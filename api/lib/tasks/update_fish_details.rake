namespace :fish do
  desc '魚の基本情報のみを更新（関連データは保持）'
  task update_details: :environment do
    puts '魚のデータ更新を開始します...'

    ActiveRecord::Base.transaction do
      Dir[Rails.root.join('db/seeds/json/fish_data_*.json')].sort.each do |file|
        puts "\n#{File.basename(file)}を処理中..."
        begin
          data = JSON.parse(File.read(file))

          data['fish'].each do |fish_data|
            fish = Fish.find_by(id: fish_data['id'])

            if fish
              puts "#{fish.name}の更新を開始:"
              puts "- 現在の特徴: #{fish.features[0..50]}..."

              fish.update!(
                name: fish_data['name'],
                features: fish_data['features'],
                nutrition: fish_data['nutrition'],
                origin: fish_data['origin']
              )

              puts "✓ 更新完了: #{fish.name}"
              puts "- 更新後の特徴: #{fish.features[0..50]}..."
            else
              puts "× ID:#{fish_data['id']}の魚が見つかりません"
            end
          end
        rescue JSON::ParserError => e
          puts "× JSONエラー (#{File.basename(file)}): #{e.message}"
          raise
        rescue StandardError => e
          puts "× 予期せぬエラー: #{e.message}"
          raise
        end
      end
    end

    puts "\n魚のデータ更新が完了"
  rescue StandardError => e
    puts "\n× 更新処理が失敗: #{e.message}"
    puts e.backtrace
    raise
  end
end
