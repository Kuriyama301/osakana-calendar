import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../../pages/HomePage';
import { CalendarProvider } from '../../CalendarContext';
import { getFishByDate } from '../../api/fish'; // 実際の API 関数
import { getApiUrl } from '../../api/client'; // API URL を取得するための関数

// API モック設定
vi.mock('../../api/fish'); // API 関数をモック

const mockFishData = {
  id: 1,
  name: 'マグロ',
  image: 'https://example.com/maguro.jpg',
  season: {
    start: '2024-01-01',
    end: '2024-03-31',
  },
};

describe('統合テスト: 日付選択から魚詳細モーダル表示まで', () => {
  beforeEach(() => {
    // API モックの設定
    vi.mock('../../api/client', () => ({
      getApiUrl: vi.fn().mockReturnValue('http://localhost:3000'), // API URL モック
    }));
    getFishByDate.mockResolvedValue(mockFishData); // API レスポンスをモック

    // scrollIntoView のモック
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('日付選択後、魚詳細モーダルが表示される', async () => {
    render(
      <CalendarProvider>
        <HomePage />
      </CalendarProvider>
    );

    // カレンダーがレンダリングされるまで待つ
    await waitFor(() => {
      const calendarDays = screen.getAllByRole('button', { name: /1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31/i });
      return calendarDays.length > 0;
    });

    // 1. 日付選択
    await waitFor(() => {
      const calendarDay = screen.getByText('15'); // メインカレンダーの 15 日を選択
      fireEvent.click(calendarDay);
    });

    // 2. モーダルが表示される
    await waitFor(() => {
      const modalTitle = screen.getByText(/旬の魚/);
      expect(modalTitle).toBeInTheDocument();
    });

    // 3. 魚を選択
    await waitFor(() => {
      const fishItem = screen.getByText('マグロ'); // モックで用意した魚名
      fireEvent.click(fishItem);
    });

    // 4. 魚詳細モーダルが表示される
    await waitFor(() => {
      const fishDetailModal = screen.getByText('マグロ'); // 魚の詳細モーダルのタイトル
      expect(fishDetailModal).toBeInTheDocument();
    });

    // API が呼び出されたことを確認
    expect(getFishByDate).toHaveBeenCalledTimes(1);

    // scrollIntoView が呼び出されたことを確認
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});