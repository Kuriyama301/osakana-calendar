import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import { useCalendar } from "../../hooks/useCalendar";
import SeasonalFishModal from "../Fish/SeasonalFishModal";
import { useCalendarLogic } from "../../hooks/useCalendarLogic";
import { useFishModal } from "../../hooks/useFishModal";
import { formatDate, isToday } from "../../utils/dateUtils";

const MainCalendar = React.forwardRef((props, ref) => {
  const { selectedDate, mainCalendarRef, isExternalSelection } = useCalendar();
  const { calendarData, extendCalendarData } = useCalendarLogic();
  const {
    isModalOpen,
    selectedModalDate,
    isLoading,
    seasonalFish,
    error,
    handleDateClick,
    closeModal,
  } = useFishModal();
  const calendarRef = useRef(null);

  const scrollToDate = useCallback((date) => {
    const targetElement = document.getElementById(`date-${date.toISOString()}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToDate,
  }));

  useEffect(() => {
    if (mainCalendarRef) {
      mainCalendarRef.current = { scrollToDate };
    }
  }, [mainCalendarRef, scrollToDate]);

  useEffect(() => {
    if (isExternalSelection) {
      scrollToDate(selectedDate);
    }
  }, [selectedDate, isExternalSelection, scrollToDate]);

  useEffect(() => {
    if (calendarRef.current && calendarData.length > 0) {
      const todayElement = calendarRef.current.querySelector(".today");
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: "auto", block: "center" });
      }
    }
  }, [calendarData]);

  const handleScroll = useCallback(() => {
    if (isLoading || !calendarRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = calendarRef.current;
    const isNearTop = scrollTop < clientHeight;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < clientHeight;

    if (isNearTop) {
      extendCalendarData("past");
    } else if (isNearBottom) {
      extendCalendarData("future");
    }
  }, [isLoading, extendCalendarData]);

  useEffect(() => {
    const currentRef = calendarRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="flex flex-col h-screen bg-transparent pt-16">
      <div
        ref={calendarRef}
        className="flex-grow overflow-y-auto scrollbar-hide"
      >
        {calendarData.map((date, index) => {
          const { month, day, weekday } = formatDate(date);
          return (
            <div
              key={index}
              id={`date-${date.toISOString()}`}
              data-testid={`calendar-day-${day}`}
              className={`flex flex-col justify-start p-4 mb-2 rounded-lg text-white h-24 relative ${
                isToday(date) ? "ring-2 ring-yellow-400 today" : ""
              } cursor-pointer`}
              style={{
                backgroundImage: `url(/calendar-background.svg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => handleDateClick(date)}
            >
              <div className="text-sm tracking-widest mb-1 text-white">
                Date
              </div>
              <div className="flex items-baseline translate-y-[12px]">
                <span className="inline-flex justify-center w-24 text-5xl font-bold tracking-widest text-white relative -top-3 font-mono">
                  <span className="w-12 text-right">{month}</span>
                  <span className="w-12 text-left translate-x-[20px]">
                    {day}
                  </span>
                </span>
                <span className="text-3xl ml-2 text-white relative -top-3.5 translate-x-[40px]">
                  {weekday}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <SeasonalFishModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentDate={selectedModalDate}
        seasonalFish={seasonalFish}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
});

export default MainCalendar;
