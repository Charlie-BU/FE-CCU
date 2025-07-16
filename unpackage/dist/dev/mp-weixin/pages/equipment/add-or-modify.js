"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  __name: "add-or-modify",
  setup(__props) {
    const show = utils_js_magic.magic();
    const equipmentId = common_vendor.ref(null);
    const equipment = common_vendor.ref({});
    common_vendor.onLoad((options) => {
      equipmentId.value = options.id;
    });
    const briefUserInfo = common_vendor.ref(null);
    common_vendor.onMounted(async () => {
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      await utils_js_loginCheck.onlyLoginedAccess();
      if (equipmentId.value)
        await getThisEquipment();
    });
    const getThisEquipment = async () => {
      if (!equipmentId.value)
        return;
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        equipmentId: equipmentId.value
      };
      const res = await utils_js_api.uniRequest("POST", "equipment", "/getThisEquipment", data);
      if (res.status < 0)
        return;
      equipment.value = res.equipment;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const form = common_vendor.ref({
      name: "",
      status: null,
      function: "",
      operateRegulation: "",
      imageUrl: "",
      responsorId: null,
      info: ""
    });
    const statusOptions = [
      { value: 1, label: "正常" },
      { value: 2, label: "异常" },
      { value: 3, label: "维修" },
      { value: 4, label: "报废" }
    ];
    const handleStatusChange = (e) => {
      form.value.status = +e.detail.value;
    };
    const requiredFields = common_vendor.ref({
      name: "设备名称",
      status: "设备状态",
      function: "设备功能",
      operateRegulation: "操作规范",
      status: "设备状态"
    });
    const submit = async () => {
      common_vendor.index.showToast({ title: "提交中", icon: "loading", duration: 1e5 });
      if (equipmentId.value) {
        const data2 = {
          sessionid: common_vendor.index.getStorageSync("sessionid"),
          equipmentId: equipmentId.value,
          equipmentData: form.value
        };
        const res2 = await utils_js_api.uniRequest("POST", "equipment", "/modifyEquipmentInfo", data2);
        common_vendor.index.showToast({
          title: res2.message,
          icon: "none",
          duration: 1e3
        });
        if (res2.status === 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/equipment/index"
            });
          }, 1e3);
        }
        return;
      }
      for (let requiredField in requiredFields.value) {
        if (!form.value[requiredField]) {
          common_vendor.index.showToast({
            title: `请输入${requiredFields.value[requiredField]}`,
            icon: "none",
            duration: 800
          });
          return;
        }
      }
      form.value.responsorId = briefUserInfo.value.id;
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        equipmentData: form.value
      };
      const res = await utils_js_api.uniRequest("POST", "equipment", "/addEquipment", data);
      common_vendor.index.showToast({ title: res.message, icon: "none", duration: 1e3 });
      if (res.status === 200) {
        setTimeout(() => {
          common_vendor.index.reLaunch({ url: "/pages/equipment/index" });
        }, 1e3);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.o(goBack),
        c: common_vendor.unref(show)
      }, common_vendor.unref(show) ? common_vendor.e({
        d: common_vendor.t(equipmentId.value ? "设备信息修改" : "添加设备"),
        e: equipmentId.value ? equipment.value.name : "请输入设备名称",
        f: form.value.name,
        g: common_vendor.o(($event) => form.value.name = $event.detail.value),
        h: common_vendor.f(statusOptions, (item, index, i0) => {
          return {
            a: item.value,
            b: equipmentId.value && equipment.value.status === item.value,
            c: common_vendor.t(item.label),
            d: index
          };
        }),
        i: common_vendor.o(handleStatusChange),
        j: equipmentId.value ? equipment.value.function : "请输入设备功能",
        k: form.value.function,
        l: common_vendor.o(($event) => form.value.function = $event.detail.value),
        m: equipmentId.value ? equipment.value.operateRegulation : "请输入操作规范",
        n: form.value.operateRegulation,
        o: common_vendor.o(($event) => form.value.operateRegulation = $event.detail.value),
        p: briefUserInfo.value && !equipmentId.value
      }, briefUserInfo.value && !equipmentId.value ? {
        q: briefUserInfo.value.username
      } : {}, {
        r: equipmentId.value ? equipment.value.info : "请输入备注（非必填）",
        s: form.value.info,
        t: common_vendor.o(($event) => form.value.info = $event.detail.value),
        v: common_vendor.o(submit)
      }) : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/equipment/add-or-modify.js.map
