module Api
  module V1
    class YoutubeController < ApplicationController
      def search
        fish_name = params[:q]&.strip
        if fish_name.blank?
          render json: { error: '魚の名前を指定してください' }, status: :bad_request
          return
        end

        result = YoutubeService.search(fish_name)

        if result[:success]
          render json: { success: true, videos: result[:data] }
        else
          render json: { success: false, error: result[:error] }, status: :internal_server_error
        end
      end
    end
  end
end
