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

      # お気に入り関連
      resources :favorites, only: [:index, :create, :destroy]
    end
  end
end
