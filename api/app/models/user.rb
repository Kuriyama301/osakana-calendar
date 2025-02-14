# frozen_string_literal: true

# ユーザー情報を管理するモデル
# 認証、お気に入り、コレクション機能の管理とJWTトークンの処理を行う
class User < ApplicationRecord
  # JWTトークンの無効化戦略を組み込み
  include Devise::JWT::RevocationStrategies::Denylist

  # Devise認証機能の設定
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable, :trackable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # OAuth認証プロバイダーの設定
  devise :omniauthable, omniauth_providers: %i[google_oauth2 line]

  # バリデーション設定
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true, length: { maximum: 50 }

  # お気に入り機能の関連付け
  has_many :favorites, dependent: :destroy
  has_many :favorite_fishes, through: :favorites, source: :fish

  # コレクション機能の関連付け
  has_many :fish_collections, dependent: :destroy
  has_many :collected_fishes, through: :fish_collections, source: :fish

  # JWTトークンのペイロードをカスタマイズ
  # @return [Hash] カスタマイズされたペイロード
  def jwt_payload
    super.merge({
                  'email' => email,
                  'name' => name
                })
  end

  # OAuth認証情報からユーザーを検索または作成
  # @param auth [OmniAuth::AuthHash] 認証情報
  # @return [User, nil] 作成または検索されたユーザー、失敗時はnil
  def self.from_omniauth(auth)
    return nil unless auth&.provider && auth.uid

    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email if auth.info&.email
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name if auth.info&.name
      user.profile_image_url = auth.info.image if auth.info&.image
      user.confirmed_at = Time.current
    end
  end

  # JWTトークンを生成
  # @return [String] 生成されたJWTトークン
  def generate_jwt
    JWT.encode(
      {
        sub: id,
        exp: (Time.zone.now + ENV.fetch('DEVISE_JWT_EXPIRATION_TIME', 24.hours).to_i).to_i,
        jti: SecureRandom.uuid,
        iat: Time.zone.now.to_i
      },
      ENV.fetch('DEVISE_JWT_SECRET_KEY', nil),
      'HS256'
    )
  end
end
