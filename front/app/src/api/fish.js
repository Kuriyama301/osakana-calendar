/**
 * 魚の情報取得に関するAPI通信を管理
 * Api::V1::CalendarControllerおよびApi::V1::FishControllerとの通信を処理
 * 日付による旬の魚の取得、魚の検索機能の通信処理を実行
 */
import client from "./client";

/**
 * 指定日付の旬の魚を取得
 * GET /api/v1/calendar/fish にリクエストを送信
 * Api::V1::CalendarController#fish_by_dateを呼び出し
 * @param {Date|string} date - 検索する日付
 * @returns {Array} 該当する魚の配列（画像URLと旬の期間を含む）
 */
export const getFishByDate = async (date) => {
  try {
    if (!date) {
      throw new Error("Date parameter is required");
    }

    // 日付のフォーマット処理
    const formattedDate =
      date instanceof Date ? date.toISOString().split("T")[0] : date;

    const response = await client.get("api/v1/calendar/fish", {
      params: { date: formattedDate },
    });

    return response.data;
  } catch (error) {
    // 魚が見つからない場合は空配列を返す
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch fish data:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch fish data"
    );
  }
};

/**
 * 魚を名前や特徴で検索
 * GET /api/v1/fish/search にリクエストを送信
 * Api::V1::FishController#searchを呼び出し
 * @param {string} searchTerm - 検索キーワード
 * @returns {Array} 検索結果の魚の配列（画像URLと旬の期間を含む）
 */
export const searchFish = async (searchTerm) => {
  try {
    const response = await client.get("api/v1/fish/search", {
      params: { query: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to search fish:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to search fish"
    );
  }
};
