require "test_helper"

class Api::V1::Auth::PasswordsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = users(:user)
    @user.update!(confirmed_at: Time.current)
  end

  test "登録済みメールアドレスでパスワードリセットメールを送信できる" do
    post user_password_path, params: {
      user: { email: @user.email }
    }, as: :json

    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal "パスワードリセット用のメールを送信しました", json_response["status"]["message"]
  end

  test "未登録のメールアドレスではパスワードリセットメールを送信できない" do
    post user_password_path, params: {
      user: { email: "nonexistent@example.com" }
    }, as: :json

    assert_response :unprocessable_entity
  end
end
