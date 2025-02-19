/**
 * サブカレンダーのコンポーネント
 * カレンダーの表示と操作機能を統合
 * CalendarContextからカレンダーの状態を取得し、子コンポーネントに提供
 */

import React from "react";
import { useCalendar } from "../../hooks/useCalendar";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";

/**
 * サブカレンダーコンポーネント
 * カレンダーのヘッダー（年月表示と月切り替え）と
 * ボディ（日付グリッド）を組み合わせて表示
 */
const SubCalendar = () => {
  // カレンダーの状態管理フックを使用
  const {
    selectedDate, // 選択中の日付
    setSelectedDateExternal, // 日付選択の更新関数
    displayedMonth, // 表示中の月
    changeDisplayedMonth, // 表示月の変更関数
  } = useCalendar();

  /**
   * 前月への移動処理
   * 現在の表示月から1ヶ月前の日付を生成
   */
  const prevMonth = () => {
    const newDate = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() - 1,
      1
    );
    changeDisplayedMonth(newDate);
  };

  /**
   * 次月への移動処理
   * 現在の表示月から1ヶ月後の日付を生成
   */
  const nextMonth = () => {
    const newDate = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + 1,
      1
    );
    changeDisplayedMonth(newDate);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full">
      {/* ヘッダー部分：年月表示と月切り替えボタン */}
      <CalendarHeader
        displayedMonth={displayedMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      {/* ボディ部分：日付グリッドと選択機能 */}
      <CalendarBody
        displayedMonth={displayedMonth}
        selectedDate={selectedDate}
        setSelectedDateExternal={setSelectedDateExternal}
      />
    </div>
  );
};

export default SubCalendar;
