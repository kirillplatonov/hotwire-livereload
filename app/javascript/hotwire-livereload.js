import { createConsumer } from "@rails/actioncable"
import received from "./lib/hotwire-livereload-received"

const consumer = createConsumer()

consumer.connection.close = function ({allowReconnect: allowReconnect} = {
    allowReconnect: true
}) {
    if (!allowReconnect) {
        this.monitor.stop();
    }
    if (this.isOpen()) {
        this.webSocket.close();
    }
    if (allowReconnect) {
        console.log("[Hotwire::Livereload] Websocket reconnecting");
        return this.open();
    }
};

consumer.subscriptions.create("Hotwire::Livereload::ReloadChannel", {
  received,

  connected() {
    console.log("[Hotwire::Livereload] Websocket connected")
  },

  disconnected() {
    console.log("[Hotwire::Livereload] Websocket disconnected")
  },
})
