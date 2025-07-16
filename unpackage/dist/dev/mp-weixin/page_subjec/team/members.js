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
      team: "",
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    this.team = common_vendor.index.getStorageSync("team");
    if (!this.team) {
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
    common_vendor.index.removeStorageSync("team");
  },
  methods: {
    add_member() {
      common_vendor.wx$1.showModal({
        title: "添加队员",
        placeholderText: "请输入队员姓名",
        editable: true,
        success: (res) => {
          if (res.confirm) {
            let data = {
              "my_id": this.user.id,
              "team_id": this.team.id,
              "member_name": res.content
            };
            utils_js_api.uniRequest("POST", "add_member", data, "competition", (res2) => {
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 1e3
              });
              if (res2.data.status == 200) {
                utils_js_api.uniRequest("POST", "get_this_team", { team_id: this.team.id }, "competition", (res3) => {
                  this.team = res3.data.team;
                });
                common_vendor.index.setStorageSync("team", this.team);
              }
            });
          }
        }
      });
    },
    remove_member(member_id) {
      common_vendor.wx$1.showModal({
        title: "移除队员",
        content: "确认移除该队员？",
        success: (res) => {
          if (res.confirm) {
            let data = {
              "my_id": this.user.id,
              "member_id": member_id,
              "team_id": this.team.id
            };
            utils_js_api.uniRequest("POST", "remove_member", data, "competition", (res2) => {
              common_vendor.wx$1.showToast({
                title: res2.data.message,
                icon: "none",
                duration: 1e3
              });
              if (res2.data.status == 200) {
                this.team.members.forEach(function(item, index, arr) {
                  if (item.id == member_id) {
                    arr.splice(
                      index,
                      1
                    );
                  }
                });
                common_vendor.index.setStorageSync("team", this.team);
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
    a: common_vendor.t($data.team.teamname),
    b: common_vendor.o((...args) => $options.add_member && $options.add_member(...args)),
    c: common_vendor.f($data.team.members, (member, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(member.username),
        b: common_vendor.t(member.gender),
        c: common_vendor.t(member.school),
        d: common_vendor.t(member.role),
        e: member.organ
      }, member.organ ? {
        f: common_vendor.t(member.organ.organname)
      } : {}, {
        g: common_vendor.t(member.score),
        h: common_vendor.o(($event) => $options.remove_member(member.id), index),
        i: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b484fd6e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/team/members.js.map
