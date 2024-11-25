import client from "./client";
import { videoCache } from "../utils/videoCache";

export const searchYoutubeVideos = async (query) => {
  try {
    // キャッシュを確認
    const cachedData = videoCache.get(query);
    if (cachedData) {
      console.log("キャッシュからデータを取得:", query);
      return cachedData;
    }

    // APIから新しいデータを取得
    const response = await client.get("/api/v1/youtube/search", {
      params: { q: query },
    });

    // キャッシュに保存
    const videos = response.data.videos;
    videoCache.set(query, videos);

    return videos;
  } catch (error) {
    console.error("YouTube動画の検索に失敗しました:", error);
    throw error;
  }
};
