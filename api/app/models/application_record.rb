class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end

require "active_storage/engine"
