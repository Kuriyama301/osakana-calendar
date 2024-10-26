class UpdateFishSeasons < ActiveRecord::Migration[7.0]
  def change
    # 新しいカラムの追加（存在しない場合のみ）
    add_column :fish_seasons, :start_month, :integer unless column_exists?(:fish_seasons, :start_month)
    add_column :fish_seasons, :start_day, :integer unless column_exists?(:fish_seasons, :start_day)
    add_column :fish_seasons, :end_month, :integer unless column_exists?(:fish_seasons, :end_month)
    add_column :fish_seasons, :end_day, :integer unless column_exists?(:fish_seasons, :end_day)

    # 古いカラムの削除（存在する場合のみ）
    remove_column :fish_seasons, :start_date, :date if column_exists?(:fish_seasons, :start_date)
    remove_column :fish_seasons, :end_date, :date if column_exists?(:fish_seasons, :end_date)

    # インデックスの更新
    remove_index :fish_seasons, [:fish_id, :start_date, :end_date], if_exists: true
    unless index_exists?(:fish_seasons, [:fish_id, :start_month, :start_day, :end_month, :end_day], name: 'index_fish_seasons_on_fish_id_and_dates')
      add_index :fish_seasons, [:fish_id, :start_month, :start_day, :end_month, :end_day], unique: true, name: 'index_fish_seasons_on_fish_id_and_dates'
    end
  end
end
