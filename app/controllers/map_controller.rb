class MapController < ApplicationController

  def new
    @marker = Marker.create(marker_params)

    respond_to do |format|
      format.json { render json: @marker }
    end
  end

  private

    def marker_params
      params.require(:marker).permit(:name, :query, :lat, :lng, :source_id, :color, :icon)
    end
end
