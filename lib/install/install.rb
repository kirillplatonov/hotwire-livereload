APP_LAYOUT_PATH = Rails.root.join("app/views/layouts/application.html.erb")
CABLE_CONFIG_PATH = Rails.root.join("config/cable.yml")

if APP_LAYOUT_PATH.exist?
  say "Add Hotwire Livereload tag in application layout"
  content = <<~HTML
    \n    <%= hotwire_livereload_tags if Rails.env.development? %>
  HTML
  insert_into_file APP_LAYOUT_PATH, content.chop, before: /\s*<\/head>/
else
  say "Default application.html.erb is missing!", :red
  say %(  Add <%= hotwire_livereload_tags %> within the <head> tag in your custom layout.)
  say %(  If using `config.hotwire_livereload.reload_method = :turbo_stream`, place *after* the `<%= action_cable_meta_tag %>`.)
end

if CABLE_CONFIG_PATH.exist?
  gemfile = File.read(Rails.root.join("Gemfile"))
  if gemfile.include?("solid_cable")
    say "Uncomment solid_cable in Gemfile"
    uncomment_lines "Gemfile", %r{gem ['"]solid_cable['"]}
  else
    say "Add solid_cable to Gemfile"
    gem "solid_cable"
    say "Change config/database.yml to create a separate connection for cable"
  end

  say "Switch development cable to use solid_cable"

  content = <<~YAML
    development:
      adapter: solid_cable
      connects_to:
        database:
          writing: cable
  YAML
  gsub_file CABLE_CONFIG_PATH, /development:\n  adapter: async\n/, content
else
  say 'ActionCable config file (config/cable.yml) is missing. Uncomment "gem \'solid_cable\'" in your Gemfile and create config/cable.yml to use Hotwire Livereload.'
end
