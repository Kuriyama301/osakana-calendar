# Load the Rails application.
require_relative "application"

# Create necessary directories
%w[tmp/pids tmp/cache tmp/sockets log storage].each do |dir|
  FileUtils.mkdir_p(Rails.root.join(dir))
  FileUtils.chmod(0777, Rails.root.join(dir))
end

# Initialize the Rails application.
Rails.application.initialize!
