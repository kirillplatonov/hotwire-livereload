require "hotwire/livereload/engine"
require "hotwire/livereload/middleware"

if defined?(::Rails::Railtie)
  module Hotwire
    module Livereload
      DISABLE_FILE = "tmp/livereload-disabled.txt"

      class Railtie < ::Rails::Railtie
        initializer("rollbar.user_informer") do |app|
          app.config.middleware.insert_before(
            ActionDispatch::ShowExceptions,
            Hotwire::Livereload::Middleware
          )
        end
      end
    end
  end
end
