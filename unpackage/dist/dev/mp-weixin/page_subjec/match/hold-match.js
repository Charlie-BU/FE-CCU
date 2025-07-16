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
      organs: [],
      title: "",
      description: "",
      match_type: "",
      system: "",
      address: "",
      organ_id: "",
      match_time: "",
      place: "",
      sign_start_time: "",
      sign_end_time: "",
      participant: "",
      fee: "",
      restriction: "",
      prize_for_first: "",
      prize_for_second: "",
      prize_for_third: "",
      additional_info: "",
      score_min: "",
      score_max: "",
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    utils_js_api.uniRequest("POST", "fetch_organs", null, "competition", (res) => {
      this.organs = res.data.organs;
    });
  },
  methods: {
    onInput(e) {
      this.title = e.target.value;
      this.description = e.target.value;
      this.address = e.target.value;
      this.match_time = e.target.value;
      this.place = e.target.value;
      this.sign_start_time = e.target.value;
      this.sign_end_time = e.target.value;
      this.participant = e.target.value;
      this.fee = e.target.value;
      this.prize_for_first = e.target.value;
      this.prize_for_second = e.target.value;
      this.prize_for_third = e.target.value;
      this.additional_info = e.target.value;
      this.score_min = e.target.value;
      this.score_max = e.target.value;
    },
    which_match_type(e) {
      this.match_type = e.detail.value;
    },
    which_system(e) {
      this.system = e.detail.value;
    },
    which_organ_id(e) {
      this.organ_id = parseInt(e.detail.value);
    },
    which_restriction(e) {
      this.restriction = e.detail.value;
    },
    backref() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    confirm_hold() {
      common_vendor.wx$1.showToast({
        title: "举办中",
        icon: "loading",
        duration: 1e5
      });
      let data = {
        "my_id": this.user.id,
        "title": this.title,
        "description": this.description,
        "match_type": this.match_type,
        "system": this.system,
        "address": this.address,
        "organ_id": this.organ_id,
        "match_time": this.match_time,
        "place": this.place,
        "sign_start_time": this.sign_start_time,
        "sign_end_time": this.sign_end_time,
        "participant": this.participant,
        "fee": this.fee,
        "restriction": this.restriction,
        "prize_for_first": this.prize_for_first,
        "prize_for_second": this.prize_for_second,
        "prize_for_third": this.prize_for_third,
        "additional_info": this.additional_info,
        "score_min": this.score_min,
        "score_max": this.score_max
      };
      utils_js_api.uniRequest("POST", "hold_match", data, "competition", (res) => {
        common_vendor.index.__f__("log", "at page_subjec/match/hold-match.vue:263", res.data.message);
        common_vendor.wx$1.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1e3
        });
        if (res.data.status == 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/page_subjec/match/index"
            });
          }, 1e3);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.backref()),
    c: $data.title,
    d: common_vendor.o(($event) => $data.title = $event.detail.value),
    e: $data.description,
    f: common_vendor.o(($event) => $data.description = $event.detail.value),
    g: common_vendor.o((...args) => $options.which_match_type && $options.which_match_type(...args)),
    h: common_vendor.o((...args) => $options.which_system && $options.which_system(...args)),
    i: $data.address,
    j: common_vendor.o(($event) => $data.address = $event.detail.value),
    k: common_vendor.f(this.organs, (organ, index, i0) => {
      return {
        a: organ.id,
        b: common_vendor.t(organ.organname),
        c: index
      };
    }),
    l: common_vendor.o((...args) => $options.which_organ_id && $options.which_organ_id(...args)),
    m: $data.match_time,
    n: common_vendor.o(($event) => $data.match_time = $event.detail.value),
    o: $data.place,
    p: common_vendor.o(($event) => $data.place = $event.detail.value),
    q: $data.sign_start_time,
    r: common_vendor.o(($event) => $data.sign_start_time = $event.detail.value),
    s: $data.sign_end_time,
    t: common_vendor.o(($event) => $data.sign_end_time = $event.detail.value),
    v: $data.participant,
    w: common_vendor.o(($event) => $data.participant = $event.detail.value),
    x: $data.fee,
    y: common_vendor.o(($event) => $data.fee = $event.detail.value),
    z: $data.score_min,
    A: common_vendor.o(($event) => $data.score_min = $event.detail.value),
    B: $data.score_max,
    C: common_vendor.o(($event) => $data.score_max = $event.detail.value),
    D: common_vendor.o((...args) => $options.which_restriction && $options.which_restriction(...args)),
    E: $data.prize_for_first,
    F: common_vendor.o(($event) => $data.prize_for_first = $event.detail.value),
    G: $data.prize_for_second,
    H: common_vendor.o(($event) => $data.prize_for_second = $event.detail.value),
    I: $data.prize_for_third,
    J: common_vendor.o(($event) => $data.prize_for_third = $event.detail.value),
    K: $data.additional_info,
    L: common_vendor.o(($event) => $data.additional_info = $event.detail.value),
    M: common_vendor.o((...args) => $options.confirm_hold && $options.confirm_hold(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/match/hold-match.js.map
