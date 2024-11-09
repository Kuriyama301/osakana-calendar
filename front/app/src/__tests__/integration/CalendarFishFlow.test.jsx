import { describe, beforeEach, afterEach, test, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import HomePage from "../../pages/HomePage";
import { CalendarProvider } from "../../CalendarContext";
import client from "../../api/client";

vi.mock("../../api/client", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("カレンダーと魚情報の統合テスト", () => {
  let user;
  const mockDate = new Date("2024-01-15T00:00:00.000Z");

  beforeEach(async () => {
    vi.setSystemTime(mockDate);

    window.ResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    Element.prototype.scrollIntoView = vi.fn();
    user = userEvent.setup();

    client.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "テスト用の魚",
          image_url: "/test-image.jpg",
          fish_seasons: [
            {
              start_month: 1,
              start_day: 1,
              end_month: 12,
              end_day: 31,
            },
          ],
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  test("日付選択時にAPIが呼び出される", async () => {
    await act(async () => {
      render(
        <CalendarProvider initialDate={mockDate}>
          <HomePage />
        </CalendarProvider>
      );
    });

    const date15Elements = screen.getAllByTestId("calendar-day-15");
    const targetElement = date15Elements.find(
      (element) => element.id === `date-${mockDate.toISOString()}`
    );

    await act(async () => {
      await user.click(targetElement);
    });

    expect(client.get).toHaveBeenCalledWith("api/v1/calendar/fish", {
      params: { date: "2024-01-15" },
    });
  });

  test("魚情報モーダルが表示される", async () => {
    await act(async () => {
      render(
        <CalendarProvider initialDate={mockDate}>
          <HomePage />
        </CalendarProvider>
      );
    });

    const date15Elements = screen.getAllByTestId("calendar-day-15");
    const targetElement = date15Elements.find(
      (element) => element.id === `date-${mockDate.toISOString()}`
    );

    await act(async () => {
      await user.click(targetElement);
      // モーダルの表示を待機
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByText("テスト用の魚")).toBeInTheDocument();
  });
});
