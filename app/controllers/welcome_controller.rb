class WelcomeController < ApplicationController
  def dashboard
  end

  def query
  end

  def question
  end

  def map
    if params[:x]
      SQLite3::Database.new( "db/maps.mbtiles" ) do |db|
        db.execute( "SELECT tile_data
                     FROM images
                     WHERE tile_id IN (
                        SELECT tile_id
                        FROM map
                        WHERE zoom=#{params[:z]} AND
                              row =#{params[:y]} AND
                              col =#{params[:x]} LIMIT 1)
                     LIMIT 1" ) do |row|
          @image = row.first
        end
      end
      send_data @image, type: "image/jpg"
    else
      @markers = Marker.all
    end
  end

  def mark
    @marker = Marker.new(marker_params)
    respond_to do |format|
      if @marker.save
        # format.json { render status: :ok }
      else
        # format.json { render status: :status: :unprocessable_entity }
      end
    end
  end

  private
    def marker_params
      params.require(:marker).permit(:name, :source, :query, :lat, :lng, :color, :icon)
    end
end
