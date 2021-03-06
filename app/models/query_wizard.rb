require 'json'
require 'digest'
require 'active_record'

class QueryWizard

  def initialize
    @_contexts = {}
  end

  def CreateContext connectionString
    if !@_contexts.key? connectionString.MD5
      @_contexts[connectionString.MD5] = GetDynamicDbContext connectionString.ConnectionInfo
    end
  end

  def GetTables connectionString
    CreateContext connectionString
    @_contexts[connectionString.MD5].connection.tables
  end

  def GetColumns connectionString, table
    @_contexts[connectionString.MD5].connection.columns table
  end

  def GetTablesColumns connectionString, tables
    CreateContext connectionString
    tables.each_with_index.map { |table, index| {table: table, index: index, columns: GetColumns(connectionString, table)} }
  end

  def Run options, connectionStrings
    sql = QueryBuilder(connectionStrings["source#{options["source"]}"], options, connectionStrings)

    result = {}
    result["data"] = Query connectionStrings["source#{options["source"]}"], sql
    result["sql"] = sql

    # puts result.to_s
    return result
  end

  def RunSQL connectionStrings, source_id, sql
    Query connectionStrings["source#{source_id}"], sql
  end

  def Query connectionString, sql
    CreateContext connectionString
    @_contexts[connectionString.MD5].connection.execute sql
  end

  def RelationshipTable connectionString, chossenTables
    dbInfo = GetTablesColumns connectionString, chossenTables
    CreateRelationshipTable dbInfo, chossenTables
  end

  def ConnectionString options # {adapter, database, host, username, password}
    JSON.generate options
  end

  private
    def GetDynamicDbContext dbInfo
      connection = Class.new ActiveRecord::Base do
        self.abstract_class = true
      end
      Object.const_set "DynamicContent#{getCounter}", connection
      connection.establish_connection dbInfo
    end

    def getCounter
      @counter ||= 1
      @counter += 1
    end

    def CreateRelationshipTable dbInfo, chossenTables
      relations = {}
      dbInfo.map { |e| relations[e[:table]] = Relation(e, dbInfo, chossenTables) }
      return relations
    end

    def Relation table, tables, chossenTables

      relationships = []
      
      tables.each do |t|
        if (chossenTables.include? t[:table] and chossenTables.include? table[:table] and table[:table] != t[:table] )
          t[:columns].each do |c1|
            table[:columns].each do |c2|
              # relationships << {
              #   table: t["table"], column: c1::name,
              #   query: "#{table["table"]} NATURAL JOIN #{t["table"]}"
              #   } if NaturalJoin c1, c2
              
              relationships << {
                table: t[:table],
                query: "#{table[:table]} INNER JOIN %s ON #{table[:table]}.#{c2::name} = #{t[:table]}.#{c1::name}"
                } if InnerJoin table[:table], c1, c2, t[:table]
            end
          end
        end
      end
      return relationships
    end

    def InnerJoin table, column1, column2, table2
      condition1 = column1.name.include?(column2.name) && table.include?(column1.name.removeId) 
      condition2 = column2.name.include?(column1.name) && table2.include?(column2.name.removeId)
      result = column1.table_name != table &&
      column1.sql_type == column2.sql_type && ((condition1) or (condition2))

      return result
    end

    def NaturalJoin column1, column2
      column1.table_name != column2.table_name &&
      !["id", "name", "created_at", "updated_at"].include?(column1.name) &&
      column1.sql_type == column2.sql_type && column1.name == column2.name
    end

    def QueryBuilder connectionString, options, connectionStrings = {}

      [ SetColumns(options["columns"]), 
        SetTables(connectionString, options["tables"]),
        SetConditions(connectionString, options["conditions"], options["conditionSlider"], options["map_condition"], connectionStrings), 
        SetGroups(options["groups"]),
        SetHavings(options["having"]), 
        SetOrders(options["orders"]),
        SetLimits(options["limit"])
      ].select { |e| e != nil }.join ' '

    end

    def SetColumns options
      "SELECT #{ options.nil?? '*' : options.each_value.map { |e| ColumnBuilder e }.join(', ') }"
    end

    def SetTables c, options
      "FROM #{ TableBuilder c, options }" unless options.nil?
    end

    def SetConditions c, options, slide, points, connectionStrings = {}
      switch = slide.nil?? ' AND ' : ' OR '

      if options != nil and points != nil
        "WHERE #{options.each_value.map { |e| ConditionBuilder c, e, connectionStrings }.select {|x| x != nil }.join switch}" + " AND " + points 
      elsif options != nil
        "WHERE #{options.each_value.map { |e| ConditionBuilder c, e, connectionStrings }.select {|x| x != nil }.join switch}"
      elsif points != nil
        "WHERE" + points
      end
    end

    def SetGroups options
      "GROUP BY #{options.each_value.map { |e| GroupBuilder e }.join ', '}" if options != nil
    end

    def SetHavings options
      "HAVING #{options.each_value.map { |e| HavingBuilder e }.join ', '}" if options != nil
    end

    def SetOrders options
      "ORDER BY #{options.each_value.map { |e| OrderBuilder e }.join ', '}" if options != nil
    end

    def SetLimits options
      "LIMIT #{options}" if options != nil && options != ''
    end

    def ColumnBuilder c
      return "#{c["column"]}" if c["type"] == "single"
      return "#{c["func"]}(#{c["column"]})#{" AS #{c["alias"]}" if c.key? "alias"}" if c["type"] == "function"
    end

    def TableBuilder connectionString, options
      relations = RelationshipTable connectionString, options
      
      return options[0] if options.length == 1
      BuildRelate Clousure(options, relations).reverse, relations
    end

    def BuildRelate options, relations
      table = options.pop
      return table if options.empty?
      return relations[table].select{ |e| options.include? e[:table] }.first[:query] % "(#{BuildRelate(options, relations)})"
    end

    def Clousure tables, relations
      tables.each do |e|
        orders = []
        begin
          ordersLength = orders.length
          tables.each do |t|
            if orders.include? t
              relations[t].each do |t2|
                orders << t2[:table] unless orders.include? t2[:table]
              end
            end
          end
          return orders if orders.length == tables.length
        end while orders.length != ordersLength
      end
    end

    def ConditionBuilder connectionString, c, connectionStrings
      if c["type"] == "inclusion"
        if c["value_type"] == "query"
          result = Run c["value"], connectionStrings
          return "#{c["column"]} IN (#{result.each.map{|e| e[e.keys.first]}.join(', ')})"
        end
        return "#{c["column"]} IN (#{c["value"].each_value.map{|e| Quotes(e["value"], e["type"]) }.join ', '})" if c["value_type"] == "array"
      end

      return "#{c["column"]} #{SingleOperators()[c["type"]]} #{ Quotes c["value"], c["value_type"] }" if SingleOperators().key? c["type"]
      return "(#{c["column"]} BETWEEN #{c["value"].each_value.map{|v| Quotes v["value"], v["type"]}.join " AND "})" if c["type"] == "between"
    end

    def Quotes value, type
      quotesRequired = ["string", "datetime", "text"]
      quotesRequired.include?(type) ? "'#{value}'" : value
    end

    def GroupBuilder c
      "#{c["column"]}"
    end

    def OrderBuilder c
      "#{c["column"]}#{" #{c["type"]}" if c.key? "type"}"
    end

    def HavingBuilder c
      "#{c["func"]}(#{c["column"]}) #{SingleOperators()[c["type"]]} #{ Quotes c["value"], c["value_type"] }"
    end

  public
    def SingleOperators
      return {
        "=" => "=",
        "<" => "<",
        ">" => ">",
        "<=" => "<=",
        ">=" => ">=",
        "<>" => "<>",
        "LIKE" => "LIKE",
      }
    end

    def SQLFunctions
      return [
        "AVG", "COUNT", "FIRST", "LAST",
        "MAX", "MIN", "SUM", "UCASE", "LCASE",
        "MID", "LEN", "ROUND", "NOW", "FORMAT"
      ]
    end
