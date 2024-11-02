require "test_helper"

class Api::V1::FishControllerTest < ActionDispatch::IntegrationTest
  setup do
    @fish = fish(:fish_one)
  end

  test "魚の一覧を取得できる" do
    get api_v1_fish_index_url
    assert_response :success
  end

  test "特定の魚の詳細を取得できる" do
    get api_v1_fish_url(@fish)
    assert_response :success
  end
end
