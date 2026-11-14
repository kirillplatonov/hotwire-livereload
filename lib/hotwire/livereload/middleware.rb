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
        body = body.sub("</head>", "#{livereload_script(request)}</head>")
        return body unless turbo_stream_reload_method?

        # <turbo-cable-stream-source> isn't valid inside <head>, so it goes at
        # the end of <body>. Target the last </body> in case an earlier one
        # appears inside an inline script or template.
        stream_source = view_helpers.turbo_stream_from("hotwire-livereload")
        body_close = body.rindex("</body>")
        if body_close
          body.dup.insert(body_close, stream_source)
        else
          body.sub("</head>", "#{stream_source}</head>")
        end
      end

      def view_helpers
        ActionController::Base.helpers
      end

      def turbo_stream_reload_method?
        Hotwire::Livereload::Engine.config.hotwire_livereload.reload_method == :turbo_stream
      end

      def livereload_script(request)
        source = turbo_stream_reload_method? ? "hotwire-livereload-turbo-stream" : "hotwire-livereload"
        view_helpers.javascript_include_tag(source, defer: true, nonce: request&.content_security_policy_nonce)
      end
    end
  end
end
