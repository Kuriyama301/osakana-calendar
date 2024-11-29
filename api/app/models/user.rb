class User < ApplicationRecord
  # 明示的にDeviseをrequire
  require 'devise'

  # Deviseの機能を追加
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable

  # バリデーション設定
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true, length: { maximum: 50 }
end
