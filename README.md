# Hotwire::Livereload

Automatically reload Hotwire Turbo when "view" files are modified.

https://user-images.githubusercontent.com/839922/131983979-afd0bcc7-86e8-4c53-9758-3bf762dbb16a.mp4

## Installation

The JavaScript for Hotwire::Livereload is installed via asset pipeline, which is included with this gem.

Add `hotwire-livereload` to your Gemfile:
```
bundle add hotwire-livereload --group development
```

Run installer:
```
rails livereload:install
```

## Configuration

You can watch for changes in additional folders by adding them to `listen_paths`. For example, you can watch for CSS changes:

```ruby
# config/environments/development.rb

Rails.application.configure do
  # ...
  config.hotwire_livereload.listen_paths << Rails.root.join("app/assets/stylesheets")
end
```

Folders listened by default:
- `app/views`
- `app/helpers`
- `app/javascript`

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
