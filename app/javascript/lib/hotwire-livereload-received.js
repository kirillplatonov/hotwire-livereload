import debounce from "debounce"
import scrollPosition from "./hotwire-livereload-scroll-position"

export default debounce(({force_reload}) => {
  const onErrorPage = document.title === "Action Controller: Exception caught"

  if (onErrorPage || force_reload) {
    console.log("[Hotwire::Livereload] Files changed. Force reloading..")
    document.location.reload()
  } else {
    console.log("[Hotwire::Livereload] Files changed. Reloading..")
    scrollPosition.save()
    Turbo.cache.clear()
    Turbo.visit(window.location.href, { action: 'replace' })
  }
}, 300)
