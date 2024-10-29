require 'json'

def load_json_file(file_path)
  JSON.parse(File.read(file_path))
rescue JSON::ParserError => e
  puts "Error parsing JSON file #{file_path}: #{e.message}"
  {}
end

def process_fish_data(data)
  data['fish'].each do |fish_data|
    # 魚のデータを作成
    fish = Fish.find_or_initialize_by(id: fish_data['id']) do |f|
      f.name = fish_data['name']
      f.features = fish_data['features']
      f.nutrition = fish_data['nutrition']
      f.origin = fish_data['origin']
    end

    puts "Processing fish: #{fish.name}"

    # 既存の画像があれば削除（オプション）
    fish.image.purge if fish.image.attached?

    # 画像の添付
    blob_data = data['active_storage_blobs'].find { |b| b['id'] == fish_data['active_storage_attachments'][0]['blob_id'] }
    if blob_data
      image_filename = blob_data['filename']
      image_path = Rails.root.join('db', 'seeds', 'images', image_filename)

      if File.exist?(image_path)
        begin
          fish.image.attach(
            io: File.open(image_path),
            filename: image_filename,
            content_type: blob_data['content_type']
          )
          puts "✓ Attached image: #{image_filename}"
        rescue => e
          puts "× Error attaching image for #{fish.name}: #{e.message}"
        end
      else
        puts "× Image file not found: #{image_filename}"
      end
    end

    fish.save!

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
  end
end

# メイン処理
puts "Starting seed process..."

Dir[Rails.root.join('db', 'seeds', 'json', 'fish_data_*.json')].sort.each do |file_path|
  puts "\nProcessing #{File.basename(file_path)}"
  data = load_json_file(file_path)
  process_fish_data(data) if data.any?
end

puts "\nSeed data has been successfully loaded!"
