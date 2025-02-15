# frozen_string_literal: true

# YouTube動画検索機能を提供するAPIコントローラー
# 魚に関する料理や解説動画を検索するためのエンドポイントを管理
# YouTubeのAPIを利用して動画情報を取得
module Api
  module V1
    class YoutubeController < ApplicationController
      # GET /api/v1/youtube/search?q=検索キーワード
      # 指定されたキーワードでYouTube動画を検索
      def search
        # キーワードが空の場合はエラーを返す
        return render_error('検索キーワードを入力してください') if params[:q].blank?

        # YouTubeサービスを使用して検索を実行
        result = YoutubeService.search(params[:q])

        if result[:success]
          render json: { videos: result[:data] }
        else
          render_error(result[:error])
        end
      end

      private

      # エラーレスポンスを生成するヘルパーメソッド
      # @param message [String] エラーメッセージ
      def render_error(message)
        render json: { error: message }, status: :bad_request
      end
    end
  end
end
