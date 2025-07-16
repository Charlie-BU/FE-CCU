"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const utils_js_utils = require("../../utils/js/utils.js");
const _sfc_main = {
  data() {
    return {
      user: "",
      this_season: "",
      matches_length: "",
      win_length: "",
      lose_length: "",
      start_score: "",
      end_score: "",
      my_valid_posts_length: "",
      my_valid_train_length: 0,
      my_valid_questions_length: "",
      hide_this: utils_js_magic.magic()
    };
  },
  computed: {
    formatted_time() {
      if (this.this_season && this.this_season.start_time && this.this_season.end_time) {
        return [utils_js_utils.format_time(this.this_season.start_time), utils_js_utils.format_time(this.this_season.end_time)];
      } else {
        return ["", ""];
      }
    }
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    utils_js_api.uniRequest("POST", "get_this_season", null, "competition", (res) => {
      this.this_season = res.data.this_season;
      const data = {
        "my_id": this.user.id,
        "season_id": this.this_season.id
      };
      utils_js_api.uniRequest("POST", "get_user_season_recording", data, "user", (res2) => {
        this.matches_length = res2.data.matches_length;
        this.win_length = res2.data.win_length;
        this.lose_length = res2.data.lose_length;
        this.start_score = res2.data.start_score;
        this.end_score = res2.data.end_score;
      });
      utils_js_api.uniRequest("POST", "cal_active", { "user_id": this.user.id }, "user", (res2) => {
        this.my_valid_posts_length = res2.data.my_valid_posts_length;
        this.my_valid_questions_length = res2.data.my_valid_questions_length;
      });
    });
  },
  methods: {
    img_operation() {
      let avatarUrl = this.this_season.badge_url;
      if (avatarUrl) {
        common_vendor.wx$1.previewImage({
          urls: [avatarUrl],
          current: avatarUrl
        });
      }
    },
    active_instruction() {
      common_vendor.wx$1.showModal({
        title: "活跃度计算规则",
        content: "赛季活跃度反映用户在本赛季参加TJTT积分赛、参与约球、约教、提问等活动的频率。计算方式为：(本赛季完赛积分赛数 × 0.7 + 本赛季匹配成功约球帖数 × 0.1 + 本赛季被采纳提问问题数 × 0.1 + 本赛季约教成功次数 × 0.1) × 100。",
        showCancel: false,
        confirmText: "了解"
      });
    },
    standard_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/apps/standard"
      });
    },
    match_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/page_subjec/match/index"
      });
    },
    equipment_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.index.switchTab({
        url: "/pages/equipment/index"
      });
    },
    store_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.wx$1.showToast({
        title: "该功能暂未上线，敬请期待",
        icon: "none",
        duration: 1e3
      });
    },
    athlete_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/apps/athlete"
      });
    },
    match_forcast_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.wx$1.showToast({
        title: "该功能暂未上线，敬请期待",
        icon: "none",
        duration: 1e3
      });
    },
    chat_room_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.wx$1.showToast({
        title: "该功能暂未上线，敬请期待",
        icon: "none",
        duration: 1e3
      });
    },
    athlete_auth_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.wx$1.showToast({
        title: "该功能暂未上线，敬请期待",
        icon: "none",
        duration: 1e3
      });
    },
    TJTTers_page() {
      if (this.hide_this) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/apps/TJTTers"
      });
    },
    send_feedback() {
      if (this.hide_this) {
        return;
      }
      common_vendor.wx$1.showModal({
        title: "用户反馈",
        placeholderText: "提交后反馈内容将自动发送至TJTT邮箱",
        editable: true,
        confirmText: "提交",
        success: (res) => {
          if (res.confirm) {
            let data = {
              "my_id": this.user.id,
              "feedback": res.content
            };
            utils_js_api.uniRequest("POST", "send_feedback", data, "user", (res2) => {
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 1200
              });
            });
          }
        }
      });
    }
  },
  onPullDownRefresh() {
    common_vendor.index.reLaunch({
      url: "/pages/apps/index"
    });
    setTimeout(() => {
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.this_season.badge_url,
    b: common_vendor.o((...args) => $options.img_operation && $options.img_operation(...args)),
    c: common_vendor.t($data.this_season.season_name),
    d: common_vendor.t($options.formatted_time[0].split(" ")[0]),
    e: common_vendor.t($options.formatted_time[1].split(" ")[0]),
    f: common_vendor.t($data.matches_length),
    g: common_vendor.t($data.win_length),
    h: common_vendor.t($data.lose_length),
    i: common_vendor.t($data.end_score - $data.start_score > 0 ? "+" : ""),
    j: common_vendor.t($data.end_score - $data.start_score),
    k: common_vendor.t($data.user.active),
    l: common_vendor.o((...args) => $options.active_instruction && $options.active_instruction(...args)),
    m: common_vendor.t($data.my_valid_posts_length),
    n: common_vendor.t($data.my_valid_train_length),
    o: common_vendor.t($data.my_valid_questions_length),
    p: common_vendor.o((...args) => $options.standard_page && $options.standard_page(...args)),
    q: common_vendor.o((...args) => $options.match_page && $options.match_page(...args)),
    r: common_vendor.o((...args) => $options.equipment_page && $options.equipment_page(...args)),
    s: common_vendor.o((...args) => $options.athlete_page && $options.athlete_page(...args)),
    t: common_vendor.o((...args) => $options.match_forcast_page && $options.match_forcast_page(...args)),
    v: common_vendor.o((...args) => $options.store_page && $options.store_page(...args)),
    w: common_vendor.o((...args) => $options.chat_room_page && $options.chat_room_page(...args)),
    x: common_vendor.o((...args) => $options.athlete_auth_page && $options.athlete_auth_page(...args)),
    y: common_vendor.o((...args) => $options.TJTTers_page && $options.TJTTers_page(...args)),
    z: common_vendor.o((...args) => $options.send_feedback && $options.send_feedback(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ce4e1703"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/apps/index.js.map
