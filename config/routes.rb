Rails.application.routes.draw do
  resources :sources
  get 'welcome/dashboard'
  get 'welcome/query'
  get 'welcome/question'
  get 'welcome/map'

  root to: 'welcome#dashboard'
  match 'map/new' => 'map#new', as: 'create_marker', via: :post
  match 'wizard/test' => 'wizard#test', as: 'show_query', via: :post
end
