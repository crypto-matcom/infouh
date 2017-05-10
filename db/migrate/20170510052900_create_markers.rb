class CreateMarkers < ActiveRecord::Migration[5.0]
  def change
    create_table :markers do |t|
      t.string :name
      t.string :query
      t.float :lat
      t.float :lng
      t.references :source, foreign_key: true
      t.string :color
      t.string :icon

      t.timestamps
    end
  end
end
