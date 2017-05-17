class MapController < ApplicationController

  skip_before_action :verify_authenticity_token, only: [:addConsult, :addQuestion]

  def create
    marker = Marker.new(marker_params)

    respond_to do |format|
      if marker.save
        format.html { redirect_to welcome_map_path }
        format.json { render welcome_map_path }
      end
    end
  end

  def markers
    respond_to do |format|
      format.json { render json: Marker.all.map {|e| [e.id, e.name]}}
    end
  end

  def addConsult
    consult = Consult.find(params[:query])
    consult.marker_id = params[:id]
    consult.save

    respond_to do |format|
      format.html {redirect_to welcome_map_path}
      format.json {render welcome_map_path}
    end
  end

  def addQuestion
    question = Question.find(params[:query])
    question.marker_id = params[:id]
    question.save

    respond_to do |format|
      format.html {redirect_to welcome_map_path}
      format.json {render welcome_map_path}
    end
  end

  private

    def marker_params
      params.require(:marker).permit(:name, :description, :lat, :lng, :color)
    end
end
