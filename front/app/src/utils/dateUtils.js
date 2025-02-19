/**
 * 日付操作のユーティリティ関数モジュール
 * カレンダー表示に必要な日付フォーマット処理を提供
 */

/**
 * 日付オブジェクトを表示用にフォーマットする関数
 * 引数: date - フォーマットする日付オブジェクト
 * 戻り値:
 *  - month: 2桁の月（01-12）
 *  - day: 2桁の日（01-31）
 *  - weekday: 日本語の曜日（日-土）
 *
 * 使用例:
 * const date = new Date('2024-02-17');
 * formatDate(date); // => { month: "02", day: "17", weekday: "土" }
 */
export const formatDate = (date) => {
  // 日本語の曜日配列
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  return {
    // 月を2桁の文字列に変換（1→"01"）
    // getMonth()は0から始まるため+1が必要
    month: String(date.getMonth() + 1).padStart(2, "0"),

    // 日を2桁の文字列に変換（1→"01"）
    day: String(date.getDate()).padStart(2, "0"),

    // 曜日を日本語に変換（getDay()は0=日曜日）
    weekday: days[date.getDay()],
  };
};

/**
 * 指定された日付が今日かどうかを判定する関数
 * 引数: date - 判定する日付オブジェクト
 * 戻り値: 今日の日付の場合はtrue、それ以外はfalse
 *
 * 使用例:
 * const today = new Date();
 * isToday(today); // => true
 *
 * 注意: 時刻は考慮せず、年月日のみで比較
 */
export const isToday = (date) =>
  date.toDateString() === new Date().toDateString();
