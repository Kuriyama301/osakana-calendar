require "test_helper"

class Api::V1::Auth::PasswordsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:user)
  end

  test "登録済みメールアドレスでパスワードリセットメールを送信できる" do
    post user_password_path, params: {
      user: { email: @user.email }
    }, as: :json

    assert_response :success
    assert_equal 'パスワードリセット用のメールを送信しました',
      JSON.parse(response.body)['status']['message']
  end

  test "未登録のメールアドレスではパスワードリセットメールを送信できない" do
    post user_password_path, params: {
      user: { email: 'nonexistent@example.com' }
    }, as: :json

    assert_response :unprocessable_entity
  end
end
