# frozen_string_literal: true

# 魚の情報を提供するAPI機能のコントローラー
# 魚の一覧取得、詳細表示、検索機能を管理
# 画像URLと旬の時期情報も含めて提供
module Api
  module V1
    class FishController < ApplicationController
      # show, search アクションで画像URLを生成するための設定
      before_action :set_active_storage_current, only: %i[show search]

      # GET /api/v1/fish
      # 指定日付（デフォルトは今日）に旬の魚一覧を取得
      def index
        date = params[:date].present? ? Date.parse(params[:date]) : Time.zone.today
        @fishes = Fish.in_season_with_full_details(date)
        render json: @fishes
      rescue ArgumentError
        render json: { error: 'Invalid date format. Please use YYYY-MM-DD.' }, status: :bad_request
      end

      # GET /api/v1/fish/:id
      # 指定されたIDの魚の詳細情報を取得
      def show
        @fish = Fish.find(params[:id])
        render json: @fish.as_json(include: :fish_seasons, methods: :image_url)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Fish not found' }, status: :not_found
      end

      # GET /api/v1/fish/search
      # 魚の名前と特徴で検索
      # クエリがない場合は全ての魚を返す
      def search
        @fishes = if params[:query].present?
                    Fish.search_by_name_and_features(params[:query])
                        # 旬の時期情報を一括取得（N+1問題を防ぐ）
                        .includes(:fish_seasons)
                        # 画像情報を一括取得
                        .with_attached_image
                  else
                    Fish
                      .includes(:fish_seasons)
                      .with_attached_image
                  end

        render json: @fishes.as_json(include: :fish_seasons, methods: :image_url)
      rescue StandardError => e
        render json: { error: e.message }, status: :internal_server_error
      end

      private

      # 許可されたパラメータを定義
      def fish_params
        params.require(:fish).permit(:name, :features, :nutrition, :origin)
      end

      # 開発環境での画像URL生成に必要な設定
      # 検索フォームからのリクエストでも画像URLを生成できるようにする
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
