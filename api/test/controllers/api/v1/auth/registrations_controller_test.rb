require "test_helper"

class Api::V1::Auth::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "should register new user" do
    assert_difference('User.count') do
      post api_v1_user_registration_path,
        params: {
          user: {
            email: 'new@example.com',
            password: 'password',
            password_confirmation: 'password',
            name: 'New User'
          }
        },
        as: :json
    end

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal 'success', json['status']
    assert_equal '登録確認メールを送信しました', json['message']
    assert_equal 'New User', json['data']['data']['attributes']['name']
  end

  test "should not register user with invalid data" do
    assert_no_difference('User.count') do
      post api_v1_user_registration_path,
        params: {
          user: {
            email: 'invalid-email',
            password: 'short',
            name: ''
          }
        },
        as: :json
    end

    assert_response :unprocessable_entity
  end

  test "should not register user with duplicate email" do
    existing_user = users(:user)

    assert_no_difference('User.count') do
      post api_v1_user_registration_path,
        params: {
          user: {
            email: existing_user.email,
            password: 'password',
            password_confirmation: 'password',
            name: 'Another User'
          }
        },
        as: :json
    end

    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_equal 'error', json['status']
  end
end
