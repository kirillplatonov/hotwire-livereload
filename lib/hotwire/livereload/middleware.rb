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
          if body&.include?("</head>") && (!turbo_stream_reload_method? || body.include?("</body>"))
            body = inject_livereload_elements(body, request)
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

      def turbo_stream_reload_method?
        Hotwire::Livereload::Engine.config.hotwire_livereload.reload_method == :turbo_stream
      end

      def inject_livereload_elements(body, request)
        body_with_script = body.sub("</head>", "#{livereload_script(request)}</head>")
        return body_with_script unless turbo_stream_reload_method?

        body_with_script.sub("</body>", "#{livereload_turbo_cable_stream_source}</body>")
      end

      def livereload_script(request)
        view_helpers.javascript_include_tag(livereload_script_source, defer: true, nonce: request&.content_security_policy_nonce)
      end

      def view_helpers
        ActionController::Base.helpers
      end

      def livereload_script_source
        if turbo_stream_reload_method?
          "hotwire-livereload-turbo-stream"
        else
          "hotwire-livereload"
        end
      end

      def livereload_turbo_cable_stream_source
        view_helpers.turbo_stream_from("hotwire-livereload")
      end
    end
  end
end
