namespace :livereload do
  desc "Install Hotwire::Livereload into the app"
  task :install do
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{File.expand_path("../install/install.rb", __dir__)}"
  end

  desc "Disable Hotwire::Livereload"
  task :disable do
    FileUtils.mkdir_p("tmp")
    FileUtils.touch Hotwire::Livereload::DISABLE_FILE
    puts "Livereload disabled."
  end

  desc "Enable Hotwire::Livereload"
  task :enable do
    if File.exist?(Hotwire::Livereload::DISABLE_FILE)
      File.delete Hotwire::Livereload::DISABLE_FILE
    end
    puts "Livereload enabled."
  end
end
