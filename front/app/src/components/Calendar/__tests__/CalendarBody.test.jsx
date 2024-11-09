import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from 'vitest';
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

  test("曜日ヘッダーが正しく表示される", () => {
    render(<CalendarBody {...defaultProps} />);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("月の日数が正しく表示される", () => {
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
});
