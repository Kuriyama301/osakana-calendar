import client from "./client";

export const getFishByDate = async (date) => {
  try {
    if (!date) {
      throw new Error('Date parameter is required');
    }
    
    const formattedDate = date instanceof Date 
      ? date.toISOString().split('T')[0] 
      : date;

    // baseURLが設定されているため、先頭のスラッシュを削除
    const response = await client.get('api/v1/calendar/fish', {
      params: { date: formattedDate }
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // 魚が見つからない場合は空配列
    }
    console.error('Failed to fetch fish data:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch fish data'
    );
  }
};