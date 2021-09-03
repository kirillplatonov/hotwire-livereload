module Hotwire::Livereload::LivereloadTagsHelper
  def hotwire_livereload_tags
    return unless Rails.env.development?

    javascript_include_tag "hotwire-livereload", defer: true
  end
end
