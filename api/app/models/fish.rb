class Fish < ApplicationRecord
  has_many :fish_seasons
  has_one_attached :image

  # 特定の日付の旬の魚を取得するスコープ（既存のまま）
  scope :in_season_on, ->(date) {
    joins(:fish_seasons).where(
      "(fish_seasons.start_month <= :month AND fish_seasons.end_month >= :month) OR " \
      "(fish_seasons.start_month > fish_seasons.end_month AND " \
      "(fish_seasons.start_month <= :month OR fish_seasons.end_month >= :month))",
      month: date.month
    ).distinct
  }

  def as_json(options = {})
    super(options.merge(
      methods: [:image_url],
      include: :fish_seasons
    ))
  end

  def image_url
    return nil unless image.attached?

    begin
      if Rails.env.production?
        # S3の直接URLを返す
        "https://#{ENV['AWS_BUCKET']}.s3.#{ENV['AWS_REGION']}.amazonaws.com/#{image.key}"
      else
        # 開発環境用のURL
        Rails.application.routes.url_helpers.rails_blob_url(image)
      end
    rescue StandardError => e
      Rails.logger.error "Error generating image URL: #{e.message}"
      nil
    end
  end
end
