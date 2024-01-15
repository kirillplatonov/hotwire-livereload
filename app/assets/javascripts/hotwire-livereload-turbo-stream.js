(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/debounce/index.js
  var require_debounce = __commonJS({
    "node_modules/debounce/index.js"(exports, module) {
      function debounce2(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        if (null == wait)
          wait = 100;
        function later() {
          var last = Date.now() - timestamp;
          if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
              context = args = null;
            }
          }
        }
        ;
        var debounced = function() {
          context = this;
          args = arguments;
          timestamp = Date.now();
          var callNow = immediate && !timeout;
          if (!timeout)
            timeout = setTimeout(later, wait);
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }
          return result;
        };
        debounced.clear = function() {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
        };
        debounced.flush = function() {
          if (timeout) {
            result = func.apply(context, args);
            context = args = null;
            clearTimeout(timeout);
            timeout = null;
          }
        };
        return debounced;
      }
      debounce2.debounce = debounce2;
      module.exports = debounce2;
    }
  });

  // app/javascript/lib/hotwire-livereload-received.js
  var import_debounce = __toESM(require_debounce());

  // app/javascript/lib/hotwire-livereload-scroll-position.js
  var KEY = "hotwire-livereload-scrollPosition";
  function read() {
    const value = localStorage.getItem(KEY);
    if (!value)
      return;
    return parseInt(value);
  }
  function save() {
    const pos = window.scrollY;
    localStorage.setItem(KEY, pos.toString());
  }
  function remove() {
    localStorage.removeItem(KEY);
  }
  function restore() {
    const value = read();
    if (value) {
      console.log("[Hotwire::Livereload] Restoring scroll position to", value);
      window.scrollTo(0, value);
    }
  }
  var hotwire_livereload_scroll_position_default = { read, save, restore, remove };

  // app/javascript/lib/hotwire-livereload-received.js
  var hotwire_livereload_received_default = (0, import_debounce.default)(({ force_reload }) => {
    const onErrorPage = document.title === "Action Controller: Exception caught";
    if (onErrorPage || force_reload) {
      console.log("[Hotwire::Livereload] Files changed. Force reloading..");
      document.location.reload();
    } else {
      console.log("[Hotwire::Livereload] Files changed. Reloading..");
      hotwire_livereload_scroll_position_default.save();
      Turbo.cache.clear();
      Turbo.visit(window.location.href, { action: "replace" });
    }
  }, 300);

  // app/javascript/hotwire-livereload-turbo-stream.js
  (() => {
    if (window.HotwireLivereload) {
      return;
    }
    window.HotwireLivereload = function({ target }) {
      const element = target.querySelector("template")?.content.getElementById("hotwire-livereload");
      if (element) {
        hotwire_livereload_received_default({ force_reload: element.dataset.forceReload });
      }
    };
    document.addEventListener("turbo:before-stream-render", window.HotwireLivereload);
  })();
})();
