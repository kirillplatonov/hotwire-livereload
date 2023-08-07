const KEY = "hotwire-livereload-scrollPosition"

export function read() {
  const value = localStorage.getItem(KEY)
  if (!value) return 0;
  return parseInt(value)
}

export function save() {
  const pos = window.scrollY
  localStorage.setItem(KEY, pos.toString())
}

export function reset() {
  const value = read()
  console.log("[Hotwire::Livereload] Restoring scroll position to", value)
  window.scrollTo(0, value)
}

export default { read, save, reset }
