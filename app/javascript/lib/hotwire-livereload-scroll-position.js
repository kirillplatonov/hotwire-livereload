const KEY = "hotwire-livereload-scrollPosition"

export function read() {
  const value = localStorage.getItem(KEY)
  if (!value) return
  return parseInt(value)
}

export function save() {
  const pos = window.scrollY
  localStorage.setItem(KEY, pos.toString())
}

export function remove() {
  localStorage.removeItem(KEY)
}

export function restore() {
  const value = read()
  if (value) {
    console.log("[Hotwire::Livereload] Restoring scroll position to", value)
    window.scrollTo(0, value)
  }

}

export default { read, save, restore, remove }
