import { useMemo } from "react";

const isDateInSeason = (season, currentDate) => {
  const [year, month, day] = currentDate
    .replace(/年|月/g, "-")
    .replace("日", "")
    .split("-")
    .map(Number);
  const current = new Date(year, month - 1, day);
  const currentMonthDay = current.getMonth() * 100 + current.getDate();

  const startMonthDay = (season.start_month - 1) * 100 + season.start_day;
  const endMonthDay = (season.end_month - 1) * 100 + season.end_day;

  return startMonthDay <= endMonthDay
    ? currentMonthDay >= startMonthDay && currentMonthDay <= endMonthDay
    : currentMonthDay >= startMonthDay || currentMonthDay <= endMonthDay;
};

export const useFishFilter = (seasonalFish, currentDate) => {
  return useMemo(
    () =>
      seasonalFish.filter((fish) =>
        fish.fish_seasons.some((season) => isDateInSeason(season, currentDate))
      ),
    [seasonalFish, currentDate]
  );
};
