import PropTypes from "prop-types";
import CalendarDay from "./CalendarDay";

const CalendarBody = ({
  displayedMonth,
  selectedDate,
  setSelectedDateExternal,
}) => {
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const renderCalendar = () => {
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="text-center"></div>);
    }
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
      {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
        <div
          key={day}
          className="text-center font-medium text-base text-gray-600"
        >
          {day}
        </div>
      ))}
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
