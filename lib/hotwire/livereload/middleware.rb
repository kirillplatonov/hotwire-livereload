module Hotwire
  module Livereload
    class Middleware
      def initialize(app)
        @app = app
      end

      def call(env)
        status, headers, body = @app.call(env)
        request = ActionDispatch::Request.new(env)
        if status > 0 && ![200, 301, 302].include?(status) && request.method == "GET"
          replacement_text = Hotwire::Livereload.error_page_injected_code.call
          body = replace_placeholder(replacement_text, body, headers) if replacement_text
        end

        [status, headers, body]
      end

      private

      # - body interface is .each so we cannot use anything else
      # - always call .close on the old body so it can get garbage collected if it is a File
      def replace_placeholder(replacement_text, body, headers)
        new_body = []
        body.each do |chunk|
          new_body << chunk.gsub(/(<\/head>)/, replacement_text + "\\1")
        end
        headers["Content-Length"] = new_body.inject(0) { |sum, x| sum + x.bytesize }.to_s
        new_body
      ensure
        body.close if body&.respond_to?(:close)
      end
    end
  end
end
