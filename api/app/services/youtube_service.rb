require 'net/http'
require 'uri'
require 'json'

class YoutubeService
  BASE_URL = 'https://www.googleapis.com/youtube/v3'

  def self.search(query, max_results = 3)
    Rails.logger.info "YouTube Search: Starting search for query: #{query}"

    api_key = ENV['YOUTUBE_API_KEY']
    Rails.logger.info "API Key present: #{!api_key.blank?}"

    return { success: false, error: 'APIキーが設定されていません' } if api_key.blank?

    search_query = "#{query} 料理 レシピ"

    uri = URI("#{BASE_URL}/search")
    params = {
      part: 'snippet',
      q: search_query,
      key: api_key,
      maxResults: max_results,
      type: 'video',
      relevanceLanguage: 'ja',
      videoEmbeddable: 'true'
    }

    uri.query = URI.encode_www_form(params)
    Rails.logger.info "Request URL: #{uri.to_s.gsub(api_key, '[REDACTED]')}"

    begin
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER

      request = Net::HTTP::Get.new(uri)
      # リファラーヘッダーを追加
      request['Referer'] = 'http://localhost:3000'
      # User-Agentヘッダーも追加
      request['User-Agent'] = 'OsakanaCalendarApp/1.0'

      Rails.logger.info "Making HTTP request..."
      response = http.request(request)
      Rails.logger.info "Response status: #{response.code}"
      Rails.logger.info "Response body: #{response.body[0..200]}..."

      if response.is_a?(Net::HTTPSuccess)
        data = JSON.parse(response.body)
        videos = data['items'].map do |item|
          {
            video_id: item['id']['videoId'],
            title: item['snippet']['title'],
            thumbnail: item['snippet']['thumbnails']['medium'],
            channel_title: item['snippet']['channelTitle'],
            published_at: item['snippet']['publishedAt']
          }
        end
        { success: true, data: videos }
      else
        Rails.logger.error "Request failed: #{response.code} - #{response.body}"
        { success: false, error: "動画の検索に失敗しました (Status: #{response.code})" }
      end
    rescue StandardError => e
      Rails.logger.error "Error occurred: #{e.class} - #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      { success: false, error: "エラーが発生しました: #{e.message}" }
    end
  end
end
