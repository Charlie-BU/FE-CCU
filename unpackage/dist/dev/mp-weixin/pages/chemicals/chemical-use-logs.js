"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const _sfc_main = {
  __name: "chemical-use-logs",
  setup(__props) {
    const logs = common_vendor.ref([]);
    const searchKeyword = common_vendor.ref("");
    common_vendor.onMounted(async () => {
      const user = await new Promise((resolve) => {
        utils_js_loginCheck.loginCheck();
      });
      if (user) {
        fetchLogs();
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 2e3);
      }
    });
    const fetchLogs = async () => {
      try {
        const data = {
          sessionid: common_vendor.index.getStorageSync("sessionid"),
          keyword: searchKeyword.value
        };
        const res = await utils_js_api.uniRequest("POST", "chemical", "/getLogs", data);
        if (res.status === 200) {
          logs.value = res.logs;
        } else {
          common_vendor.index.showToast({
            title: res.message || "获取数据失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chemicals/chemical-use-logs.vue:93", "获取药品使用记录失败:", error);
        common_vendor.index.showToast({
          title: "获取数据失败，请稍后再试",
          icon: "none"
        });
      }
    };
    const searchLogs = () => {
      fetchLogs();
    };
    const formatDate = (dateString) => {
      if (!dateString)
        return "";
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(searchLogs),
        b: searchKeyword.value,
        c: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        d: common_vendor.o(searchLogs),
        e: logs.value.length > 0
      }, logs.value.length > 0 ? {
        f: common_vendor.f(logs.value, (log, index, i0) => {
          return {
            a: common_vendor.t(log.operatorName),
            b: common_vendor.t(log.operation),
            c: common_vendor.t(formatDate(log.time)),
            d: index
          };
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-af141d05"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chemicals/chemical-use-logs.js.map
