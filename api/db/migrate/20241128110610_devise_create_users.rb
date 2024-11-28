class DeviseCreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      # メール認証用の基本項目
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :name

      # パスワードリセット用の項目
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      # ログイン状態の記憶用
      t.datetime :remember_created_at

      # ログイン履歴の記録用
      t.integer  :sign_in_count, default: 0, null: false  # ログイン回数
      t.datetime :current_sign_in_at                      # 現在のログイン時刻
      t.datetime :last_sign_in_at                         # 前回のログイン時刻
      t.string   :current_sign_in_ip                      # 現在のログインIPアドレス
      t.string   :last_sign_in_ip                         # 前回のログインIPアドレス

      t.timestamps null: false
    end

    # インデックスの追加
    add_index :users, :email,                unique: true     # メールアドレスの一意性確保
    add_index :users, :reset_password_token, unique: true     # リセットトークンの一意性確保
  end
end
