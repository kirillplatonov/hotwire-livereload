module Hotwire::Livereload::LivereloadTagsHelper
  def hotwire_livereload_tags
    partial = if Hotwire::Livereload::Engine.config.hotwire_livereload.reload_method == :turbo_stream
      "hotwire/livereload/head_turbo_stream"
    else
      "hotwire/livereload/head_action_cable"
    end

    render partial
  end
end
