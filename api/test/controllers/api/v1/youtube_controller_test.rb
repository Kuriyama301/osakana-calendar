require 'test_helper'

class Api::V1::YoutubeControllerTest < ActionDispatch::IntegrationTest
  test '検索キーワードで動画を取得できる' do
    mock_response = {
      success: true,
      data: [{ id: 'video1', title: 'サンプル動画' }]
    }

    YoutubeService.stub :search, mock_response do
      get '/api/v1/youtube/search', params: { q: 'マグロ' }

      assert_response :success
      assert_equal 1, json_response['videos'].length
    end
  end
end
