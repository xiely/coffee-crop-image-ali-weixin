"use strict";
const common_vendor = require("../common/vendor.js");
function toast(content) {
  common_vendor.index.showToast({
    icon: "none",
    title: content
  });
}
function showConfirm(content) {
  return new Promise((resolve, reject) => {
    common_vendor.index.showModal({
      title: "提示",
      content,
      cancelText: "取消",
      confirmText: "确定",
      success: function(res) {
        resolve(res);
      }
    });
  });
}
function tansParams(params) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof value[key] !== "undefined") {
            let params2 = propName + "[" + key + "]";
            var subPart = encodeURIComponent(params2) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}
exports.showConfirm = showConfirm;
exports.tansParams = tansParams;
exports.toast = toast;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/common.js.map
