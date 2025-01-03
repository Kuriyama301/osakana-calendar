import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { X, Info, Lock, Mail } from "lucide-react";
import PropTypes from "prop-types";

const HelpModal = ({ isOpen, onClose }) => {
  const { isAnimating, shouldRender } = useModal(isOpen);
  const [selectedSection, setSelectedSection] = useState("terms");

  if (!shouldRender) return null;

  const sections = {
    terms: {
      title: "利用規約",
      content: `
        1. はじめに
        本利用規約は、「おさかなカレンダー」の利用条件を定めるものです。

        2. サービスの利用
        本サービスの利用を開始した時点で、本規約に同意したものとみなされます。

        3. 禁止事項
        以下の行為を禁止します：
        - 不正アクセス
        - 他のユーザーへの迷惑行為
        - システムに負荷をかける行為
      `,
    },
    privacy: {
      title: "プライバシーポリシー",
      content: `
        1. 個人情報の取り扱い
        当サービスは、ユーザーの個人情報を適切に管理します。

        2. 収集する情報
        - ユーザー名
        - メールアドレス
        - その他サービス利用に関する情報

        3. 情報の管理
        収集した情報は適切に管理し、漏洩防止に努めます。
      `,
    },
    contact: {
      title: "お問い合わせ",
      content: `
        お問い合わせは以下のメールアドレスまでお願いいたします：
        contact@example.com

        回答までに2-3日いただく場合がございます。
      `,
    },
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isAnimating ? "bg-opacity-50" : "bg-opacity-0"
      } flex items-center justify-center z-50`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-8">
            ヘルプ
          </h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[600px]">
          <nav className="md:w-64 p-4 border-b md:border-b-0 md:border-r">
            {Object.entries(sections).map(([key, { title }]) => (
              <button
                key={key}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSection(key);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                  selectedSection === key
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {title}
              </button>
            ))}
          </nav>
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {sections[selectedSection].title}
            </h3>
            <div className="prose max-w-none whitespace-pre-line">
              {sections[selectedSection].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HelpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HelpModal;
