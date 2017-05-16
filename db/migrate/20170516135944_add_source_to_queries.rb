class AddSourceToQueries < ActiveRecord::Migration[5.0]
  def change
    add_reference :queries, :source, foreign_key: true
  end
end
