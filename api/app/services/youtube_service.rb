# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

# YouTube APIと連携して動画検索を行うサービスクラス
# 魚の料理レシピ動画を検索して結果を整形して返す
class YoutubeService
  # YouTube Data API v3のベースURL
  BASE_URL = 'https://www.googleapis.com/youtube/v3'

  # 指定されたキーワードで料理動画を検索
  # @param query [String] 検索キーワード（魚の名前など）
  # @return [Hash] 検索結果（成功時はvideos配列、失敗時はエラーメッセージ）
  def self.search(query)
    # 料理レシピに特化した検索クエリを作成
    search_query = "#{query} 料理 レシピ"

    # APIリクエストのURL構築
    uri = URI("#{BASE_URL}/search")
    params = {
      part: 'snippet',
      q: search_query,
      key: ENV.fetch('YOUTUBE_API_KEY', nil),
      maxResults: 3,
      type: 'video'
    }

    uri.query = URI.encode_www_form(params)

    begin
      # HTTPSリクエストを実行
      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        request = Net::HTTP::Get.new(uri)
        http.request(request)
      end

      if response.is_a?(Net::HTTPSuccess)
        # レスポンスを解析して必要な情報を抽出
        data = JSON.parse(response.body)
        videos = data['items'].map do |item|
          {
            id: item['id']['videoId'],
            title: item['snippet']['title'],
            thumbnail_url: item['snippet']['thumbnails']['medium']['url']
          }
        end
        { success: true, data: videos }
      else
        # APIリクエスト失敗時のエラーレスポンス
        { success: false, error: '動画の検索に失敗しました' }
      end
    rescue StandardError => e
      # 通信エラーなどの例外発生時のエラーレスポンス
      { success: false, error: e.message }
    end
  end
end
