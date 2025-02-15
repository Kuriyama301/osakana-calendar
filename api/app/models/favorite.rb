# frozen_string_literal: true

# お気に入りの魚を管理するモデル
# ユーザーと魚の中間テーブルとして機能し、お気に入り関係を表現
class Favorite < ApplicationRecord
  # アソシエーション：ユーザーに属する
  belongs_to :user

  # アソシエーション：魚に属する
  belongs_to :fish

  # バリデーション：同じユーザーが同じ魚を重複してお気に入りできない
  validates :user_id, uniqueness: { scope: :fish_id }
end
