namespace :email do
  desc "Test email configuration"
  task test: :environment do
    # テストユーザー作成
    user = User.new(
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    )

    # 確認メール送信テスト
    begin
      user.send_confirmation_instructions
      puts "Test email sent successfully!"
    rescue => e
      puts "Error sending email: #{e.message}"
    end
  end
end
