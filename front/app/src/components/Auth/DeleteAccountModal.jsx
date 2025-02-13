/**
* アカウント削除モーダルのコンポーネント
* アカウント削除の確認画面表示、削除処理の実行を行う
*/

import React from "react";
import { X } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useDeleteAccount } from "../../contexts/DeleteAccountContext";

const DeleteAccountModal = () => {
  const { isModalOpen, isDeleting, error, closeModal, deleteAccount } =
    useDeleteAccount();
  const { isAnimating, shouldRender } = useModal(isModalOpen);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ${
        isAnimating ? "bg-opacity-50" : "bg-opacity-0"
      } flex items-center justify-center z-50`}
      onClick={closeModal}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-md transform transition-all duration-300 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl font-bold mb-4">アカウントの削除</h2>

          <div className="space-y-4">
            <div className="text-gray-600">
              <p className="mb-4">
                アカウントを削除すると、以下のデータがすべて削除されます：
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>お気に入りの魚のデータ</li>
                <li>コレクションデータ</li>
                <li>その他のすべてのデータ</li>
              </ul>
              <p className="font-medium text-red-600">
                この操作は取り消すことができません。本当に削除しますか？
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={closeModal}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                キャンセル
              </button>
              <button
                onClick={deleteAccount}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "アカウントを削除する"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
