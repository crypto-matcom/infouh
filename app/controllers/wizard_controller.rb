class WizardController < ApplicationController

  skip_before_action :verify_authenticity_token, only: [:test]

  def initialize
    @queryWizard = ::QueryWizard.new
  end

  def perform

  end

  def tables
    source = @queryWizard.ConnectionString Source.all.first.connectionInfo
    respond_to do |format|
      format.json { render json: @queryWizard.GetTables(source) }
    end
  end

  def columns
    source = @queryWizard.ConnectionString(Source.all.first.connectionInfo)

    @columns = [
      @queryWizard.GetTablesColumns(source, ['metadata', 'map']).map { |e| [e[:table], e[:columns].map { |f| [f.name, f.type] }] },
      @queryWizard.SingleOperators.keys.map { |e| e },
      @queryWizard.SQLFunctions
    ]
    respond_to do |format|
      format.json { render json: @columns }
    end
  end

  def build
    respond_to do |format|
      format.json { render json: params[params[:prefix]] }
    end
  end

  def connections
    @connections = Source.all.map { |e| [e.id, e.name] }
    respond_to do |format|
      format.json { render json: @connections }
    end
  end

  def test
    puts @queryWizard.ConformQuery Source.all.first().connectionInfo, params[params[:prefix]]
  end

end
