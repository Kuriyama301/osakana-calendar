import React from "react";

const CalendarDay = ({ date, isSelected, onClick }) => (
  <div
    className={`text-center text-sm cursor-pointer ${
      isSelected
        ? "bg-blue-500 text-white rounded-full"
        : "text-gray-700 hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    {date.getDate()}
  </div>
);

export default CalendarDay;
