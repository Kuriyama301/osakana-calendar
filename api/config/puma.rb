# Puma configuration for production and development
workers ENV.fetch("WEB_CONCURRENCY") { 2 }
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Port configuration
port ENV.fetch("PORT") { 3000 }

# Environment configuration
environment ENV.fetch("RAILS_ENV") { "development" }

# Disable pidfile in production
unless ENV.fetch("RAILS_ENV", "development") == "development"
  pidfile nil
  state_path nil
  preload_app!
end

# Allow puma to be restarted by `bin/rails restart` command
plugin :tmp_restart

on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end
