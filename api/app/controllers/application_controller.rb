class ApplicationController < ActionController::API
  # Deviseのパラメータ設定
  before_action :configure_permitted_parameters, if: :devise_controller?

  # エラーハンドリング
  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found
  rescue_from JWT::DecodeError, with: :handle_jwt_error  # JWT関連のエラー追加

  protected

  # Deviseのパラメータ設定メソッド
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  private

  # エラーハンドリング
  def handle_standard_error(error)
    Rails.logger.error "Error: #{error.class} - #{error.message}"
    render json: { error: "An internal server error occurred" }, status: :internal_server_error
  end

  def handle_record_not_found(error)
    render json: { error: "Requested resource not found" }, status: :not_found
  end

  # JWT認証エラーハンドリング
  def handle_jwt_error(error)
    Rails.logger.error "JWT Error: #{error.message}"
    render json: { error: "Authentication failed" }, status: :unauthorized
  end

  # 認証が必要なAPIのエラーハンドリング
  def render_unauthorized
    render json: { error: "You need to sign in or sign up before continuing" },
      status: :unauthorized
  end
end
