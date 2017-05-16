class WizardController < ApplicationController

  skip_before_action :verify_authenticity_token, only: [:test]

  def initialize
    @queryWizard = ::QueryWizard.new
  end

  def perform
    sources = {}
    Source.all.each { |e| sources["source#{e.id}"] = @queryWizard.ConnectionString(e.connectionInfo) }
    data = @queryWizard.Run params[params[:prefix]], sources

    ign = (0..100)
    xm = Builder::XmlMarkup.new(:indent => 2)
    xm.table {
      xm.tr { data[0].keys.select{|x| !ign.include?(x) }.each { |key| xm.th(key)}}
      data.each { |row| xm.tr { row.each_pair { |key, value| xm.td(value) unless ign.include?(key) }}}
    }

    respond_to do |format|
      format.json { render json: [xm.to_s] }
    end
  end

  def tables
    sources = @queryWizard.ConnectionString Source.find(params[:id]).connectionInfo
    puts @queryWizard.GetTables(sources)
    respond_to do |format|
      format.json { render json: @queryWizard.GetTables(sources) }
    end
  end

  def columns
    sources = @queryWizard.ConnectionString Source.find(params[:id]).connectionInfo

    tables = params[:tables] == 'all' ? @queryWizard.GetTables(sources) : params[:tables]

    @columns = [
      @queryWizard.GetTablesColumns(sources,tables).map { |e| [e[:table], e[:columns].map { |f| [f.name, f.type] }] },
      @queryWizard.SingleOperators.keys.map { |e| e },
      @queryWizard.SQLFunctions
    ]
    respond_to do |format|
      format.json { render json: @columns }
    end
  end

  def connections
    @connections = Source.all.map { |e| [e.id, e.name] }
    respond_to do |format|
      format.json { render json: @connections }
    end
  end

  def test
    sources = {}
    puts params
    Source.all.each { |e| sources["source#{e.id}"] = @queryWizard.ConnectionString(e.connectionInfo) }
    query = @queryWizard.ConformQuery params[params[:prefix]], sources
    puts query
    respond_to do |format|
      format.json { render json: [query] }
    end
  end

end
