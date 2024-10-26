class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

  private

  def handle_standard_error(error)
    Rails.logger.error "Error: #{error.class} - #{error.message}"
    render json: { error: "An internal server error occurred" }, status: :internal_server_error
  end

  def handle_record_not_found(error)
    render json: { error: "Requested resource not found" }, status: :not_found
  end
end
