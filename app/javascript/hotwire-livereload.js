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

const debouncedScroll = debounce(() => {
  if (window.scrollY !== 0) return scrollPosition.save();

  // On a second update, the page mysteriously jumps to the top and sends a scroll event.
  // So we wait a bit and if the page is still is at the top, it was likely on purpose.
  setTimeout(() => {
    if (window.scrollY !== 0) return;
    scrollPosition.save();
  }, 1000);
}, 100)
window.addEventListener("scroll", debouncedScroll)

document.addEventListener("turbo:click", scrollPosition.reset)
document.addEventListener("turbo:before-visit", scrollPosition.restore)
document.addEventListener("turbo:load", scrollPosition.restore)
document.addEventListener("DOMContentLoaded", scrollPosition.restore)
document.addEventListener("turbo:frame-load", scrollPosition.restore)

