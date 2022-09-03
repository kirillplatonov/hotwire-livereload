import received from "./lib/hotwire-livereload-received"

(() => {
  if(window.HotwireLivereload){ return; }

  window.HotwireLivereload = function({ target }) {
    const element = target.querySelector('template')?.content.getElementById('hotwire-livereload')
    if (element) {
      received({ changed: JSON.parse(element.dataset.changed), mode: element.dataset.mode })
    }
  };

  document.addEventListener('turbo:before-stream-render', window.HotwireLivereload);
})();

