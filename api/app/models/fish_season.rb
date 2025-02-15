# frozen_string_literal: true

# 魚の旬の時期を管理するモデル
# 各魚の旬の開始日と終了日を保持し、期間の判定や表示を行う
class FishSeason < ApplicationRecord
  # アソシエーション：魚に属する
  belongs_to :fish

  # バリデーション：必須項目の確認
  validates :start_month, :start_day, :end_month, :end_day, presence: true

  # バリデーション：月の値が1-12の範囲内
  validates :start_month, :end_month, inclusion: { in: 1..12 }

  # バリデーション：日の値が1-31の範囲内
  validates :start_day, :end_day, inclusion: { in: 1..31 }

  # 指定された日付が旬の期間内かどうかを判定
  # @param date [Date] 判定する日付
  # @return [Boolean] 旬の期間内ならtrue
  def in_season?(date)
    date_month_day = (date.month * 100) + date.day
    start_month_day = (start_month * 100) + start_day
    end_month_day = (end_month * 100) + end_day

    # 期間が年をまたがない場合と年をまたぐ場合で判定方法を変える
    if start_month_day <= end_month_day
      date_month_day.between?(start_month_day, end_month_day)
    else
      date_month_day >= start_month_day || date_month_day <= end_month_day
    end
  end

  # 旬の期間を日付範囲として取得
  # @return [Range] 開始日から終了日までの範囲
  def season_range
    start_date = Date.new(Date.current.year, start_month, start_day)
    end_date = Date.new(Date.current.year, end_month, end_day)
    # 終了日が開始日より前の場合は翌年の日付として扱う
    end_date = end_date.next_year if end_date < start_date

    start_date..end_date
  end

  # 旬の期間を日本語形式で表示
  # @return [String] "○月○日 から ○月○日" の形式
  def formatted_season
    "#{start_month}月#{start_day}日 から #{end_month}月#{end_day}日"
  end
end
