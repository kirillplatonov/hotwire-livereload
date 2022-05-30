import debounce from "debounce"

export default debounce(({force_reload}) => {
  const onErrorPage = document.title === "Action Controller: Exception caught"

  if (onErrorPage || force_reload) {
    console.log("[Hotwire::Livereload] Files changed. Force reloading..")
    document.location.reload()
  } else {
    console.log("[Hotwire::Livereload] Files changed. Reloading..")
    Turbo.visit(window.location.href, { action: 'replace' })
  }
}, 300)
