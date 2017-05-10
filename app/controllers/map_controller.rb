class MapController < ApplicationController
  def point
    @columns = ['column1', 'column2']

    respond_to do |format|
      format.json { render json: @columns }
    end
  end
end
