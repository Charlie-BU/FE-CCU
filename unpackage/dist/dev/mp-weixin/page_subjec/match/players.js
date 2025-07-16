"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const _sfc_main = {
  data() {
    return {
      message: "",
      user: "",
      match: "",
      players: ""
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
    });
    utils_js_api.uniRequest("POST", "get_match_players", { "match_id": match_id }, "competition", (res) => {
      this.players = res.data.players;
      common_vendor.wx$1.hideToast();
    });
  },
  methods: {
    add_player() {
      common_vendor.wx$1.showModal({
        title: "添加参赛选手",
        placeholderText: "请输入选手姓名",
        editable: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.wx$1.showToast({
              title: "添加中",
              icon: "loading",
              duration: 1e5
            });
            let data = {
              "my_id": this.user.id,
              "match_id": this.match.id,
              "player_username": res.content
            };
            utils_js_api.uniRequest("POST", "add_player", data, "competition", (res2) => {
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 1e3
              });
              if (res2.data.status == 200) {
                utils_js_api.uniRequest("POST", "get_match_players", { "match_id": this.match.id }, "competition", (res3) => {
                  this.players = res3.data.players;
                });
              }
            });
          }
        }
      });
    },
    reset_present() {
      common_vendor.wx$1.showModal({
        title: "退签",
        content: "比赛已结束，确认将所有选手置为未签到状态？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.wx$1.showToast({
              title: "退签中",
              icon: "loading",
              duration: 1e5
            });
            let data = {
              "my_id": this.user.id,
              "match_id": this.match.id
            };
            utils_js_api.uniRequest("POST", "reset_present", data, "competition", (res2) => {
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 1e3
              });
              if (res2.data.status == 200) {
                utils_js_api.uniRequest("POST", "get_match_players", { "match_id": this.match.id }, "competition", (res3) => {
                  this.players = res3.data.players;
                });
              }
            });
          }
        }
      });
    },
    sign_or_unsign(player_id, player_present) {
      if (player_present == 0) {
        common_vendor.wx$1.showModal({
          title: "选手签到",
          content: "确认签到该选手？",
          success: (res) => {
            if (res.confirm) {
              common_vendor.wx$1.showToast({
                title: "签到中",
                icon: "loading",
                duration: 1e5
              });
              let data = {
                "my_id": this.user.id,
                "match_title": this.match.title,
                "player_id": player_id
              };
              utils_js_api.uniRequest("POST", "player_sign_or_unsign", data, "competition", (res2) => {
                common_vendor.wx$1.showToast({
                  title: res2.data.message,
                  icon: "none",
                  duration: 1e3
                });
                if (res2.data.status == 200) {
                  utils_js_api.uniRequest("POST", "get_match_players", { "match_id": this.match.id }, "competition", (res3) => {
                    this.players = res3.data.players;
                  });
                }
              });
            }
          }
        });
      } else {
        common_vendor.wx$1.showModal({
          title: "选手退签",
          content: "确认退签该选手？",
          success: (res) => {
            if (res.confirm) {
              common_vendor.wx$1.showToast({
                title: "退签中",
                icon: "loading",
                duration: 1e5
              });
              let data = {
                "my_id": this.user.id,
                "match_title": this.match.title,
                "player_id": player_id
              };
              utils_js_api.uniRequest("POST", "player_sign_or_unsign", data, "competition", (res2) => {
                common_vendor.wx$1.showToast({
                  title: res2.data.message,
                  icon: "none",
                  duration: 1e3
                });
                if (res2.data.status == 200) {
                  utils_js_api.uniRequest("POST", "get_match_players", { "match_id": this.match.id }, "competition", (res3) => {
                    this.players = res3.data.players;
                  });
                }
              });
            }
          }
        });
      }
    },
    remove_player(player_id) {
      common_vendor.wx$1.showModal({
        title: "移除参赛选手",
        content: "确认移除该选手？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.wx$1.showToast({
              title: "移除中",
              icon: "loading",
              duration: 1e5
            });
            let data = {
              "my_id": this.user.id,
              "player_id": player_id,
              "match_id": this.match.id
            };
            utils_js_api.uniRequest("POST", "remove_player", data, "competition", (res2) => {
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 1e3
              });
              if (res2.data.status == 200) {
                this.players.forEach(function(item, index, arr) {
                  if (item.id == player_id) {
                    arr.splice(index, 1);
                  }
                });
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.match.title),
    b: common_vendor.o((...args) => $options.add_player && $options.add_player(...args)),
    c: common_vendor.o((...args) => $options.reset_present && $options.reset_present(...args)),
    d: common_vendor.f(this.players, (player, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(player.username),
        b: common_vendor.t(player.gender),
        c: common_vendor.t(player.school),
        d: common_vendor.t(player.role),
        e: player.organ
      }, player.organ ? {
        f: common_vendor.t(player.organ.organname)
      } : {}, {
        g: common_vendor.t(player.fixed_score),
        h: player.present == 0
      }, player.present == 0 ? {
        i: common_vendor.o(($event) => $options.sign_or_unsign(player.id, player.present), index)
      } : {
        j: common_vendor.o(($event) => $options.sign_or_unsign(player.id, player.present), index)
      }, {
        k: common_vendor.o(($event) => $options.remove_player(player.id), index),
        l: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-db6dcb87"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/match/players.js.map
