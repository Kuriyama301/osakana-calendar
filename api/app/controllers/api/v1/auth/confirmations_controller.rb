# frozen_string_literal: true

# メールアドレス確認機能のコントローラー
# 新規登録時のメール確認トークンを検証し、アカウントを有効化する
# GET /api/v1/auth/confirmation?token=xxx
# フロントエンド連携: EmailConfirmation.jsxからのリクエストを処理

module Api
  module V1
    module Auth
      # メールアドレス確認機能を管理するコントローラー
      # EmailConfirmation.jsxコンポーネントからのリクエストを処理し、
      # メール確認の結果をフロントエンドに返却する
      # フロントエンドとの連携:
      # authAPI.confirmEmail()からのリクエストに応答
      # 処理結果をJSONで返却し、フロントエンドでのUI更新とリダイレクトを制御
      class ConfirmationsController < ApplicationController
        include ActionController::MimeResponds

        # メール確認トークンの検証とアカウントの有効化
        # @param [String] token EmailConfirmation.jsxから送信される確認トークン
        # @return [JSON] フロントエンドでのUI表示用のレスポンス
        #   success: { status: 'success', message: '確認完了', data: { email: '...' } }
        #   error: { status: 'error', message: 'エラー内容', error_code: '...' }
        def show
          params[:confirmation_token] = params[:token] if params[:token].present?
          user = find_user_by_token
          handle_confirmation(user)
        rescue StandardError => e
          handle_unexpected_error(e)
        end

        private

        # トークンからユーザーを検索
        # 無効なトークンの場合、フロントエンドでエラー表示を行うためのレスポンスを返す
        # @return [User, nil] 確認対象のユーザーまたはnil
        def find_user_by_token
          user = User.find_by(confirmation_token: params[:confirmation_token])
          return user if user.present?

          # EmailConfirmation.jsxでエラー表示用のレスポンス
          render_error(
            'このトークンは無効です',
            'invalid_token',
            :unprocessable_entity
          )
          nil
        end

        # 確認状態に応じた処理とレスポンス生成
        # フロントエンドでの表示状態の制御に使用される
        # @param [User] user 確認対象のユーザー
        def handle_confirmation(user)
          return unless user

          if user.confirmed?
            handle_already_confirmed
          elsif user.confirm
            handle_successful_confirmation(user)
          else
            handle_failed_confirmation(user)
          end
        end

        # 既に確認済みの場合のレスポンス
        # EmailConfirmation.jsxで警告表示を行う
        def handle_already_confirmed
          render_error(
            'このメールアドレスは既に確認済みです',
            'already_confirmed',
            :unprocessable_entity
          )
        end

        # 確認成功時のレスポンス
        # EmailConfirmation.jsxで成功表示とリダイレクトを行う
        # @param [User] user 確認されたユーザー
        def handle_successful_confirmation(user)
          render json: {
            status: 'success',
            message: 'メールアドレスの確認が完了しました',
            data: {
              email: user.email,
              confirmed: true
            }
          }, status: :ok
        end

        # 確認失敗時のレスポンス
        # EmailConfirmation.jsxでエラー表示を行う
        # @param [User] user 確認に失敗したユーザー
        def handle_failed_confirmation(user)
          render_error(
            'メールアドレスの確認に失敗しました',
            'confirmation_failed',
            :unprocessable_entity,
            user.errors.full_messages
          )
        end

        # 予期せぬエラーの処理
        # フロントエンドでのエラーハンドリング用のレスポンスを返す
        # @param [StandardError] error 発生したエラー
        def handle_unexpected_error(error)
          Rails.logger.error "Confirmation error: #{error.message}"
          render_error(
            '予期せぬエラーが発生しました',
            'system_error',
            :internal_server_error
          )
        end

        # エラーレスポンスの生成
        # EmailConfirmation.jsxでのエラー表示に使用される
        # @param [String] message 表示するエラーメッセージ
        # @param [String] error_code エラー種別の識別子
        # @param [Symbol] status HTTPステータス
        # @param [Array] errors 詳細エラー情報（オプション）
        def render_error(message, error_code, status, errors = nil)
          response = {
            status: 'error',
            message: message,
            error_code: error_code
          }
          response[:errors] = errors if errors.present?

          render json: response, status: status
        end

        def resource_params
          params.require(:user).permit(:email)
        end
      end
    end
  end
end
