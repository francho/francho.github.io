require 'html/proofer'
require 'scss_lint/rake_task'

desc 'Test everything: build, html and sass'
task :test => [:html_lint]

desc 'build web site'
task :build do
  sh 'bundle exec jekyll build'
end

desc 'run server'
task :serve do
  sh 'bundle exec jekyll serve --watch jekyll serve --config _config.yml,_config-dev.yml'
end

desc 'Run html tests'
task :html_lint => [:build] do
  HTML::Proofer.new('./_site', {
                               typhoeus: {ssl_verifypeer: false, ssl_verifyhost: 0},
                               only_4xx: true,
                               parallel: {in_processes: 5}
                             }).run
end

desc 'Run scss-lint tests'
task :scss_lint do
  SCSSLint::RakeTask.new do |t|
    t.config= './.scss-lint.yml'
    t.files= ['_sass']
  end
end

