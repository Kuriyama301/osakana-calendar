# frozen_string_literal: true

# 全コントローラーの基底クラス
# 認証機能とJWTトークン処理の共通機能を提供
# Deviseとの統合やJSON応答の基本設定も管理
class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include Devise::Controllers::Helpers

  # JSONレスポンスのみを許可
  respond_to :json

  # Deviseコントローラーでパラメータを設定
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  # Deviseで許可するパラメータを設定
  # サインアップ時とアカウント更新時のパラメータを定義
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name email password password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  # ユーザー認証を確認
  # JWTトークンを検証し、現在のユーザーを設定
  def authenticate_user!
    Rails.logger.debug 'Authentication started'
    token = extract_token_from_header
    Rails.logger.debug { "Extracted token: #{token}" }

    return unauthorized_error('トークンが見つかりません') unless token

    begin
      decoded = decode_token(token)
      Rails.logger.debug { "Decoded token: #{decoded}" }

      validate_token_expiration(decoded)
      set_current_user(decoded)

      Rails.logger.debug { "Authentication successful for user: #{@current_user&.id}" }
      true
    rescue JWT::ExpiredSignature
      Rails.logger.error 'Token has expired'
      unauthorized_error('トークンの有効期限が切れています')
    rescue JWT::DecodeError => e
      Rails.logger.error "Token decode error: #{e.message}"
      unauthorized_error('無効なトークンです')
    rescue StandardError => e
      Rails.logger.error "Authentication error: #{e.class} - #{e.message}"
      unauthorized_error('認証に失敗しました')
    end
  end

  # 現在のユーザーを取得
  # トークンからユーザー情報を復元
  def current_user
    return @current_user if defined?(@current_user)

    token = extract_token_from_header
    return nil unless token

    begin
      decoded = decode_token(token)
      @current_user = User.find(decoded['sub'])
    rescue StandardError => e
      Rails.logger.error "Current user resolution error: #{e.message}"
      nil
    end
  end

  # Devise統合用のエイリアスメソッド
  def current_api_v1_user
    current_user
  end

  private

  # AuthorizationヘッダーからJWTトークンを抽出
  def extract_token_from_header
    header = request.headers['Authorization']
    return nil if header.blank?
    return nil unless header.start_with?('Bearer ')

    header.split.last
  rescue StandardError => e
    Rails.logger.error "Token extraction error: #{e.message}"
    nil
  end

  # トークンの有効期限を検証
  def validate_token_expiration(decoded)
    exp_time = Time.at(decoded['exp'])
    if exp_time < Time.current
      Rails.logger.error "Token expired at: #{exp_time}"
      raise JWT::ExpiredSignature
    end
  end

  # デコードされたトークンから現在のユーザーを設定
  def set_current_user(decoded)
    @current_user_id = decoded['sub']
    @current_user = find_current_user

    unless @current_user
      Rails.logger.error "User not found: #{@current_user_id}"
      raise StandardError, 'User not found'
    end
  end

  # JWTトークンをデコード
  def decode_token(token)
    JWT.decode(
      token,
      ENV.fetch('DEVISE_JWT_SECRET_KEY', nil),
      true,
      decode_options
    ).first
  end

  # JWTデコードのオプションを設定
  def decode_options
    {
      algorithm: ENV.fetch('JWT_ALGORITHM', 'HS256'),
      exp_leeway: 30
    }
  end

  # ユーザーIDからユーザーを検索
  def find_current_user
    User.find_by(id: @current_user_id)
  end

  # 認証エラー時のレスポンスを生成
  def unauthorized_error(message)
    render json: { error: message }, status: :unauthorized
    false
  end
end
