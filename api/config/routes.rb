Rails.application.routes.draw do
  # API用のルーティング
  scope :api do
    scope :v1 do
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
    end
  end

  # API機能用のルーティング
  namespace :api do
    namespace :v1 do
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
end
