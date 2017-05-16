class CreateConsults < ActiveRecord::Migration[5.0]
  def change
    create_table :consults do |t|
      t.string :name
      t.string :code
      t.references :marker, foreign_key: true

      t.timestamps
    end
  end
end
