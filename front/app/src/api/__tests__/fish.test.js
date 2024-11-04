import { getFishByDate } from "../fish";
import { vi, expect } from "vitest";

// スパイを使用してconsole.errorをモック化
const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../client", () => ({
  default: {
    get: vi.fn(),
  },
}));

import client from "../client";

describe("getFishByDate", () => {
  // 各テスト前にスパイをリセット
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  // 各テスト後にモックをリセット
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("日付パラメータがない場合はエラーを投げる", async () => {
    await expect(getFishByDate()).rejects.toThrow("Date parameter is required");
  });

  test("正常なレスポンスを処理できる", async () => {
    const mockFishData = [
      {
        id: 1,
        name: "サンマ",
        fish_seasons: [
          {
            start_month: 9,
            start_day: 1,
            end_month: 11,
            end_day: 30,
          },
        ],
      },
    ];

    client.get.mockResolvedValueOnce({ data: mockFishData });

    const result = await getFishByDate(new Date("2024-01-01"));
    expect(result).toEqual(mockFishData);
    expect(client.get).toHaveBeenCalledWith("api/v1/calendar/fish", {
      params: { date: "2024-01-01" },
    });
  });

  test("404エラーの場合は空配列を返す", async () => {
    const error = new Error("Not Found");
    error.response = { status: 404 };
    client.get.mockRejectedValueOnce(error);

    const result = await getFishByDate(new Date("2024-01-01"));
    expect(result).toEqual([]);
  });

  test("APIエラー時は適切なエラーメッセージを表示", async () => {
    const errorMessage = "API Error";
    const error = new Error(errorMessage);
    error.response = {
      data: { message: errorMessage },
    };
    client.get.mockRejectedValueOnce(error);

    await expect(getFishByDate(new Date("2024-01-01"))).rejects.toThrow(
      errorMessage
    );
  });

  test("日付変換が正しく行われる", async () => {
    client.get.mockResolvedValue({ data: [] });

    // Date オブジェクトでの呼び出し
    await getFishByDate(new Date("2024-01-01"));
    expect(client.get).toHaveBeenCalledWith("api/v1/calendar/fish", {
      params: { date: "2024-01-01" },
    });

    // 文字列での呼び出し
    await getFishByDate("2024-01-01");
    expect(client.get).toHaveBeenCalledWith("api/v1/calendar/fish", {
      params: { date: "2024-01-01" },
    });
  });
});
