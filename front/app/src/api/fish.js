import client from "./client";

export const getFishByDate = async (date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    // 本番環境ではAPIのベースURLに /api が含まれていないため、パスを修正
    const apiPath = 'v1/calendar/fish';
    const response = await client.get(`${apiPath}?date=${formattedDate}`);
    return response.data;
  } catch (error) {
    // より詳細なデバッグ情報を追加
    console.error('API Request Failed:', {
      date: formattedDate,
      config: error.config,
      response: error.response,
      message: error.message
    });
    throw error;
  }
};