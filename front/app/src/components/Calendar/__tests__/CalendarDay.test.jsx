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

  test("選択状態のスタイルが正しく適用される", () => {
    // 非選択状態
    const { container, rerender } = render(<CalendarDay {...defaultProps} />);
    const dayElement = container.firstChild;
    expect(dayElement).toHaveClass("text-gray-700");

    // 選択状態
    rerender(<CalendarDay {...defaultProps} isSelected={true} />);
    expect(dayElement).toHaveClass("bg-blue-500");
    expect(dayElement).toHaveClass("text-white");
  });

  test("クリックイベントが正しく動作する", () => {
    render(<CalendarDay {...defaultProps} />);
    fireEvent.click(screen.getByText("1"));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test("hover状態のスタイルが適用される", () => {
    const { container } = render(<CalendarDay {...defaultProps} />);
    const dayElement = container.firstChild;
    const classNames = dayElement.className;
    expect(classNames).toContain("hover:bg-gray-100");
  });
});
