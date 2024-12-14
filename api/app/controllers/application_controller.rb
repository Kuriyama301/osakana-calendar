class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::HttpAuthentication::Token::ControllerMethods
  respond_to :json

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def authenticate_user!
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(request.headers['Authorization'].split(' ').last,
                             Rails.application.credentials.secret_key_base).first
      @current_user_id = jwt_payload['sub']
    else
      render json: { error: 'Not Authorized' }, status: :unauthorized
    end
  rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
    render json: { error: 'Not Authorized' }, status: :unauthorized
  end

  def current_user
    @current_user ||= super || User.find(@current_user_id)
  end
end
