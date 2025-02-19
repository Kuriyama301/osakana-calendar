/**
 * カレンダーの日付表示部分のコンポーネント
 * 曜日の表示、日付のグリッド表示、日付の選択機能を管理
 * CalendarDayコンポーネントを使用して各日付のレンダリングと選択を制御
 */

import PropTypes from "prop-types";
import CalendarDay from "./CalendarDay";

const CalendarBody = ({
  displayedMonth,
  selectedDate,
  setSelectedDateExternal,
}) => {
  /**
   * 指定された年月の日数を取得
   * @param {number} year - 年
   * @param {number} month - 月（0-11）
   * @returns {number} その月の日数
   */
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  /**
   * 指定された年月の1日の曜日を取得（0:日曜 - 6:土曜）
   * @param {number} year - 年
   * @param {number} month - 月（0-11）
   * @returns {number} 1日の曜日
   */
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // 表示月の年と月を取得
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  /**
   * カレンダーグリッドの生成
   * 月の最初の日の前に空白セルを配置し、
   * 各日付にCalendarDayコンポーネントを設定
   */
  const renderCalendar = () => {
    const calendarDays = [];

    // 月初めまでの空白を追加
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="text-center"></div>);
    }

    // 日付を追加
    for (let i = 1; i <= days; i++) {
      const currentDate = new Date(year, month, i);
      calendarDays.push(
        <CalendarDay
          key={i}
          date={currentDate}
          isSelected={
            currentDate.toDateString() === selectedDate.toDateString()
          }
          onClick={() => setSelectedDateExternal(currentDate)}
        />
      );
    }

    return calendarDays;
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* 曜日の表示 */}
      {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
        <div
          key={day}
          className="text-center font-medium text-base text-gray-600"
        >
          {day}
        </div>
      ))}
      {/* カレンダーグリッドの表示 */}
      {renderCalendar()}
    </div>
  );
};

CalendarBody.propTypes = {
  displayedMonth: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  setSelectedDateExternal: PropTypes.func.isRequired,
};

export default CalendarBody;
