import { render, screen } from "@testing-library/react";
import SeasonalFishModal from "../SeasonalFishModal";

describe("SeasonalFishModal", () => {
  const mockFish = [{
    id: 1,
    name: "サンマ",
    image_url: "/test-image.jpg", // image_urlを追加
    fish_seasons: [{
      start_month: 9,
      start_day: 1,
      end_month: 11,
      end_day: 30,
    }],
  }];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    currentDate: "2024年1月1日",
    seasonalFish: [],
    isLoading: false,
    error: null,
  };

  test("モーダルが開いているときに日付が表示される", () => {
    render(<SeasonalFishModal {...defaultProps} />);
    expect(screen.getByText("2024年1月1日の旬の魚")).toBeInTheDocument();
  });

  test("魚のリストが表示される", () => {
    render(<SeasonalFishModal {...defaultProps} seasonalFish={mockFish} />);
    expect(screen.getByText("サンマ")).toBeInTheDocument();
  });

  test("データが空の場合適切なメッセージが表示される", () => {
    render(<SeasonalFishModal {...defaultProps} seasonalFish={[]} />);
    expect(screen.getByText("この日付の旬の魚はありません。")).toBeInTheDocument();
  });
});