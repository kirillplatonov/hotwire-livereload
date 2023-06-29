# Hotwire::Livereload

Automatically reload Hotwire Turbo when app files are modified.

https://user-images.githubusercontent.com/839922/148676469-0acfa036-832e-4b40-aa05-1fdd945baa1f.mp4

## Dependencies

* [Redis](https://redis.io/)

## Getting started

Add `hotwire-livereload` to your Gemfile:
```
bundle add hotwire-livereload --group development
```

Run installer:
```
rails livereload:install
```

Folders listened by default:
- `app/views`
- `app/helpers`
- `app/javascript`
- `app/assets/stylesheets`
- `app/assets/javascripts`
- `app/assets/images`
- `app/components`
- `config/locales`

The gem detects if you use [`jsbundling-rails`](https://github.com/rails/jsbundling-rails) or [`cssbundling-rails`](https://github.com/rails/cssbundling-rails) and watches for changes in their output folder `app/assets/builds` automatically.

## Configuration

You can watch for changes in additional folders by adding them to `listen_paths`:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.listen_paths << Rails.root.join("app/custom_folder")
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

If you don't have `data-turbo-track="reload"` attribute on your JS and CSS bundles you might need to setup force reloading. This will trigger full browser reloading for JS and CSS files only:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.force_reload_paths << Rails.root.join("app/assets/stylesheets")
  config.hotwire_livereload.force_reload_paths << Rails.root.join("app/javascript")
end
```

Instead of a direct ActionCable websocket connection, you can reuse the existing TurboStream websocket connection and send updates using standard turbo-streams:
```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.reload_method = :turbo_stream
end
```

In that case you need to place `hotwire_livereload_tags` helper in your layout *after* the `<%= action_cable_meta_tag %>`.

```diff
<head>
  ...
  <%= action_cable_meta_tag %>
+ <%= hotwire_livereload_tags if Rails.env.development? %>
  ...
</head>
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
