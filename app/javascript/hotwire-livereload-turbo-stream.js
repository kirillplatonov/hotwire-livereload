import received from "./lib/hotwire-livereload-received"

(() => {
  if(window.HotwireLivereload){ return; }

  window.HotwireLivereload = function(event) {
    const element = event.target.querySelector('template').content.getElementById('hotwire-livereload')
    if (!element) { return; }

    received({ force_reload: element.dataset.forceReload })
  };

  document.addEventListener('turbo:before-stream-render', window.HotwireLivereload);
})();

