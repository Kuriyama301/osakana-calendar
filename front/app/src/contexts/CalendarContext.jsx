/**
 * カレンダーの状態管理のコンテキストコンポーネント
 * 選択された日付、表示月の管理、日付の同期処理を制御
 */

import { createContext, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";

// カレンダーのグローバル状態を管理するコンテキストを作成
export const CalendarContext = createContext();

/**
 * カレンダーの状態を提供するプロバイダーコンポーネント
 * @param {Object} props
 * @param {ReactNode} props.children - 子コンポーネント
 * @param {Date} props.initialDate - 初期表示する日付（デフォルト: 現在の日付）
 */
const CalendarProvider = ({ children, initialDate = new Date() }) => {
  // 選択された日付の状態管理
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // 現在表示中の月の状態管理
  const [displayedMonth, setDisplayedMonth] = useState(initialDate);

  // 外部からの日付選択かどうかのフラグ管理
  // これにより、メインカレンダーとサブカレンダー間の同期を制御
  const [isExternalSelection, setIsExternalSelection] = useState(false);

  // メインカレンダーのrefを保持し、スクロール制御に使用
  const mainCalendarRef = useRef(null);

  /**
   * 外部から日付を選択した際の処理
   * - サブカレンダーからメインカレンダーを操作する際に使用
   * - 日付の選択、表示月の更新、該当日付へのスクロールを一括で処理
   */

  const setSelectedDateExternal = useCallback((date) => {
    setIsExternalSelection(true);
    setSelectedDate(date);
    setDisplayedMonth(date);

    // メインカレンダーが存在する場合、その日付までスクロール
    if (mainCalendarRef.current?.scrollToDate) {
      mainCalendarRef.current.scrollToDate(date);
    }
  }, []);

  /**
   * 表示月を変更する処理
   * - カレンダーのナビゲーション時に使用
   */
  const changeDisplayedMonth = useCallback((date) => {
    setDisplayedMonth(date);
  }, []);

  // コンテキストの値をプロバイダーを通じて子コンポーネントに提供
  return (
    <CalendarContext.Provider
      value={{
        selectedDate, // 現在選択されている日付
        setSelectedDate, // 日付選択を更新する関数
        displayedMonth, // 現在表示している月
        changeDisplayedMonth, // 表示月を変更する関数
        isExternalSelection, // 外部選択フラグ
        setSelectedDateExternal, // 外部から日付を選択する関数
        mainCalendarRef, // メインカレンダーへの参照
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

// 型チェック
CalendarProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialDate: PropTypes.instanceOf(Date),
};

export default CalendarProvider;
