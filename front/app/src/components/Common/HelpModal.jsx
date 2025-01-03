import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { X, Info, Lock, Mail, Book } from "lucide-react";
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
        本利用規約（以下「本規約」）は、「おさかなカレンダー」（以下「本サービス」）の利用に関する条件を定めるものです。

        2. サービスの概要
        本サービスは、旬の魚に関する情報を提供し、季節ごとの魚の特徴や調理方法、栄養価などの情報を共有するプラットフォームです。

        3. 利用開始
        本サービスの利用を開始した時点で、本規約に同意したものとみなされます。
        本サービスは、無料でご利用いただけます。

        4. 禁止事項
        以下の行為を禁止します：
        - 不正アクセスやシステムに負荷をかける行為
        - 他のユーザーへの迷惑行為や誹謗中傷
        - 商用目的での無断利用や情報の転載
        - その他、運営が不適切と判断する行為

        5. 免責事項
        - 掲載情報の正確性について最大限の努力を行いますが、その完全性を保証するものではありません
        - 本サービスの利用により生じた損害について、運営側は一切の責任を負いません
        - システムメンテナンスや不具合により一時的にサービスを停止する場合があります

        6. 規約の変更
        本規約は予告なく変更される場合があります。変更後の利用は、新しい規約に同意したものとみなされます。

        7. 著作権・知的財産権
        - 本サービスに掲載される全てのコンテンツの著作権は当サービスまたは権利者に帰属します
        - コンテンツの無断転載、複製、改変、販売等は禁止します

        8. 利用環境
        - 推奨ブラウザ：Chrome, Safari, Firefox, Edge の最新版
        - 画面解像度：1280×720 以上推奨
      `,
    },
    privacy: {
      title: "プライバシーポリシー",
      content: `
        1. 基本方針
        当サービスは、ユーザーの個人情報の重要性を認識し、適切な管理と保護に努めています。

        2. 収集する情報
        以下の情報を収集する場合があります：
        - アクセスログ（IPアドレス、ブラウザ情報等）
        - お問い合わせ時に提供いただく情報
        - 利用状況やアクセス履歴
        - デバイス情報

        3. 情報の利用目的
        収集した情報は以下の目的で利用します：
        - サービスの提供と改善
        - 統計データの作成と分析
        - 不正アクセスの防止
        - お問い合わせへの対応

        4. 情報の管理
        - 収集した情報は適切に管理し、不正アクセスや漏洩防止に努めます
        - 法令に基づく場合を除き、第三者への提供は行いません
        - 統計データとして利用する場合は、個人を特定できない形に加工します

        5. Cookieの使用
        本サービスでは、より良い体験を提供するためにCookieを使用しています。
        ブラウザの設定でCookieを無効にすることも可能です。

        6. データの保管期間
        - アクセスログは180日間保管後、自動的に削除されます
        - お問い合わせ内容は対応完了後3年間保管します

        7. アクセス解析ツール
        本サービスではGoogleアナリティクスを使用しています。データは匿名で収集され、個人を特定する情報は含まれません。
      `,
    },
    usage: {
      title: "使い方ガイド",
      content: `
        1. カレンダーの見方
        - メインカレンダー：縦スクロールのカレンダーで魚を一覧表示
        - サブカレンダー：指定の日付へのジャンプ機能

        2. 魚の情報の見方
        - 基本情報：魚の特徴や生態
        - 栄養情報：含まれる栄養素や健康効果
        - 産地情報：主な漁獲地域や時期
        - 画像：魚のイラストや特徴

        3. 検索機能
        - 魚の名前で検索や関連単語で検索

        4. 便利な使い方
        - お気に入りの魚を登録して簡単にアクセス
        - 食べたオサカナを保存して記録
      `,
    },
    contact: {
      title: "お問い合わせ",
      content: (
        <>
          お問い合わせは以下の方法で受け付けています：{"\n\n"}
          1. googleフォームでのお問い合わせ{"\n"}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeFNi09lrETcoajDjGyEzs3bXLxn3EUOjVbQnBc508NNaWTXw/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            お問い合わせフォームはこちら
          </a>
          {"\n\n"}※回答までに2-3日いただく場合がございます{"\n\n"}
          2. お問い合わせの種類{"\n"}- サービスの使い方に関する質問{"\n"}-
          掲載情報の訂正・更新依頼{"\n"}- 不具合の報告{"\n"}-
          その他のご意見・ご要望{"\n\n"}
          3. お問い合わせ時のお願い{"\n"}-
          具体的な状況や画面の説明をお願いします{"\n"}-
          エラーが発生した場合は、発生時の状況をできるだけ詳しくお知らせください
          {"\n"}- 返信用のメールアドレスを正確にご記入ください{"\n\n"}
          4. 注意事項{"\n"}- 返信は平日のみとなります{"\n"}-
          内容によっては回答を差し控えさせていただく場合があります{"\n"}-
          お問い合わせ内容は今後のサービス改善に活用させていただく場合があります
        </>
      ),
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
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 flex items-center ${
                  selectedSection === key
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {key === "terms" && <Lock className="w-4 h-4 mr-2" />}
                {key === "privacy" && <Info className="w-4 h-4 mr-2" />}
                {key === "usage" && <Book className="w-4 h-4 mr-2" />}
                {key === "contact" && <Mail className="w-4 h-4 mr-2" />}
                {title}
              </button>
            ))}
          </nav>
          <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
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
