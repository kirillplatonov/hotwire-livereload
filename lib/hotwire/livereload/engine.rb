module Hotwire
  module Livereload
    class Engine < ::Rails::Engine
      isolate_namespace Hotwire::Livereload

      config.hotwire_livereload = ActiveSupport::OrderedOptions.new
      config.hotwire_livereload.listen_paths ||= []
      config.hotwire_livereload.skip_listen_paths ||= []
      config.hotwire_livereload.force_reload_paths ||= []
      config.hotwire_livereload.reload_method = :action_cable
      config.hotwire_livereload.disable_default_listeners = false
      config.autoload_once_paths = %W[#{root}/app/channels]
      config.hotwire_livereload.listen_options ||= {}
      config.hotwire_livereload.debounce_delay_ms = 0

      initializer "hotwire_livereload.middleware" do
        if Hotwire::Livereload.enabled?
          config.app_middleware.insert_after ActionDispatch::Executor, Hotwire::Livereload::Middleware
        end
      end

      initializer "hotwire_livereload.routes" do
        if Hotwire::Livereload.enabled?
          config.after_initialize do |app|
            app.routes.prepend do
              mount Hotwire::Livereload.cable_server => "/hotwire-livereload", :internal => true, :anchor => true
            end
          end
        end
      end

      initializer "hotwire_livereload.assets" do
        if Hotwire::Livereload.enabled? && Rails.application.config.respond_to?(:assets)
          Rails.application.config.assets.precompile += %w[hotwire-livereload.js hotwire-livereload-turbo-stream.js]
        end
      end

      initializer "hotwire_livereload.set_configs" do |app|
        if Hotwire::Livereload.enabled?
          options = app.config.hotwire_livereload
          skip_listen_paths = options.skip_listen_paths.map(&:to_s).uniq

          unless options.disable_default_listeners
            default_listen_paths = %w[
              app/views
              app/helpers
              app/javascript
              app/assets/stylesheets
              app/assets/javascripts
              app/assets/images
              app/components
              config/locales
            ]
            if defined?(Jsbundling)
              default_listen_paths -= %w[app/javascript]
              default_listen_paths += %w[app/assets/builds]
            end
            if defined?(Cssbundling)
              default_listen_paths -= %w[app/assets/stylesheets]
              default_listen_paths += %w[app/assets/builds]
            end
            options.listen_paths += default_listen_paths
              .uniq
              .map { |p| Rails.root.join(p) }
              .select { |p| Dir.exist?(p) }
              .reject { |p| skip_listen_paths.include?(p.to_s) }
          end
        end
      end

      config.after_initialize do |app|
        if Hotwire::Livereload.enabled?
          @trigger_reload = (Hotwire::Livereload.debounce(config.hotwire_livereload.debounce_delay_ms) do |options|
            if config.hotwire_livereload.reload_method == :turbo_stream
              Hotwire::Livereload.turbo_stream(options)
            else
              Hotwire::Livereload.action_cable(options)
            end
          end)

          options = app.config.hotwire_livereload
          listen_paths = options.listen_paths.map(&:to_s).uniq
          force_reload_paths = options.force_reload_paths.map(&:to_s).uniq.join("|")

          @listener = Listen.to(*listen_paths, **config.hotwire_livereload.listen_options) do |modified, added, removed|
            unless File.exist?(DISABLE_FILE)
              changed = [modified, removed, added].flatten.uniq
              next unless changed.any?

              force_reload = force_reload_paths.present? && changed.any? do |path|
                path.match(%r{#{force_reload_paths}})
              end

              options = {changed: changed, force_reload: force_reload}
              @trigger_reload.call(options)
            end
          end
          @listener.start
        end
      end

      at_exit do
        if Hotwire::Livereload.enabled?
          @listener&.stop
        end
      end
    end
  end
end
