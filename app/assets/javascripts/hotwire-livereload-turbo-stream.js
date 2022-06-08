(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/debounce/index.js
  var require_debounce = __commonJS({
    "node_modules/debounce/index.js"(exports, module) {
      function debounce2(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        if (wait == null)
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
  var import_debounce = __toModule(require_debounce());
  var hotwire_livereload_received_default = (0, import_debounce.default)(({ force_reload }) => {
    const onErrorPage = document.title === "Action Controller: Exception caught";
    if (onErrorPage || force_reload) {
      console.log("[Hotwire::Livereload] Files changed. Force reloading..");
      document.location.reload();
    } else {
      console.log("[Hotwire::Livereload] Files changed. Reloading..");
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
