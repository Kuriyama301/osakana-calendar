class FishCollection < ApplicationRecord
  belongs_to :user
  belongs_to :fish
  validates :user_id, uniqueness: { scope: :fish_id }
end
