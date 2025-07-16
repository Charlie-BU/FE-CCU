"use strict";
const common_vendor = require("../../common/vendor.js");
let release = "https://charlie.black";
let run = release;
const uniRequest = (method = "GET", blue = null, url = null, data = null, headers = null) => {
  let fullURL = run + "/" + blue + url;
  if (method === "GET" && data) {
    const params = new URLSearchParams(data).toString();
    fullURL += "?" + params;
    data = null;
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: fullURL,
      method,
      header: {
        "Content-Type": "application/json",
        ...headers || {}
      },
      data: method === "GET" ? data : JSON.stringify(data),
      dataType: "json",
      sslVerify: false,
      withCredentials: false,
      firstIpv4: false,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "服务器繁忙，请稍后再试",
          icon: "none",
          duration: 1e3
        });
        reject(err);
      }
    });
  });
};
exports.uniRequest = uniRequest;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/js/api.js.map
