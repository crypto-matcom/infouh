# You are using Sourcer.
# Mantainer <a.caballero@estudiantes.matcom.uh.cu>
# source 'file:/home/linux/Documents/Rails/rubygems/'
source 'http://172.17.0.1/index/rubygems/rubygems-updates'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


gem 'rails', '~> 5.0.2'
gem 'sqlite3'
gem 'puma', '~> 3.0'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'therubyracer', platforms: :ruby

gem 'jquery-rails'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'

gem 'builder' 
gem 'twitter-bootstrap-rails'
gem 'semantic-ui-sass'
gem 'leaflet-rails'
gem 'leaflet-awesome-markers-rails', '~> 2.0'
# gem 'leaflet-sidebar-rails'

group :development, :test do
  gem 'byebug', platform: :mri
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.0.5'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
