class CreateFish < ActiveRecord::Migration[7.0]
  def change
    create_table :fish do |t|
      t.string :name, null: false
      t.text :features, null: false
      t.text :nutrition, null: false
      t.string :origin, null: false

      t.timestamps
    end

    add_index :fish, :name, unique: true
  end
end
