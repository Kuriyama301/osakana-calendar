# frozen_string_literal: true

# ユーザーの魚図鑑（コレクション）を管理するモデル
# ユーザーと魚の中間テーブルとして機能し、収集した魚を記録
class FishCollection < ApplicationRecord
  # アソシエーション：ユーザーに属する
  belongs_to :user

  # アソシエーション：魚に属する
  belongs_to :fish

  # バリデーション：同じユーザーが同じ魚を重複して収集できない
  validates :user_id, uniqueness: { scope: :fish_id }
end
