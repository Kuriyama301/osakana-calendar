export const formatDate = (date) => {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return {
    month: String(date.getMonth() + 1).padStart(2, "0"),
    day: String(date.getDate()).padStart(2, "0"),
    weekday: days[date.getDay()],
  };
};

export const isToday = (date) =>
  date.toDateString() === new Date().toDateString();
