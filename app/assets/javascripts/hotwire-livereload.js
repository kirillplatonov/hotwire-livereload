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

  // node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js
  var require_action_cable = __commonJS({
    "node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ActionCable = {});
      })(exports, function(exports2) {
        "use strict";
        var adapters = {
          logger: self.console,
          WebSocket: self.WebSocket
        };
        var logger = {
          log: function log() {
            if (this.enabled) {
              var _adapters$logger;
              for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
                messages[_key] = arguments[_key];
              }
              messages.push(Date.now());
              (_adapters$logger = adapters.logger).log.apply(_adapters$logger, ["[ActionCable]"].concat(messages));
            }
          }
        };
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
          return typeof obj;
        } : function(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var classCallCheck = function(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };
        var createClass = function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function(Constructor, protoProps, staticProps) {
            if (protoProps)
              defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              defineProperties(Constructor, staticProps);
            return Constructor;
          };
        }();
        var now = function now2() {
          return (/* @__PURE__ */ new Date()).getTime();
        };
        var secondsSince = function secondsSince2(time) {
          return (now() - time) / 1e3;
        };
        var clamp = function clamp2(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };
        var ConnectionMonitor = function() {
          function ConnectionMonitor2(connection) {
            classCallCheck(this, ConnectionMonitor2);
            this.visibilityDidChange = this.visibilityDidChange.bind(this);
            this.connection = connection;
            this.reconnectAttempts = 0;
          }
          ConnectionMonitor2.prototype.start = function start() {
            if (!this.isRunning()) {
              this.startedAt = now();
              delete this.stoppedAt;
              this.startPolling();
              addEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms");
            }
          };
          ConnectionMonitor2.prototype.stop = function stop() {
            if (this.isRunning()) {
              this.stoppedAt = now();
              this.stopPolling();
              removeEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor stopped");
            }
          };
          ConnectionMonitor2.prototype.isRunning = function isRunning() {
            return this.startedAt && !this.stoppedAt;
          };
          ConnectionMonitor2.prototype.recordPing = function recordPing() {
            this.pingedAt = now();
          };
          ConnectionMonitor2.prototype.recordConnect = function recordConnect() {
            this.reconnectAttempts = 0;
            this.recordPing();
            delete this.disconnectedAt;
            logger.log("ConnectionMonitor recorded connect");
          };
          ConnectionMonitor2.prototype.recordDisconnect = function recordDisconnect() {
            this.disconnectedAt = now();
            logger.log("ConnectionMonitor recorded disconnect");
          };
          ConnectionMonitor2.prototype.startPolling = function startPolling() {
            this.stopPolling();
            this.poll();
          };
          ConnectionMonitor2.prototype.stopPolling = function stopPolling() {
            clearTimeout(this.pollTimeout);
          };
          ConnectionMonitor2.prototype.poll = function poll() {
            var _this = this;
            this.pollTimeout = setTimeout(function() {
              _this.reconnectIfStale();
              _this.poll();
            }, this.getPollInterval());
          };
          ConnectionMonitor2.prototype.getPollInterval = function getPollInterval() {
            var _constructor$pollInte = this.constructor.pollInterval, min = _constructor$pollInte.min, max = _constructor$pollInte.max, multiplier = _constructor$pollInte.multiplier;
            var interval = multiplier * Math.log(this.reconnectAttempts + 1);
            return Math.round(clamp(interval, min, max) * 1e3);
          };
          ConnectionMonitor2.prototype.reconnectIfStale = function reconnectIfStale() {
            if (this.connectionIsStale()) {
              logger.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + secondsSince(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
              this.reconnectAttempts++;
              if (this.disconnectedRecently()) {
                logger.log("ConnectionMonitor skipping reopening recent disconnect");
              } else {
                logger.log("ConnectionMonitor reopening");
                this.connection.reopen();
              }
            }
          };
          ConnectionMonitor2.prototype.connectionIsStale = function connectionIsStale() {
            return secondsSince(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
          };
          ConnectionMonitor2.prototype.disconnectedRecently = function disconnectedRecently() {
            return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
          };
          ConnectionMonitor2.prototype.visibilityDidChange = function visibilityDidChange() {
            var _this2 = this;
            if (document.visibilityState === "visible") {
              setTimeout(function() {
                if (_this2.connectionIsStale() || !_this2.connection.isOpen()) {
                  logger.log("ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " + document.visibilityState);
                  _this2.connection.reopen();
                }
              }, 200);
            }
          };
          return ConnectionMonitor2;
        }();
        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30,
          multiplier: 5
        };
        ConnectionMonitor.staleThreshold = 6;
        var INTERNAL = {
          message_types: {
            welcome: "welcome",
            disconnect: "disconnect",
            ping: "ping",
            confirmation: "confirm_subscription",
            rejection: "reject_subscription"
          },
          disconnect_reasons: {
            unauthorized: "unauthorized",
            invalid_request: "invalid_request",
            server_restart: "server_restart"
          },
          default_mount_path: "/cable",
          protocols: ["actioncable-v1-json", "actioncable-unsupported"]
        };
        var message_types = INTERNAL.message_types, protocols = INTERNAL.protocols;
        var supportedProtocols = protocols.slice(0, protocols.length - 1);
        var indexOf = [].indexOf;
        var Connection = function() {
          function Connection2(consumer2) {
            classCallCheck(this, Connection2);
            this.open = this.open.bind(this);
            this.consumer = consumer2;
            this.subscriptions = this.consumer.subscriptions;
            this.monitor = new ConnectionMonitor(this);
            this.disconnected = true;
          }
          Connection2.prototype.send = function send(data) {
            if (this.isOpen()) {
              this.webSocket.send(JSON.stringify(data));
              return true;
            } else {
              return false;
            }
          };
          Connection2.prototype.open = function open() {
            if (this.isActive()) {
              logger.log("Attempted to open WebSocket, but existing socket is " + this.getState());
              return false;
            } else {
              logger.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + protocols);
              if (this.webSocket) {
                this.uninstallEventHandlers();
              }
              this.webSocket = new adapters.WebSocket(this.consumer.url, protocols);
              this.installEventHandlers();
              this.monitor.start();
              return true;
            }
          };
          Connection2.prototype.close = function close() {
            var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
              allowReconnect: true
            }, allowReconnect = _ref.allowReconnect;
            if (!allowReconnect) {
              this.monitor.stop();
            }
            if (this.isActive()) {
              return this.webSocket.close();
            }
          };
          Connection2.prototype.reopen = function reopen() {
            logger.log("Reopening WebSocket, current state is " + this.getState());
            if (this.isActive()) {
              try {
                return this.close();
              } catch (error) {
                logger.log("Failed to reopen WebSocket", error);
              } finally {
                logger.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
                setTimeout(this.open, this.constructor.reopenDelay);
              }
            } else {
              return this.open();
            }
          };
          Connection2.prototype.getProtocol = function getProtocol() {
            if (this.webSocket) {
              return this.webSocket.protocol;
            }
          };
          Connection2.prototype.isOpen = function isOpen() {
            return this.isState("open");
          };
          Connection2.prototype.isActive = function isActive() {
            return this.isState("open", "connecting");
          };
          Connection2.prototype.isProtocolSupported = function isProtocolSupported() {
            return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
          };
          Connection2.prototype.isState = function isState() {
            for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
              states[_key] = arguments[_key];
            }
            return indexOf.call(states, this.getState()) >= 0;
          };
          Connection2.prototype.getState = function getState() {
            if (this.webSocket) {
              for (var state in adapters.WebSocket) {
                if (adapters.WebSocket[state] === this.webSocket.readyState) {
                  return state.toLowerCase();
                }
              }
            }
            return null;
          };
          Connection2.prototype.installEventHandlers = function installEventHandlers() {
            for (var eventName in this.events) {
              var handler = this.events[eventName].bind(this);
              this.webSocket["on" + eventName] = handler;
            }
          };
          Connection2.prototype.uninstallEventHandlers = function uninstallEventHandlers() {
            for (var eventName in this.events) {
              this.webSocket["on" + eventName] = function() {
              };
            }
          };
          return Connection2;
        }();
        Connection.reopenDelay = 500;
        Connection.prototype.events = {
          message: function message(event) {
            if (!this.isProtocolSupported()) {
              return;
            }
            var _JSON$parse = JSON.parse(event.data), identifier = _JSON$parse.identifier, message2 = _JSON$parse.message, reason = _JSON$parse.reason, reconnect = _JSON$parse.reconnect, type = _JSON$parse.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.disconnect:
                logger.log("Disconnecting. Reason: " + reason);
                return this.close({
                  allowReconnect: reconnect
                });
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                this.subscriptions.confirmSubscription(identifier);
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message2);
            }
          },
          open: function open() {
            logger.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function close(event) {
            logger.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function error() {
            logger.log("WebSocket onerror event");
          }
        };
        var extend = function extend2(object, properties) {
          if (properties != null) {
            for (var key in properties) {
              var value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };
        var Subscription = function() {
          function Subscription2(consumer2) {
            var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            var mixin = arguments[2];
            classCallCheck(this, Subscription2);
            this.consumer = consumer2;
            this.identifier = JSON.stringify(params);
            extend(this, mixin);
          }
          Subscription2.prototype.perform = function perform(action) {
            var data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            data.action = action;
            return this.send(data);
          };
          Subscription2.prototype.send = function send(data) {
            return this.consumer.send({
              command: "message",
              identifier: this.identifier,
              data: JSON.stringify(data)
            });
          };
          Subscription2.prototype.unsubscribe = function unsubscribe() {
            return this.consumer.subscriptions.remove(this);
          };
          return Subscription2;
        }();
        var SubscriptionGuarantor = function() {
          function SubscriptionGuarantor2(subscriptions) {
            classCallCheck(this, SubscriptionGuarantor2);
            this.subscriptions = subscriptions;
            this.pendingSubscriptions = [];
          }
          SubscriptionGuarantor2.prototype.guarantee = function guarantee(subscription2) {
            if (this.pendingSubscriptions.indexOf(subscription2) == -1) {
              logger.log("SubscriptionGuarantor guaranteeing " + subscription2.identifier);
              this.pendingSubscriptions.push(subscription2);
            } else {
              logger.log("SubscriptionGuarantor already guaranteeing " + subscription2.identifier);
            }
            this.startGuaranteeing();
          };
          SubscriptionGuarantor2.prototype.forget = function forget(subscription2) {
            logger.log("SubscriptionGuarantor forgetting " + subscription2.identifier);
            this.pendingSubscriptions = this.pendingSubscriptions.filter(function(s) {
              return s !== subscription2;
            });
          };
          SubscriptionGuarantor2.prototype.startGuaranteeing = function startGuaranteeing() {
            this.stopGuaranteeing();
            this.retrySubscribing();
          };
          SubscriptionGuarantor2.prototype.stopGuaranteeing = function stopGuaranteeing() {
            clearTimeout(this.retryTimeout);
          };
          SubscriptionGuarantor2.prototype.retrySubscribing = function retrySubscribing() {
            var _this = this;
            this.retryTimeout = setTimeout(function() {
              if (_this.subscriptions && typeof _this.subscriptions.subscribe === "function") {
                _this.pendingSubscriptions.map(function(subscription2) {
                  logger.log("SubscriptionGuarantor resubscribing " + subscription2.identifier);
                  _this.subscriptions.subscribe(subscription2);
                });
              }
            }, 500);
          };
          return SubscriptionGuarantor2;
        }();
        var Subscriptions = function() {
          function Subscriptions2(consumer2) {
            classCallCheck(this, Subscriptions2);
            this.consumer = consumer2;
            this.guarantor = new SubscriptionGuarantor(this);
            this.subscriptions = [];
          }
          Subscriptions2.prototype.create = function create(channelName, mixin) {
            var channel = channelName;
            var params = (typeof channel === "undefined" ? "undefined" : _typeof(channel)) === "object" ? channel : {
              channel
            };
            var subscription2 = new Subscription(this.consumer, params, mixin);
            return this.add(subscription2);
          };
          Subscriptions2.prototype.add = function add(subscription2) {
            this.subscriptions.push(subscription2);
            this.consumer.ensureActiveConnection();
            this.notify(subscription2, "initialized");
            this.subscribe(subscription2);
            return subscription2;
          };
          Subscriptions2.prototype.remove = function remove2(subscription2) {
            this.forget(subscription2);
            if (!this.findAll(subscription2.identifier).length) {
              this.sendCommand(subscription2, "unsubscribe");
            }
            return subscription2;
          };
          Subscriptions2.prototype.reject = function reject(identifier) {
            var _this = this;
            return this.findAll(identifier).map(function(subscription2) {
              _this.forget(subscription2);
              _this.notify(subscription2, "rejected");
              return subscription2;
            });
          };
          Subscriptions2.prototype.forget = function forget(subscription2) {
            this.guarantor.forget(subscription2);
            this.subscriptions = this.subscriptions.filter(function(s) {
              return s !== subscription2;
            });
            return subscription2;
          };
          Subscriptions2.prototype.findAll = function findAll(identifier) {
            return this.subscriptions.filter(function(s) {
              return s.identifier === identifier;
            });
          };
          Subscriptions2.prototype.reload = function reload() {
            var _this2 = this;
            return this.subscriptions.map(function(subscription2) {
              return _this2.subscribe(subscription2);
            });
          };
          Subscriptions2.prototype.notifyAll = function notifyAll(callbackName) {
            var _this3 = this;
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return this.subscriptions.map(function(subscription2) {
              return _this3.notify.apply(_this3, [subscription2, callbackName].concat(args));
            });
          };
          Subscriptions2.prototype.notify = function notify(subscription2, callbackName) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }
            var subscriptions = void 0;
            if (typeof subscription2 === "string") {
              subscriptions = this.findAll(subscription2);
            } else {
              subscriptions = [subscription2];
            }
            return subscriptions.map(function(subscription3) {
              return typeof subscription3[callbackName] === "function" ? subscription3[callbackName].apply(subscription3, args) : void 0;
            });
          };
          Subscriptions2.prototype.subscribe = function subscribe(subscription2) {
            if (this.sendCommand(subscription2, "subscribe")) {
              this.guarantor.guarantee(subscription2);
            }
          };
          Subscriptions2.prototype.confirmSubscription = function confirmSubscription(identifier) {
            var _this4 = this;
            logger.log("Subscription confirmed " + identifier);
            this.findAll(identifier).map(function(subscription2) {
              return _this4.guarantor.forget(subscription2);
            });
          };
          Subscriptions2.prototype.sendCommand = function sendCommand(subscription2, command) {
            var identifier = subscription2.identifier;
            return this.consumer.send({
              command,
              identifier
            });
          };
          return Subscriptions2;
        }();
        var Consumer = function() {
          function Consumer2(url) {
            classCallCheck(this, Consumer2);
            this._url = url;
            this.subscriptions = new Subscriptions(this);
            this.connection = new Connection(this);
          }
          Consumer2.prototype.send = function send(data) {
            return this.connection.send(data);
          };
          Consumer2.prototype.connect = function connect() {
            return this.connection.open();
          };
          Consumer2.prototype.disconnect = function disconnect() {
            return this.connection.close({
              allowReconnect: false
            });
          };
          Consumer2.prototype.ensureActiveConnection = function ensureActiveConnection() {
            if (!this.connection.isActive()) {
              return this.connection.open();
            }
          };
          createClass(Consumer2, [{
            key: "url",
            get: function get$$1() {
              return createWebSocketURL(this._url);
            }
          }]);
          return Consumer2;
        }();
        function createWebSocketURL(url) {
          if (typeof url === "function") {
            url = url();
          }
          if (url && !/^wss?:/i.test(url)) {
            var a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        }
        function createConsumer2() {
          var url = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getConfig("url") || INTERNAL.default_mount_path;
          return new Consumer(url);
        }
        function getConfig(name) {
          var element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          if (element) {
            return element.getAttribute("content");
          }
        }
        exports2.Connection = Connection;
        exports2.ConnectionMonitor = ConnectionMonitor;
        exports2.Consumer = Consumer;
        exports2.INTERNAL = INTERNAL;
        exports2.Subscription = Subscription;
        exports2.Subscriptions = Subscriptions;
        exports2.SubscriptionGuarantor = SubscriptionGuarantor;
        exports2.adapters = adapters;
        exports2.createWebSocketURL = createWebSocketURL;
        exports2.logger = logger;
        exports2.createConsumer = createConsumer2;
        exports2.getConfig = getConfig;
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
      });
    }
  });

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

  // app/javascript/hotwire-livereload.js
  var import_actioncable = __toESM(require_action_cable());

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

  // app/javascript/hotwire-livereload.js
  var consumer = (0, import_actioncable.createConsumer)();
  var subscription = null;
  var createSubscription = () => consumer.subscriptions.create("Hotwire::Livereload::ReloadChannel", {
    received: hotwire_livereload_received_default,
    connected() {
      console.log("[Hotwire::Livereload] Websocket connected");
    },
    disconnected() {
      console.log("[Hotwire::Livereload] Websocket disconnected");
    }
  });
  subscription = createSubscription();
  document.addEventListener("turbo:load", () => {
    hotwire_livereload_scroll_position_default.restore();
    hotwire_livereload_scroll_position_default.remove();
    if (subscription) {
      consumer.subscriptions.remove(subscription);
      subscription = null;
    }
    subscription = createSubscription();
  });
})();
