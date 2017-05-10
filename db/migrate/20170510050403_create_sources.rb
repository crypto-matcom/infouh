class CreateSources < ActiveRecord::Migration[5.0]
  def change
    create_table :sources do |t|
      t.string :adapter
      t.string :database
      t.string :host
      t.string :username
      t.string :password

      t.timestamps
    end
  end
end
