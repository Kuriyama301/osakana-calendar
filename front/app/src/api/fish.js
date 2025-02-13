/**
* 魚の情報取得に関するAPI通信を管理
* 日付による魚の取得、魚の検索機能の通信処理を記述
*/

import client from "./client";

export const getFishByDate = async (date) => {
  try {
    if (!date) {
      throw new Error("Date parameter is required");
    }

    const formattedDate =
      date instanceof Date ? date.toISOString().split("T")[0] : date;

    const response = await client.get("api/v1/calendar/fish", {
      params: { date: formattedDate },
    });

    return response.data;
  } catch (error) {
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
