import { createContext, useState, useContext, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
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
    <CalendarContext.Provider value={{ 
      selectedDate, 
      setSelectedDate,
      displayedMonth,
      changeDisplayedMonth,
      isExternalSelection,
      setSelectedDateExternal,
      mainCalendarRef
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

CalendarProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CalendarProvider;