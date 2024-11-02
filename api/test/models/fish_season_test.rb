require "test_helper"

class FishSeasonTest < ActiveSupport::TestCase
  test "旬の期間内かどうかを判定できる" do
    season = fish_seasons(:season_one)

    # 期間内の日付でテスト
    in_season_date = Date.new(2024, season.start_month, season.start_day)
    assert season.in_season?(in_season_date), "期間内の日付が正しく判定されていません"

    # 期間外の日付でテスト
    out_of_season_date = Date.new(2024, 7, 1)
    assert_not season.in_season?(out_of_season_date), "期間外の日付が正しく判定されていません"
  end

  test "formatted_seasonが正しい形式を返す" do
    season = fish_seasons(:season_one)
    expected = "#{season.start_month}月#{season.start_day}日 から #{season.end_month}月#{season.end_day}日"
    assert_equal expected, season.formatted_season
  end
end
