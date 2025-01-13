import {
  createContext,
  useState,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";

export const CalendarContext = createContext();

const CalendarProvider = ({ children, initialDate = new Date() }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [displayedMonth, setDisplayedMonth] = useState(initialDate);
  const [isExternalSelection, setIsExternalSelection] = useState(false);
  const mainCalendarRef = useRef(null);

  const setSelectedDateExternal = useCallback((date) => {
    setIsExternalSelection(true);
    setSelectedDate(date);
    setDisplayedMonth(date);
    if (mainCalendarRef.current?.scrollToDate) {
      mainCalendarRef.current.scrollToDate(date);
    }
  }, []);

  const changeDisplayedMonth = useCallback((date) => {
    setDisplayedMonth(date);
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        displayedMonth,
        changeDisplayedMonth,
        isExternalSelection,
        setSelectedDateExternal,
        mainCalendarRef,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

CalendarProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialDate: PropTypes.instanceOf(Date),
};

export default CalendarProvider;