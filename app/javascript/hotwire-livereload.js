import { createConsumer } from "@rails/actioncable"
import received from "./lib/hotwire-livereload-received"
import scrollPosition from "./lib/hotwire-livereload-scroll-position"

const consumer = createConsumer("/hotwire-livereload")
consumer.subscriptions.create("Hotwire::Livereload::ReloadChannel", {
  received,

  connected() {
    console.log("[Hotwire::Livereload] Websocket connected")
  },

  disconnected() {
    console.log("[Hotwire::Livereload] Websocket disconnected")
  },
})

document.addEventListener("turbo:load", () => {
  scrollPosition.restore()
  scrollPosition.remove()
})
