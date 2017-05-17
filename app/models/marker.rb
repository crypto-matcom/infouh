class Marker < ApplicationRecord
  has_many :questions
  has_many :consults
end
