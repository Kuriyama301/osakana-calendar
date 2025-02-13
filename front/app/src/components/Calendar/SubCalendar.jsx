/**
* サブカレンダーのコンポーネント
* 月単位のカレンダー表示、月の切り替え、日付選択機能を表示する
*/

import React from "react";
import { useCalendar } from "../../hooks/useCalendar";
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
