require 'letter_opener_web'

Rails.application.routes.draw do
  # API関連ルーティング
  namespace :api do
    namespace :v1 do
      # Devise認証ルーティング
      devise_for :users,
        path: 'auth',
        defaults: { format: :json },
        controllers: {
          sessions: 'api/v1/auth/sessions',
          registrations: 'api/v1/auth/registrations',
          passwords: 'api/v1/auth/passwords',
          confirmations: 'api/v1/auth/confirmations'
        }

      # YouTube
      resources :youtube, only: [] do
        collection do
          get 'search'
        end
      end

      # 魚情報関連
      resources :fish, only: [:index, :show] do
        collection do
          get 'search'
        end
      end

      # カレンダー関連
      get '/calendar/fish', to: 'calendar#fish_by_date'
    end
  end

  # 開発環境でのメールプレビュー用
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
