import { createConsumer } from "@rails/actioncable"
import debounce from "debounce"

const consumer = createConsumer()
const received = debounce(({force_reload}) => {
  if (force_reload) {
    console.log("[Hotwire::Livereload] Files changed. Force reloading..")
    document.location.reload()
  } else {
    console.log("[Hotwire::Livereload] Files changed. Reloading..")
    Turbo.visit(window.location.href)
  }
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
