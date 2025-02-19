/**
 * 魚の旬の時期による絞り込み機能のカスタムフック
 * 指定された日付に旬の魚をフィルタリング
 * Fish.in_season_onスコープの処理をフロントエンドで実装
 */

import { useMemo } from "react";

/**
 * 日付が旬の期間内かどうかを判定
 * @param {Object} season - 旬の期間情報 (start_month, start_day, end_month, end_day)
 * @param {string} currentDate - 判定する日付（YYYY年MM月DD日形式）
 * @returns {boolean} 期間内ならtrue
 */
const isDateInSeason = (season, currentDate) => {
  // 日付文字列を分解して数値に変換
  const [year, month, day] = currentDate
    .replace(/年|月/g, "-")
    .replace("日", "")
    .split("-")
    .map(Number);

  // Dateオブジェクトと月日の数値表現を作成
  const current = new Date(year, month - 1, day);
  const currentMonthDay = current.getMonth() * 100 + current.getDate();

  const startMonthDay = (season.start_month - 1) * 100 + season.start_day;
  const endMonthDay = (season.end_month - 1) * 100 + season.end_day;

  // 期間が年をまたがない場合と年をまたぐ場合で判定
  return startMonthDay <= endMonthDay
    ? currentMonthDay >= startMonthDay && currentMonthDay <= endMonthDay
    : currentMonthDay >= startMonthDay || currentMonthDay <= endMonthDay;
};

/**
 * 魚のフィルタリングフック
 * @param {Array} seasonalFish - フィルタリング対象の魚の配列
 * @param {string} currentDate - フィルタリングする日付
 * @returns {Array} フィルタリングされた魚の配列
 */
export const useFishFilter = (seasonalFish, currentDate) => {
  return useMemo(
    () =>
      seasonalFish.filter((fish) =>
        fish.fish_seasons.some((season) => isDateInSeason(season, currentDate))
      ),
    [seasonalFish, currentDate]
  );
};
