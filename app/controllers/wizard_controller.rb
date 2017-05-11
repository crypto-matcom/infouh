class WizardController < ApplicationController

  def initialize
    @queryWizard = ::QueryWizard.new
  end

  def perform

  end

  def tables

  end

  def columns

  end

  def build

  end

  def test
    puts @queryWizard.ConformQuery Source.all.first().ConnectionString, params[:prefix]
  end

end
