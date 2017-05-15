class WelcomeController < ApplicationController
  layout 'map', only: :map

  def dashboard
  end

  def query
  end

  def question
    @questions = Question.all
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

end
