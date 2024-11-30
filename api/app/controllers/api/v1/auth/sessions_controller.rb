module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          render json: {
            status: { code: 200, message: 'ログインに成功しました' },
            data: { user: resource }
          }
        end

        def respond_to_on_destroy
          head :no_content
        end
      end
    end
  end
end
