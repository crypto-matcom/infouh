Rails.application.routes.draw do
  resources :sources
  get 'welcome/dashboard'
  get 'welcome/query'
  get 'welcome/question'
  get 'welcome/map'

  root to: 'welcome#dashboard'

  match 'map/new' => 'map#new', as: 'create_marker', via: :post

  match 'question/create' => 'question#create', as: 'question_create', via: :post
  match 'question/show' => 'question#show', as: 'question_show', via: :post
  match 'question/delete/:id' => 'question#delete', as: 'question_delete', via: [:get, :post]

  match 'wizard/test' => 'wizard#test', as: 'wizard_test', via: :post
  match 'wizard/tables' => 'wizard#tables', as: 'wizard_tables', via: :post
  match 'wizard/columns' => 'wizard#columns', as: 'wizard_columns', via: :post
  match 'wizard/connections' => 'wizard#connections', as: 'wizard_connections', via: :post
end
