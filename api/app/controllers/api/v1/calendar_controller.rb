class Api::V1::CalendarController < ApplicationController
  def fish_by_date
    date = Date.parse(params[:date])
    @fish = Fish.in_season_on(date).includes(:fish_seasons, :image_attachment)

    if @fish.empty?
      render json: { message: "No fish available for the specified date" }, status: :not_found
    else
      render json: @fish.as_json(include: :fish_seasons, methods: :image_url)
    end
  rescue ArgumentError
    render json: { error: "Invalid date format" }, status: :bad_request
  end
end
