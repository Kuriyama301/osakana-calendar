# db/seeds.rb
require 'json'

def load_json_file(file_path)
  JSON.parse(File.read(file_path))
rescue JSON::ParserError => e
  puts "Error parsing JSON file #{file_path}: #{e.message}"
  {}
rescue Errno::ENOENT
  puts "File not found: #{file_path}"
  {}
end

def process_fish_data(data)
  data['fish'].each do |fish_data|
    # 魚のデータを作成
    fish = Fish.find_or_create_by!(name: fish_data['name']) do |f|
      f.features = fish_data['features']
      f.nutrition = fish_data['nutrition']
      f.origin = fish_data['origin']
    end

    puts "Processing fish: #{fish.name}"

    # シーズン情報の作成
    fish_data['fish_seasons'].each do |season_data|
      FishSeason.find_or_create_by!(
        fish: fish,
        start_month: season_data['start_month'],
        start_day: season_data['start_day'],
        end_month: season_data['end_month'],
        end_day: season_data['end_day']
      )
    end

    # 画像の添付（シンプル化）
    unless fish.image.attached?
      # 画像ファイル名を魚の名前から生成
      filename = "#{fish.name.downcase}.jpg"
      image_path = Rails.root.join('db', 'seeds', 'images', filename)

      if File.exist?(image_path)
        begin
          fish.image.attach(
            io: File.open(image_path),
            filename: filename,
            content_type: 'image/jpeg'
          )
          puts "✓ Attached image for #{fish.name}"
        rescue => e
          puts "× Error attaching image for #{fish.name}: #{e.message}"
        end
      else
        puts "× Image file not found: #{filename}"
      end
    end
  end
end

# メイン処理
ActiveRecord::Base.transaction do
  puts "Starting seed process..."

  json_files = Dir[Rails.root.join('db', 'seeds', 'json', 'fish_data*.json')].sort

  json_files.each do |file_path|
    puts "\nProcessing #{File.basename(file_path)}"
    data = load_json_file(file_path)
    process_fish_data(data) if data.any?
  end
end

puts "\nSeed data has been successfully loaded!"
