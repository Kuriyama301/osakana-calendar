Rails.application.routes.draw do
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

      # YouTube検索
      get 'youtube/search', to: 'youtube#search'

      # 魚情報関連
      resources :fish, only: [:index, :show] do
        collection do
          get 'search'
        end
      end

      # カレンダー関連
      get 'calendar/fish', to: 'calendar#fish_by_date'
    end
  end

  # 開発環境のみメールプレビューを有効化
  if Rails.env.development?
    begin
      require 'letter_opener_web'
      mount LetterOpenerWeb::Engine, at: '/letter_opener'
    rescue LoadError
      # letter_opener_webが利用できない場合は無視
    end
  end
end
