require 'net/http'
require 'uri'
require 'json'

class YoutubeService
  BASE_URL = 'https://www.googleapis.com/youtube/v3'

  def self.search(query)
    search_query = "#{query} 料理 レシピ"

    uri = URI("#{BASE_URL}/search")
    params = {
      part: 'snippet',
      q: search_query,
      key: ENV['YOUTUBE_API_KEY'],
      maxResults: 3,
      type: 'video'
    }

    uri.query = URI.encode_www_form(params)

    begin
      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        request = Net::HTTP::Get.new(uri)
        http.request(request)
      end

      if response.is_a?(Net::HTTPSuccess)
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
        { success: false, error: '動画の検索に失敗しました' }
      end
    rescue StandardError => e
      { success: false, error: e.message }
    end
  end
end
