# dependencies
require "rails"
require "action_cable/engine"
require "action_cable/server/base"
require "listen"

# modules
require "hotwire/livereload/cable_server"
require "hotwire/livereload/version"
require "hotwire/livereload/engine"

module Hotwire
  module Livereload
    DISABLE_FILE = "tmp/livereload-disabled.txt"
  end
end
