import debounce from "debounce"

const debounced_soft_reload = debounce(() => {
  console.log("[Hotwire::Livereload] Files changed. Reloading..")
  Turbo.visit(window.location.href, {action: 'replace'})
}, 300, true)

export default ({mode, changed}) => {
  const onErrorPage = document.title === "Action Controller: Exception caught"

  if (onErrorPage || mode === "force") {
    console.log("[Hotwire::Livereload] Files changed. Force reloading..")
    document.location.reload()
  } else {
    if (mode === "css"){
      changed.forEach((item, index) => {
        const stylesheet = document.querySelector(`[data-stylesheet="${item.file}"]`);
        if(stylesheet) {
          console.log(`[Hotwire::Livereload] Stylesheet ${item.file} changed. Reloading..`)
          stylesheet.href = item.path;
        }
      })
    } else {
      if (window.Turbo) {
        debounced_soft_reload()
      } else {
        console.log("[Hotwire::Livereload] Files changed. Force reloading..")
        document.location.reload()
      }
    }
  }
}
