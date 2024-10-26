class CreateFishSeasons < ActiveRecord::Migration[7.0]
  def change
    create_table :fish_seasons do |t|
      t.references :fish, null: false, foreign_key: true
      t.integer :start_month
      t.integer :start_day
      t.integer :end_month
      t.integer :end_day

      t.timestamps
    end
    add_index :fish_seasons, [:fish_id, :start_month, :start_day, :end_month, :end_day], unique: true, name: 'index_fish_seasons_on_fish_id_and_dates'
  end
end
