(() => {
  // app/javascript/lib/hotwire-livereload-received.js
  var hotwire_livereload_received_default = ({ mode, changed }) => {
    const onErrorPage = document.title === "Action Controller: Exception caught";
    if (onErrorPage || mode === "force") {
      console.log("[Hotwire::Livereload] Files changed. Force reloading..");
      document.location.reload();
    } else {
      if (mode === "css") {
        changed.forEach((item, index) => {
          const stylesheet = document.querySelector(`[data-stylesheet="${item.file}"]`);
          if (stylesheet) {
            console.log(`[Hotwire::Livereload] Stylesheet ${item.file} changed. Reloading..`);
            stylesheet.href = item.path;
          }
        });
      } else {
        if (window.Turbo) {
          console.log("[Hotwire::Livereload] Files changed. Reloading..");
          Turbo.visit(window.location.href, { action: "replace" });
        } else {
          console.log("[Hotwire::Livereload] Files changed. Force reloading..");
          document.location.reload();
        }
      }
    }
  };

  // app/javascript/hotwire-livereload-turbo-stream.js
  (() => {
    if (window.HotwireLivereload) {
      return;
    }
    window.HotwireLivereload = function({ target }) {
      const element = target.querySelector("template")?.content.getElementById("hotwire-livereload");
      if (element) {
        hotwire_livereload_received_default({ changed: JSON.parse(element.dataset.changed), mode: element.dataset.mode });
      }
    };
    document.addEventListener("turbo:before-stream-render", window.HotwireLivereload);
  })();
})();
