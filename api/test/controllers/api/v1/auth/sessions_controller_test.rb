require 'test_helper'

class Api::V1::Auth::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:user)
  end

  test 'should sign in confirmed user' do
    post api_v1_user_session_path,
         params: {
           user: {
             email: @user.email,
             password: 'password'
           }
         },
         as: :json

    assert_response :success
    json = JSON.parse(response.body)
    assert_equal 'success', json['status']
    assert json['token'].present?
  end

  test 'should not sign in unconfirmed user' do
    unconfirmed_user = users(:unconfirmed_user)
    post api_v1_user_session_path,
         params: {
           user: {
             email: unconfirmed_user.email,
             password: 'password'
           }
         },
         as: :json

    assert_response :unauthorized
  end

  test 'should not sign in with invalid password' do
    post api_v1_user_session_path,
         params: {
           user: {
             email: @user.email,
             password: 'wrong_password'
           }
         },
         as: :json

    assert_response :unauthorized
  end

  test 'should sign out user' do
    # ログイン
    post api_v1_user_session_path,
         params: {
           user: {
             email: @user.email,
             password: 'password'
           }
         },
         as: :json

    token = JSON.parse(response.body)['token']

    # ログアウト
    delete destroy_api_v1_user_session_path,
           headers: { 'Authorization' => "Bearer #{token}" },
           as: :json

    assert_response :success
  end
end
