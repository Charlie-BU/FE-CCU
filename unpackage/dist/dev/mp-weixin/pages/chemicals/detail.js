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
    const selectedYear = common_vendor.ref("");
    const selectedMonth = common_vendor.ref("");
    const selectedYearIndex = common_vendor.ref(0);
    const selectedMonthIndex = common_vendor.ref(0);
    const yearOptions = common_vendor.ref([]);
    const monthOptions = common_vendor.ref(["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]);
    const filterResult = common_vendor.ref(null);
    common_vendor.onLoad((options) => {
      chemicalId.value = options.id;
    });
    const initYearOptions = () => {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const years = [];
      for (let i = currentYear; i >= currentYear - 10; i--) {
        years.push(i + "年");
      }
      yearOptions.value = years;
    };
    const onYearChange = (e) => {
      selectedYearIndex.value = e.detail.value;
      selectedYear.value = yearOptions.value[e.detail.value];
    };
    const onMonthChange = (e) => {
      selectedMonthIndex.value = e.detail.value;
      selectedMonth.value = monthOptions.value[e.detail.value];
    };
    const filterChemicalRecords = async () => {
      if (!selectedYear.value) {
        common_vendor.index.showToast({
          title: "请选择年份",
          icon: "none",
          duration: 1500
        });
        return;
      }
      common_vendor.index.showToast({
        title: "筛选中",
        icon: "loading",
        duration: 1e5
      });
      const year = parseInt(selectedYear.value.replace("年", ""));
      const month = selectedMonth.value ? parseInt(selectedMonth.value.replace("月", "")) : null;
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        chemicalId: chemicalId.value,
        year,
        month
      };
      try {
        const res = await utils_js_api.uniRequest("POST", "chemical", "/getChemicalRecordsByTime", data);
        common_vendor.index.hideToast();
        if (res.status === 200) {
          filterResult.value = {
            inboundCount: res.inboundCount || 0,
            outboundCount: res.outboundCount || 0
          };
          common_vendor.index.showToast({
            title: "筛选完成",
            icon: "success",
            duration: 1500
          });
        } else {
          common_vendor.index.showToast({
            title: res.message || "筛选失败",
            icon: "none",
            duration: 1500
          });
        }
      } catch (error) {
        common_vendor.index.hideToast();
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none",
          duration: 1500
        });
      }
    };
    const resetFilter = () => {
      selectedYear.value = "";
      selectedMonth.value = "";
      selectedYearIndex.value = 0;
      selectedMonthIndex.value = 0;
      filterResult.value = null;
    };
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
      initYearOptions();
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
          common_vendor.index.__f__("error", "at pages/chemicals/detail.vue:297", err);
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
        placeholderText: "请输入领用药品瓶数（可填写小数）",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "请稍后",
              icon: "loading",
              duration: 1e5
            });
            const amount = +r.content;
            if (isNaN(amount) || !amount || amount <= 0) {
              common_vendor.index.showToast({
                title: "请输入领用药品瓶数（可填写小数）",
                icon: "none",
                duration: 1e3
              });
              return;
            }
            if (amount > chemical.value.amount) {
              common_vendor.index.showToast({
                title: "领用药品瓶数不能大于库存",
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
        editable: true,
        placeholderText: "请输入补充药品瓶数（可填写小数）",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "请稍后",
              icon: "loading",
              duration: 1e5
            });
            const amount = +r.content;
            if (isNaN(amount) || !amount || amount <= 0) {
              common_vendor.index.showToast({
                title: "请输入领用药品瓶数（可填写小数）",
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
      var _a, _b, _c;
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
        l: common_vendor.t((_a = chemical.value.amount) == null ? void 0 : _a.toFixed(1)),
        m: chemical.value.info
      }, chemical.value.info ? {} : {}, {
        n: chemical.value.specification
      }, chemical.value.specification ? {
        o: common_vendor.t(chemical.value.specification)
      } : {}, {
        p: chemical.value.purity
      }, chemical.value.purity ? {
        q: common_vendor.t(chemical.value.purity)
      } : {}, {
        r: chemical.value.site
      }, chemical.value.site ? {
        s: common_vendor.t(chemical.value.site)
      } : {}, {
        t: chemical.value.info
      }, chemical.value.info ? {} : {}, {
        v: chemical.value.info
      }, chemical.value.info ? {
        w: common_vendor.t(chemical.value.info)
      } : {}, {
        x: registers.value
      }, registers.value ? {
        y: common_vendor.t(registers.value.map(({
          username
        }) => username).join("、") || "无")
      } : {}, {
        z: responsor.value
      }, responsor.value ? {
        A: common_vendor.t(responsor.value.username || "无")
      } : {}, {
        B: takers.value
      }, takers.value ? {
        C: common_vendor.t(takers.value.map(({
          username
        }) => username).join("、") || "无")
      } : {}, {
        D: common_vendor.t(selectedYear.value || "请选择年份"),
        E: yearOptions.value,
        F: selectedYearIndex.value,
        G: common_vendor.o(onYearChange),
        H: common_vendor.t(selectedMonth.value || "全年"),
        I: monthOptions.value,
        J: selectedMonthIndex.value,
        K: common_vendor.o(onMonthChange),
        L: common_vendor.p({
          name: "search",
          size: "16",
          color: "#ffffff"
        }),
        M: common_vendor.o(filterChemicalRecords),
        N: common_vendor.p({
          name: "reload",
          size: "16",
          color: "#666666"
        }),
        O: common_vendor.o(resetFilter),
        P: filterResult.value
      }, filterResult.value ? {
        Q: common_vendor.t(filterResult.value.inboundCount),
        R: common_vendor.t(filterResult.value.outboundCount)
      } : {}, {
        S: !((_b = chemical.value.takerIds) == null ? void 0 : _b.includes(briefUserInfo.value.id))
      }, !((_c = chemical.value.takerIds) == null ? void 0 : _c.includes(briefUserInfo.value.id)) ? {
        T: common_vendor.p({
          name: "coupon-fill",
          size: "40"
        }),
        U: common_vendor.o(takeChemical)
      } : {
        V: common_vendor.p({
          name: "coupon",
          size: "40"
        }),
        W: common_vendor.o(returnChemical)
      }, {
        X: common_vendor.p({
          name: "plus-circle-fill",
          size: "40"
        }),
        Y: common_vendor.o(supplementChemical),
        Z: common_vendor.p({
          name: "setting-fill",
          size: "40"
        }),
        aa: common_vendor.o(gotoModifyChemicalInfo),
        ab: common_vendor.p({
          name: "trash-fill",
          size: "40"
        }),
        ac: common_vendor.o(deleteChemical)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ea5ca1cc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chemicals/detail.js.map
