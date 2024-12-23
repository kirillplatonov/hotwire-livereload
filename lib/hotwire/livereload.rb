# dependencies
require "rails"
require "action_cable/engine"
require "action_cable/server/base"
require "listen"

# modules
require "hotwire/livereload/cable_server"
require "hotwire/livereload/middleware"
require "hotwire/livereload/version"
require "hotwire/livereload/engine"

module Hotwire
  module Livereload
    DISABLE_FILE = "tmp/livereload-disabled.txt"

    class << self
      def turbo_stream(locals)
        Turbo::StreamsChannel.broadcast_replace_to(
          "hotwire-livereload",
          target: "hotwire-livereload",
          partial: "hotwire/livereload/turbo_stream",
          locals: locals
        )
      end

      def cable_server
        @cable_server ||= Hotwire::Livereload::CableServer.new
      end

      def action_cable(opts)
        cable_server.broadcast("hotwire-reload", opts)
      end

      def server_process?
        puma_process = defined?(::Puma) && File.basename($0) == "puma"
        rails_server = defined?(Rails::Server)

        !!(puma_process || rails_server)
      end

      def enabled?
        Rails.env.development? && server_process?
      end

      def debounce(wait_ms, &block)
        if wait_ms.zero?
          return ->(*args) { yield(*args) }
        end

        mutex = Mutex.new
        timer_thread = nil
        seconds = wait_ms.to_f / 1000.0

        lambda do |*args|
          mutex.synchronize do
            # Cancel previous timer
            timer_thread&.kill

            timer_thread = Thread.new do
              sleep(seconds)
              yield(*args)
            end
          end
        end
      end
    end
  end
end
