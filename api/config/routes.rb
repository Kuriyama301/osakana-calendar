require 'letter_opener_web'

Rails.application.routes.draw do
  # API用の認証ルーティング設定
  devise_for :users,
    path: 'api/v1/auth',  # APIのパス階層に合わせる
    defaults: { format: :json },  # JSONレスポンスに設定
    controllers: {
      sessions: 'api/v1/auth/sessions',
      registrations: 'api/v1/auth/registrations'
    }

  # API関連ルーティング
  namespace :api do
    namespace :v1 do
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
