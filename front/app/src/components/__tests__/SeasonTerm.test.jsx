import { render, screen } from "@testing-library/react";
import SeasonTerm from "../Fish/SeasonTerm";

describe("SeasonTerm", () => {
  test("期間を正しく表示する", () => {
    const season = {
      start_month: 9,
      start_day: 1,
      end_month: 11,
      end_day: 30,
    };

    render(<SeasonTerm season={season} />);
    expect(screen.getByText("9月上旬～11月下旬")).toBeInTheDocument();
  });

  // エラーケースのテストを追加
  test("データがない場合のエラー表示", () => {
    render(<SeasonTerm season={{}} />);
    expect(screen.getByText("期間データなし")).toBeInTheDocument();
  });
});