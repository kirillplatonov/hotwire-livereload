import received from "./lib/hotwire-livereload-received"

(() => {
  if(window.HotwireLivereload){ return; }

  window.HotwireLivereload = function({ target }) {
    const element = target.querySelector('template')?.content.getElementById('hotwire-livereload')
    if (element) {
      received({ force_reload: element.dataset.forceReload })
    }
  };

  document.addEventListener('turbo:before-stream-render', window.HotwireLivereload);
})();

