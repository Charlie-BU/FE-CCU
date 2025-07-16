"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  data() {
    return {
      user: "",
      author: "",
      content: "",
      mottos: "",
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
  },
  methods: {
    add() {
      let data = {
        "author": this.author,
        "content": this.content,
        "user_id": this.user.id
      };
      utils_js_api.uniRequest("POST", "add_motto", data, "application", (res) => {
        common_vendor.wx$1.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1e3
        });
        if (res.data.status == 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/management/index"
            });
          }, 1e3);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.author,
    b: common_vendor.o(($event) => $data.author = $event.detail.value),
    c: $data.content,
    d: common_vendor.o(($event) => $data.content = $event.detail.value),
    e: common_vendor.o((...args) => $options.add && $options.add(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/motto/add-motto.js.map
