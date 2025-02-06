# frozen_string_literal: true

class JwtDenylist < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist

  # バリデーション
  validates :jti, presence: true, uniqueness: true
  validates :exp, presence: true

  # スコープ
  scope :expired, -> { where('exp < ?', Time.current) }
  scope :active, -> { where('exp >= ?', Time.current) }

  # コールバック
  before_validation :ensure_jti_unique, on: :create

  class << self
    def cleanup_expired
      Rails.logger.info "Cleaning up expired tokens started"
      deleted_count = expired.delete_all
      Rails.logger.info "Cleaned up #{deleted_count} expired tokens"
      deleted_count
    rescue StandardError => e
      Rails.logger.error "Cleanup error: #{e.message}"
      raise
    end

    def token_revoked?(payload)
      return true unless payload['jti'].present?
      exists?(jti: payload['jti'])
    end

    def revoke_token(payload)
      return false unless payload['jti'].present? && payload['exp'].present?

      create!(
        jti: payload['jti'],
        exp: Time.at(payload['exp']).utc
      )
      true
    rescue ActiveRecord::RecordNotUnique => e
      Rails.logger.warn "Token already blacklisted: #{e.message}"
      true
    rescue StandardError => e
      Rails.logger.error "Token revocation error: #{e.message}"
      false
    end
  end

  private

  def ensure_jti_unique
    return unless jti
    return if valid_uuid?(jti)

    self.jti = SecureRandom.uuid while self.class.exists?(jti: jti)
  end

  def valid_uuid?(string)
    uuid_regex = /\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i
    uuid_regex.match?(string)
  end
end
