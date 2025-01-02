Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # OmniAuthルートを明示的に設定
      devise_scope :user do
        # get 'auth/google_oauth2', to: 'auth/omniauth_callbacks#passthru'
        # get 'auth/google_oauth2/callback', to: 'auth/omniauth_callbacks#google_oauth2'
        post 'auth/google_oauth2/callback', to: 'auth/omniauth_callbacks#google_oauth2'
      end

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

      # お気に入り関連
      resources :favorites, only: [:index, :create, :destroy]

      # 魚コレクション関連
      resources :fish_collections, only: [:index, :create, :destroy]
    end
  end
end
