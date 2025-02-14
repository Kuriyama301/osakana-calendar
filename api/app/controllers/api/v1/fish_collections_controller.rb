# frozen_string_literal: true

# コレクショnn機能を管理するAPI機能を提供するコントローラー
# 魚の登録、取得、削除を管理
# 各アクションは認証済みユーザーのみアクセス可能
module Api
  module V1
    class FishCollectionsController < ApplicationController
      # 未認証ユーザーのアクセスを制限
      before_action :authenticate_user!
      # 画像URL生成の設定を行うフィルター
      before_action :set_active_storage_current

      # GET /api/v1/fish_collections
      # ユーザーのコレクション一覧を取得
      def index
        @collections = current_user.collected_fishes
                                   .includes(:fish_seasons)
                                   .with_attached_image
        render json: @collections.map { |fish|
          fish.as_json(include: :fish_seasons, methods: :image_url)
        }
      end

      # POST /api/v1/fish_collections
      # 新しい魚をコレクションに追加
      def create
        # パラメータから魚のIDを取得（2つの形式に対応）
        fish_id = params[:fish_id] || params.dig(:fish_collection, :fish_id)
        @collection = current_user.fish_collections.build(fish_id: fish_id)

        if @collection.save
          fish = @collection.fish.as_json(
            include: :fish_seasons,
            methods: :image_url
          )
          render json: fish, status: :created
        else
          # バリデーションエラー時のデバッグ情報を記録
          Rails.logger.debug { "Collection validation errors: #{@collection.errors.full_messages}" }
          render json: {
            error: @collection.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/fish_collections/:id
      # 指定された魚をコレクションから削除
      def destroy
        @collection = current_user.fish_collections.find_by!(fish_id: params[:id])
        if @collection.destroy
          head :no_content
        else
          render json: { error: 'Failed to remove collection' }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Collection not found' }, status: :not_found
      end

      private

      # 許可されたパラメータを定義
      def collection_params
        params.permit(:fish_id, fish_collection: [:fish_id])
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
