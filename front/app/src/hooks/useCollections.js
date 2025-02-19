/**
 * 魚コレクション機能のカスタムフック
 * CollectionsContextからコレクションの状態と操作関数を取得して提供
 * 魚の収集状態の管理とコレクション機能へのアクセスを一元管理
 */

import { useContext } from "react";
import { CollectionsContext } from "../contexts/CollectionsContext";

/**
 * 魚コレクション状態管理のカスタムフック
 * @returns {Object} CollectionsContextの提供する全てのコレクション機能と状態
 * @throws {Error} CollectionsProviderの外で使用された場合
 */
export const useCollections = () => {
  const context = useContext(CollectionsContext);

  // CollectionsProviderの外で使用された場合はエラー
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }

  return context;
};
