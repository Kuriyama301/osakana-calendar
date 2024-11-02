require "test_helper"

class Api::V1::CalendarControllerTest < ActionDispatch::IntegrationTest
  test "指定日の魚を取得できる" do
    get api_v1_calendar_fish_url, params: { date: "2024-01-15" }
    assert_response :success
  end

  test "不正な日付でエラーを返す" do
    get api_v1_calendar_fish_url, params: { date: "invalid" }
    assert_response :bad_request
  end
end
