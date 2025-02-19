/**
 * カレンダーの日付セルのコンポーネント
 * 1日分の日付の表示と選択状態の管理
 * CalendarBodyから日付データを受け取り、クリックイベントを親に通知
 */

import PropTypes from "prop-types";

/**
 * 日付セルコンポーネント
 * @param {Date} date - 表示する日付
 * @param {boolean} isSelected - 選択状態
 * @param {Function} onClick - クリック時のコールバック
 */
const CalendarDay = ({ date, isSelected, onClick }) => (
  <div
    // テスト用のdata属性
    data-testid={`calendar-day-${date.getDate()}`}
    // 選択状態に応じてスタイルを切り替え
    className={`text-center text-sm cursor-pointer ${
      isSelected
        ? "bg-blue-500 text-white rounded-full" // 選択中の日付のスタイル
        : "text-gray-700 hover:bg-gray-100" // 非選択時のスタイル
    }`}
    onClick={onClick}
  >
    {date.getDate()}
  </div>
);

// Propsの型チェック
CalendarDay.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CalendarDay;
