require "action_cable/server/base"
require "hotwire/livereload/cable_server"
require "hotwire/livereload/engine"

module Hotwire
  module Livereload
    DISABLE_FILE = "tmp/livereload-disabled.txt"
  end
end
