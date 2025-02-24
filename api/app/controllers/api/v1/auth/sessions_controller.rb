# frozen_string_literal: true

# セッション管理（ログイン/ログアウト）のコントローラー
# ユーザー認証、JWTトークンの生成・無効化、セッション状態を管理する
# POST /api/v1/auth/sign_in (ログイン)
# DELETE /api/v1/auth/sign_out (ログアウト)
# フロントエンド連携: LoginForm.jsx, AuthContext.jsxからのリクエストを処理

module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json
        skip_before_action :verify_signed_out_user
        before_action :configure_sign_in_params, only: [:create]
        before_action :verify_user_and_token, only: [:destroy]

        # ログイン処理
        # @param [Hash] sign_in_params メールアドレスとパスワード
        # @return [JSON] 認証結果とJWTトークン
        def create
          Rails.logger.info "ログイン試行パラメータ: #{params.inspect}"
          authenticate_user_and_respond
        end

        # ログアウト処理
        # JWTトークンの無効化とセッションの破棄を実行
        # @return [JSON] ログアウト結果
        def destroy
          Rails.logger.info "ログアウト処理開始: user_id=#{@current_user&.id}"

          begin
            invalidate_current_token
            perform_sign_out
            render_success('ログアウトしました')
          rescue StandardError => e
            Rails.logger.error "Logout error: #{e.class} - #{e.message}"
            Rails.logger.error e.backtrace.join("\n")
            render_error('ログアウト処理中にエラーが発生しました', :internal_server_error)
          end
        end

        private

        # ユーザーとトークンの検証
        # @return [Boolean] 検証結果
        def verify_user_and_token
          token = extract_token_from_header
          return render_error('トークンが見つかりません', :unauthorized) unless token

          begin
            @token_payload = decode_jwt_token(token)
            @current_user = User.find(@token_payload['sub'])

            Rails.logger.info "Token verification successful: user=#{@current_user.id}, jti=#{@token_payload['jti']}"
            true
          rescue JWT::DecodeError => e
            Rails.logger.error "Token decode error: #{e.message}"
            render_error('無効なトークンです', :unauthorized)
            false
          rescue ActiveRecord::RecordNotFound => e
            Rails.logger.error "User not found: #{e.message}"
            render_error('ユーザーが見つかりません', :unauthorized)
            false
          end
        end

        # トークンのデコードと検証
        # @param [String] token 検証するJWTトークン
        # @return [Boolean] 検証結果
        def decode_and_verify_token(token)
          @token_payload = decode_jwt_token(token)
          true
        rescue JWT::DecodeError => e
          Rails.logger.error "トークン検証エラー: #{e.message}"
          render_error('無効なトークンです', :unauthorized)
          false
        end

        # 現在のトークンを無効化
        # @return [void]
        def invalidate_current_token
          return unless @token_payload

          JwtDenylist.create!(
            jti: @token_payload['jti'],
            exp: Time.at(@token_payload['exp'])
          )
          Rails.logger.info "Token blacklisted: #{@token_payload['jti']}"
        end

        # セッションからのサインアウト処理
        # @return [void]
        def perform_sign_out
          if Devise.sign_out_all_scopes
            sign_out
            Rails.logger.info "全スコープからサインアウトしました"
          else
            sign_out(resource_name)
            Rails.logger.info "ユーザー #{@current_user.id} をサインアウトしました"
          end
        end

        # ユーザー認証とレスポンス生成
        # @return [JSON] 認証結果とユーザー情報
        def authenticate_user_and_respond
          user = User.find_by(email: sign_in_params[:email])

          if user&.valid_password?(sign_in_params[:password])
            handle_successful_login(user)
          else
            render_error('メールアドレスまたはパスワードが正しくありません', :unauthorized)
          end
        end

        # ログイン成功時の処理
        # @param [User] user ログインユーザー
        # @return [JSON] ユーザー情報とトークン
        def handle_successful_login(user)
          sign_in(resource_name, user)
          token = generate_jwt_token(user)

          Rails.logger.info "ユーザー #{user.id} のログインが完了しました"

          render json: {
            status: 'success',
            message: 'ログインしました',
            data: {
              data: {
                attributes: {
                  id: user.id,
                  email: user.email,
                  name: user.name
                }
              }
            },
            token: token
          }, status: :ok
        end

        # JWTトークンの生成
        # @param [User] resource トークンを生成するユーザー
        # @return [String] 生成されたJWTトークン
        def generate_jwt_token(resource)
          JWT.encode(
            {
              sub: resource.id,
              exp: (Time.zone.now + ENV.fetch('DEVISE_JWT_EXPIRATION_TIME', 24.hours).to_i).to_i,
              jti: SecureRandom.uuid,
              iat: Time.zone.now.to_i
            },
            ENV.fetch('DEVISE_JWT_SECRET_KEY'),
            'HS256'
          )
        rescue StandardError => e
          Rails.logger.error "JWT generation error: #{e.message}"
          raise
        end

        # JWTトークンのデコード
        # @param [String] token デコードするトークン
        # @return [Hash] デコードされたペイロード
        def decode_jwt_token(token)
          JWT.decode(
            token,
            ENV.fetch('DEVISE_JWT_SECRET_KEY'),
            true,
            { algorithm: 'HS256' }
          ).first
        rescue JWT::DecodeError => e
          Rails.logger.error "JWT decode error: #{e.message}"
          raise
        end

        # 認証ヘッダーからトークンを抽出
        # @return [String, nil] 抽出されたトークンまたはnil
        def extract_token_from_header
          auth_header = request.headers['Authorization']
          return nil unless auth_header&.start_with?('Bearer ')

          auth_header.split(' ').last
        end

        # サインインパラメータの取得
        # @return [ActionController::Parameters] 許可されたパラメータ
        def sign_in_params
          params.require(:user).permit(:email, :password)
        end

        # サインインパラメータの設定
        # @return [void]
        def configure_sign_in_params
          devise_parameter_sanitizer.permit(:sign_in, keys: [:email])
        end

        # リソース名の設定
        # @return [Symbol] APIユーザーのリソース名
        def resource_name
          :api_v1_user
        end

        # 成功レスポンスの生成
        # @param [String] message 成功メッセージ
        # @return [JSON] 成功レスポンス
        def render_success(message)
          render json: {
            status: 'success',
            message: message
          }, status: :ok
        end

        # エラーレスポンスの生成
        # @param [String] message エラーメッセージ
        # @param [Symbol] status HTTPステータスコード
        # @return [JSON] エラーレスポンス
        def render_error(message, status)
          render json: {
            status: 'error',
            message: message
          }, status: status
        end
      end
    end
  end
end
