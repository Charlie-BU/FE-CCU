"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_utils = require("../../utils/js/utils.js");
const utils_js_conventions = require("../../utils/js/conventions.js");
const utils_js_uqrcode = require("../../utils/js/uqrcode.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const chemicalId = common_vendor.ref(null);
    const chemical = common_vendor.ref({});
    const briefUserInfo = common_vendor.ref(null);
    common_vendor.onLoad((options) => {
      chemicalId.value = options.id;
    });
    common_vendor.onMounted(async () => {
      common_vendor.index.showToast({
        title: "加载中",
        icon: "loading",
        duration: 1e5
      });
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      await utils_js_loginCheck.onlyLoginedAccess();
      await getThisChemical();
      generateQRCode();
      await Promise.all([getRegistersInfo(), getResponsorInfo(), getTakersInfo()]);
      common_vendor.index.hideToast();
    });
    const getThisChemical = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        chemicalId: chemicalId.value
      };
      const res = await utils_js_api.uniRequest("POST", "chemical", "/getThisChemical", data);
      if (res.status < 0)
        return;
      chemical.value = res.chemical;
    };
    const generateQRCode = () => {
      let qrcode = new utils_js_uqrcode.b();
      qrcode.data = `https://baike.baidu.com/item/${chemical.value.name}`;
      qrcode.size = 150;
      qrcode.make();
      let canvasContext = common_vendor.index.createCanvasContext("qrcode", this);
      qrcode.canvasContext = canvasContext;
      qrcode.drawCanvas();
    };
    const previewQRCode = () => {
      common_vendor.index.canvasToTempFilePath({
        canvasId: "qrcode",
        success: (res) => {
          const tempFilePath = res.tempFilePath;
          utils_js_utils.previewImage(tempFilePath);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/chemicals/detail.vue:151", err);
        }
      });
    };
    const registers = common_vendor.ref([]);
    const responsor = common_vendor.ref(null);
    const takers = common_vendor.ref([]);
    const getRegistersInfo = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        userIds: [...chemical.value.registerIds]
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/getUsersInfoByIds", data);
      if (res.status < 0)
        return;
      registers.value = res.users;
    };
    const getResponsorInfo = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        userIds: [chemical.value.responsorId]
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/getUsersInfoByIds", data);
      if (res.status < 0)
        return;
      responsor.value = res.users[0];
    };
    const getTakersInfo = async () => {
      const userIds = chemical.value.takerIds ? [...chemical.value.takerIds] : [];
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        userIds
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/getUsersInfoByIds", data);
      if (res.status < 0)
        return;
      takers.value = res.users;
    };
    const takeChemical = async () => {
      common_vendor.index.showModal({
        title: "领用药品",
        editable: true,
        placeholderText: "请输入领用药品数量（填写1～100间数字，表示领用该药品数量百分比）",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "请稍后",
              icon: "loading",
              duration: 1e5
            });
            const amount = +r.content;
            if (isNaN(amount) || !amount || amount <= 0 || amount > 100) {
              common_vendor.index.showToast({
                title: "请输入1～100间数字，表示领用该药品数量百分比",
                icon: "none",
                duration: 1e3
              });
              return;
            }
            const data = {
              sessionid: common_vendor.index.getStorageSync("sessionid"),
              chemicalId: chemicalId.value,
              amount
            };
            const res = await utils_js_api.uniRequest("POST", "chemical", "/takeChemical", data);
            common_vendor.index.showToast({
              title: res.message,
              icon: "none",
              duration: 1e3
            });
            if (res.status === 200) {
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: `/pages/chemicals/detail?id=${chemicalId.value}`
                });
              }, 1e3);
            }
          }
        }
      });
    };
    const returnChemical = async () => {
      common_vendor.index.showModal({
        title: "归还药品",
        content: "确定归还领用的全部药品？",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "请稍后",
              icon: "loading",
              duration: 1e5
            });
            const data = {
              sessionid: common_vendor.index.getStorageSync("sessionid"),
              chemicalId: chemicalId.value
            };
            const res = await utils_js_api.uniRequest("POST", "chemical", "/returnChemical", data);
            common_vendor.index.showToast({
              title: res.message,
              icon: "none",
              duration: 1e3
            });
            if (res.status === 200) {
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: `/pages/chemicals/detail?id=${chemicalId.value}`
                });
              }, 1e3);
            }
          }
        }
      });
    };
    const supplementChemical = async () => {
      common_vendor.index.showModal({
        title: "补充药品",
        content: "补充药品后，您将成为药品入库人。确定要补充药品？",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "请稍后",
              icon: "loading",
              duration: 1e5
            });
            const data = {
              sessionid: common_vendor.index.getStorageSync("sessionid"),
              chemicalId: chemicalId.value
            };
            const res = await utils_js_api.uniRequest("POST", "chemical", "/supplementChemical", data);
            common_vendor.index.showToast({
              title: res.message,
              icon: "none",
              duration: 1e3
            });
            if (res.status === 200) {
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: `/pages/chemicals/detail?id=${chemicalId.value}`
                });
              }, 1e3);
            }
          }
        }
      });
    };
    const gotoModifyChemicalInfo = () => {
      common_vendor.index.navigateTo({
        url: `/pages/chemicals/add-or-modify?id=${chemicalId.value}`
      });
    };
    const deleteChemical = async () => {
      common_vendor.index.showModal({
        title: "删除药品",
        content: "药品删除后数据不可恢复，您确认删除该药品？",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "删除中",
              icon: "loading",
              duration: 1e5
            });
            const data = {
              sessionid: common_vendor.index.getStorageSync("sessionid"),
              chemicalId: chemicalId.value
            };
            const res = await utils_js_api.uniRequest("POST", "chemical", "/deleteChemical", data);
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
          }
        }
      });
    };
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.t(chemical.value.name),
        b: common_vendor.t(chemical.value.formula),
        c: common_vendor.t(chemical.value.name),
        d: common_vendor.o(previewQRCode),
        e: common_vendor.t(chemical.value.name),
        f: common_vendor.t(chemical.value.formula),
        g: common_vendor.t(chemical.value.CAS),
        h: common_vendor.t(utils_js_conventions.getChemicalType(chemical.value.type)),
        i: chemical.value.dangerLevel
      }, chemical.value.dangerLevel ? {
        j: common_vendor.t(utils_js_conventions.getChemicalDangerLevel(chemical.value.dangerLevel))
      } : {}, {
        k: common_vendor.t(utils_js_conventions.getChemicalStatus(chemical.value.status)),
        l: common_vendor.t(utils_js_utils.toPercentage(chemical.value.amount, _ctx.decimals = 0)),
        m: chemical.value.info
      }, chemical.value.info ? {} : {}, {
        n: chemical.value.info
      }, chemical.value.info ? {
        o: common_vendor.t(chemical.value.info)
      } : {}, {
        p: registers.value
      }, registers.value ? {
        q: common_vendor.t(registers.value.map(({
          username
        }) => username).join("、") || "无")
      } : {}, {
        r: responsor.value
      }, responsor.value ? {
        s: common_vendor.t(responsor.value.username || "无")
      } : {}, {
        t: takers.value
      }, takers.value ? {
        v: common_vendor.t(takers.value.map(({
          username
        }) => username).join("、") || "无")
      } : {}, {
        w: !((_a = chemical.value.takerIds) == null ? void 0 : _a.includes(briefUserInfo.value.id))
      }, !((_b = chemical.value.takerIds) == null ? void 0 : _b.includes(briefUserInfo.value.id)) ? {
        x: common_vendor.p({
          name: "coupon-fill",
          size: "40"
        }),
        y: common_vendor.o(takeChemical)
      } : {
        z: common_vendor.p({
          name: "coupon",
          size: "40"
        }),
        A: common_vendor.o(returnChemical)
      }, {
        B: common_vendor.p({
          name: "plus-circle-fill",
          size: "40"
        }),
        C: common_vendor.o(supplementChemical),
        D: common_vendor.p({
          name: "setting-fill",
          size: "40"
        }),
        E: common_vendor.o(gotoModifyChemicalInfo),
        F: common_vendor.p({
          name: "trash-fill",
          size: "40"
        }),
        G: common_vendor.o(deleteChemical)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ea5ca1cc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chemicals/detail.js.map
