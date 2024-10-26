class Api::V1::CalendarController < ApplicationController
  def fish_by_date
    date = Date.parse(params[:date])
    @fish = Fish.in_season_on(date)
      .includes(:fish_seasons)
      .select(:id, :name, :features, :nutrition, :origin)

    if @fish.exists?
      render json: @fish, include: :fish_seasons
    else
      render json: { message: "No fish found for this date" }, status: :not_found
    end
  rescue ArgumentError
    render json: { error: "Invalid date format" }, status: :bad_request
  end
end
