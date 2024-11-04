import { render, screen, fireEvent } from "@testing-library/react";
import CalendarBody from "../CalendarBody";

describe("CalendarBody", () => {
  const defaultProps = {
    displayedMonth: new Date(2024, 0, 1),
    selectedDate: new Date(2024, 0, 1),
    setSelectedDateExternal: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("曜日が正しく表示される", () => {
    render(<CalendarBody {...defaultProps} />);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("日付が正しく表示される", () => {
    render(<CalendarBody {...defaultProps} />);
    for (let i = 1; i <= 31; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  test("日付選択が正しく動作する", () => {
    render(<CalendarBody {...defaultProps} />);
    fireEvent.click(screen.getByText("15"));
    expect(defaultProps.setSelectedDateExternal).toHaveBeenCalled();
  });

  test("選択された日付のスタイルが正しく適用される", () => {
    const selectedDate = new Date(2024, 0, 15);
    render(<CalendarBody {...defaultProps} selectedDate={selectedDate} />);

    // CalendarDay内の要素を探す
    const selectedDayElement = screen.getByText("15");
    const dayContainer = selectedDayElement.closest(
      'div[class*="bg-blue-500"]'
    );
    expect(dayContainer).toBeInTheDocument();
    expect(dayContainer).toHaveClass("bg-blue-500", "text-white");
  });
});
