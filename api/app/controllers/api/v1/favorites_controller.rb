# frozen_string_literal: true

# お気に入りの魚を管理するAPI機能を提供するコントローラー
# ユーザーのお気に入り魚の登録、取得、削除を管理
# 各アクションは認証済みユーザーのみアクセス可能
module Api
  module V1
    class FavoritesController < ApplicationController
      # 未認証ユーザーのアクセスを制限
      before_action :authenticate_user!
      # 画像URL生成の設定を行うフィルター
      before_action :set_active_storage_current

      # GET /api/v1/favorites
      # ユーザーのお気に入り魚一覧を取得
      def index
        @favorites = current_user.favorite_fishes
                                 .includes(:fish_seasons)
                                 .with_attached_image
        render json: @favorites.map { |fish|
          fish.as_json(include: :fish_seasons, methods: :image_url)
        }
      end

      # POST /api/v1/favorites
      # 新しい魚をお気に入りに追加
      def create
        # パラメータから魚のIDを取得（2つの形式に対応）
        fish_id = params[:fish_id] || params.dig(:favorite, :fish_id)
        @favorite = current_user.favorites.build(fish_id: fish_id)

        if @favorite.save
          fish = @favorite.fish.as_json(
            include: :fish_seasons,
            methods: :image_url
          )
          render json: fish, status: :created
        else
          # バリデーションエラー時のデバッグ情報を記録
          Rails.logger.debug { "Favorite validation errors: #{@favorite.errors.full_messages}" }
          render json: {
            error: @favorite.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/favorites/:id
      # 指定された魚をお気に入りから削除
      def destroy
        @favorite = current_user.favorites.find_by!(fish_id: params[:id])

        if @favorite.destroy
          head :no_content
        else
          render json: { error: 'Failed to remove favorite' }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Favorite not found' }, status: :not_found
      end

      private

      # 許可されたパラメータを定義
      def favorite_params
        params.permit(:fish_id, favorite: [:fish_id])
      end

      # 開発環境での画像URL生成に必要な設定
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
