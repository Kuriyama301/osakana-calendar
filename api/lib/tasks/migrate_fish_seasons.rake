namespace :db do
  desc "Migrate fish seasons data to new format"
  task migrate_fish_seasons: :environment do
    FishSeason.find_each do |season|
      start_date = Date.parse(season.start_date)
      end_date = Date.parse(season.end_date)

      season.update(
        start_month: start_date.month,
        start_day: start_date.day,
        end_month: end_date.month,
        end_day: end_date.day
      )
    end
    puts "Fish seasons data migration completed."
  end
end
