require 'test_helper'

class Api::V1::Auth::PasswordsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:user)
  end

  test "パスワードリセットメールを送信できる" do
    assert_emails 1 do
      post api_v1_user_password_path,
        params: {
          user: { email: @user.email }
        },
        as: :json
    end

    assert_response :ok
    assert_equal 'パスワードリセット用のメールを送信しました', json_response['message']
  end
end
