require "rails"
require "action_cable/engine"
require "listen"

module Hotwire
  module Livereload
    class Engine < ::Rails::Engine
      isolate_namespace Hotwire::Livereload
      config.hotwire_livereload = ActiveSupport::OrderedOptions.new
      config.hotwire_livereload.listen_paths ||= []
      config.autoload_once_paths = %W(
        #{root}/app/channels
        #{root}/app/helpers
      )

      initializer "hotwire_livereload.assets" do
        if Rails.application.config.respond_to?(:assets)
          Rails.application.config.assets.precompile += %w( hotwire-livereload.js )
        end
      end

      initializer "hotwire_livereload.helpers" do
        ActiveSupport.on_load(:action_controller_base) do
          helper Hotwire::Livereload::LivereloadTagsHelper
        end
      end

      initializer "hotwire_livereload.set_configs" do |app|
        options = app.config.hotwire_livereload
        options.listen_paths = options.listen_paths.map(&:to_s)
        options.listen_paths << Rails.root.join("app/views")
        options.listen_paths << Rails.root.join("app/helpers")
        if Dir.exist?(Rails.root.join("app/javascript"))
          options.listen_paths << Rails.root.join("app/javascript")
        end
      end

      config.after_initialize do |app|
        if Rails.env.development?
          @listener = Listen.to(*app.config.hotwire_livereload.listen_paths) do |modified, added, removed|
            unless File.exists?(Rails.root.join("tmp/livereload-disable.txt")
              if (modified.any? || removed.any? || added.any?)
                content = { modified: modified, removed: removed, added: added }
                ActionCable.server.broadcast("hotwire-reload", content)
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
  end
end
