/**
 * カレンダーデータの生成と管理を行うカスタムフック
 * 無限スクロールのためのデータ拡張機能を提供
 *
 * @param {number} initialYearRange - 初期表示する年数範囲（デフォルト: 前後5年）
 * @returns {Object} カレンダーデータと拡張関数を含むオブジェクト
 */

import { useState, useCallback, useEffect } from "react";

export const useCalendarLogic = (initialYearRange = 5) => {
  // カレンダーの日付データを管理するstate
  const [calendarData, setCalendarData] = useState([]);

  /**
   * 指定された期間の日付データを生成する関数
   * @param {Date} startDate - 開始日
   * @param {Date} endDate - 終了日
   * @returns {Array<Date>} 日付オブジェクトの配列
   */
  const generateCalendarData = useCallback((startDate, endDate) => {
    const data = [];
    // 開始日から終了日まで1日ずつ日付オブジェクトを生成
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      data.push(new Date(date));
    }
    return data;
  }, []);

  /**
   * コンポーネントマウント時の初期データ生成
   * 現在の年から前後initialYearRange年分のデータを生成
   */
  useEffect(() => {
    // 初期表示範囲の開始日を設定（例：2020年1月1日）
    const initialStartDate = new Date(
      new Date().getFullYear() - initialYearRange,
      0,
      1
    );
    // 初期表示範囲の終了日を設定（例：2030年12月31日）
    const initialEndDate = new Date(
      new Date().getFullYear() + initialYearRange,
      11,
      31
    );
    // 初期データをセット
    setCalendarData(generateCalendarData(initialStartDate, initialEndDate));
  }, [generateCalendarData, initialYearRange]);

  /**
   * カレンダーデータを指定された方向に拡張する関数
   * スクロールが端に近づいた時に呼び出される
   *
   * @param {string} direction - 拡張する方向 ("past" | "future")
   */
  const extendCalendarData = useCallback(
    (direction) => {
      // 現在のデータの開始日と終了日を取得
      const currentStartDate = calendarData[0];
      const currentEndDate = calendarData[calendarData.length - 1];

      if (direction === "past") {
        // 過去方向への拡張
        const newStartDate = new Date(currentStartDate);
        newStartDate.setFullYear(newStartDate.getFullYear() - 1);
        // 新しいデータを生成して現在のデータの前に追加
        const newData = generateCalendarData(newStartDate, currentStartDate);
        setCalendarData((prevData) => [...newData, ...prevData]);
      } else {
        // 未来方向への拡張
        const newEndDate = new Date(currentEndDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        // 新しいデータを生成して現在のデータの後に追加
        const newData = generateCalendarData(currentEndDate, newEndDate);
        setCalendarData((prevData) => [...prevData, ...newData]);
      }
    },
    [calendarData, generateCalendarData]
  );

  return { calendarData, extendCalendarData };
};
