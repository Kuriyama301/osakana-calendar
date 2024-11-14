class Api::V1::FishController < ApplicationController
  before_action :set_active_storage_current, only: [:show, :search]

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
        # 旬の時期情報を一括取得（N+1問題）
        .includes(:fish_seasons)
        # 画像情報を一括取得
        .with_attached_image
    else
      Fish.all
        .includes(:fish_seasons)
        .with_attached_image
    end

    render json: @fishes.as_json(include: :fish_seasons, methods: :image_url)
  rescue StandardError => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def fish_params
    params.require(:fish).permit(:name, :features, :nutrition, :origin)
  end

  # URL生成をフォーム検索からも利用可能にする
  def set_active_storage_current
    return if Rails.env.production?

    ActiveStorage::Current.url_options = {
      host: ENV.fetch('API_HOST', 'localhost'),
      port: ENV.fetch('API_PORT', 3000),
      protocol: ENV.fetch('API_PROTOCOL', 'http')
    }
  end
end
