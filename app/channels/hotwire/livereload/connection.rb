class Hotwire::Livereload::Connection < ActionCable::Connection::Base
  identified_by :uid

  def connect
    self.uid = request.params[:uid]
    logger.add_tags(uid)
    logger.info "connected to Hotwire::Livereload"
  end
end
