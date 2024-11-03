import { renderHook } from '@testing-library/react';
import { useFishFilter } from '../useFishFilter';

// モックデータを直接定義
const mockFishData = {
  basicFish: {
    id: 1,
    name: "マサバ",
    fish_seasons: [
      {
        id: 1,
        fish_id: 1,
        start_month: 10,
        start_day: 1,
        end_month: 2,
        end_day: 28
      }
    ]
  },
  crossSeasonFish: {
    id: 2,
    name: "クロマグロ",
    fish_seasons: [
      {
        id: 2,
        fish_id: 2,
        start_month: 12,
        start_day: 1,
        end_month: 2,
        end_day: 28
      }
    ]
  },
  multiSeasonFish: {
    id: 3,
    name: "アジ",
    fish_seasons: [
      {
        id: 3,
        fish_id: 3,
        start_month: 3,
        start_day: 1,
        end_month: 5,
        end_day: 31
      },
      {
        id: 4,
        fish_id: 3,
        start_month: 9,
        start_day: 1,
        end_month: 11,
        end_day: 30
      }
    ]
  }
};

// 日付文字列生成ヘルパー関数
const createTestDate = (year, month, day) => 
  `${year}年${month}月${day}日`;

describe('useFishFilter', () => {
  test('通常期間内の魚を正しくフィルタリング', () => {
    const { result } = renderHook(() => 
      useFishFilter([mockFishData.basicFish], createTestDate(2024, 1, 15))
    );
    
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('マサバ');
  });

  test('年をまたぐ期間の魚を正しくフィルタリング', () => {
    const fish = [mockFishData.crossSeasonFish];
    
    // 期間内（1月）
    const { result: inSeason } = renderHook(() => 
      useFishFilter(fish, createTestDate(2024, 1, 15))
    );
    expect(inSeason.current).toHaveLength(1);
    
    // 期間外（4月）
    const { result: outOfSeason } = renderHook(() => 
      useFishFilter(fish, createTestDate(2024, 4, 15))
    );
    expect(outOfSeason.current).toHaveLength(0);
  });

  test('期間の切り替わりを正しく判定', () => {
    const fish = [mockFishData.basicFish];
    
    // 旬の始まり（10月1日）
    const { result: startDate } = renderHook(() => 
      useFishFilter(fish, createTestDate(2024, 10, 1))
    );
    expect(startDate.current).toHaveLength(1);
    
    // 旬の終わり（2月28日）
    const { result: endDate } = renderHook(() => 
      useFishFilter(fish, createTestDate(2024, 2, 28))
    );
    expect(endDate.current).toHaveLength(1);
  });

  test('複数シーズンを持つ魚を正しくフィルタリング', () => {
    const fish = [mockFishData.multiSeasonFish];
    
    // 春シーズン（4月）
    const { result: spring } = renderHook(() => 
      useFishFilter(fish, createTestDate(2024, 4, 15))
    );
    expect(spring.current).toHaveLength(1);
    
    // 秋シーズン（10月）
    const { result: autumn } = renderHook(() => 
      useFishFilter(fish, createTestDate(2024, 10, 15))
    );
    expect(autumn.current).toHaveLength(1);
    
    // シーズン外（7月）
    const { result: offSeason } = renderHook(() => 
      useFishFilter(fish, createTestDate(2024, 7, 15))
    );
    expect(offSeason.current).toHaveLength(0);
  });
});