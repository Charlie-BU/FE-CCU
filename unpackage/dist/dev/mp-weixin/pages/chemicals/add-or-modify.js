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
    const chemicalId = common_vendor.ref(null);
    const chemical = common_vendor.ref({});
    common_vendor.onLoad((options) => {
      chemicalId.value = options.id;
    });
    const briefUserInfo = common_vendor.ref(null);
    common_vendor.onMounted(async () => {
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      await utils_js_loginCheck.onlyLoginedAccess();
      await getThisChemical();
    });
    const getThisChemical = async () => {
      if (!chemicalId.value)
        return;
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        chemicalId: chemicalId.value
      };
      const res = await utils_js_api.uniRequest("POST", "chemical", "/getThisChemical", data);
      if (res.status < 0)
        return;
      chemical.value = res.chemical;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const form = common_vendor.ref({
      name: "",
      formula: "",
      CAS: "",
      type: null,
      dangerLevel: [],
      info: "",
      responsorId: null,
      registerIds: []
    });
    const dangerLevels = [
      { value: 1, label: "常规" },
      { value: 2, label: "易燃" },
      { value: 3, label: "易爆" },
      { value: 4, label: "腐蚀" },
      { value: 5, label: "易制毒" },
      { value: 6, label: "易制爆" }
    ];
    const handleTypeChange = (e) => {
      form.value.type = +e.detail.value;
    };
    const handleDangerLevelChange = (e) => {
      form.value.dangerLevel = e.detail.value.map(Number);
    };
    const requiredFields = common_vendor.ref({
      name: "药品名称",
      formula: "化学式",
      CAS: " CAS 号",
      type: "药品种类",
      // 无机1/有机2
      dangerLevel: "危险性"
      // 常规1/易燃2/易爆3/腐蚀4/易制毒5/易制爆6
    });
    const submit = async () => {
      common_vendor.index.showToast({
        title: "提交中",
        icon: "loading",
        duration: 1e5
      });
      if (chemicalId.value) {
        const data2 = {
          sessionid: common_vendor.index.getStorageSync("sessionid"),
          chemicalId: chemicalId.value,
          chemicalData: form.value
        };
        const res2 = await utils_js_api.uniRequest("POST", "chemical", "/modifyChemicalInfo", data2);
        common_vendor.index.showToast({
          title: res2.message,
          icon: "none",
          duration: 1e3
        });
        if (res2.status === 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: `/pages/chemicals/detail?id=${chemicalId.value}`
            });
          }, 1e3);
        }
        return;
      }
      form.value.responsorId = briefUserInfo.value.id;
      form.value.registerIds.push(briefUserInfo.value.id);
      const chemicalData = form.value;
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
      if (chemicalData.dangerLevel.length === 0) {
        common_vendor.index.showToast({
          title: "请选择药品危险性",
          icon: "none",
          duration: 800
        });
        return;
      }
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        chemicalData
      };
      const res = await utils_js_api.uniRequest("POST", "chemical", "/addChemical", data);
      common_vendor.index.showToast({
        title: res.message,
        icon: "none",
        duration: 1e3
      });
      if (res.status === 200) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/chemicals/index"
          });
        }, 1e3);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.o(goBack),
        c: common_vendor.unref(show)
      }, common_vendor.unref(show) ? common_vendor.e({
        d: common_vendor.t(chemicalId.value ? "药品信息修改" : "药品入库"),
        e: chemicalId.value ? chemical.value.name : "请输入药品名称",
        f: form.value.name,
        g: common_vendor.o(($event) => form.value.name = $event.detail.value),
        h: chemicalId.value ? chemical.value.formula : "请输入化学式或分子式",
        i: form.value.formula,
        j: common_vendor.o(($event) => form.value.formula = $event.detail.value),
        k: chemicalId.value ? chemical.value.CAS : "请输入 CAS 号",
        l: form.value.CAS,
        m: common_vendor.o(($event) => form.value.CAS = $event.detail.value),
        n: chemicalId.value && chemical.value.type === 1,
        o: chemicalId.value && chemical.value.type === 2,
        p: common_vendor.o(handleTypeChange),
        q: chemicalId.value
      }, chemicalId.value ? {
        r: common_vendor.f(dangerLevels, (item, index, i0) => {
          var _a, _b, _c, _d;
          return common_vendor.e({
            a: (_b = (_a = chemical.value) == null ? void 0 : _a.dangerLevel) == null ? void 0 : _b.includes(+item.value)
          }, ((_d = (_c = chemical.value) == null ? void 0 : _c.dangerLevel) == null ? void 0 : _d.includes(+item.value)) ? {
            b: item.value
          } : {
            c: item.value
          }, {
            d: common_vendor.t(item.label),
            e: index
          });
        }),
        s: common_vendor.o(handleDangerLevelChange)
      } : {
        t: common_vendor.f(dangerLevels, (item, index, i0) => {
          return {
            a: item.value,
            b: common_vendor.t(item.label),
            c: index
          };
        }),
        v: common_vendor.o(handleDangerLevelChange)
      }, {
        w: chemicalId.value ? chemical.value.info : "请输入备注（非必填）",
        x: form.value.info,
        y: common_vendor.o(($event) => form.value.info = $event.detail.value),
        z: briefUserInfo.value && !chemicalId.value
      }, briefUserInfo.value && !chemicalId.value ? {
        A: briefUserInfo.value.username
      } : {}, {
        B: briefUserInfo.value && !chemicalId.value
      }, briefUserInfo.value && !chemicalId.value ? {
        C: briefUserInfo.value.username
      } : {}, {
        D: common_vendor.o(submit)
      }) : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chemicals/add-or-modify.js.map
