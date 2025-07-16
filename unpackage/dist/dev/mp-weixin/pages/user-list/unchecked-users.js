"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_conventions = require("../../utils/js/conventions.js");
const utils_js_utils = require("../../utils/js/utils.js");
const _sfc_main = {
  __name: "unchecked-users",
  setup(__props) {
    const briefUserInfo = common_vendor.ref(null);
    common_vendor.onMounted(async () => {
      await utils_js_loginCheck.onlyLoginedAccess();
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      if (briefUserInfo.value.usertype === 1) {
        common_vendor.index.showToast({
          title: "权限不足",
          icon: "none",
          duration: 1e3
        });
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        }, 1e3);
      }
      await getUncheckedUsersInfo();
    });
    const uncheckedUsers = common_vendor.ref([]);
    const getUncheckedUsersInfo = async () => {
      const res = await utils_js_api.uniRequest("POST", "user", "/getUncheckedUsersInfo", { sessionid: common_vendor.index.getStorageSync("sessionid") });
      if (res.status < 0)
        return;
      uncheckedUsers.value = res.uncheckedUsers;
    };
    const checkUser = async (userId, opinion) => {
      if (opinion === 1) {
        common_vendor.index.showModal({
          title: "新成员审核",
          content: "确定通过该成员的注册？",
          success: async (r) => {
            if (r.confirm) {
              common_vendor.index.showToast({
                title: "请稍后",
                icon: "loading",
                duration: 1e5
              });
              const data = {
                sessionid: common_vendor.index.getStorageSync("sessionid"),
                userId,
                opinion,
                massage: ""
              };
              const res = await utils_js_api.uniRequest("POST", "user", "/checkNewUser", data);
              common_vendor.index.showToast({
                title: res.message,
                icon: "none",
                duration: 1e3
              });
              if (res.status < 0)
                return;
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: "/pages/user-list/unchecked-users"
                });
              }, 1e3);
            }
          }
        });
      } else if (opinion === 2) {
        common_vendor.index.showModal({
          title: "审核驳回",
          editable: true,
          placeholderText: "请输入驳回理由",
          success: async (r) => {
            if (!r.content) {
              common_vendor.index.showToast({
                title: "请输入驳回理由",
                icon: "none",
                duration: 800
              });
              return;
            }
            if (r.confirm) {
              common_vendor.index.showToast({
                title: "请稍后",
                icon: "loading",
                duration: 1e5
              });
              const data = {
                sessionid: common_vendor.index.getStorageSync("sessionid"),
                userId,
                opinion,
                massage: r.content
              };
              const res = await utils_js_api.uniRequest("POST", "user", "/checkNewUser", data);
              common_vendor.index.showToast({
                title: res.message,
                icon: "none",
                duration: 1500
              });
              if (res.status < 0)
                return;
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: "/pages/user-list/unchecked-users"
                });
              }, 1500);
            }
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: uncheckedUsers.value.length === 0
      }, uncheckedUsers.value.length === 0 ? {} : {
        b: common_vendor.f(uncheckedUsers.value, (user, index, i0) => {
          return common_vendor.e({
            a: user.gender === 1
          }, user.gender === 1 ? {} : user.gender === 2 ? {} : {}, {
            b: user.gender === 2,
            c: common_vendor.t(index + 1),
            d: common_vendor.t(user.username),
            e: common_vendor.t(user.workNum),
            f: common_vendor.t(user.phone),
            g: common_vendor.t(user.email),
            h: common_vendor.t(utils_js_conventions.getUserRole(user.role)),
            i: common_vendor.t(user.role === 1 ? "学号" : "工号"),
            j: common_vendor.t(user.workNum),
            k: common_vendor.t(utils_js_conventions.getUserDegree(user.degree)),
            l: user.role === 1
          }, user.role === 1 ? {
            m: common_vendor.t(user.graduateTime || "未填写")
          } : {}, {
            n: common_vendor.t(utils_js_utils.format_time(user.joinTime)),
            o: common_vendor.o(($event) => checkUser(user.id, 1), index),
            p: common_vendor.o(($event) => checkUser(user.id, 2), index),
            q: index
          });
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-39bb2af0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user-list/unchecked-users.js.map
