import '@testing-library/jest-dom'
import { vi } from 'vitest'

// 必要なモックの設定
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// テスト実行前のクリーンアップ
beforeEach(() => {
  vi.clearAllMocks()
})