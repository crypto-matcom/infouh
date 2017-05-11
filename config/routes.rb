Rails.application.routes.draw do
  resources :sources
  get 'welcome/dashboard'
  get 'welcome/query'
  get 'welcome/question'
  get 'welcome/map'

  root to: 'welcome#dashboard'
  match 'map/new' => 'map#new', as: 'create_marker', via: :post
  match 'wizard/test' => 'wizard#test', as: 'show_query', via: :post
  match 'wizard/tables' => 'wizard#tables', as: 'get_tables', via: :post
  match 'wizard/columns' => 'wizard#columns', as: 'get_columns', via: :post
  match 'wizard/connections' => 'wizard#connections', as: 'get_connections', via: :post
end
