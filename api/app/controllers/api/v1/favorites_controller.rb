# frozen_string_literal: true

module Api
  module V1
    class FavoritesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_active_storage_current

      def index
        @favorites = current_user.favorite_fishes
                                 .includes(:fish_seasons)
                                 .with_attached_image
        render json: @favorites.map { |fish|
          fish.as_json(include: :fish_seasons, methods: :image_url)
        }
      end

      def create
        fish_id = params[:fish_id] || params.dig(:favorite, :fish_id)
        @favorite = current_user.favorites.build(fish_id: fish_id)

        if @favorite.save
          fish = @favorite.fish.as_json(
            include: :fish_seasons,
            methods: :image_url
          )
          render json: fish, status: :created
        else
          Rails.logger.debug { "Favorite validation errors: #{@favorite.errors.full_messages}" } # デバッグログ追加
          render json: {
            error: @favorite.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

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

      def favorite_params
        params.permit(:fish_id, favorite: [:fish_id])
      end

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
