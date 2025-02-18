/**
 * お気に入り機能のAPI通信を管理
 * Api::V1::FavoritesControllerとの通信を処理
 * お気に入りの魚の登録、取得、削除の通信処理を実行
 */
import client from "./client";

export const favoritesAPI = {
  /**
   * お気に入り一覧の取得
   * GET /api/v1/favorites にリクエストを送信
   * Api::V1::FavoritesController#indexを呼び出し
   * お気に入りに登録した魚の一覧とその詳細情報を取得
   */
  getFavorites: async () => {
    try {
      const response = await client.get("/api/v1/favorites");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      throw error;
    }
  },

  /**
   * お気に入りへの魚の追加
   * POST /api/v1/favorites にリクエストを送信
   * Api::V1::FavoritesController#createを呼び出し
   * 指定されたIDの魚をお気に入りに追加
   */
  addFavorite: async (fishId) => {
    try {
      const response = await client.post("/api/v1/favorites", {
        fish_id: fishId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  },

  /**
   * お気に入りからの魚の削除
   * DELETE /api/v1/favorites/:id にリクエストを送信
   * Api::V1::FavoritesController#destroyを呼び出し
   * 指定されたIDの魚をお気に入りから削除
   */
  removeFavorite: async (fishId) => {
    try {
      await client.delete(`/api/v1/favorites/${fishId}`);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      throw error;
    }
  },
};
