route("mount Hotwire::Livereload::Engine, at: '/hotwire-livereload'")

if (app_layout_path = Rails.root.join("app/views/layouts/application.html.erb")).exist?
  say "Add Hotwire::Livereload tag in application layout"
  insert_into_file app_layout_path.to_s, before: /\s*<\/head>/ do <<-HTML
\n    <%= hotwire_livereload_tags %>
HTML
  end
else
  say "Default application.html.erb is missing!", :red
  say %(        Add <%= hotwire_livereload_tags %> within the <head> tag in your custom layout.)
end
