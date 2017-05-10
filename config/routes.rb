Rails.application.routes.draw do
  get 'gab/hello'

  get 'test/home'

  get 'test/hola'

  resources :sources
  get 'welcome/dashboard'
  get 'welcome/query'
  get 'welcome/question'
  get 'welcome/map'

  root to: 'welcome#dashboard'
  match 'map/point' => 'map#point', as: 'create_map_point', via: :post
end
