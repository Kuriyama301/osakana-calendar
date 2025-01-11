# frozen_string_literal: true

class JwtDenylist < ApplicationRecord
  # JWTの無効化（ブラックリスト）管理用モデル
  include Devise::JWT::RevocationStrategies::Denylist

  # JTIカラムのインデックスを追加するマイグレーション
  self.table_name = 'jwt_denylists'
end
