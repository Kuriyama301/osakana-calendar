ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/mock'

class ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers
  include Rails.application.routes.url_helpers

  fixtures :all

  def json_response
    JSON.parse(@response.body)
  end

  # ユーザーのログインのヘルパー
  def login_as_user(user = nil)
    @user = user || users(:user)
    post api_v1_user_session_path, params: {
      user: { email: @user.email, password: 'password' }
    }, as: :json
    assert_response :success
  end

  # YouTubeのモックレスポンスを生成するヘルパー
  def mock_youtube_success_response
    {
      success: true,
      data: [
        {
          id: 'test_video_id',
          title: 'テスト動画',
          thumbnail_url: 'http://example.com/thumbnail.jpg'
        }
      ]
    }
  end

  def mock_youtube_error_response
    {
      success: false,
      error: '動画の検索に失敗しました'
    }
  end

  def auth_headers(token)
    {
      'Authorization' => "Bearer #{token}",
      'Content-Type' => 'application/json',
      'Accept' => 'application/json'
    }
  end
end
