# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( flat/animate.css )
Rails.application.config.assets.precompile += %w( flat/caption-hover.css )
Rails.application.config.assets.precompile += %w( flat/circle-hover.css )
Rails.application.config.assets.precompile += %w( flat/galleryeffect.css )
Rails.application.config.assets.precompile += %w( flat/slider.css )
Rails.application.config.assets.precompile += %w( flat/style.css )

Rails.application.config.assets.precompile += %w( map.css )
Rails.application.config.assets.precompile += %w( map.js )
