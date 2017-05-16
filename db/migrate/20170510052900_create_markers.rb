class CreateMarkers < ActiveRecord::Migration[5.0]
  def change
    create_table :markers do |t|
      t.string :name
      t.float :lat
      t.float :lng
      t.string :color
      t.string :description
      t.timestamps
    end
  end
end
