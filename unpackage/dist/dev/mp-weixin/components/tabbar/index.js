"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  props: {
    currentPage: {
      type: Number,
      default: 0,
      show: false
    }
  },
  data() {
    return {
      currentItem: 0
    };
  },
  mounted() {
    this.currentItem = this.currentPage;
  },
  computed: {
    shopNum() {
    },
    flagShow() {
      return false;
    }
  },
  methods: {
    NavChange(e) {
      common_vendor.index.switchTab({
        url: e
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.currentPage == 0,
    b: common_assets._imports_0,
    c: $props.currentPage != 0,
    d: common_assets._imports_1,
    e: common_vendor.n($props.currentPage == 0 ? "text-blue  " : "text-gray"),
    f: common_vendor.o(($event) => $options.NavChange("/pages/index/index")),
    g: $props.currentPage == 1,
    h: common_assets._imports_2,
    i: $props.currentPage != 1,
    j: common_assets._imports_3,
    k: common_vendor.n($props.currentPage == 1 ? "text-blue" : "text-gray"),
    l: common_vendor.o(($event) => $options.NavChange("/pages/equipment/index")),
    m: $props.currentPage == 2,
    n: common_assets._imports_4,
    o: $props.currentPage != 2,
    p: common_assets._imports_5,
    q: common_vendor.n($props.currentPage == 2 ? "text-blue" : "text-gray"),
    r: common_vendor.o(($event) => $options.NavChange("/pages/user-list/index")),
    s: $options.flagShow
  }, $options.flagShow ? {
    t: common_vendor.t($options.shopNum)
  } : {}, {
    v: $props.currentPage == 3,
    w: common_assets._imports_6,
    x: $props.currentPage != 3,
    y: common_assets._imports_7,
    z: common_vendor.n($props.currentPage == 3 ? "text-blue" : "text-gray"),
    A: common_vendor.o(($event) => $options.NavChange("/pages/chemicals/index")),
    B: $props.currentPage == 4,
    C: common_assets._imports_8,
    D: $props.currentPage != 4,
    E: common_assets._imports_9,
    F: common_vendor.n($props.currentPage == 4 ? "text-blue" : "text-gray"),
    G: common_vendor.o(($event) => $options.NavChange("/pages/my/index"))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0e399a7b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tabbar/index.js.map
