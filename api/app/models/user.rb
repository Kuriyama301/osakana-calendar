class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist

  # Devise機能
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable, :trackable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

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
end
