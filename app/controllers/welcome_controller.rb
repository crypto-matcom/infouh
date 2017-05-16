class WelcomeController < ApplicationController

  skip_before_action :verify_authenticity_token, only: :show
  layout 'map', only: :map

  def dashboard
  end

  def query
  end

  def show
    @queryWizard = ::QueryWizard.new
    data = @queryWizard.Query @queryWizard.ConnectionString(Source.find(params[:id]).connectionInfo), params[:query]
    puts params[:query]
    @table = createTable(data).html_safe
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

  private

    def createTable data
      ign = (0..100)
      xm = Builder::XmlMarkup.new(:indent => 2)
      xm.table {
        xm.tr { data[0].keys.select{|x| !ign.include?(x) }.each { |key| xm.th(key)}}
        data.each { |row| xm.tr { row.each_pair { |key, value| xm.td(value) unless ign.include?(key) }}}
      }
      return xm.to_s
    end

end
