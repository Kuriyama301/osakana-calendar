/**
 * モーダルのアニメーション制御カスタムフック
 * モーダルの表示/非表示のアニメーションとレンダリングタイミングを管理
 * LoadingScreen等のモーダルコンポーネントで使用
 */

import { useState, useEffect } from "react";

/**
 * モーダルアニメーション制御フック
 * @param {boolean} isOpen - モーダルの表示状態
 * @returns {Object} アニメーション制御用の状態
 * - isAnimating: アニメーション実行中かどうか
 * - shouldRender: モーダルをレンダリングすべきかどうか
 */
export const useModal = (isOpen) => {
  // アニメーションとレンダリングの状態管理
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  /**
   * モーダルの表示状態が変更された時の処理
   * 表示時: 即座にレンダリングを開始し、少し遅らせてアニメーションを開始
   * 非表示時: アニメーションを停止し、アニメーション完了後にレンダリングを停止
   */
  useEffect(() => {
    if (isOpen) {
      // モーダルを表示する場合
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      // モーダルを非表示にする場合
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300); // フェードアウトアニメーションの時間
    }
  }, [isOpen]);

  return { isAnimating, shouldRender };
};
