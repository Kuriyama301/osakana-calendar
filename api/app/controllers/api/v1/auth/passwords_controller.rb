# frozen_string_literal: true

##
# パスワードリセット機能のコントローラー
# パスワードリセットメールの送信とパスワードの更新を処理する
# POST /api/v1/auth/password (リセットメール送信)
# PUT /api/v1/auth/password (パスワード更新)
# フロントエンド連携 PasswordResetModal.jsx からのリクエストを処理

module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        # createアクション
        # パスワードリセットメールの送信処理
        # @param [String] email リセット対象のメールアドレス
        # @return [JSON] 処理結果のメッセージ
        def create
          self.resource = resource_class.send_reset_password_instructions(resource_params)

          if successfully_sent?(resource)
            render json: {
              message: 'パスワードリセット用のメールを送信しました'
            }, status: :ok
          else
            render json: {
              message: 'メール送信に失敗しました',
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # updateアクション
        # パスワードの更新処理
        # @param [String] reset_password_token リセットトークン
        # @param [String] password 新しいパスワード
        # @param [String] password_confirmation パスワード（確認用）
        # @return [JSON] 更新結果のメッセージ
        def update
          self.resource = resource_class.reset_password_by_token(resource_params)

          if resource.errors.empty?
            render json: {
              message: 'パスワードを更新しました'
            }, status: :ok
          else
            render json: {
              message: 'パスワードの更新に失敗しました',
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        # 許可されたパラメータの設定
        # @return [ActionController::Parameters] 許可されたパラメータ
        def resource_params
          params.require(:user).permit(:email, :password, :password_confirmation, :reset_password_token)
        end
      end
    end
  end
end
