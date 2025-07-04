"use strict";
const common_vendor = require("../common/vendor.js");
const config = require("../config.js");
const utils_auth = require("./auth.js");
const utils_errorCode = require("./errorCode.js");
const utils_common = require("./common.js");
let timeout = 1e4;
const baseUrl = config.config.baseUrl;
const request = (config2) => {
  const isToken = (config2.header || {}).isToken === false;
  config2.header = config2.header || {};
  if (utils_auth.getToken() && !isToken) {
    config2.header["Authorization"] = utils_auth.getToken();
  }
  if (config2.params) {
    let url = config2.url + "?" + utils_common.tansParams(config2.params);
    url = url.slice(0, -1);
    config2.url = url;
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      method: config2.method || "get",
      timeout: config2.timeout || timeout,
      url: config2.baseUrl ? config2.baseUrl + config2.url : baseUrl + config2.url,
      data: config2.data,
      header: config2.header,
      dataType: "json"
    }).then((resArr) => {
      let error, res;
      if (Array.isArray(resArr)) {
        [error, res] = resArr;
      } else {
        error = null;
        res = resArr;
      }
      if (error) {
        reject("后端接口连接异常");
        return;
      }
      if (!res || !res.data) {
        reject("无响应数据");
        return;
      }
      const code = res.data.code || 200;
      const msg = utils_errorCode.errorCode[code] || res.data.msg || res.data.message || utils_errorCode.errorCode["default"];
      if (res.data == "404 page not found") {
        reject("404 page not found");
        utils_common.toast("404 page not found");
        return;
      }
      if (code === 401) {
        utils_common.showConfirm("登录状态已过期，您可以继续留在该页面，或者重新登录?").then((res2) => {
          if (res2.confirm)
            ;
        });
        reject("无效的会话，或者会话已过期，请重新登录。");
      } else if (code === 500) {
        reject("500");
      } else if (code !== "SUCCESS" && code !== 200) {
        utils_common.toast(msg);
        reject(code.message || msg || code);
      } else {
        resolve(res.data);
      }
    }).catch((error) => {
      let message = error && error.message ? error.message : String(error);
      if (message === "Network Error") {
        message = "后端接口连接异常";
      } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
      } else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
      }
      utils_common.toast(message);
      reject(error);
    });
  });
};
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
