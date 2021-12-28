require_relative "lib/hotwire/livereload/version"

Gem::Specification.new do |spec|
  spec.name        = "hotwire-livereload"
  spec.version     = Hotwire::Livereload::VERSION
  spec.authors     = ["Kirill Platonov"]
  spec.email       = ["mail@kirillplatonov.com"]
  spec.homepage    = "https://github.com/kirillplatonov/hotwire-livereload"
  spec.summary     = "Automatically reload Hotwire Turbo when app files are modified."
  spec.license     = "MIT"

  spec.files = Dir["{app,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  spec.add_dependency "rails", ">= 6.0.0"
  spec.add_dependency "listen", ">= 3.0.0"
end
