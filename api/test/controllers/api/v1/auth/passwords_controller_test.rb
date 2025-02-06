require 'test_helper'

class Api::V1::Auth::PasswordsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:user)
  end

  test 'should send reset password instructions' do
    post api_v1_user_password_path,
          params: { user: { email: @user.email } },
          as: :json

    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal 'パスワードリセット用のメールを送信しました', json['message']
  end

  test 'should send reset instructions even for non-existent email' do
    post api_v1_user_password_path,
          params: { user: { email: 'nonexistent@example.com' } },
          as: :json

    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal 'パスワードリセット用のメールを送信しました', json['message']
  end

  test 'should reset password with token' do
    token = @user.send_reset_password_instructions

    put api_v1_user_password_path,
        params: {
          user: {
            reset_password_token: token,
            password: 'newpassword',
            password_confirmation: 'newpassword'
          }
        },
        as: :json

    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal 'パスワードを更新しました', json['message']
  end

  test 'should not reset password with invalid token' do
    put api_v1_user_password_path,
        params: {
          user: {
            reset_password_token: 'invalid_token',
            password: 'newpassword',
            password_confirmation: 'newpassword'
          }
        },
        as: :json

    assert_response :unprocessable_entity
  end
end
