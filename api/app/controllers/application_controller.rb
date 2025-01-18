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

    begin
      decoded_token = decode_token(token)
      Rails.logger.debug "Decoded token: #{decoded_token.inspect}"
      @current_user_id = extract_user_id(decoded_token)
      return unauthorized_error('User not found') unless current_user

      # scope = decoded_token['scope']
      # return unauthorized_error('wrong scope') unless scope == 'api_v1_user'
    rescue JWT::DecodeError => e
      handle_jwt_error(e)
    end
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
    user_id = decoded_token['sub']
    user_id.is_a?(String) ? user_id.to_i : user_id
  end

  def find_current_user
    return nil unless @current_user_id

    User.find_by(id: @current_user_id)
  rescue ActiveRecord::RecordNotFound
    nil
  end

  def handle_jwt_error(error)
    Rails.logger.error "JWT decode error: #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
    unauthorized_error('Invalid token')
  end

  def unauthorized_error(message)
    render json: { error: message }, status: :unauthorized
    nil
  end
end
