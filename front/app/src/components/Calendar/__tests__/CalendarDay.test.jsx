import { render, screen, fireEvent } from "@testing-library/react";
import CalendarDay from "../CalendarDay";

describe("CalendarDay", () => {
  const defaultProps = {
    date: new Date(2024, 0, 1), // 2024年1月1日
    isSelected: false,
    onClick: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("日付が正しく表示される", () => {
    render(<CalendarDay {...defaultProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("クリックイベントが正しく動作する", () => {
    render(<CalendarDay {...defaultProps} />);
    fireEvent.click(screen.getByText("1"));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});
