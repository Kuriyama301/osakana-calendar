# frozen_string_literal: true

# 魚の基本情報を管理するメインモデル
# 魚の詳細情報、画像、旬の時期、お気に入り、収集状態を管理
class Fish < ApplicationRecord
  # 関連付け：旬の時期（削除時に関連レコードも削除）
  has_many :fish_seasons, dependent: :destroy

  # 関連付け：魚の画像
  has_one_attached :image

  # 関連付け：お気に入り機能
  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user

  # 関連付け：コレクション機能
  has_many :fish_collections, dependent: :destroy
  has_many :collected_by_users, through: :fish_collections, source: :user

  # 指定された日付に旬の魚を検索するスコープ
  # 年をまたぐ期間（例：12月〜2月）にも対応
  scope :in_season_on, lambda { |date|
    joins(:fish_seasons).where(
      '(fish_seasons.start_month <= :month AND fish_seasons.end_month >= :month) OR ' \
      '(fish_seasons.start_month > fish_seasons.end_month AND ' \
      '(fish_seasons.start_month <= :month OR fish_seasons.end_month >= :month))',
      month: date.month
    ).distinct
  }

  # クラスメソッド定義
  class << self
    # 指定日の旬の魚の詳細情報を取得
    # @param date [Date] 検索する日付（デフォルトは今日）
    # @return [Array<Hash>] 魚の詳細情報の配列
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

    # 名前と特徴で魚を検索
    # @param query [String] 検索キーワード
    # @return [ActiveRecord::Relation] 検索結果
    def search_by_name_and_features(query)
      where('name LIKE :query OR features LIKE :query',
            query: "%#{sanitize_sql_like(query)}%")
    end
  end

  # JSONレスポンス形式のカスタマイズ
  def as_json(options = {})
    super(options.merge(
      methods: [:image_url],
      include: :fish_seasons
    ))
  end

  # 環境に応じた画像URLを生成
  # @return [String, nil] 画像のURL、未添付の場合はnil
  def image_url
    return nil unless image.attached?

    Rails.env.production? ? production_image_url : development_image_url
  end

  private

  # 本番環境（S3）での画像URL生成
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

  # 開発環境での画像URL生成
  def development_image_url
    image.url
  rescue StandardError => e
    log_error('local', e)
    nil
  end

  # S3パラメータの存在確認
  def any_s3_params_missing?(bucket, region, key)
    key.nil? || bucket.nil? || region.nil?
  end

  # エラーログの記録
  def log_error(source, error)
    Rails.logger.error "Error generating #{source} URL: #{error.message}"
  end
end
