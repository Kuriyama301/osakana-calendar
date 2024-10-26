# app/models/fish.rb
class Fish < ApplicationRecord
  has_many :fish_seasons
  has_one_attached :image

  # 特定の日付の旬の魚を取得するスコープ
  scope :in_season_on, ->(date) {
    joins(:fish_seasons).where(
      "(fish_seasons.start_month <= :month AND fish_seasons.end_month >= :month) OR " \
      "(fish_seasons.start_month > fish_seasons.end_month AND " \
      "(fish_seasons.start_month <= :month OR fish_seasons.end_month >= :month))",
      month: date.month
    ).distinct
  }

  def image_url
    if Rails.env.production?
      # 本番環境用のURL生成
      rails_blob_url(image) if image.attached?
    else
      # 開発環境用のURL生成
      if image.attached?
        host = ENV.fetch('API_HOST', 'localhost:3000')
        protocol = ENV.fetch('API_PROTOCOL', 'http')
        "#{protocol}://#{host}/images/#{image.filename}"
      end
    end
  end
end
