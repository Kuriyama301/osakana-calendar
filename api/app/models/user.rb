class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist

  # Devise機能
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable, :trackable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  devise :omniauthable, omniauth_providers: %i[google_oauth2]

  # バリデーション
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true, length: { maximum: 50 }

  # JWTペイロードのカスタマイズ
  def jwt_payload
    super.merge({
      'email' => email,
      'name' => name
    })
  end

  # アソシエーション
  has_many :favorites, dependent: :destroy
  has_many :favorite_fishes, through: :favorites, source: :fish

  # Google OAuth用のメソッドを追加
  def self.from_omniauth(auth)
    return nil unless auth&.provider && auth&.uid

    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email if auth.info&.email
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name if auth.info&.name
      user.confirmed_at = Time.current # Google認証の場合はメール確認済みに
    end
  end
end
