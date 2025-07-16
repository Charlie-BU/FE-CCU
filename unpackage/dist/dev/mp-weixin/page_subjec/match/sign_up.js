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
      team_id: "",
      agree: "",
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
  },
  methods: {
    which_team(e) {
      this.team_id = e.detail.value;
    },
    whether_agree(e) {
      this.agree = e.detail.value;
    },
    backref() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    sign_up() {
      if (this.agree !== "agreed") {
        common_vendor.wx$1.showToast({
          title: "请阅读并同意承诺书",
          icon: "none",
          duration: 1e3
        });
        return;
      }
      if (this.match.fee > 0) {
        this.initiate_payment();
      } else {
        this.confirm_sign_up();
      }
    },
    initiate_payment() {
    },
    // 确认报名流程
    confirm_sign_up() {
      common_vendor.wx$1.showToast({
        title: "报名中",
        icon: "loading",
        duration: 1e5
      });
      const data = {
        match_id: this.match.id,
        user_id: this.user.id,
        team_id: parseInt(this.team_id),
        agree: this.agree
      };
      utils_js_api.uniRequest("POST", "match_sign_up", data, "competition", (res) => {
        common_vendor.wx$1.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1e3
        });
        if (res.data.status === 200) {
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
  return common_vendor.e({
    a: $data.user.username,
    b: $data.user.phone,
    c: $data.user.role,
    d: $data.user.score,
    e: $data.match
  }, $data.match ? {
    f: $data.match.title
  } : {}, {
    g: $data.match
  }, $data.match ? {
    h: $data.match.restriction
  } : {}, {
    i: isNaN($data.match.participant - $data.match.players_length)
  }, isNaN($data.match.participant - $data.match.players_length) ? {} : {
    j: $data.match.participant - $data.match.players_length
  }, {
    k: $data.match.teams_length != 0
  }, $data.match.teams_length != 0 ? {
    l: common_vendor.f($data.match.teams, (team_x, index, i0) => {
      return {
        a: team_x.id,
        b: common_vendor.t(team_x.teamname),
        c: index
      };
    }),
    m: $data.message,
    n: common_vendor.o((...args) => $options.which_team && $options.which_team(...args))
  } : {}, {
    o: common_vendor.t($data.match.fee),
    p: common_vendor.t($data.user.username),
    q: common_vendor.o((...args) => $options.whether_agree && $options.whether_agree(...args)),
    r: common_vendor.o((...args) => $options.sign_up && $options.sign_up(...args)),
    s: common_vendor.o((...args) => $options.backref && $options.backref(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/match/sign_up.js.map
