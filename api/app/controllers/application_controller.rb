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
    Rails.logger.debug 'Token extraction started'
    token = extract_token_from_header
    Rails.logger.debug { "Extracted token: #{token}" }

    return unauthorized_error('Token missing') unless token

    begin
      decoded = decode_token(token)
      Rails.logger.debug { "Decoded token: #{decoded}" }
      Rails.logger.debug { "Token exp: #{decoded['exp']}" }
      Rails.logger.debug { "Current time: #{Time.now.to_i}" }
      @current_user_id = extract_user_id(decoded)
      Rails.logger.debug { "User ID: #{@current_user_id}" }
      @current_user = find_current_user
      Rails.logger.debug { "Current user found: #{@current_user.present?}" }
    rescue StandardError => e
      Rails.logger.error "Authentication error: #{e.class} - #{e.message}"
      handle_jwt_error(e)
    end
  end

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = find_current_user
  end

  def current_api_v1_user
    current_user
  end

  private

  def extract_token_from_header
    header = request.headers['Authorization']
    return nil if header.blank?
    return nil unless header.start_with?('Bearer ')

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
    decoded_token['sub']
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
