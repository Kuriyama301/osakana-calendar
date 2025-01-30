# frozen_string_literal: true

class DeviseMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers
  default template_path: 'devise/mailer'
  layout 'mailer'

  def confirmation_instructions(record, token, opts = {})
    @token = token
    @resource = record
    @frontend_url = if Rails.env.production?
                      ENV.fetch('FRONTEND_URL', 'https://www.osakana-calendar.com')
                    else
                      'http://localhost:5173'
                    end

    opts[:subject] = 'メールアドレスの確認'
    opts[:from] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')
    opts[:reply_to] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')

    super
  end

  # パスワードリセット用のメソッドを追加
  def reset_password_instructions(record, token, opts = {})
    @token = token
    @resource = record
    @frontend_url = if Rails.env.production?
                      ENV.fetch('FRONTEND_URL', 'https://www.osakana-calendar.com')
                    else
                      'http://localhost:5173'
                    end

    opts[:subject] = 'パスワード再設定の手順'
    opts[:from] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')
    opts[:reply_to] = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')

    super
  end
end
