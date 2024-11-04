import { render, screen, fireEvent } from "@testing-library/react";
import CalendarHeader from "../CalendarHeader";

describe("CalendarHeader", () => {
  const defaultProps = {
    displayedMonth: new Date(2024, 0, 1),
    prevMonth: vi.fn(),
    nextMonth: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("年月が正しく表示される", () => {
    render(<CalendarHeader {...defaultProps} />);
    expect(screen.getByText("2024年 1月")).toBeInTheDocument();
  });

  test("前月・次月ボタンが機能する", () => {
    render(<CalendarHeader {...defaultProps} />);

    // 前月ボタンのクリック
    fireEvent.click(screen.getByLabelText("前の月"));
    expect(defaultProps.prevMonth).toHaveBeenCalledTimes(1);

    // 次月ボタンのクリック
    fireEvent.click(screen.getByLabelText("次の月"));
    expect(defaultProps.nextMonth).toHaveBeenCalledTimes(1);
  });
});
