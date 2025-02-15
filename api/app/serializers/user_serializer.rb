# frozen_string_literal: true

require 'jsonapi/serializer'

# ユーザー情報のJSON形式を定義するシリアライザー
# JSONAPIの規格に準拠したレスポンスを生成
class UserSerializer
  include JSONAPI::Serializer

  # 基本的な属性の定義
  attributes :id, :email, :name, :created_at

  # カスタム属性：作成日を年/月/日形式で表示
  # @return [String] YYYY/MM/DD形式の作成日
  attribute :created_date do |user|
    user.created_at&.strftime('%Y/%m/%d')
  end
end
