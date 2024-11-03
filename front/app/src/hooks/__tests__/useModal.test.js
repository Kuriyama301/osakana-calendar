import { renderHook } from '@testing-library/react';
import { useFishFilter } from '../useFishFilter';

// 単純化したテストケース
describe('useFishFilter', () => {
  // 単一の魚のテスト
  test('通常期間内の魚を正しくフィルタリング', () => {
    const testFish = [{
      id: 1,
      name: "マサバ",
      fish_seasons: [
        {
          start_month: 10,
          start_day: 1,
          end_month: 2,
          end_day: 28
        }
      ]
    }];

    // 期間内（1月15日）
    const { result: inSeason } = renderHook(() => 
      useFishFilter(testFish, "2024年1月15日")
    );
    expect(inSeason.current).toHaveLength(1);

    // 期間外（7月15日）
    const { result: outOfSeason } = renderHook(() => 
      useFishFilter(testFish, "2024年7月15日")
    );
    expect(outOfSeason.current).toHaveLength(0);
  });

  // 年をまたぐ期間のテスト
  test('年をまたぐ期間の魚を正しくフィルタリング', () => {
    const testFish = [{
      id: 2,
      name: "クロマグロ",
      fish_seasons: [
        {
          start_month: 12,
          start_day: 1,
          end_month: 2,
          end_day: 28
        }
      ]
    }];

    // 期間内（1月）
    const { result: inSeason } = renderHook(() => 
      useFishFilter(testFish, "2024年1月15日")
    );
    expect(inSeason.current).toHaveLength(1);

    // 期間外（4月）
    const { result: outOfSeason } = renderHook(() => 
      useFishFilter(testFish, "2024年4月15日")
    );
    expect(outOfSeason.current).toHaveLength(0);
  });

  // 境界値のテスト
  test('期間の境界値を正しく判定', () => {
    const testFish = [{
      id: 1,
      fish_seasons: [
        {
          start_month: 10,
          start_day: 1,
          end_month: 2,
          end_day: 28
        }
      ]
    }];

    // 開始日
    const { result: startDate } = renderHook(() => 
      useFishFilter(testFish, "2024年10月1日")
    );
    expect(startDate.current).toHaveLength(1);

    // 終了日
    const { result: endDate } = renderHook(() => 
      useFishFilter(testFish, "2024年2月28日")
    );
    expect(endDate.current).toHaveLength(1);
  });

  // 複数シーズンのテスト
  test('複数シーズンを持つ魚を正しくフィルタリング', () => {
    const testFish = [{
      id: 3,
      name: "アジ",
      fish_seasons: [
        {
          start_month: 3,
          start_day: 1,
          end_month: 5,
          end_day: 31
        },
        {
          start_month: 9,
          start_day: 1,
          end_month: 11,
          end_day: 30
        }
      ]
    }];

    // 春シーズン
    const { result: spring } = renderHook(() => 
      useFishFilter(testFish, "2024年4月15日")
    );
    expect(spring.current).toHaveLength(1);

    // 秋シーズン
    const { result: autumn } = renderHook(() => 
      useFishFilter(testFish, "2024年10月15日")
    );
    expect(autumn.current).toHaveLength(1);

    // シーズン外
    const { result: offSeason } = renderHook(() => 
      useFishFilter(testFish, "2024年7月15日")
    );
    expect(offSeason.current).toHaveLength(0);
  });
});