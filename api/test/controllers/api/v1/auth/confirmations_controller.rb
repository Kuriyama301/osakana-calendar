require 'test_helper'

class Api::V1::Auth::ConfirmationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:unconfirmed_user)
  end

  test "有効なトークンでメールアドレスを確認できる" do
    get user_confirmation_path(confirmation_token: @user.confirmation_token)
    assert_response :success
  end

  test "確認メールを再送信できる" do
    post user_confirmation_path, params: {
      user: { email: @user.email }
    }, as: :json

    assert_response :success
  end
end
