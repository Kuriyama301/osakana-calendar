/**
* YouTube動画検索に関するAPI通信を管理
* 検索キーワードによる動画取得とキャッシュの処理を記述
*/

import client from "./client";
import { videoCache } from "../utils/videoCache";

export const searchYoutubeVideos = async (query) => {
  try {
    const cachedData = videoCache.get(query);
    if (cachedData) {
      console.log("キャッシュからデータを取得:", query);
      return cachedData;
    }

    const response = await client.get("/api/v1/youtube/search", {
      params: { q: query },
    });

    const videos = response.data.videos;
    videoCache.set(query, videos);

    return videos;
  } catch (error) {
    console.error("YouTube動画の検索に失敗しました:", error);
    throw error;
  }
};
