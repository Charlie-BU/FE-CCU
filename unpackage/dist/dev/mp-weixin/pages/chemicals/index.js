"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_conventions = require("../../utils/js/conventions.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _component_tabbar = common_vendor.resolveComponent("tabbar");
  (_easycom_u_icon2 + _easycom_u_tabs2 + _easycom_u_search2 + _component_tabbar)();
}
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_u_tabs = () => "../../uni_modules/vk-uview-ui/components/u-tabs/u-tabs.js";
const _easycom_u_search = () => "../../uni_modules/vk-uview-ui/components/u-search/u-search.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_tabs + _easycom_u_search)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const categories = common_vendor.ref([
      {
        name: "全部药品"
      },
      {
        name: "我的领用"
      },
      {
        name: "无机药品"
      },
      {
        name: "有机药品"
      },
      {
        name: "易制毒制爆药品"
      }
    ]);
    const chemicals = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      common_vendor.index.showToast({
        title: "加载中",
        icon: "loading",
        duration: 1e5
      });
      await utils_js_loginCheck.onlyLoginedAccess();
      await Promise.all([getChemicalAmount(), getChemicals()]);
      common_vendor.index.hideToast();
    });
    common_vendor.onPullDownRefresh(async () => {
      try {
        common_vendor.index.reLaunch({
          url: "/pages/chemicals/index"
        });
        common_vendor.index.stopPullDownRefresh();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chemicals/index.vue:129", error);
      }
    });
    const allChemicalLength = common_vendor.ref(0);
    const inorganicChemicalLength = common_vendor.ref(0);
    const organicChemicalLength = common_vendor.ref(0);
    const dangerousChemicalLength = common_vendor.ref(0);
    const getChemicalAmount = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid")
      };
      const res = await utils_js_api.uniRequest("POST", "chemical", "/getChemicalAmount", data);
      if (res.status < 0)
        return;
      allChemicalLength.value = res.data.allChemicalLength;
      inorganicChemicalLength.value = res.data.inorganicChemicalLength;
      organicChemicalLength.value = res.data.organicChemicalLength;
      dangerousChemicalLength.value = res.data.dangerousChemicalLength;
    };
    const getChemicals = async (filterType = 0) => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        filterType
      };
      const res = await utils_js_api.uniRequest("POST", "chemical", "/getChemicals", data);
      if (res.status < 0)
        return;
      chemicals.value = res.chemicals;
    };
    const getMyChemicals = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid")
      };
      const res = await utils_js_api.uniRequest("POST", "chemical", "/getMyChemicals", data);
      if (res.status < 0)
        return;
      chemicals.value = res.chemicals;
    };
    let current = common_vendor.ref(0);
    const change = async (index) => {
      common_vendor.index.showToast({
        title: "加载中",
        icon: "loading",
        duration: 1e5
      });
      current.value = index;
      if (index === 1) {
        await getMyChemicals();
        common_vendor.index.hideToast();
        return;
      }
      if (index > 1)
        index--;
      await getChemicals(index);
      common_vendor.index.hideToast();
    };
    const searchContent = common_vendor.ref("");
    const search = async () => {
      current.value = 0;
      common_vendor.index.showToast({
        title: "加载中",
        icon: "loading",
        duration: 1e5
      });
      let data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        searchContent: searchContent.value
      };
      const res = await utils_js_api.uniRequest("POST", "chemical", "/searchChemical", data);
      if (res.status < 0) {
        common_vendor.index.showToast({
          title: res.message,
          icon: "none",
          duration: 1e3
        });
      }
      chemicals.value = res.chemicals;
      common_vendor.index.hideToast();
    };
    const gotoChemicalDetail = (chemicalId) => {
      common_vendor.index.navigateTo({
        url: `/pages/chemicals/detail?id=${chemicalId}`
      });
    };
    const gotoAddChemical = () => {
      common_vendor.index.navigateTo({
        url: "/pages/chemicals/add-or-modify"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(allChemicalLength.value),
        b: common_vendor.p({
          name: "hourglass",
          color: "#F25C07",
          size: "28"
        }),
        c: common_vendor.t(inorganicChemicalLength.value),
        d: common_vendor.t(organicChemicalLength.value),
        e: common_vendor.p({
          name: "hourglass-half-fill",
          color: "#F25C07",
          size: "28"
        }),
        f: common_vendor.t(dangerousChemicalLength.value),
        g: common_vendor.p({
          name: "warning-fill",
          color: "#F25C07",
          size: "28"
        }),
        h: common_vendor.o(change),
        i: common_vendor.p({
          list: categories.value,
          ["bg-color"]: "null",
          ["active-color"]: "#F25C07",
          ["font-size"]: "20rpx",
          ["is-scroll"]: "true",
          current: common_vendor.unref(current)
        }),
        j: common_vendor.o(gotoAddChemical),
        k: common_vendor.p({
          name: "plus-circle-fill",
          color: "#5853bf",
          size: "50"
        }),
        l: common_vendor.o(($event) => searchContent.value = $event),
        m: common_vendor.p({
          ["bg-color"]: "#ffffff",
          ["show-action"]: false,
          placeholder: "输入药品名称或化学式",
          modelValue: searchContent.value
        }),
        n: common_vendor.o(search),
        o: chemicals.value.length !== 0
      }, chemicals.value.length !== 0 ? {
        p: common_vendor.f(chemicals.value, (chemical, index, i0) => {
          var _a;
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: common_vendor.t(utils_js_conventions.getChemicalType(chemical.type)),
            c: common_vendor.t(chemical.name),
            d: common_vendor.t(chemical.formula),
            e: common_vendor.t(chemical.CAS),
            f: common_vendor.t(utils_js_conventions.getChemicalDangerLevel(chemical.dangerLevel)),
            g: chemical.info
          }, chemical.info ? {
            h: common_vendor.t(chemical.info)
          } : {}, {
            i: common_vendor.t(utils_js_conventions.getChemicalStatus(chemical.status)),
            j: common_vendor.t((_a = chemical.amount) == null ? void 0 : _a.toFixed(1)),
            k: common_vendor.o(($event) => gotoChemicalDetail(chemical.id), index),
            l: index
          });
        })
      } : {}, {
        q: common_vendor.p({
          ["current-page"]: 3
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07572955"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chemicals/index.js.map
