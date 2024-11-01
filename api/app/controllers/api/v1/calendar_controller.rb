class Api::V1::CalendarController < ApplicationController
  before_action :set_active_storage_current, only: :fish_by_date

  def fish_by_date
    date = Date.parse(params[:date])
    @fish = Fish.in_season_on(date)
      .includes(:fish_seasons)
      .with_attached_image
      .select(:id, :name, :features, :nutrition, :origin)

    if @fish.exists?
      # as_jsonメソッドを使用して画像URLを含める rails7から？
      render json: @fish.as_json(
        include: :fish_seasons,
        methods: [:image_url]
      )
    else
      render json: { message: "No fish found for this date" }, status: :not_found
    end
  rescue ArgumentError
    render json: { error: "Invalid date format" }, status: :bad_request
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
