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

  # 全ての詳細情報を含む形式で旬の魚を取得するクラスメソッド
  def self.in_season_with_full_details(date = Date.current)
    in_season_on(date)
      .includes(:fish_seasons)
      .map do |fish|
        {
          id: fish.id,
          name: fish.name,
          features: fish.features,
          nutrition: fish.nutrition,
          origin: fish.origin,
          image_url: fish.image_url,
          fish_seasons: fish.fish_seasons
        }
      end
  end

  def as_json(options = {})
    super(options.merge(
      methods: [:image_url],
      include: :fish_seasons
    ))
  end

  # 画像URLを生成するメソッド
  def image_url
    return nil unless image.attached?

    begin
      # S3の直接URLのみを使用する単純な実装
      "https://#{ENV['AWS_BUCKET']}.s3.#{ENV['AWS_REGION']}.amazonaws.com/#{image.key}"
    rescue StandardError => e
      Rails.logger.error "Error generating image URL: #{e.message}"
      nil
    end
  end
end
