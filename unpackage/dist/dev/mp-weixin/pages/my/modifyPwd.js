"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const _sfc_main = {
  __name: "modifyPwd",
  setup(__props) {
    const briefUserInfo = common_vendor.ref(null);
    common_vendor.onMounted(async () => {
      await utils_js_loginCheck.onlyLoginedAccess();
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const form = common_vendor.ref({
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null
    });
    const modifySubmit = async () => {
      if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmNewPassword) {
        common_vendor.index.showToast({
          title: "请输入完整",
          icon: "none",
          duration: 1e3
        });
        return;
      }
      if (form.value.newPassword !== form.value.confirmNewPassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none",
          duration: 1e3
        });
        return;
      }
      if (form.value.oldPassword === form.value.newPassword) {
        common_vendor.index.showToast({
          title: "原密码与新密码相同",
          icon: "none",
          duration: 1e3
        });
        return;
      }
      common_vendor.index.showToast({
        title: "修改中",
        icon: "loading",
        duration: 1e5
      });
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/modifyPassword", data);
      common_vendor.index.showToast({
        title: res.message,
        icon: "none",
        duration: 1e3
      });
      if (res.status === 200) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: `/pages/my/index`
          });
        }, 1e3);
      }
    };
    return (_ctx, _cache) => {
      var _a;
      return {
        a: common_assets._imports_0$2,
        b: common_vendor.o(goBack),
        c: (_a = briefUserInfo.value) == null ? void 0 : _a.username,
        d: form.value.oldPassword,
        e: common_vendor.o(($event) => form.value.oldPassword = $event.detail.value),
        f: form.value.newPassword,
        g: common_vendor.o(($event) => form.value.newPassword = $event.detail.value),
        h: form.value.confirmNewPassword,
        i: common_vendor.o(($event) => form.value.confirmNewPassword = $event.detail.value),
        j: common_vendor.o(modifySubmit)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/modifyPwd.js.map
