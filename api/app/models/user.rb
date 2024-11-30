class User < ApplicationRecord
  # 明示的にDeviseをrequire
  require 'devise'

  # Deviseの機能を追加
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # バリデーション
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true, length: { maximum: 50 }

  # JWTトークンのペイロードをカスタマイズ
  def jwt_payload
    {
      'email' => email,
      'name' => name,
      'exp' => (Time.current + 24.hours).to_i
    }
  end
end
