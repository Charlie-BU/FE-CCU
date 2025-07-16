"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_conventions = require("../../utils/js/conventions.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _component_tabbar = common_vendor.resolveComponent("tabbar");
  (_easycom_u_search2 + _component_tabbar)();
}
const _easycom_u_search = () => "../../uni_modules/vk-uview-ui/components/u-search/u-search.js";
if (!Math) {
  _easycom_u_search();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const briefUserInfo = common_vendor.ref(null);
    const users = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      await utils_js_loginCheck.onlyLoginedAccess();
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      await Promise.all([getAllUsers(), getUncheckedUsersAmount()]);
    });
    common_vendor.onPullDownRefresh(async () => {
      try {
        common_vendor.index.reLaunch({
          url: "/pages/user-list/index"
        });
        common_vendor.index.stopPullDownRefresh();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user-list/index.vue:87", error);
      }
    });
    const stuLength = common_vendor.computed(() => users.value.filter((user) => user.role === 1).length);
    const teacherLength = common_vendor.computed(() => users.value.filter((user) => user.role === 2).length);
    const getAllUsers = async () => {
      const res = await utils_js_api.uniRequest("POST", "user", "/getAllUsers", { sessionid: common_vendor.index.getStorageSync("sessionid") });
      if (res.status < 0)
        return;
      users.value = res.users;
      for (const user of users.value) {
        const data = {
          sessionid: common_vendor.index.getStorageSync("sessionid"),
          stuId: user.id
        };
        const r = await utils_js_api.uniRequest("POST", "user", "/getSupervisorInfo", data);
        user.supervisorName = r.supervisorName || "未知";
      }
    };
    const uncheckedUsersAmount = common_vendor.ref(0);
    const getUncheckedUsersAmount = async () => {
      const res = await utils_js_api.uniRequest("POST", "user", "/getUncheckedUsersAmount", { sessionid: common_vendor.index.getStorageSync("sessionid") });
      if (res.status < 0)
        return;
      uncheckedUsersAmount.value = res.uncheckedUsersAmount;
    };
    const searchContent = common_vendor.ref("");
    const searchUser = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        searchContent: searchContent.value
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/searchUser", data);
      users.value = res.users;
      for (const user of users.value) {
        const data2 = {
          sessionid: common_vendor.index.getStorageSync("sessionid"),
          stuId: user.id
        };
        const r = await utils_js_api.uniRequest("POST", "user", "/getSupervisorInfo", data2);
        user.supervisorName = r.supervisorName || "未知";
      }
    };
    const gotoUncheckedUsers = () => {
      if (uncheckedUsersAmount.value === 0)
        return;
      common_vendor.index.navigateTo({
        url: "/pages/user-list/unchecked-users"
      });
    };
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.t(users.value.length),
        b: common_vendor.t(stuLength.value),
        c: common_vendor.t(teacherLength.value),
        d: ((_a = briefUserInfo.value) == null ? void 0 : _a.usertype) > 1
      }, ((_b = briefUserInfo.value) == null ? void 0 : _b.usertype) > 1 ? {
        e: common_vendor.t(uncheckedUsersAmount.value),
        f: common_vendor.s(uncheckedUsersAmount.value > 0 ? "color: #f25c07" : ""),
        g: common_vendor.o(gotoUncheckedUsers)
      } : {}, {
        h: common_vendor.o(($event) => searchContent.value = $event),
        i: common_vendor.p({
          ["show-action"]: false,
          placeholder: "输入成员姓名",
          modelValue: searchContent.value
        }),
        j: common_vendor.o(searchUser),
        k: common_vendor.f(users.value, (user, index, i0) => {
          return common_vendor.e({
            a: user.avatarUrl
          }, user.avatarUrl ? {
            b: user.avatarUrl
          } : user.gender === 1 ? {} : user.gender === 2 ? {} : {}, {
            c: user.gender === 1,
            d: user.gender === 2,
            e: common_vendor.t(index + 1),
            f: common_vendor.t(user.username),
            g: common_vendor.t(user.workNum),
            h: common_vendor.t(utils_js_conventions.getUserRole(user.role)),
            i: common_vendor.t(utils_js_conventions.getUserDegree(user.degree)),
            j: user.role === 1
          }, user.role === 1 ? {
            k: common_vendor.t(user.supervisorName)
          } : user.role === 2 ? {
            m: common_vendor.t(user.stuAmount)
          } : {}, {
            l: user.role === 2,
            n: index
          });
        }),
        l: common_vendor.p({
          ["current-page"]: 2
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9c9a1d8c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user-list/index.js.map
