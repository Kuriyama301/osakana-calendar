# frozen_string_literal: true

require 'jsonapi/serializer'

class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :email, :name, :created_at

  attribute :created_date do |user|
    user.created_at&.strftime('%Y/%m/%d')
  end
end
