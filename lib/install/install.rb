APP_LAYOUT_PATH = Rails.root.join("app/views/layouts/application.html.erb")
CABLE_CONFIG_PATH = Rails.root.join("config/cable.yml")

if APP_LAYOUT_PATH.exist?
  say "Add Hotwire Livereload tag in application layout"
  insert_into_file APP_LAYOUT_PATH, before: /\s*<\/head>/ do <<-HTML
\n    <%= hotwire_livereload_tags %>
HTML
  end
else
  say "Default application.html.erb is missing!", :red
  say %(  Add <%= hotwire_livereload_tags %> within the <head> tag in your custom layout.)
end

if CABLE_CONFIG_PATH.exist?
  say "Enable redis in bundle"
  uncomment_lines "Gemfile", %(gem 'redis')

  say "Switch development cable to use redis"
  gsub_file CABLE_CONFIG_PATH.to_s, /development:\n\s+adapter: async/, "development:\n  adapter: redis\n  url: redis://localhost:6379/1"
else
  say 'ActionCable config file (config/cable.yml) is missing. Uncomment "gem \'redis\'" in your Gemfile and create config/cable.yml to use Hotwire Livereload.'
end
