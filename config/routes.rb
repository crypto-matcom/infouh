Rails.application.routes.draw do
  get 'welcome/dashboard'
  get 'welcome/query'
  get 'welcome/question'
  get 'welcome/map'

  root to: 'welcome#dashboard'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
