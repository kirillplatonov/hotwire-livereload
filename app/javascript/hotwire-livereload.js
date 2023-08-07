import { createConsumer } from "@rails/actioncable"
import received from "./lib/hotwire-livereload-received"
import scrollPosition from "./lib/hotwire-livereload-scroll-position"
import debounce from "debounce"

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

window.addEventListener("scroll", debounce(scrollPosition.save, 100))
document.addEventListener("turbo:before-visit", scrollPosition.save)
document.addEventListener("turbo:load", scrollPosition.reset)
document.addEventListener("DOMContentLoaded", scrollPosition.reset)
document.addEventListener("turbo:frame-load", scrollPosition.reset)

