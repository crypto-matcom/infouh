class Marker < ApplicationRecord
  has_many :queries
  has_many :consults
end
