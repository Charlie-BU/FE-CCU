"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      message: "",
      user: "",
      update_match_type: "",
      match_title: "",
      winner1: "",
      winner2: "",
      loser1: "",
      loser2: "",
      result: "",
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    this.update_match_type = common_vendor.index.getStorageSync("update_match_type");
    common_vendor.index.removeStorageSync("update_match_type");
  },
  methods: {
    onInput(e) {
      this.match_title = e.target.value;
      this.winner1 = e.target.value;
      this.loser1 = e.target.value;
      this.winner2 = e.target.value;
      this.loser2 = e.target.value;
    },
    what_result(e) {
      this.result = e.detail.value;
    },
    backref() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    confirm_single() {
      common_vendor.wx$1.showModal({
        title: "确认更新",
        content: "比分录入后选手积分自动计算，该操作不可逆，请务必确认对阵双方及比分正确",
        success: (res) => {
          if (res.confirm) {
            common_vendor.wx$1.showToast({
              title: "计算中",
              icon: "loading",
              duration: 1e5
            });
            let data = {
              "my_id": this.user.id,
              "match_title": this.match_title,
              "winner1": this.winner1,
              "loser1": this.loser1,
              "result": this.result
            };
            utils_js_api.uniRequest("POST", "score_update_single", data, "competition", (res2) => {
              common_vendor.index.__f__("log", "at page_subjec/match/score-update.vue:159", res2.data.message);
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 700
              });
            });
          }
        }
      });
    },
    confirm_double() {
      common_vendor.wx$1.showModal({
        title: "确认更新",
        content: "比分录入后选手积分自动计算，该操作不可逆，请务必确认对阵双方及比分正确",
        success: (res) => {
          if (res.confirm) {
            common_vendor.wx$1.showToast({
              title: "计算中",
              icon: "loading",
              duration: 1e5
            });
            let data = {
              "my_id": this.user.id,
              "match_title": this.match_title,
              "winner1": this.winner1,
              "loser1": this.loser1,
              "winner2": this.winner2,
              "loser2": this.loser2,
              "result": this.result
            };
            utils_js_api.uniRequest("POST", "score_update_double", data, "competition", (res2) => {
              common_vendor.index.__f__("log", "at page_subjec/match/score-update.vue:192", res2.data.message);
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 700
              });
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.backref()),
    c: $data.update_match_type == "single"
  }, $data.update_match_type == "single" ? {
    d: $data.winner1,
    e: common_vendor.o(($event) => $data.winner1 = $event.detail.value)
  } : {}, {
    f: $data.update_match_type == "single"
  }, $data.update_match_type == "single" ? {
    g: $data.loser1,
    h: common_vendor.o(($event) => $data.loser1 = $event.detail.value)
  } : {}, {
    i: $data.update_match_type == "double"
  }, $data.update_match_type == "double" ? {
    j: $data.winner1,
    k: common_vendor.o(($event) => $data.winner1 = $event.detail.value)
  } : {}, {
    l: $data.update_match_type == "double"
  }, $data.update_match_type == "double" ? {
    m: $data.winner2,
    n: common_vendor.o(($event) => $data.winner2 = $event.detail.value)
  } : {}, {
    o: $data.update_match_type == "double"
  }, $data.update_match_type == "double" ? {
    p: $data.loser1,
    q: common_vendor.o(($event) => $data.loser1 = $event.detail.value)
  } : {}, {
    r: $data.update_match_type == "double"
  }, $data.update_match_type == "double" ? {
    s: $data.loser2,
    t: common_vendor.o(($event) => $data.loser2 = $event.detail.value)
  } : {}, {
    v: common_vendor.o((...args) => $options.what_result && $options.what_result(...args)),
    w: $data.match_title,
    x: common_vendor.o(($event) => $data.match_title = $event.detail.value),
    y: $data.update_match_type == "single"
  }, $data.update_match_type == "single" ? {
    z: common_vendor.o((...args) => $options.confirm_single && $options.confirm_single(...args))
  } : {}, {
    A: $data.update_match_type == "double"
  }, $data.update_match_type == "double" ? {
    B: common_vendor.o((...args) => $options.confirm_double && $options.confirm_double(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/match/score-update.js.map
