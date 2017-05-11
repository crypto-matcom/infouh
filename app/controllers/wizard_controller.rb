class WizardController < ApplicationController

  def initialize
    @queryWizard = ::QueryWizard.new
  end

  def test
    puts @queryWizard.ConformQuery Source.all.first().ConnectionString, params[:prefix]
  end

end
