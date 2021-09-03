import { createConsumer } from "@rails/actioncable"
import debounce from "debounce"

const consumer = createConsumer()
const received = debounce(() => {
  console.log("[Hotwire::Livereload] Files changed")
  Turbo.visit(window.location.href)
}, 300)

consumer.subscriptions.create("Hotwire::Livereload::ReloadChannel", {
  received,

  connected() {
    console.log("[Hotwire::Livereload] Websocket connected")
  },

  disconnected() {
    console.log("[Hotwire::Livereload] Websocket disconnected")
  },
})
