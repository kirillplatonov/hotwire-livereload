Hotwire::Livereload::Engine.routes.draw do
  if Rails.env.development?
    mount Hotwire::Livereload::Engine.websocket => Hotwire::Livereload::Engine.cable.mount_path
  end
end
