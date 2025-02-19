/**
 * 今日の旬の魚モーダル管理のカスタムフック
 * 初回訪問時と日付変更時のモーダル表示を制御
 * useFishModalと連携して魚のデータを表示
 */

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useFishModal } from "./useFishModal";

/**
 * 日別魚情報モーダルの制御フック
 * @returns {Object} モーダルの状態と制御関数
 * - isModalOpen: モーダルの表示状態
 * - selectedModalDate: 選択された日付
 * - isLoading: ローディング状態
 * - seasonalFish: 表示する魚のデータ
 * - error: エラー情報
 * - closeModal: モーダルを閉じる関数
 */
export const useDailyFishModal = () => {
  // 初期ローディング状態の管理
  const [initialLoading, setInitialLoading] = useState(true);

  // 魚情報モーダルの基本機能を取得
  const {
    isModalOpen,
    selectedModalDate,
    isLoading,
    seasonalFish,
    error,
    handleDateClick,
    closeModal,
  } = useFishModal();

  /**
   * 初回訪問時と日付変更時の処理
   * その日の旬の魚を自動表示
   */
  useEffect(() => {
    const checkDailyFish = async () => {
      try {
        // 今日の日付を取得
        const today = format(new Date(), "yyyy-MM-dd");
        // 最後の訪問日を取得
        const lastVisit = localStorage.getItem("lastVisitDate");

        // 日付が変わっていれば魚の情報を表示
        if (lastVisit !== today) {
          await handleDateClick(new Date());
          localStorage.setItem("lastVisitDate", today);
        }
      } catch (e) {
        console.error("Daily fish check failed:", e);
      } finally {
        setInitialLoading(false);
      }
    };

    checkDailyFish();
  }, [handleDateClick]);

  // 全体のローディング状態を管理
  const isPageLoading = initialLoading || isLoading;

  return {
    isModalOpen,
    selectedModalDate,
    isLoading: isPageLoading,
    seasonalFish,
    error,
    closeModal,
  };
};
