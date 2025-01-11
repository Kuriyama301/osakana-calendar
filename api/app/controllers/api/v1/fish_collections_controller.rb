# frozen_string_literal: true

module Api
  module V1
    class FishCollectionsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_active_storage_current

      def index
        @collections = current_user.collected_fishes
                                   .includes(:fish_seasons)
                                   .with_attached_image
        render json: @collections.map { |fish|
          fish.as_json(include: :fish_seasons, methods: :image_url)
        }
      end

      def create
        fish_id = params[:fish_id] || params.dig(:fish_collection, :fish_id)
        @collection = current_user.fish_collections.build(fish_id: fish_id)

        if @collection.save
          fish = @collection.fish.as_json(
            include: :fish_seasons,
            methods: :image_url
          )
          render json: fish, status: :created
        else
          Rails.logger.debug { "Collection validation errors: #{@collection.errors.full_messages}" }
          render json: {
            error: @collection.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

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

      def collection_params
        params.permit(:fish_id, fish_collection: [:fish_id])
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
