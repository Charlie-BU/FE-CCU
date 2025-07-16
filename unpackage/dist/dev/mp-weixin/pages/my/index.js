"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_conventions = require("../../utils/js/conventions.js");
const utils_js_magic = require("../../utils/js/magic.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _component_tabbar = common_vendor.resolveComponent("tabbar");
  (_easycom_u_icon2 + _easycom_uni_td2 + _easycom_uni_tr2 + _easycom_uni_table2 + _component_tabbar)();
}
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_u_icon + _easycom_uni_td + _easycom_uni_tr + _easycom_uni_table)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const show = utils_js_magic.magic();
    const user = common_vendor.ref(null);
    const supervisor = common_vendor.ref(null);
    const takingEquipmentInfo = common_vendor.ref([]);
    const takingChemicalInfo = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      const briefUserInfo = await utils_js_loginCheck.loginCheck();
      if (briefUserInfo) {
        user.value = await utils_js_loginCheck.getUserInfo();
        if (user.value.role === 1) {
          supervisor.value = await getSupervisorInfo();
        }
        [takingEquipmentInfo.value, takingChemicalInfo.value] = await getEquipmentAndChemicalInfo();
      }
    });
    common_vendor.onPullDownRefresh(async () => {
      try {
        common_vendor.index.reLaunch({
          url: "/pages/my/index"
        });
        common_vendor.index.stopPullDownRefresh();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/index.vue:268", error);
      }
    });
    const getSupervisorInfo = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        stuId: user.value.id
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/getSupervisorInfo", data);
      if (res.status === 200) {
        return { name: res.supervisorName || "未知" };
      }
      return { name: "未知" };
    };
    const getEquipmentAndChemicalInfo = async () => {
      const res = await utils_js_api.uniRequest("POST", "user", "/getEquipmentAndChemicalInfo", { sessionid: common_vendor.index.getStorageSync("sessionid") });
      if (res.status === 200) {
        return [res.data.equipmentInfo, res.data.chemicalInfo];
      }
      return null;
    };
    const logout = () => {
      common_vendor.index.clearStorageSync();
      common_vendor.index.reLaunch({
        url: "/pages/my/index"
      });
    };
    const gotoLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    const gotoRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    };
    const gotoEquipment = () => {
      common_vendor.index.switchTab({
        url: "/pages/equipment/index"
      });
    };
    const gotoChemical = () => {
      common_vendor.index.switchTab({
        url: "/pages/chemicals/index"
      });
    };
    const gotoModifyInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    };
    const gotoModifyPwd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/my/modifyPwd"
      });
    };
    const setPrivacy = () => {
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: user.value
      }, user.value ? common_vendor.e({
        b: common_vendor.o(logout),
        c: user.value.avatarUrl
      }, user.value.avatarUrl ? {
        d: user.value.avatarUrl
      } : user.value.gender == 1 ? {} : user.value.gender == 2 ? {} : {}, {
        e: user.value.gender == 1,
        f: user.value.gender == 2,
        g: common_vendor.t(user.value.username),
        h: common_vendor.t(user.value.directionName),
        i: common_vendor.t(user.value.workNum),
        j: user.value.role === 1
      }, user.value.role === 1 ? {} : user.value.role === 2 ? {} : {}, {
        k: user.value.role === 2,
        l: common_vendor.t(utils_js_conventions.getUserDegree(user.value.degree)),
        m: user.value.role === 1
      }, user.value.role === 1 ? common_vendor.e({
        n: supervisor.value
      }, supervisor.value ? {
        o: common_vendor.t(supervisor.value.name)
      } : {}) : user.value.role === 2 ? {
        q: common_vendor.t(user.value.stuAmount)
      } : {}, {
        p: user.value.role === 2,
        r: common_vendor.p({
          name: "arrow-right",
          color: "#212121",
          size: "28"
        }),
        s: takingEquipmentInfo.value[0] === 0
      }, takingEquipmentInfo.value[0] === 0 ? {} : {
        t: common_vendor.t(takingEquipmentInfo.value[1]),
        v: common_vendor.t(takingEquipmentInfo.value[0])
      }, {
        w: common_vendor.o(gotoEquipment),
        x: common_vendor.p({
          name: "arrow-right",
          color: "#212121",
          size: "28"
        }),
        y: takingChemicalInfo.value[0] === 0
      }, takingChemicalInfo.value[0] === 0 ? {} : {
        z: common_vendor.t(takingChemicalInfo.value[1]),
        A: common_vendor.t(takingChemicalInfo.value[0])
      }, {
        B: common_vendor.o(gotoChemical),
        C: common_vendor.p({
          name: "setting-fill",
          size: "40"
        }),
        D: common_vendor.o(gotoModifyInfo),
        E: common_vendor.p({
          name: "lock-fill",
          size: "40"
        }),
        F: common_vendor.o(gotoModifyPwd),
        G: user.value.isPrivate
      }, user.value.isPrivate ? {
        H: common_vendor.p({
          name: "account",
          size: "40"
        })
      } : {
        I: common_vendor.p({
          name: "account-fill",
          size: "40"
        })
      }, {
        J: common_vendor.o(setPrivacy),
        K: common_vendor.t(user.value.username),
        L: common_vendor.t(utils_js_conventions.getUserGender(user.value.gender)),
        M: common_vendor.t(user.value.phone),
        N: common_vendor.t(user.value.email),
        O: common_vendor.t(utils_js_conventions.getUserRole(user.value.role)),
        P: common_vendor.t(user.value.role === 1 ? "学号" : "工号"),
        Q: common_vendor.t(user.value.workNum),
        R: common_vendor.t(utils_js_conventions.getUserDegree(user.value.degree)),
        S: common_vendor.t(user.value.directionName),
        T: user.value.role === 1
      }, user.value.role === 1 ? {
        U: common_vendor.t(user.value.graduateTime)
      } : {}, {
        V: common_vendor.p({
          stripe: true,
          emptyText: "无数据"
        })
      }) : common_vendor.e({
        W: common_vendor.o(gotoLogin),
        X: common_vendor.unref(show)
      }, common_vendor.unref(show) ? {
        Y: common_vendor.o(gotoRegister)
      } : {}), {
        Z: common_vendor.p({
          ["current-page"]: 4
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f97bc692"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/index.js.map
