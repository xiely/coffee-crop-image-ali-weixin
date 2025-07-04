"use strict";
const common_vendor = require("../common/vendor.js");
const TokenKey = "App-Token";
function getToken() {
  return common_vendor.index.getStorageSync(TokenKey);
}
exports.getToken = getToken;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
