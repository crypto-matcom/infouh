class Question < ApplicationRecord
  belongs_to :marker, optional: true
  belongs_to :source
end
