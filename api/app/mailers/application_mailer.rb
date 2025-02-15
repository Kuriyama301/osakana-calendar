# frozen_string_literal: true

# メール送信の基底クラス
# アプリケーション全体のメール設定と共通レイアウトを管理
class ApplicationMailer < ActionMailer::Base
  # デフォルトの送信元メールアドレスを環境変数から設定
  # 環境変数が未設定の場合はデフォルト値を使用
  default from: ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')

  # メールのレイアウトテンプレートを指定
  layout 'mailer'
end
