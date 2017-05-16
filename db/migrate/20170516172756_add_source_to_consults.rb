class AddSourceToConsults < ActiveRecord::Migration[5.0]
  def change
    add_reference :consults, :source, foreign_key: true
  end
end
