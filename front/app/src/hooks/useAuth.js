/**
 * 認証機能のカスタムフック
 * AuthContextから認証状態とユーザー情報を取得して提供
 * ログイン、ログアウト、サインアップなどの認証機能へのアクセスを一元管理
 */

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * 認証状態管理のカスタムフック
 * @returns {Object} AuthContextの提供する全ての認証機能と状態
 * @throws {Error} AuthProviderの外で使用された場合
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // AuthProviderの外で使用された場合はエラー
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
