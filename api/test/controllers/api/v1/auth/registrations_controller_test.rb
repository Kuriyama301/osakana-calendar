require "test_helper"

class Api::V1::Auth::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "ユーザー登録ができる" do
    assert_difference('User.count') do
      post user_registration_path, params: {
        user: {
          email: "test@example.com",
          password: "password123",
          password_confirmation: "password123",
          name: "Test User"
        }
      }, as: :json
    end

    assert_response :success
    assert_equal 'ユーザー登録が完了しました', json_response['message']
  end
end
