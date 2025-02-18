/**
 * YouTube動画検索に関するAPI通信を管理
 * Api::V1::YoutubeControllerとの通信を処理
 * 魚の料理動画の検索とキャッシュ管理を実行
 */
import client from "./client";
import { videoCache } from "../utils/videoCache";

/**
 * YouTubeの料理動画を検索
 * GET /api/v1/youtube/search にリクエストを送信
 * Api::V1::YoutubeController#searchを呼び出し
 * キャッシュがある場合はそれを使用し、なければAPIリクエストを実行
 *
 * @param {string} query - 検索する魚の名前
 * @returns {Array} 動画情報の配列（タイトル、サムネイル、動画ID）
 */
export const searchYoutubeVideos = async (query) => {
  try {
    // キャッシュをチェック
    const cachedData = videoCache.get(query);
    if (cachedData) {
      console.log("キャッシュからデータを取得:", query);
      return cachedData;
    }

    // APIリクエストを実行
    const response = await client.get("/api/v1/youtube/search", {
      params: { q: query },
    });

    const videos = response.data.videos;

    // 取得したデータをキャッシュに保存
    videoCache.set(query, videos);

    return videos;
  } catch (error) {
    console.error("YouTube動画の検索に失敗しました:", error);
    throw error;
  }
};
