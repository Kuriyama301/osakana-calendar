class User < ApplicationRecord
  require 'devise'

  # Devise機能
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable, :trackable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # バリデーション
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true, length: { maximum: 50 }
end
