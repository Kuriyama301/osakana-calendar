/**
 * サブカレンダーのヘッダー部分のコンポーネント
 * 年月の表示、前月・次月への移動ボタンを管理
 * MainCalendarコンポーネントから月の情報と移動関数を受け取る
 */

import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * カレンダーヘッダーコンポーネント
 * @param {Date} displayedMonth - 表示中の年月
 * @param {Function} prevMonth - 前月への移動関数
 * @param {Function} nextMonth - 次月への移動関数
 */
const CalendarHeader = ({ displayedMonth, prevMonth, nextMonth }) => (
  <div className="flex justify-center items-center mb-6">
    {/* 年月の表示 */}
    <h2 className="text-xl font-semibold text-gray-800 mr-6">
      {displayedMonth.getFullYear()}年 {displayedMonth.getMonth() + 1}月
    </h2>

    {/* 月移動ボタン */}
    <div className="flex ml-4">
      {/* 前月ボタン */}
      <button
        onClick={prevMonth}
        className="text-blue-500 bg-gray-100 w-10 h-10 flex items-center justify-center transition-all duration-200 ease-in-out mr-2 rounded-full hover:bg-gray-200 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50 !p-0 !border-0"
        aria-label="前の月"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 次月ボタン */}
      <button
        onClick={nextMonth}
        className="text-blue-500 bg-gray-100 w-10 h-10 flex items-center justify-center transition-all duration-200 ease-in-out rounded-full hover:bg-gray-200 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50 !p-0 !border-0"
        aria-label="次の月"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  </div>
);

// Propsの型チェック
CalendarHeader.propTypes = {
  displayedMonth: PropTypes.instanceOf(Date).isRequired,
  prevMonth: PropTypes.func.isRequired,
  nextMonth: PropTypes.func.isRequired,
};

export default CalendarHeader;
