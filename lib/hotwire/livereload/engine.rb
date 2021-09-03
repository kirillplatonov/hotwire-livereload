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
        options.listen_paths << Rails.root.join("app", "views")
      end

      initializer "hotwire_livereload.cable.config" do |app|
        config_path = Hotwire::Livereload::Engine.root.join("config", "livereload_cable.yml")
        cable = Hotwire::Livereload::Engine.cable

        if Rails.env.development?
          cable.cable = app.config_for(config_path).with_indifferent_access
          cable.mount_path = "/cable"
          cable.connection_class = -> { Hotwire::Livereload::Connection }
          cable.logger ||= Rails.logger
        end
      end

      config.after_initialize do |app|
        if Rails.env.development?
          @listener = Listen.to(*app.config.hotwire_livereload.listen_paths) do |modified, added, removed|
            if modified.any? || removed.any? || added.any?
              Hotwire::Livereload::Engine.websocket.broadcast(
                "reload",
                { modified: modified, removed: removed, added: added }
              )
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

      class << self
        def websocket
          @websocket ||= ActionCable::Server::Base.new(config: Hotwire::Livereload::Engine.cable)
        end

        def cable
          @cable ||= ActionCable::Server::Configuration.new
        end
      end
    end
  end
end
