class Source < ApplicationRecord
  has_many :markers
  def connectionInfo
    { adapter: self.adapter, database: self.database, host: self.host, username: self.username, password: self.password }
  end
end
