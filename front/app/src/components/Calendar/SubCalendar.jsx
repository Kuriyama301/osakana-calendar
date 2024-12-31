// SubCalendar.jsx
// - カレンダーのレイアウト
// - 月の切り替え機能
// - 日付の選択機能

import React from "react";
import { useCalendar } from "../../CalendarContext.jsx";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";

const SubCalendar = () => {
  const {
    selectedDate,
    setSelectedDateExternal,
    displayedMonth,
    changeDisplayedMonth,
  } = useCalendar();

  const prevMonth = () => {
    const newDate = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() - 1,
      1
    );
    changeDisplayedMonth(newDate);
  };

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
      <CalendarHeader
        displayedMonth={displayedMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <CalendarBody
        displayedMonth={displayedMonth}
        selectedDate={selectedDate}
        setSelectedDateExternal={setSelectedDateExternal}
      />
    </div>
  );
};

export default SubCalendar;
