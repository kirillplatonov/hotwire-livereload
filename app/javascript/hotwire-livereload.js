import { createConsumer } from "@rails/actioncable"
import debounce from "debounce"

const endpoint = "/hotwire-livereload/cable"
const uid = (Date.now() + ((Math.random() * 100) | 0)).toString()
const consumer = createConsumer(`${endpoint}?uid=${uid}`)
const received = debounce(() => {
  console.log("Hotwire::Livereload files changed")
  Turbo.visit(window.location.href)
}, 300)

consumer.subscriptions.create("Hotwire::Livereload::ReloadChannel", {
  received,
  connected() {
    console.log("Hotwire::Livereload websocket connected")
  },
  disconnected() {
    console.log("Hotwire::Livereload websocket disconnected")
  },
})
