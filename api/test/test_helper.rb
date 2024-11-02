ENV['RAILS_ENV'] ||= 'test'
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  # フィクスチャをセットアップ
  fixtures :all

  # 必要に応じて共通のヘルパーメソッドを追加
  def json_response
    JSON.parse(@response.body)
  end
end
