# frozen_string_literal: true

# ルーティング設定ファイル
# APIエンドポイントとリクエストの対応関係を管理

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      # Devise認証ルート設定
      devise_for :users,
        path: 'auth',
        defaults: { format: :json },
        skip: [:omniauth_callbacks],
        controllers: {
          sessions: 'api/v1/auth/sessions',
          registrations: 'api/v1/auth/registrations',
          passwords: 'api/v1/auth/passwords',
          confirmations: 'api/v1/auth/confirmations'
        }

      # OAuth認証関連のルート
      devise_scope :user do
        post 'auth/google_oauth2/callback', to: 'auth/omniauth_callbacks#google_oauth2'
        get 'auth/line/callback', to: 'auth/line#callback'
        delete 'auth/sign_out', to: 'auth/sessions#destroy'
        # delete 'auth/registration', to: 'auth/registrations#destroy'
      end

      # 機能別APIルート
      get 'youtube/search', to: 'youtube#search'

      # 魚情報関連のルート
      resources :fish, only: [:index, :show] do
        collection do
          get 'search'
        end
      end

      # カレンダー関連のルート
      get 'calendar/fish', to: 'calendar#fish_by_date'

      # ユーザー機能関連のルート
      resources :favorites, only: [:index, :create, :destroy]
      resources :fish_collections, only: [:index, :create, :destroy]
    end
  end
end
