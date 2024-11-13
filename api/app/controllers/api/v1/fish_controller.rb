class Api::V1::FishController < ApplicationController
  def index
    begin
      date = params[:date].present? ? Date.parse(params[:date]) : Date.today
      @fishes = Fish.in_season_with_full_details(date)
      render json: @fishes
    rescue ArgumentError
      render json: { error: "Invalid date format. Please use YYYY-MM-DD." }, status: :bad_request
    end
  end

  def show
    @fish = Fish.find(params[:id])
    render json: @fish.as_json(include: :fish_seasons, methods: :image_url)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Fish not found" }, status: :not_found
  end

  def search
    @fishes = if params[:query].present?
      Fish.search_by_name_and_features(params[:query])
    else
      Fish.all
    end

    render json: @fishes.as_json(include: :fish_seasons, methods: :image_url)
  rescue StandardError => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def fish_params
    params.require(:fish).permit(:name, :features, :nutrition, :origin)
  end
end
