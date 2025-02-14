# frozen_string_literal: true

# JWTトークンの無効化を管理するモデル
# ログアウトしたトークンや期限切れトークンを記録し、認証時にチェック
class JwtDenylist < ApplicationRecord
  # Deviseのトークン無効化戦略を組み込み
  include Devise::JWT::RevocationStrategies::Denylist

  # バリデーション：JTIとexpの必須チェックと一意性
  validates :jti, presence: true, uniqueness: true
  validates :exp, presence: true

  # スコープ：有効期限切れと有効なトークンの分類
  scope :expired, -> { where('exp < ?', Time.current) }
  scope :active, -> { where('exp >= ?', Time.current) }

  # コールバック：作成時にJTIの一意性を確保
  before_validation :ensure_jti_unique, on: :create

  # クラスメソッド定義
  class << self
    # 期限切れトークンの一括削除
    # @return [Integer] 削除されたレコード数
    def cleanup_expired
      Rails.logger.info "Cleaning up expired tokens started"
      deleted_count = expired.delete_all
      Rails.logger.info "Cleaned up #{deleted_count} expired tokens"
      deleted_count
    rescue StandardError => e
      Rails.logger.error "Cleanup error: #{e.message}"
      raise
    end

    # トークンが無効化されているかチェック
    # @param payload [Hash] JWTトークンのペイロード
    # @return [Boolean] 無効化されている場合はtrue
    def token_revoked?(payload)
      return true unless payload['jti'].present?
      exists?(jti: payload['jti'])
    end

    # トークンを無効化
    # @param payload [Hash] JWTトークンのペイロード
    # @return [Boolean] 無効化の成功/失敗
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

  # JTIの一意性を確保
  # 既存のJTIが無効なUUIDの場合、新しいUUIDを生成
  def ensure_jti_unique
    return unless jti
    return if valid_uuid?(jti)

    self.jti = SecureRandom.uuid while self.class.exists?(jti: jti)
  end

  # UUIDの形式チェック
  # @param string [String] チェック対象の文字列
  # @return [Boolean] 有効なUUIDの場合はtrue
  def valid_uuid?(string)
    uuid_regex = /\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i
    uuid_regex.match?(string)
  end
end
