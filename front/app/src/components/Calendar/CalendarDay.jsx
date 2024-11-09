import PropTypes from "prop-types";

const CalendarDay = ({ date, isSelected, onClick }) => (
  <div
    data-testid={`calendar-day-${date.getDate()}`}
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

CalendarDay.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CalendarDay;
