namespace :livereload do
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
