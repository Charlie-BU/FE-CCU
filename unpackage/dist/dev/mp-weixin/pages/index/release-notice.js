"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  __name: "release-notice",
  setup(__props) {
    const show = utils_js_magic.magic();
    const briefUserInfo = common_vendor.ref(null);
    common_vendor.onMounted(async () => {
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      await utils_js_loginCheck.onlyLoginedAccess();
    });
    const title = common_vendor.ref("");
    const content = common_vendor.ref("");
    const releaseNotice = async () => {
      common_vendor.index.showToast({
        title: "发布中",
        icon: "loading",
        duration: 1e5
      });
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        title: title.value,
        content: content.value
      };
      const res = await utils_js_api.uniRequest("POST", "extras", "/releaseNotice", data);
      common_vendor.index.showToast({
        title: res.message,
        icon: "none",
        duration: 800
      });
      if (res.status < 0)
        return;
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }, 800);
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.o(goBack),
        c: common_vendor.unref(show)
      }, common_vendor.unref(show) ? {
        d: (_a = briefUserInfo.value) == null ? void 0 : _a.username,
        e: title.value,
        f: common_vendor.o(($event) => title.value = $event.detail.value),
        g: content.value,
        h: common_vendor.o(($event) => content.value = $event.detail.value),
        i: common_vendor.o(releaseNotice)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-75c360d8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/release-notice.js.map
