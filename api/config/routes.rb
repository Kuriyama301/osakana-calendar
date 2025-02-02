Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
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

      # Google OAuth2のコールバックルートを追加
      devise_scope :user do
        post 'auth/google_oauth2/callback', to: 'auth/omniauth_callbacks#google_oauth2'
        get 'auth/line/callback', to: 'auth/line#callback'
        delete 'auth', to: 'api/v1/auth/registrations#destroy'
      end

      # その他のルート
      get 'youtube/search', to: 'youtube#search'

      resources :fish, only: [:index, :show] do
        collection do
          get 'search'
        end
      end

      get 'calendar/fish', to: 'calendar#fish_by_date'
      resources :favorites, only: [:index, :create, :destroy]
      resources :fish_collections, only: [:index, :create, :destroy]
    end
  end
end
