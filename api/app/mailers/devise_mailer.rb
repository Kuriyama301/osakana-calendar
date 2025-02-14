# frozen_string_literal: true

# Deviseを使用した認証関連のメール送信を管理するクラス
# メールアドレス確認とパスワードリセット機能のメールテンプレートを提供
class DeviseMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers

  # メールテンプレートの場所を指定
  default template_path: 'devise/mailer'

  # メールのレイアウトを指定
  layout 'mailer'

  # メールアドレス確認用のメール送信設定
  # @param record [User] 確認対象のユーザー
  # @param token [String] 確認用トークン
  # @param opts [Hash] メール送信オプション
  def confirmation_instructions(record, token, opts = {})
    @token = token
    @resource = record
    # 環境に応じてフロントエンドのURLを設定
    @frontend_url = if Rails.env.production?
                      ENV.fetch('FRONTEND_URL', 'https://www.osakana-calendar.com')
                    else
                      'http://localhost:5173'
                    end

    # メールの基本設定
    opts[:subject] = 'メールアドレスの確認'
    opts[:from] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')
    opts[:reply_to] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')

    super
  end

  # パスワードリセット用のメール送信設定
  # @param record [User] リセット対象のユーザー
  # @param token [String] リセット用トークン
  # @param opts [Hash] メール送信オプション
  def reset_password_instructions(record, token, opts = {})
    @token = token
    @resource = record
    # 環境に応じてフロントエンドのURLを設定
    @frontend_url = if Rails.env.production?
                      ENV.fetch('FRONTEND_URL', 'https://www.osakana-calendar.com')
                    else
                      'http://localhost:5173'
                    end

    # メールの基本設定
    opts[:subject] = 'パスワード再設定の手順'
    opts[:from] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')
    opts[:reply_to] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')

    super
  end
end
