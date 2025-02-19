/**
 * 魚コレクションの状態管理カスタムフック
 * コレクションデータの取得、追加、削除などの状態管理と操作を提供
 * Api::V1::FishCollectionsControllerと連携してデータを同期
 */

import { useState, useCallback, useEffect } from "react";
import { collectionsAPI } from "../api/collections";
import { useAuth } from "./useAuth";

/**
 * コレクションの状態管理フック
 * @returns {Object} コレクションの状態と操作メソッド
 * - collections: 収集した魚の配列
 * - isLoading: 読み込み状態
 * - fetchCollections: コレクションデータの再取得
 * - addCollection: 魚の収集
 * - removeCollection: 収集解除
 */
export const useCollectionsState = () => {
  // 状態の定義
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  /**
   * コレクションデータの取得
   * GET /api/v1/fish_collections を呼び出し
   */
  const fetchCollections = useCallback(async () => {
    if (!isAuthenticated()) return;
    setIsLoading(true);
    try {
      const response = await collectionsAPI.getCollections();
      setCollections(response);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * 魚をコレクションに追加
   * POST /api/v1/fish_collections を呼び出し
   * @param {number} fishId - 追加する魚のID
   */
  const addCollection = useCallback(
    async (fishId) => {
      try {
        await collectionsAPI.addCollection(fishId);
        await fetchCollections();
      } catch (error) {
        console.error("Failed to add collection:", error);
        // 重複エラーの場合は再取得して状態を更新
        if (error.response?.status === 422) {
          await fetchCollections();
        }
      }
    },
    [fetchCollections]
  );

  /**
   * 魚をコレクションから削除
   * DELETE /api/v1/fish_collections/:id を呼び出し
   * @param {number} fishId - 削除する魚のID
   */
  const removeCollection = useCallback(
    async (fishId) => {
      try {
        await collectionsAPI.removeCollection(fishId);
        await fetchCollections();
      } catch (error) {
        console.error("Failed to remove collection:", error);
      }
    },
    [fetchCollections]
  );

  // 初期データの取得
  useEffect(() => {
    const initializeCollections = async () => {
      await fetchCollections();
    };
    initializeCollections();
  }, [fetchCollections]);

  return {
    collections,
    isLoading,
    fetchCollections,
    addCollection,
    removeCollection,
  };
};
