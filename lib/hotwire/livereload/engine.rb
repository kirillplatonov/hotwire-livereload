require "rails"
require "action_cable/engine"
require "listen"

module Hotwire
  module Livereload
    class Engine < ::Rails::Engine
      isolate_namespace Hotwire::Livereload
      config.hotwire_livereload = ActiveSupport::OrderedOptions.new
      config.hotwire_livereload.listen_paths ||= []
      config.hotwire_livereload.force_reload_paths ||= []
      config.hotwire_livereload.reload_method = :action_cable
      config.hotwire_livereload.disable_default_listeners = false
      config.autoload_once_paths = %W(
        #{root}/app/channels
        #{root}/app/helpers
      )

      initializer "hotwire_livereload.assets" do
        if Rails.application.config.respond_to?(:assets)
          Rails.application.config.assets.precompile += %w( hotwire-livereload.js hotwire-livereload-turbo-stream.js)
        end
      end

      initializer "hotwire_livereload.helpers" do
        ActiveSupport.on_load(:action_controller_base) do
          helper Hotwire::Livereload::LivereloadTagsHelper
        end
      end

      initializer "hotwire_livereload.set_configs" do |app|
        options = app.config.hotwire_livereload

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
          ].map { |p| Rails.root.join(p) }
          options.listen_paths += default_listen_paths.select { |p| Dir.exist?(p) }
        end
      end

      config.after_initialize do |app|
        if Rails.env.development? && Hotwire::Livereload.server_process?
          options = app.config.hotwire_livereload
          listen_paths = options.listen_paths.map(&:to_s).uniq
          force_reload_paths = options.force_reload_paths.map(&:to_s).uniq.join("|")

          @listener = Listen.to(*listen_paths) do |modified, added, removed|
            unless File.exist?(DISABLE_FILE)
              changed = [modified, removed, added].flatten.uniq
              return unless changed.any?

              force_reload = force_reload_paths.present? && changed.any? do |path|
                path.match(%r{#{force_reload_paths}})
              end

              options = {changed: changed, force_reload: force_reload}
              if config.hotwire_livereload.reload_method == :turbo_stream
                Hotwire::Livereload.turbo_stream(options)
              else
                Hotwire::Livereload.action_cable(options)
              end
            end
          end
          @listener.start
        end
      end

      at_exit do
        if Rails.env.development?
          @listener&.stop
        end
      end
    end

    def self.turbo_stream(locals)
      Turbo::StreamsChannel.broadcast_replace_to(
        "hotwire-livereload",
        target: "hotwire-livereload",
        partial: "hotwire/livereload/turbo_stream",
        locals: locals
      )
    end

    def self.action_cable(opts)
      ActionCable.server.broadcast("hotwire-reload", opts)
    end

    def self.server_process?
      puma_process = defined?(::Puma) && File.basename($0) == "puma"
      rails_server = defined?(Rails::Server)

      puma_process || rails_server
    end
  end
end
