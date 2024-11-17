import React, { useState, useEffect, useRef, useCallback } from "react";
import { MainCalendar, SubCalendar } from "../components";

const HomePage = () => {
  const [showSubCalendar, setShowSubCalendar] = useState(true);
  const containerRef = useRef(null);

  const checkSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const breakpoint = 1024;
      setShowSubCalendar(containerWidth >= breakpoint);
    }
  }, []);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSize, 150);
    };

    window.addEventListener("resize", handleResize);
    checkSize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkSize]);

  return (
    <div
      ref={containerRef}
      className="relativemin-h-screen"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // backgroundColor: "rgba(255, 255, 255, 0.8)",
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center items-start h-full">
          <div
            className={`sub-calendar-container ${
              showSubCalendar ? "block" : "hidden"
            } lg:block lg:w-80 fixed left-4 top-20 lg:sticky lg:top-20 lg:left-auto`}
          >
            <SubCalendar />
          </div>
          <div className="main-calendar-container w-full max-w-3xl lg:ml-8">
            <MainCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
