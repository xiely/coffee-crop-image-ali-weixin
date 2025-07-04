"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
function random(data) {
  return utils_request.request({
    url: "/gwop/refreshToken",
    method: "get",
    data
  });
}
function orderId(data) {
  return utils_request.request({
    url: "/gwop/order/orderMakeToken",
    method: "get",
    data
  });
}
function flowerSet(data) {
  common_vendor.index.__f__("log", "at api/index.js:39", data, "flowerSet data");
  let obj = JSON.parse(JSON.stringify(data));
  delete obj.randomId;
  return utils_request.request({
    url: `/gwop/order/flowerSet?randomId=${data.randomId}`,
    method: "post",
    data: {
      data: obj
    }
  });
}
exports.flowerSet = flowerSet;
exports.orderId = orderId;
exports.random = random;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
