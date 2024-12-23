# Hotwire::Livereload

Automatically reload Hotwire Turbo when app files are modified.

https://user-images.githubusercontent.com/839922/148676469-0acfa036-832e-4b40-aa05-1fdd945baa1f.mp4

## Getting started

Add `hotwire-livereload` to your Gemfile:
```
group :development do
  gem "hotwire-livereload", github: "kirillplatonov/hotwire-livereload"
end
```

Run `bundle install` and restart your server.

In your layout, make sure you don't `turbo-track` your JS/CSS in development:
```diff
+ <%= stylesheet_link_tag "application", "data-turbo-track": Rails.env.production? ? "reload" : "" %>
- <%= stylesheet_link_tag "application", "data-turbo-track": "reload" %>
```

## Configuration

Folders watched by default:
- `app/views`
- `app/helpers`
- `app/javascript`
- `app/assets/stylesheets`
- `app/assets/javascripts`
- `app/assets/images`
- `app/components`
- `config/locales`

The gem detects if you use [`jsbundling-rails`](https://github.com/rails/jsbundling-rails) or [`cssbundling-rails`](https://github.com/rails/cssbundling-rails) and watches for changes in their output folder `app/assets/builds` automatically.

### Listen paths

You can watch for changes in additional folders by adding them to `listen_paths`:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.listen_paths << Rails.root.join("app/custom_folder")
end
```

You can skip one or few default listen paths:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.skip_listen_paths << Rails.root.join("app/views")
end
```

You can disable default listen paths and fully override them:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.disable_default_listeners = true
  config.hotwire_livereload.listen_paths = [
    Rails.root.join("app/assets/stylesheets"),
    Rails.root.join("app/javascript")
  ]
end
```

### Force reload

If you don't have `data-turbo-track="reload"` attribute on your JS and CSS bundles you might need to setup force reloading. This will trigger full browser reloading for JS and CSS files only:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.force_reload_paths << Rails.root.join("app/assets/stylesheets")
  config.hotwire_livereload.force_reload_paths << Rails.root.join("app/javascript")
end
```

### Reload method

Instead of a direct ActionCable websocket connection, you can reuse the existing TurboStream websocket connection and send updates using standard turbo-streams:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.reload_method = :turbo_stream
end
```

### Listen options

[Listen gem](https://github.com/guard/listen), which is used for file system monitoring, accepts [options](https://github.com/guard/listen?tab=readme-ov-file#options) like enabling a fallback mechanism called "polling" to detect file changes.

By default, Listen uses a more efficient mechanism called "native" which relies on the operating system's file system events to detect changes. However, in some cases, such as when working with network-mounted file systems or in certain virtualized environments, the native mechanism may not work reliably. In such cases, enabling force_polling ensures that file changes are still detected, albeit with a slightly higher resource usage.

You may use listen_options to pass these options like:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.listen_options[:force_polling] = true
end
```

### Listen debounce delay

If your app uses TailwindCSS or similar that compiles your CSS from looking at your templates, you can end up in a situation, where updating a template triggers twice for changes; once for the template and once for the rebuilt CSS. This can lead to unreliable reloads, ie. the reload happening before the CSS is built.

To avoid this, you can add a debounce delay to the file watcher:

```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.debounce_delay_ms = 300 # in milliseconds
end
```

## Disable livereload

To temporarily disable livereload use:
```bash
bin/rails livereload:disable
```

To re-enable:
```bash
bin/rails livereload:enable
```

No server restart is required. Disabling is managed by `tmp/livereload-disabled.txt` file.

## Development

To get started:

1. Run `npm install`
2. Run `npm run watch`

## License

Hotwire::Livereload is released under the [MIT License](https://opensource.org/licenses/MIT).
