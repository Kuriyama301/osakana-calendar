class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include Devise::Controllers::Helpers
  respond_to :json

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def authenticate_user!  # 'ddef' を 'def' に修正
    if request.headers['Authorization'].present?
      token = request.headers['Authorization'].split(' ').last
      begin
        @current_user_id = JWT.decode(
          token,
          ENV['DEVISE_JWT_SECRET_KEY'],
          true,
          {
            algorithm: ENV.fetch('JWT_ALGORITHM', 'HS256'),
            exp_leeway: 30
          }
        ).first['sub']
        current_user
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token missing' }, status: :unauthorized
    end
  end

  def current_user
    @current_user ||= User.find(@current_user_id)
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :unauthorized
  end
end
