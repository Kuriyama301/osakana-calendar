require 'test_helper'

class Api::V1::Auth::SessionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = users(:user)
  end

  test '有効な認証情報でログインできる' do
    post user_session_path, params: {
      user: {
        email: @user.email,
        password: 'password'
      }
    }, as: :json

    assert_response :success
    assert_equal 'application/json; charset=utf-8', @response.content_type
  end

  test '無効な認証情報ではログインできない' do
    post user_session_path, params: {
      user: {
        email: @user.email,
        password: 'wrong_password'
      }
    }, as: :json

    assert_response :unauthorized
  end
end
