module Hotwire
  module Livereload
    class Middleware
      def initialize(app)
        @app = app
      end

      def call(env)
        request = ActionDispatch::Request.new(env)
        status, headers, response = @app.call(env)

        if html_response?(headers)
          body = get_response_body(response)
          if body&.include?("</head>")
            body = inject_livereload_scripts(body, request)
            headers["Content-Length"] = body.bytesize.to_s
            response = [body]
          end
        end

        [status, headers, response]
      end

      private

      def html_response?(headers)
        headers["content-type"]&.include?("text/html")
      end

      def get_response_body(response)
        parts = []
        response.each { |part| parts << part.to_s }
        parts.join
      end

      def inject_livereload_scripts(body, request)
        body.sub("</head>", "#{livereload_scripts(request)}</head>")
      end

      def view_helpers
        ActionController::Base.helpers
      end

      def livereload_scripts(request)
        if Hotwire::Livereload::Engine.config.hotwire_livereload.reload_method == :turbo_stream
          view_helpers.safe_join [
            view_helpers.turbo_stream_from("hotwire-livereload"),
            view_helpers.javascript_include_tag("hotwire-livereload-turbo-stream", defer: true, nonce: request&.content_security_policy_nonce)
          ], "\n"
        else
          view_helpers.javascript_include_tag("hotwire-livereload", defer: true, nonce: request&.content_security_policy_nonce)
        end
      end
    end
  end
end
