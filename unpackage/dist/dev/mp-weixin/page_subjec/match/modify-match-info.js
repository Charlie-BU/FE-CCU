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
      match: "",
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
    utils_js_api.uniRequest("POST", "fetch_organs", null, "competition", (res) => {
      this.organs = res.data.organs;
      common_vendor.wx$1.hideToast();
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
    modify() {
      common_vendor.wx$1.showToast({
        title: "修改中",
        icon: "loading",
        duration: 1e5
      });
      let data = {
        "my_id": this.user.id,
        "match_id": this.match.id,
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
      utils_js_api.uniRequest("POST", "modify_match_info", data, "competition", (res) => {
        common_vendor.wx$1.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1e3
        });
        if (res.data.status == 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/page_subjec/match/detail"
            });
          }, 1e3);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.backref()),
    c: $data.match.title,
    d: $data.title,
    e: common_vendor.o(($event) => $data.title = $event.detail.value),
    f: $data.match.description,
    g: $data.description,
    h: common_vendor.o(($event) => $data.description = $event.detail.value),
    i: $data.match.match_type == "男子单打"
  }, $data.match.match_type == "男子单打" ? {} : {}, {
    j: $data.match.match_type == "女子单打"
  }, $data.match.match_type == "女子单打" ? {} : {}, {
    k: $data.match.match_type == "混合单打"
  }, $data.match.match_type == "混合单打" ? {} : {}, {
    l: $data.match.match_type == "男子团体"
  }, $data.match.match_type == "男子团体" ? {} : {}, {
    m: $data.match.match_type == "女子团体"
  }, $data.match.match_type == "女子团体" ? {} : {}, {
    n: $data.match.match_type == "混合团体"
  }, $data.match.match_type == "混合团体" ? {} : {}, {
    o: common_vendor.o((...args) => $options.which_match_type && $options.which_match_type(...args)),
    p: $data.match.system == "小组循环赛+淘汰赛"
  }, $data.match.system == "小组循环赛+淘汰赛" ? {} : {}, {
    q: $data.match.system == "淘汰赛"
  }, $data.match.system == "淘汰赛" ? {} : {}, {
    r: $data.match.system == "大循环"
  }, $data.match.system == "大循环" ? {} : {}, {
    s: $data.match.system == "小组循环赛（不决名次）"
  }, $data.match.system == "小组循环赛（不决名次）" ? {} : {}, {
    t: $data.match.system == "其他"
  }, $data.match.system == "其他" ? {} : {}, {
    v: common_vendor.o((...args) => $options.which_system && $options.which_system(...args)),
    w: $data.user.address,
    x: $data.address,
    y: common_vendor.o(($event) => $data.address = $event.detail.value),
    z: common_vendor.f(this.organs, (organ, index, i0) => {
      return common_vendor.e({
        a: $data.match.organ_id == organ.id
      }, $data.match.organ_id == organ.id ? {
        b: organ.id,
        c: common_vendor.t(organ.organname)
      } : {
        d: organ.id,
        e: common_vendor.t(organ.organname)
      }, {
        f: index
      });
    }),
    A: common_vendor.o((...args) => $options.which_organ_id && $options.which_organ_id(...args)),
    B: $data.match_time,
    C: common_vendor.o(($event) => $data.match_time = $event.detail.value),
    D: $data.match.place,
    E: $data.place,
    F: common_vendor.o(($event) => $data.place = $event.detail.value),
    G: $data.sign_start_time,
    H: common_vendor.o(($event) => $data.sign_start_time = $event.detail.value),
    I: $data.sign_end_time,
    J: common_vendor.o(($event) => $data.sign_end_time = $event.detail.value),
    K: $data.match.participant,
    L: $data.participant,
    M: common_vendor.o(($event) => $data.participant = $event.detail.value),
    N: $data.match.fee,
    O: $data.fee,
    P: common_vendor.o(($event) => $data.fee = $event.detail.value),
    Q: $data.match.restriction == "无限制"
  }, $data.match.restriction == "无限制" ? {} : {}, {
    R: $data.match.restriction == "限制（仅）男子"
  }, $data.match.restriction == "限制（仅）男子" ? {} : {}, {
    S: $data.match.restriction == "限制（仅）女子"
  }, $data.match.restriction == "限制（仅）女子" ? {} : {}, {
    T: $data.match.restriction == "限制（仅）学生"
  }, $data.match.restriction == "限制（仅）学生" ? {} : {}, {
    U: $data.match.restriction == "限制（仅）教师"
  }, $data.match.restriction == "限制（仅）教师" ? {} : {}, {
    V: $data.match.restriction == "积分限制"
  }, $data.match.restriction == "积分限制" ? {} : {}, {
    W: $data.match.restriction == "积分限制"
  }, $data.match.restriction == "积分限制" ? {
    X: $data.match.score_min,
    Y: $data.score_min,
    Z: common_vendor.o(($event) => $data.score_min = $event.detail.value),
    aa: $data.match.score_max,
    ab: $data.score_max,
    ac: common_vendor.o(($event) => $data.score_max = $event.detail.value)
  } : {
    ad: $data.score_min,
    ae: common_vendor.o(($event) => $data.score_min = $event.detail.value),
    af: $data.score_max,
    ag: common_vendor.o(($event) => $data.score_max = $event.detail.value)
  }, {
    ah: common_vendor.o((...args) => $options.which_restriction && $options.which_restriction(...args)),
    ai: $data.match.prize_for_first,
    aj: $data.prize_for_first,
    ak: common_vendor.o(($event) => $data.prize_for_first = $event.detail.value),
    al: $data.match.prize_for_second,
    am: $data.prize_for_second,
    an: common_vendor.o(($event) => $data.prize_for_second = $event.detail.value),
    ao: $data.match.prize_for_third,
    ap: $data.prize_for_third,
    aq: common_vendor.o(($event) => $data.prize_for_third = $event.detail.value),
    ar: $data.match.additional_info,
    as: $data.additional_info,
    at: common_vendor.o(($event) => $data.additional_info = $event.detail.value),
    av: common_vendor.o((...args) => $options.modify && $options.modify(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/match/modify-match-info.js.map
