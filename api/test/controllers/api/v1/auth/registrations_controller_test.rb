require 'test_helper'

class Api::V1::Auth::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test '有効なパラメータでユーザー登録できる' do
    assert_difference('User.count') do
      post user_registration_path, params: {
        user: {
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password',
          name: 'Test User'
        }
      }, as: :json
    end

    assert_response :success
    assert_equal 'application/json; charset=utf-8', @response.content_type
  end

  test '無効なパラメータではユーザー登録できない' do
    assert_no_difference('User.count') do
      post user_registration_path, params: {
        user: {
          email: '',
          password: '',
          name: ''
        }
      }, as: :json
    end

    assert_response :unprocessable_entity
  end
end
