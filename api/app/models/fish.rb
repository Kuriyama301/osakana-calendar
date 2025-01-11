# frozen_string_literal: true

class Fish < ApplicationRecord
  has_many :fish_seasons, dependent: :destroy
  has_one_attached :image

  # アソシエーションの追加
  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user
  has_many :fish_collections, dependent: :destroy
  has_many :collected_by_users, through: :fish_collections, source: :user

  # 特定の日付の旬の魚を取得するスコープ
  scope :in_season_on, lambda { |date|
    joins(:fish_seasons).where(
      '(fish_seasons.start_month <= :month AND fish_seasons.end_month >= :month) OR ' \
      '(fish_seasons.start_month > fish_seasons.end_month AND ' \
      '(fish_seasons.start_month <= :month OR fish_seasons.end_month >= :month))',
      month: date.month
    ).distinct
  }

  # クラスメソッドをclass << selfブロックにまとめる
  class << self
    def in_season_with_full_details(date = Date.current)
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

    def search_by_name_and_features(query)
      where('name LIKE :query OR features LIKE :query',
            query: "%#{sanitize_sql_like(query)}%")
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

    Rails.env.production? ? production_image_url : development_image_url
  end

  private

  def production_image_url
    bucket = ENV.fetch('AWS_BUCKET', nil)
    region = ENV.fetch('AWS_REGION', nil)
    key = image.key

    return nil if any_s3_params_missing?(bucket, region, key)

    "https://#{bucket}.s3.#{region}.amazonaws.com/#{key}"
  rescue StandardError => e
    log_error('S3', e)
    nil
  end

  def development_image_url
    image.url
  rescue StandardError => e
    log_error('local', e)
    nil
  end

  def any_s3_params_missing?(bucket, region, key)
    key.nil? || bucket.nil? || region.nil?
  end

  def log_error(source, error)
    Rails.logger.error "Error generating #{source} URL: #{error.message}"
  end
end
