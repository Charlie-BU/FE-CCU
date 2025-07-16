"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_conventions = require("../../utils/js/conventions.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _component_tabbar = common_vendor.resolveComponent("tabbar");
  (_easycom_u_icon2 + _easycom_u_search2 + _component_tabbar)();
}
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_u_search = () => "../../uni_modules/vk-uview-ui/components/u-search/u-search.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_search)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const briefUserInfo = common_vendor.ref(null);
    const equipments = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      common_vendor.index.showToast({
        title: "加载中",
        icon: "loading",
        duration: 1e5
      });
      await utils_js_loginCheck.onlyLoginedAccess();
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      await Promise.all([getEquipmentAmount(), getEquipments()]);
      common_vendor.index.hideToast();
    });
    common_vendor.onPullDownRefresh(async () => {
      try {
        common_vendor.index.reLaunch({
          url: "/pages/equipment/index"
        });
        common_vendor.index.stopPullDownRefresh();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/equipment/index.vue:104", error);
      }
    });
    const normalEquipmentLength = common_vendor.ref(0);
    const repairingEquipmentLength = common_vendor.ref(0);
    const impairedEquipmentLength = common_vendor.ref(0);
    const damagedEquipmentLength = common_vendor.ref(0);
    const getEquipmentAmount = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid")
      };
      const res = await utils_js_api.uniRequest("POST", "equipment", "/getEquipmentAmount", data);
      if (res.status < 0)
        return;
      normalEquipmentLength.value = res.data.normalEquipmentLength;
      repairingEquipmentLength.value = res.data.repairingEquipmentLength;
      impairedEquipmentLength.value = res.data.impairedEquipmentLength;
      damagedEquipmentLength.value = res.data.damagedEquipmentLength;
    };
    const getEquipments = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid")
      };
      const res = await utils_js_api.uniRequest("POST", "equipment", "/getEquipments", data);
      if (res.status < 0)
        return;
      equipments.value = res.equipments;
    };
    const searchContent = common_vendor.ref("");
    const search = async () => {
      common_vendor.index.showToast({
        title: "加载中",
        icon: "loading",
        duration: 1e5
      });
      let data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        searchContent: searchContent.value
      };
      const res = await utils_js_api.uniRequest("POST", "equipment", "/searchEquipment", data);
      if (res.status < 0) {
        common_vendor.index.showToast({
          title: res.message,
          icon: "none",
          duration: 1e3
        });
      }
      equipments.value = res.equipments;
      common_vendor.index.hideToast();
    };
    const gotoAddOrModifyEquipment = (equipmentId = null) => {
      let url = "/pages/equipment/add-or-modify";
      if (equipmentId)
        url = url + `?id=${equipmentId}`;
      common_vendor.index.navigateTo({
        url
      });
    };
    const deleteEquipment = async (equipmentId) => {
      common_vendor.index.showModal({
        title: "删除设备",
        content: "设备删除后数据不可恢复，您确认删除该设备？",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "删除中",
              icon: "loading",
              duration: 1e5
            });
            const data = {
              sessionid: common_vendor.index.getStorageSync("sessionid"),
              equipmentId
            };
            const res = await utils_js_api.uniRequest("POST", "equipment", "/deleteEquipment", data);
            common_vendor.index.showToast({
              title: res.message,
              icon: "none",
              duration: 1e3
            });
            if (res.status === 200) {
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: "/pages/equipment/index"
                });
              }, 1e3);
            }
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(normalEquipmentLength.value),
        b: common_vendor.p({
          name: "checkmark-circle-fill",
          color: "green",
          size: "28"
        }),
        c: common_vendor.t(repairingEquipmentLength.value),
        d: common_vendor.t(impairedEquipmentLength.value),
        e: common_vendor.p({
          name: "setting-fill",
          color: "#F25C07",
          size: "28"
        }),
        f: common_vendor.t(damagedEquipmentLength.value),
        g: common_vendor.p({
          name: "close-circle-fill",
          color: "red",
          size: "28"
        }),
        h: common_vendor.o(gotoAddOrModifyEquipment),
        i: common_vendor.p({
          name: "plus-circle-fill",
          color: "#5853bf",
          size: "50"
        }),
        j: common_vendor.o(($event) => searchContent.value = $event),
        k: common_vendor.p({
          ["bg-color"]: "#ffffff",
          ["show-action"]: false,
          placeholder: "输入设备名称",
          modelValue: searchContent.value
        }),
        l: common_vendor.o(search),
        m: equipments.value.length !== 0
      }, equipments.value.length !== 0 ? {
        n: common_vendor.f(equipments.value, (equipment, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: common_vendor.t(utils_js_conventions.getEquipmentStatus(equipment.status)),
            c: common_vendor.s(equipment.status === 1 ? "color: green;" : ""),
            d: equipment.imageUrl || "https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/equipment.jpg",
            e: common_vendor.t(equipment.name),
            f: common_vendor.t(equipment.responsorName),
            g: equipment.function
          }, equipment.function ? {
            h: common_vendor.t(equipment.function)
          } : {}, {
            i: equipment.operateRegulation
          }, equipment.operateRegulation ? {
            j: common_vendor.t(equipment.operateRegulation)
          } : {}, {
            k: equipment.info
          }, equipment.info ? {
            l: common_vendor.t(equipment.info)
          } : {}, {
            m: briefUserInfo.value.id === equipment.responsorId
          }, briefUserInfo.value.id === equipment.responsorId ? {
            n: common_vendor.o(($event) => gotoAddOrModifyEquipment(equipment.id), index),
            o: common_vendor.o(($event) => deleteEquipment(equipment.id), index)
          } : {}, {
            p: index
          });
        })
      } : {}, {
        o: common_vendor.p({
          ["current-page"]: 1
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c536a64d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/equipment/index.js.map
