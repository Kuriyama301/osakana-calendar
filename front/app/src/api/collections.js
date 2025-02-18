/**
 * 魚のコレクション機能のAPI通信を管理
 * Api::V1::FishCollectionsControllerとの通信を処理
 * ユーザーの魚コレクション機能に関する通信処理を実行
 */
import client from "./client";

export const collectionsAPI = {
  /**
   * コレクション一覧の取得
   * GET /api/v1/fish_collections にリクエストを送信
   * Api::V1::FishCollectionsController#indexを呼び出し
   * 収集した魚の一覧とその詳細情報を取得
   */
  getCollections: async () => {
    try {
      const response = await client.get("/api/v1/fish_collections");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      throw error;
    }
  },

  /**
   * コレクションへの魚の追加
   * POST /api/v1/fish_collections にリクエストを送信
   * Api::V1::FishCollectionsController#createを呼び出し
   * 指定されたIDの魚をユーザーのコレクションに追加
   */
  addCollection: async (fishId) => {
    try {
      const response = await client.post("/api/v1/fish_collections", {
        fish_id: fishId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add collection:", error);
      throw error;
    }
  },

  /**
   * コレクションからの魚の削除
   * DELETE /api/v1/fish_collections/:id にリクエストを送信
   * Api::V1::FishCollectionsController#destroyを呼び出し
   * 指定されたIDの魚をユーザーのコレクションから削除
   */
  removeCollection: async (fishId) => {
    try {
      await client.delete(`/api/v1/fish_collections/${fishId}`);
    } catch (error) {
      console.error("Failed to remove collection:", error);
      throw error;
    }
  },
};
