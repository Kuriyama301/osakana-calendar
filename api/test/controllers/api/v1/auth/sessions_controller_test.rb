# test/controllers/api/v1/auth/sessions_controller_test.rb
require "test_helper"

class Api::V1::Auth::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:user)
    @user.update!(confirmed_at: Time.current)
  end

  test "有効な認証情報でログインできる" do
    puts "Test user email: #{@user.email}"  # デバッグ用
    post api_v1_user_session_path,
      params: {
        user: {
          email: @user.email,
          password: 'password'
        }
      },
      as: :json

    puts "Response body: #{response.body}"  # デバッグ用
    assert_response :success
    assert_equal 'ログインしました', json_response['message']
  end
end
