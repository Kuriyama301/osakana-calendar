require 'json'

# JSONファイルを読み込み、パースする関数
def load_json_file(file_path)
  JSON.parse(File.read(file_path))
rescue JSON::ParserError => e
  puts "Error parsing JSON file #{file_path}: #{e.message}"
  {}
end

# ユーザーデータを処理する関数
def process_user_data(data)
  return unless data['users']

  puts "\nProcessing user data..."
  original_delivery_method = ActionMailer::Base.delivery_method
  original_deliveries = ActionMailer::Base.perform_deliveries

  begin
    # メール送信を一時的に無効化
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = false

    data['users'].each do |user_data|
      user = User.find_or_initialize_by(email: user_data['email'])
      user.assign_attributes(
        password: user_data['password'],
        name: user_data['name']
      )

      if user.save
        if user_data['confirmed_at']
          # 確認状態を直接設定
          user.update_columns(
            confirmed_at: Time.zone.parse(user_data['confirmed_at']),
            confirmation_sent_at: Time.zone.parse(user_data['confirmed_at'])
          )
          puts "✓ Confirmed user: #{user.email}"
        end
        puts "✓ Created user: #{user.email}"
      else
        puts "× Error creating user #{user.email}: #{user.errors.full_messages.join(', ')}"
      end
    end
  ensure
    # メール設定を元に戻す
    ActionMailer::Base.delivery_method = original_delivery_method
    ActionMailer::Base.perform_deliveries = original_deliveries
  end
end

# 魚のデータを処理する関数
def process_fish_data(data)
  ActiveRecord::Base.transaction do
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
end

# メイン処理
puts "Starting seed process..."

begin
  ActiveRecord::Base.transaction do
    # ユーザーデータの処理
    user_data_path = Rails.root.join('db', 'seeds', 'json', 'user_data.json')
    if File.exist?(user_data_path)
      data = load_json_file(user_data_path)
      process_user_data(data)
    end

    # 魚データの処理
    Dir[Rails.root.join('db', 'seeds', 'json', 'fish_data_*.json')].sort.each do |file_path|
      puts "\nProcessing #{File.basename(file_path)}"
      data = load_json_file(file_path)
      process_fish_data(data) if data.any?
    end
  end
  puts "\nSeed data has been successfully loaded!"
rescue => e
  puts "\n× Error during seed process: #{e.message}"
  raise e
end
