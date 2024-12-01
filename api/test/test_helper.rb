ENV['RAILS_ENV'] ||= 'test'
require_relative "../config/environment"
require "rails/test_help"
require "minitest/mock"

class ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers
  fixtures :all

  def json_response
    JSON.parse(@response.body)
  end

  def setup
    @routes = Rails.application.routes
  end

  # YouTubeのモックレスポンスを生成するヘルパー
  def mock_youtube_success_response
    {
      success: true,
      data: [
        {
          id: "test_video_id",
          title: "テスト動画",
          thumbnail_url: "http://example.com/thumbnail.jpg"
        }
      ]
    }
  end

  def mock_youtube_error_response
    {
      success: false,
      error: "動画の検索に失敗しました"
    }
  end
end
