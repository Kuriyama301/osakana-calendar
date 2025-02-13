# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')
  layout 'mailer'
end
