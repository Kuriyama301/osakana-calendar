require "test_helper"

class FishTest < ActiveSupport::TestCase
  test "指定した日付の旬の魚を取得できる" do
    date = Date.new(2024, 1, 15)
    fish = Fish.in_season_on(date)
    assert_not_empty fish, "旬の魚が取得できるべき"
  end
end
