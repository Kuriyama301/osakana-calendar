class Api::V1::FavoritesController < ApplicationController
  before_action :authenticate_user!

  def index
    @favorites = current_user.favorite_fishes
    render json: @favorites.as_json(include: :fish_seasons, methods: :image_url)
  end

  def create
    @favorite = current_user.favorites.build(fish_id: params[:fish_id])
    if @favorite.save
      render json: @favorite.fish.as_json(include: :fish_seasons, methods: :image_url), status: :created
    else
      render json: { error: @favorite.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @favorite = current_user.favorites.find_by!(fish_id: params[:id])
    @favorite.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Favorite not found' }, status: :not_found
  end
end
