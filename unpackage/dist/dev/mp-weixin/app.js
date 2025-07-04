"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/login.js";
  "./pages/index/confirm.js";
}
const _sfc_main = {
  onLaunch: function(options) {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch", options);
    this.setTokenFromOptions(options);
  },
  onShow: function(options) {
    common_vendor.index.__f__("log", "at App.vue:8", "App Show", options);
    this.setTokenFromOptions(options);
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Hide");
  },
  globalData: {
    token: ""
  },
  methods: {
    setTokenFromOptions(options) {
      let scene = "";
      if (options && options.query && options.query.scene) {
        scene = options.query.scene;
      } else if (options && options.scene) {
        scene = options.scene;
      }
      if (scene) {
        this.globalData.token = decodeURIComponent(scene);
        common_vendor.index.__f__("log", "at App.vue:28", "Token set:", this.globalData.token);
      }
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
