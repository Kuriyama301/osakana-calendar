/**
 * メインカレンダーのコンポーネント
 * 主な機能：
 * 1. 無限スクロール可能な日付リストの表示
 * 2. 日付選択による魚情報モーダルの表示
 * 3. 外部からの日付選択に応じたスクロール制御
 */

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

// ref経由で外部からスクロール制御を可能にするため、forwardRefを使用
const MainCalendar = React.forwardRef((props, ref) => {
  // カレンダーの状態管理から必要な値を取得
  const { selectedDate, mainCalendarRef, isExternalSelection } = useCalendar();
  // カレンダーデータとデータ拡張関数を取得
  const { calendarData, extendCalendarData } = useCalendarLogic();
  // モーダル関連の状態と関数を取得
  const {
    isModalOpen,
    selectedModalDate,
    isLoading,
    seasonalFish,
    error,
    handleDateClick,
    closeModal,
  } = useFishModal();
  // スクロール制御用のref
  const calendarRef = useRef(null);

  /**
   * 指定された日付までスクロールする関数
   * smooth: アニメーション付きのスクロール
   * block: center: 要素を中央に配置
   */
  const scrollToDate = useCallback((date) => {
    const targetElement = document.getElementById(`date-${date.toISOString()}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // 外部からスクロール関数を呼び出せるようにする
  useImperativeHandle(ref, () => ({
    scrollToDate,
  }));

  // メインカレンダーのrefを更新
  useEffect(() => {
    if (mainCalendarRef) {
      mainCalendarRef.current = { scrollToDate };
    }
  }, [mainCalendarRef, scrollToDate]);

  // 外部から日付が選択された場合のスクロール処理
  useEffect(() => {
    if (isExternalSelection) {
      scrollToDate(selectedDate);
    }
  }, [selectedDate, isExternalSelection, scrollToDate]);

  // カレンダーデータ読み込み後、今日の日付まで自動スクロール
  useEffect(() => {
    if (calendarRef.current && calendarData.length > 0) {
      const todayElement = calendarRef.current.querySelector(".today");
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: "auto", block: "center" });
      }
    }
  }, [calendarData]);

  /**
   * スクロールイベントハンドラー
   * スクロール位置に応じてカレンダーデータを拡張
   */

  const handleScroll = useCallback(() => {
    if (isLoading || !calendarRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = calendarRef.current;
    // 上端または下端に近づいたかを判定
    const isNearTop = scrollTop < clientHeight;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < clientHeight;

    // スクロール方向に応じてデータを追加
    if (isNearTop) {
      extendCalendarData("past");
    } else if (isNearBottom) {
      extendCalendarData("future");
    }
  }, [isLoading, extendCalendarData]);

  // スクロールイベントの登録と解除
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

  // UI描画部分
  return (
    <div className="flex flex-col h-screen bg-transparent pt-16">
      {/* スクロール可能な日付リスト */}
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
              {/* 日付表示部分 */}
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
      {/* 旬の魚情報モーダル */}
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
