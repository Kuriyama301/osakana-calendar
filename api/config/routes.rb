Rails.application.routes.draw do
  # OPTIONSリクエストの処理を最初に追加
  match '*path', to: 'application#preflight', via: :options

  # 既存のルーティング
  namespace :api do
    namespace :v1 do
      resources :fish, only: [:index, :show]
      get 'calendar/fish', to: 'calendar#fish_by_date'
    end
  end

  # 静的ファイルのルーティング
  get "/images/:filename", to: "active_storage/blobs#show"
end
