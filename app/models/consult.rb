class Consult < ApplicationRecord
  belongs_to :marker, optional: true
end