end

class ParametricQuestion

  def initialize wizard
    @queryWizard = wizard
  end

  def generate options
    { name: options["name"], source_id: options["source"], question: JSON.generate(options["question"].to_unsafe_hash), query: options["query"] }
  end

  def parse model
    { name: model.name, source: model.source.connectionInfo, question: model.question.CreateHash, query: model.query }
  end

  def htmlCode model
    html =''
    question = parse model
    cs = @queryWizard.ConnectionString question[:source]
    question[:question].each_pair do |k, v|
      value = ToLabel  k,v if v['type'] == 'label'
      value = ToText   k,v if v['type'] == 'Text'
      value = ToDate   k,v if v['type'] == 'Datetime'
      value = ToNum    k,v if v['type'] == 'Numeric'
      value = ToArray  k,v if v['type'] == 'array'
      value = ToColumn k,v, cs if v['type'] == 'column'
      html+= Div value, 'field'
    end
    html+="<input type=\"hidden\" name=\"id\" id=\"showId\" value=\"#{model.source_id}\">"
    html+="<input type=\"hidden\" name=\"query\" id=\"showQuery\"  value=\"#{question[:query]}\">"
    return Div html, 'ui relaxed grid fields'
  end

  private

    def ToLabel key, value
      "<label>#{value['value']}</label>"
    end

    def ToText key, value
      "<input type=\"text\" name=\"#{key}\" value=\"\">"
    end

    def ToDate key, value
      "<input type=\"text\" name=\"#{key}\" value=\"\">"
    end

    def ToNum key, value
      "<input type=\"text\" name=\"#{key}\" value=\"\">"
    end

    def ToArray key, value
      Select key, value['value'].split(',')
    end

    def ToColumn key, value, connection
      split = value['value'].split '.'
      result = @queryWizard.Query connection, "SELECT #{split[1]} FROM #{split[0]}"
      logs = result.map {|e| e[split[1]] }
      Select key, logs
    end

    def Select name, options
      "<select name=\"#{name}\" class=\"ui dropdorn backendDropdown\">#{options.map{|e| "<option value=\"#{e}\">#{e}</option>"}.join}</select>"
    end

    def Div value, _class
      html = "<div class=\"#{_class}\">"
      html+= value
      html+= "</div>"
      return html
    end
end

class String
  def CreateHash
    JSON.parse self
  end

  alias ConnectionInfo CreateHash

  def MD5
    Digest::MD5.hexdigest self
  end

  def Sufix
    self.split('_')[-1]
  end

  def removeId
    if self.include? 'Id' and self.length > 2
      temp = self.split 'Id'
      return temp.last
    else return self
    end
  end
end
