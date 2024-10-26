import { useState, useCallback, useEffect } from "react";

export const useCalendarLogic = (initialYearRange = 5) => {
  const [calendarData, setCalendarData] = useState([]);

  const generateCalendarData = useCallback((startDate, endDate) => {
    const data = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      data.push(new Date(date));
    }
    return data;
  }, []);

  useEffect(() => {
    const initialStartDate = new Date(
      new Date().getFullYear() - initialYearRange,
      0,
      1
    );
    const initialEndDate = new Date(
      new Date().getFullYear() + initialYearRange,
      11,
      31
    );
    setCalendarData(generateCalendarData(initialStartDate, initialEndDate));
  }, [generateCalendarData, initialYearRange]);

  const extendCalendarData = useCallback(
    (direction) => {
      const currentStartDate = calendarData[0];
      const currentEndDate = calendarData[calendarData.length - 1];

      if (direction === "past") {
        const newStartDate = new Date(currentStartDate);
        newStartDate.setFullYear(newStartDate.getFullYear() - 1);
        const newData = generateCalendarData(newStartDate, currentStartDate);
        setCalendarData((prevData) => [...newData, ...prevData]);
      } else {
        const newEndDate = new Date(currentEndDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        const newData = generateCalendarData(currentEndDate, newEndDate);
        setCalendarData((prevData) => [...prevData, ...newData]);
      }
    },
    [calendarData, generateCalendarData]
  );

  return { calendarData, extendCalendarData };
};
