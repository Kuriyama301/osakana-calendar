/**
 * カレンダー機能のカスタムフック
 * CalendarContextからカレンダーの状態と操作関数を取得して提供
 * 日付の選択、表示月の管理などのカレンダー機能へのアクセスを一元管理
 */

import { useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";

/**
 * カレンダー状態管理のカスタムフック
 * @returns {Object} CalendarContextの提供する全てのカレンダー機能と状態
 * @throws {Error} CalendarProviderの外で使用された場合
 */
export const useCalendar = () => {
  const context = useContext(CalendarContext);

  // CalendarProviderの外で使用された場合はエラー
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }

  return context;
};
