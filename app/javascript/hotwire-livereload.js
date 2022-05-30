import { createConsumer } from "@rails/actioncable"
import received from "./lib/hotwire-livereload-received"

const consumer = createConsumer()
consumer.subscriptions.create("Hotwire::Livereload::ReloadChannel", {
  received,

  connected() {
    console.log("[Hotwire::Livereload] Websocket connected")
  },

  disconnected() {
    console.log("[Hotwire::Livereload] Websocket disconnected")
  },
})
