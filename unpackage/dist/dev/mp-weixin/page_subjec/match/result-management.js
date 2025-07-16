"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const _sfc_main = {
  data() {
    return {
      user: "",
      match: "",
      players: []
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    common_vendor.wx$1.showToast({
      title: "加载中",
      icon: "loading",
      duration: 1e5
    });
    let match_id = common_vendor.index.getStorageSync("match_id");
    utils_js_api.uniRequest("POST", "get_this_match", { "match_id": match_id }, "competition", (res) => {
      this.match = res.data.match;
    });
    utils_js_api.uniRequest("POST", "get_match_players", { "match_id": match_id }, "competition", (res) => {
      this.players = res.data.players;
      common_vendor.wx$1.hideToast();
    });
  },
  methods: {
    record(player_x, player_y) {
      common_vendor.index.setStorageSync("match_id", this.match.id);
      common_vendor.index.setStorageSync("player_x", player_x);
      common_vendor.index.setStorageSync("player_y", player_y);
      common_vendor.index.navigateTo({
        url: "/page_subjec/match/result-record"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.match.title),
    b: common_vendor.t($data.match.system),
    c: common_vendor.p({
      width: "20rpx"
    }),
    d: common_vendor.f($data.players, (player, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: index,
        c: "3d8f050f-3-" + i0 + ",3d8f050f-1"
      };
    }),
    e: common_vendor.p({
      width: "20rpx"
    }),
    f: common_vendor.p({
      width: "20rpx"
    }),
    g: common_vendor.p({
      width: "20rpx"
    }),
    h: common_vendor.f($data.players, (player_x, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(player_x.username),
        c: "3d8f050f-7-" + i0 + "," + ("3d8f050f-6-" + i0),
        d: common_vendor.f($data.players, (player_y, index2, i1) => {
          return common_vendor.e({
            a: player_x == player_y
          }, player_x == player_y ? {
            b: "3d8f050f-9-" + i0 + "-" + i1 + "," + ("3d8f050f-8-" + i0 + "-" + i1)
          } : {
            c: common_vendor.o(($event) => $options.record(player_x, player_y), index2)
          }, {
            d: index2,
            e: "3d8f050f-8-" + i0 + "-" + i1 + "," + ("3d8f050f-6-" + i0)
          });
        }),
        e: index,
        f: "3d8f050f-6-" + i0 + ",3d8f050f-0"
      };
    }),
    i: common_vendor.p({
      stripe: true,
      emptyText: "无数据"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3d8f050f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/match/result-management.js.map
