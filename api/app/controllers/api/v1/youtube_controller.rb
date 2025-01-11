# frozen_string_literal: true

module Api
  module V1
    class YoutubeController < ApplicationController
      def search
        return render_error('検索キーワードを入力してください') if params[:q].blank?

        result = YoutubeService.search(params[:q])
        if result[:success]
          render json: { videos: result[:data] }
        else
          render_error(result[:error])
        end
      end

      private

      def render_error(message)
        render json: { error: message }, status: :bad_request
      end
    end
  end
end
