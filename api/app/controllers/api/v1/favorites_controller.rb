class Api::V1::FavoritesController < ApplicationController
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

  private

  def set_active_storage_current
    return if Rails.env.production?

    ActiveStorage::Current.url_options = {
      host: ENV.fetch('API_HOST', 'localhost'),
      port: ENV.fetch('API_PORT', 3000),
      protocol: ENV.fetch('API_PROTOCOL', 'http')
    }
  end
end
