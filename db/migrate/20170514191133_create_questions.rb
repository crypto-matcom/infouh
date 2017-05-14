class CreateQuestions < ActiveRecord::Migration[5.0]
  def change
    create_table :questions do |t|
      t.string :name
      t.references :source, foreign_key: true
      t.string :question
      t.string :query

      t.timestamps
    end
  end
end
