class AddMarkerToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_reference :questions, :marker, foreign_key: true
  end
end
