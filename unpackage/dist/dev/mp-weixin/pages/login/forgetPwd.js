"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  __name: "forgetPwd",
  setup(__props) {
    const show = utils_js_magic.magic();
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const username = common_vendor.ref("");
    const workNum = common_vendor.ref("");
    const captcha = common_vendor.ref("");
    let captchaText = common_vendor.ref("获取验证码");
    let isWaiting = false;
    const sendEmailCaptcha = async () => {
      if (isWaiting)
        return;
      common_vendor.index.showToast({
        title: "发送中",
        icon: "loading",
        duration: 1e4
      });
      const data = {
        username: username.value,
        workNum: workNum.value
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/sendEmailCaptcha", data);
      if (res.status !== 200) {
        common_vendor.index.showToast({
          title: res.message,
          icon: "none",
          duration: 700
        });
        return;
      }
      captchaText.value = "发送中";
      isWaiting = true;
      common_vendor.index.hideToast();
      setTimer();
    };
    let timer = null;
    const setTimer = () => {
      let holdTime = 60;
      captchaText.value = "60秒";
      timer = setInterval(() => {
        if (holdTime <= 0) {
          isWaiting = false;
          captchaText.value = "获取验证码";
          clearInterval(timer);
          return;
        }
        captchaText.value = holdTime + "秒";
        holdTime--;
      }, 1e3);
    };
    const confirm = async () => {
      if (!username.value || !workNum.value || !captcha.value) {
        common_vendor.index.showToast({
          title: "请输入完整",
          icon: "none",
          duration: 800
        });
        return;
      }
      common_vendor.index.showToast({
        title: "请稍后",
        icon: "loading",
        duration: 1e4
      });
      const data = {
        username: username.value,
        workNum: workNum.value,
        captcha: captcha.value
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/resetPassword", data);
      if (res.status !== 200) {
        common_vendor.index.showToast({
          title: res.message,
          icon: "none",
          duration: 700
        });
        return;
      }
      common_vendor.index.showToast({
        title: res.message,
        icon: "none",
        duration: 2e3
      });
      setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }, 2e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.o(goBack),
        c: common_vendor.unref(show)
      }, common_vendor.unref(show) ? {
        d: username.value,
        e: common_vendor.o(($event) => username.value = $event.detail.value),
        f: workNum.value,
        g: common_vendor.o(($event) => workNum.value = $event.detail.value),
        h: captcha.value,
        i: common_vendor.o(($event) => captcha.value = $event.detail.value),
        j: common_vendor.t(common_vendor.unref(captchaText)),
        k: common_vendor.o(sendEmailCaptcha),
        l: common_vendor.o(confirm)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/forgetPwd.js.map
