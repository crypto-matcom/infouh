module WelcomeHelper

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
