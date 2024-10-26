class FishSeason < ApplicationRecord
  belongs_to :fish

  validates :start_month, :start_day, :end_month, :end_day, presence: true
  validates :start_month, :end_month, inclusion: { in: 1..12 }
  validates :start_day, :end_day, inclusion: { in: 1..31 }

  def in_season?(date)
    date_month_day = date.month * 100 + date.day
    start_month_day = start_month * 100 + start_day
    end_month_day = end_month * 100 + end_day

    if start_month_day <= end_month_day
      date_month_day.between?(start_month_day, end_month_day)
    else
      date_month_day >= start_month_day || date_month_day <= end_month_day
    end
  end

  def season_range
    start_date = Date.new(Date.current.year, start_month, start_day)
    end_date = Date.new(Date.current.year, end_month, end_day)

    if end_date < start_date
      end_date = end_date.next_year
    end

    start_date..end_date
  end

  def formatted_season
    "#{start_month}月#{start_day}日 から #{end_month}月#{end_day}日"
  end
end
