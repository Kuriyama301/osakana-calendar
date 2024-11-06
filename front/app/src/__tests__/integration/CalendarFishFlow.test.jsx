import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import HomePage from "../../pages/HomePage";
import { CalendarProvider } from "../../CalendarContext";
import client from '../../api/client';

// clientのモック
vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('カレンダーと魚情報の統合テスト', () => {
  let user;
  const testDate = new Date(2024, 0, 15);

  beforeEach(() => {
    // ResizeObserverのモック
    window.ResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // スクロール関数のモック
    Element.prototype.scrollIntoView = vi.fn();

    user = userEvent.setup();

    // 日付を固定
    vi.setSystemTime(testDate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('基本的なユーザーフロー：日付選択→魚の情報表示→詳細確認', async () => {
    // 正常系のレスポンスをモック
    client.get.mockResolvedValueOnce({
      data: [{
        id: 1,
        name: "テスト用の魚",
        features: "テスト用の特徴",
        nutrition: "テスト用の栄養",
        origin: "テスト用の産地"
      }]
    });

    await act(async () => {
      render(
        <CalendarProvider>
          <HomePage />
        </CalendarProvider>
      );
    });

    // 日付要素をクリック
    const dateId = `date-${testDate.toISOString()}`;
    const dateElement = document.getElementById(dateId);
    await user.click(dateElement);

    // 魚の情報が表示されることを確認
    const fishElement = await screen.findByText('テスト用の魚');
    expect(fishElement).toBeInTheDocument();
  });
});