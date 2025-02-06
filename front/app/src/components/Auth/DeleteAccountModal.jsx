import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useDeleteAccount } from "../../contexts/DeleteAccountContext";

const DeleteAccountModal = () => {
  const { isModalOpen, isDeleting, error, closeModal, deleteAccount } =
    useDeleteAccount();
  const { isAnimating, shouldRender } = useModal(isModalOpen);
  const [confirmText, setConfirmText] = useState("");
  const CONFIRM_TEXT = "delete";

  if (!shouldRender) return null;

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== CONFIRM_TEXT) {
      return;
    }
    await deleteAccount();
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      closeModal();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ${
        isAnimating ? "bg-opacity-50" : "bg-opacity-0"
      } flex items-center justify-center z-50`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-md transform transition-all duration-300 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {!isDeleting && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}

          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-red-600">アカウントの削除</h2>
          </div>

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
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium text-red-600 mb-2">
                  この操作は取り消すことができません。
                </p>
                <p className="text-sm text-red-500">
                  確認のため、下のフィールドに "delete" と入力してください。
                </p>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder='削除確認のため"delete"と入力'
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isDeleting}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                <p className="font-medium">エラーが発生しました</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={
                  isDeleting || confirmText.toLowerCase() !== CONFIRM_TEXT
                }
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    削除中...
                  </span>
                ) : (
                  "アカウントを削除する"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
