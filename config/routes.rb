Rails.application.routes.draw do
  resources :sources
  get 'welcome/dashboard'
  get 'welcome/query'
  get 'welcome/question'
  get 'welcome/map'

  root to: 'welcome#dashboard'
  match 'marker/create' => 'welcome#mark', as: 'create_marker_form', via: :post
end
