Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :fish, only: [:index, :show] do
        collection do
          get 'search'
        end
      end
      get '/calendar/fish', to: 'calendar#fish_by_date'
    end
  end
end
