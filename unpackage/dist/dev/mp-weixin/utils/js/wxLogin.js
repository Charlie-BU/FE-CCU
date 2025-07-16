"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("./api.js");
const getTempCode = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.login({
      provider: "weixin",
      onlyAuthorize: true,
      success: (res) => {
        if (res)
          resolve(res);
        else {
          common_vendor.index.__f__("log", "at utils/js/wxLogin.js:12", "openid获取失败");
          reject(res);
        }
      },
      fail: (e) => {
        common_vendor.index.__f__("log", "at utils/js/wxLogin.js:17", "openid获取失败");
        reject(e);
      }
    });
  });
};
const getOpenidAndSessionKey = async () => {
  const response = await getTempCode();
  if (response.code) {
    const res = await utils_js_api.uniRequest("POST", "user", "/getOpenidAndSessionKey", { tempCode: response.code });
    common_vendor.index.__f__("log", "at utils/js/wxLogin.js:28", res.message);
    if (res.status !== 200) {
      return null;
    }
    return [res.openid, res.session_key];
  }
  return null;
};
exports.getOpenidAndSessionKey = getOpenidAndSessionKey;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/js/wxLogin.js.map
