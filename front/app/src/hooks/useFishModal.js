/**
 * 魚情報モーダルの状態管理カスタムフック
 * モーダルの表示制御と魚のデータ取得を管理
 * Api::V1::FishControllerから日付ごとの魚データを取得
 */

import { useState } from "react";
import { getFishByDate } from "../api/fish";

/**
 * 魚情報モーダルの制御フック
 * @returns {Object} モーダルの状態と制御関数
 * - isModalOpen: モーダルの表示状態
 * - selectedModalDate: 選択された日付
 * - isLoading: データ取得中の状態
 * - seasonalFish: 表示する魚のデータ
 * - error: エラー情報
 * - handleDateClick: 日付選択時の処理関数
 * - closeModal: モーダルを閉じる関数
 */
export const useFishModal = () => {
  // モーダルの状態管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seasonalFish, setSeasonalFish] = useState([]);
  const [error, setError] = useState(null);

  /**
   * 日付選択時の処理
   * @param {Date} date - 選択された日付
   */
  const handleDateClick = async (date) => {
    // 日付を日本語形式にフォーマット
    const formattedDate = `${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日`;

    // 状態の初期化
    setSelectedModalDate(formattedDate);
    setIsLoading(true);
    setError(null);

    try {
      // API経由で魚のデータを取得
      const fishData = await getFishByDate(date);
      setSeasonalFish(fishData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch fish data:", error);
      setError("データの取得に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isModalOpen,
    selectedModalDate,
    isLoading,
    seasonalFish,
    error,
    handleDateClick,
    closeModal: () => setIsModalOpen(false),
  };
};
