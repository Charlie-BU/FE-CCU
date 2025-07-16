"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  data() {
    return {
      message: "",
      user: "",
      match: "",
      player_x: "",
      player_y: "",
      result: "",
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    common_vendor.wx$1.showToast({
      title: "加载中",
      icon: "loading",
      duration: 1e5
    });
    let match_id = common_vendor.index.getStorageSync("match_id");
    utils_js_api.uniRequest("POST", "get_this_match", { "match_id": match_id }, "competition", (res) => {
      this.match = res.data.match;
      common_vendor.wx$1.hideToast();
    });
    this.player_x = common_vendor.index.getStorageSync("player_x");
    this.player_y = common_vendor.index.getStorageSync("player_y");
    if (!this.player_x || !this.player_y) {
      common_vendor.wx$1.showToast({
        title: "服务器繁忙，请稍后再试",
        icon: "none",
        duration: 1500
      });
      setTimeout(() => {
        common_vendor.index.navigateBack({
          delta: 1
        });
      }, 1e3);
    }
    common_vendor.index.removeStorageSync("player_x");
    common_vendor.index.removeStorageSync("player_y");
  },
  methods: {
    what_result(e) {
      this.result = e.detail.value;
    },
    confirm_record() {
      if (!this.result) {
        common_vendor.wx$1.showToast({
          title: "请选择比分",
          icon: "none",
          duration: 1e3
        });
      } else {
        common_vendor.wx$1.showModal({
          title: "确认录入",
          content: "成绩录入后选手积分自动计算，该操作不可逆，请务必确认对阵双方及比分正确",
          success: (res) => {
            if (res.confirm) {
              common_vendor.wx$1.showToast({
                title: "计算中",
                icon: "loading",
                duration: 1e5
              });
              let data = {
                "my_id": this.user.id,
                "match_id": this.match.id,
                "player_x_id": this.player_x.id,
                "player_y_id": this.player_y.id,
                "result": this.result
              };
              utils_js_api.uniRequest("POST", "result_record", data, "competition", (res2) => {
                common_vendor.index.__f__("log", "at page_subjec/match/result-record.vue:172", res2.data.message);
                common_vendor.wx$1.showToast({
                  title: res2.data.message,
                  icon: "none",
                  duration: 1e3
                });
                if (res2.data.status == 200) {
                  utils_js_api.uniRequest("POST", "refresh", { "my_id": this.user.id }, "user", (res3) => {
                    common_vendor.index.setStorageSync("user", res3.data.user);
                    common_vendor.index.setStorageSync("my_rank", res3.data.my_rank);
                  });
                  setTimeout(() => {
                    common_vendor.index.navigateBack({
                      delta: 1
                    });
                  }, 1e3);
                }
              });
            }
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.match.title),
    b: common_vendor.t($data.match.system),
    c: common_vendor.t($data.player_x.username),
    d: common_vendor.t($data.player_y.username),
    e: common_vendor.o((...args) => $options.what_result && $options.what_result(...args)),
    f: common_vendor.o((...args) => $options.confirm_record && $options.confirm_record(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-30e9766d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/match/result-record.js.map
