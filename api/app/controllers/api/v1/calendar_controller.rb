# frozen_string_literal: true

# カレンダーに関連するAPI機能を提供するコントローラー
# 指定された日付に旬の魚の情報を返すエンドポイントを管理
# 画像URLの生成と一緒に魚の詳細情報を返す
module Api
  module V1
    class CalendarController < ApplicationController
      # 開発環境での画像URL生成に必要な設定を行うフィルター
      before_action :set_active_storage_current, only: :fish_by_date

      # GET /api/v1/calendar/fish_by_date?date=YYYY-MM-DD
      # 指定された日付に旬の魚の情報を取得するアクション
      def fish_by_date
        # パラメータから日付を解析
        date = Date.parse(params[:date])

        # 指定日付に旬の魚を検索
        # includes: N+1問題を防ぐ
        # with_attached_image: 画像の効率的な読み込み
        @fish = Fish.in_season_on(date)
                    .includes(:fish_seasons)
                    .with_attached_image
                    .select(:id, :name, :features, :nutrition, :origin)

        # 魚が見つかった場合はJSONを生成、見つからない場合は空配列を返す
        result = if @fish.exists?
                   @fish.map do |fish|
                     fish.as_json(
                       include: :fish_seasons,
                       methods: [:image_url]
                     )
                   end
                 else
                   []
                 end

        render json: result
      rescue ArgumentError
        # 日付のフォーマットが不正な場合のエラーハンドリング
        render json: { error: 'Invalid date format' }, status: :bad_request
      end

      private

      # 開発環境での画像URL生成に必要な設定
      # production環境では異なる設定を使用するため、ここでは設定しない
      def set_active_storage_current
        return if Rails.env.production?

        ActiveStorage::Current.url_options = {
          host: ENV.fetch('API_HOST', 'localhost'),
          port: ENV.fetch('API_PORT', 3000),
          protocol: ENV.fetch('API_PROTOCOL', 'http')
        }
      end
    end
  end
end
