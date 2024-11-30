# api/test/test_helper.rb
ENV['RAILS_ENV'] ||= 'test'
require_relative "../config/environment"
require "rails/test_help"
require "minitest/mock"  # モック機能のために追加

class ActiveSupport::TestCase
  # フィクスチャをセットアップ
  fixtures :all

  # 必要に応じて共通のヘルパーメソッドを追加
  def json_response
    JSON.parse(@response.body)
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

  include Devise::Test::IntegrationHelpers
end
