class WizardController < ApplicationController

  def initialize
    @queryWizard = ::QueryWizard.new
  end

  def perform

  end

  def tables
    @tables = ['table14', 'table23']
    respond_to do |format|
      format.json { render json: @tables }
    end
  end

  def columns
    @columns = [["table1", [['columns1', 'int'],['columns2', 'string']]], ["table3", [['columns3', 'date']]]]
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
    puts @queryWizard.ConformQuery Source.all.first().ConnectionString, params[:prefix]
  end

end
