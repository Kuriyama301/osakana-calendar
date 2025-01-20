# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include Devise::Controllers::Helpers

  respond_to :json

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name email password password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def authenticate_user!
    token = extract_token_from_header
    return unauthorized_error('Token missing') unless token

    process_token(token)
  rescue JWT::DecodeError => e
    handle_jwt_error(e)
  end

  def current_user
    @current_user ||= find_current_user
  end

  private

  def extract_token_from_header
    header = request.headers['Authorization']
    return nil if header.blank?

    header.split.last
  end

  def process_token(token)
    decoded = decode_token(token)
    @current_user_id = extract_user_id(decoded)
    current_user
  end

  def decode_token(token)
    JWT.decode(
      token,
      ENV.fetch('DEVISE_JWT_SECRET_KEY', nil),
      true,
      decode_options
    ).first
  end

  def decode_options
    {
      algorithm: ENV.fetch('JWT_ALGORITHM', 'HS256'),
      exp_leeway: 30
    }
  end

  def extract_user_id(decoded_token)
    decoded_token['sub']  # 'sub'のみを使用するように修正
  end

  def find_current_user
    User.find(@current_user_id)
  rescue ActiveRecord::RecordNotFound
    unauthorized_error('User not found')
  end

  def handle_jwt_error(error)
    Rails.logger.error "JWT decode error: #{error.message}"
    unauthorized_error('Invalid token')
  end

  def unauthorized_error(message)
    render json: { error: message }, status: :unauthorized
  end
end
