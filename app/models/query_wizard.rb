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
    Query connectionStrings[options["source"]], QueryBuilder(connectionStrings[options["source"]], options)
  end

  def Query connectionString, sql
    CreateContext connectionString
    @_contexts[connectionString.MD5].connection.execute sql
  end

  def ConformQuery connectionString, options
    CreateContext connectionString
    QueryBuilder connectionString, options
  end

  def RelationshipTable connectionString
    dbInfo = GetTablesColumns connectionString, GetTables(connectionString)
    CreateRelationshipTable dbInfo
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

    def CreateRelationshipTable dbInfo
      dbInfo.map { |e| { table: e["table"], relationships: Relation(e, dbInfo) } }
    end

    def Relation table, tables
      relationships = []
      tables.each do |t|
        t["columns"].each do |c1|
          table["columns"].each do |c2|
            relationships << {
              table: t["table"], column: c1::name,
              query: "#{table["table"]} NATURAL JOIN #{t["table"]}"
              } if NaturalJoin c1, c2
            relationships << {
              table: t["table"], column: c1::name,
              query: "#{table["table"]} INNER JOIN #{t["table"]} ON #{table["table"]}.#{c1::name.Sufix} = #{t["table"]}.#{c1::name}"
              } if InnerJoin table["table"], c1, c2
          end
        end
      end
      return relationships
    end

    def InnerJoin table, column1, column2 #Solve singularize
      column1.table_name != table &&
      column1.sql_type == column2.sql_type && column1.name.include?(column2.name) && column1.name.include?(table)
    end

    def NaturalJoin column1, column2
      column1.table_name != column2.table_name &&
      !["id", "name", "created_at", "updated_at"].include?(column1.name) &&
      column1.sql_type == column2.sql_type && column1.name == column2.name
    end

    def QueryBuilder connectionString, options
      [ SetColumns(options["columns"]), SetTables(connectionString, options["tables"]),
        SetConditions(connectionString, options["conditions"]), SetGroups(options["groups"]),
        SetHavings(options["having"]), SetOrders(options["orders"]),
        SetLimits(options["limit"]) ].select { |e| e != nil }.join ' '
    end

    def SetColumns options
      "SELECT #{ options == nil ? '*' : options.each_value.map { |e| ColumnBuilder e }.join(', ') }"
    end

    def SetTables c, options
      "FROM #{ TableBuilder c, options }" if options != nil
    end

    def SetConditions c, options
      "WHERE #{options.each_value.map { |e| ConditionBuilder c, e }.select {|x| x != nil }.join ' AND '}" if options != nil
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
      "LIMIT #{options}" if options != nil
    end

    def ColumnBuilder c
      return "#{c["column"]}" if c["type"] == "single"
      return "#{c["func"]}(#{c["column"]})#{" AS #{c["alias"]}" if c.key? "alias"}" if c["type"] == "function"
    end

    def TableBuilder connectionString, c
      c.first
    end

    def ConditionBuilder connectionString, c
      if c["type"] == "inclusion"
        return "#{c["column"]} IN (#{QueryBuilder connectionString, c["value"]})" if c["value_type"] == "query"
        return "#{c["column"]} IN (#{c["value"].each_value.map{|e| Quotes(e["value"], e["type"]) }.join ', '})" if c["value_type"] == "array"
      end

      return "#{c["column"]} #{SingleOperators()[c["type"]]} #{ Quotes c["value"], c["value_type"] }" if SingleOperators().key? c["type"]
      return "(#{c["column"]} BETWEEN #{c["value"].each_value.map{|v| Quotes v["value"], v["type"]}.join " AND "})" if c["type"] == "between"
    end

    def Quotes value, type
      quotesRequired = ["string", "datetime"]
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
end
