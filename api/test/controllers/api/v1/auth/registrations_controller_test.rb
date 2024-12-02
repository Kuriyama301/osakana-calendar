require "test_helper"

class Api::V1::Auth::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "正常なユーザー登録" do
    assert_difference('User.count') do
      post api_v1_user_registration_path,
        params: {
          user: {
            email: "test@example.com",
            password: "password123",
            password_confirmation: "password123",
            name: "Test User"
          }
        },
        as: :json
    end

    assert_response :created
    assert_equal 'ユーザー登録が完了しました', json_response['message']
    assert json_response['user'].present?
  end

  test "無効なパラメータでユーザー登録失敗" do
    post api_v1_user_registration_path,
      params: {
        user: {
          email: "invalid-email",
          password: "short",
          name: ""
        }
      },
      as: :json

    assert_response :unprocessable_entity
    assert json_response['errors'].present?
  end
end
