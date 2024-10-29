class Api::V1::CalendarController < ApplicationController
  def fish_by_date
    date = Date.parse(params[:date])
    @fish = Fish.in_season_on(date)
      .includes(:fish_seasons)
      .with_attached_image
      .select(:id, :name, :features, :nutrition, :origin)

    if @fish.exists?
      # as_jsonメソッドを使用して画像URLを含める
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
end
