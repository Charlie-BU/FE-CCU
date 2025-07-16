"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("./api.js");
const loginCheck = async () => {
  const sessionid = common_vendor.index.getStorageSync("sessionid");
  if (!sessionid) {
    common_vendor.index.__f__("log", "at utils/js/loginCheck.js:8", "用户未登录");
    common_vendor.index.clearStorageSync();
    return null;
  }
  const res = await utils_js_api.uniRequest("POST", "user", "/loginCheck", {
    sessionid
  });
  common_vendor.index.__f__("log", "at utils/js/loginCheck.js:15", res.message);
  if (res.status !== 200) {
    common_vendor.index.clearStorageSync();
    return null;
  }
  return {
    id: res.data.id,
    username: res.data.username,
    usertype: res.data.usertype
  };
};
const getUserInfo = async () => {
  const res = await utils_js_api.uniRequest("POST", "user", "/getUserInfo", { sessionid: common_vendor.index.getStorageSync("sessionid") });
  if (res.status === 200) {
    return res.user;
  }
};
const onlyLoginedAccess = async () => {
  const briefUserInfo = await loginCheck();
  if (!briefUserInfo) {
    common_vendor.index.showToast({
      title: "请登录",
      icon: "none",
      duration: 1e3
    });
    setTimeout(() => {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }, 1e3);
  }
};
exports.getUserInfo = getUserInfo;
exports.loginCheck = loginCheck;
exports.onlyLoginedAccess = onlyLoginedAccess;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/js/loginCheck.js.map
