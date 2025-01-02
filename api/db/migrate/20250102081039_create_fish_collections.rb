class CreateFishCollections < ActiveRecord::Migration[7.0]
  def change
    create_table :fish_collections do |t|
      t.references :user, null: false, foreign_key: true
      t.references :fish, null: false, foreign_key: true
      t.timestamps

      t.index [:user_id, :fish_id], unique: true
    end
  end
end
