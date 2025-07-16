"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      message: "",
      user: "",
      TJTTer: "",
      department: "",
      job: "",
      property: "",
      description: "",
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    if (!this.user || this.user.usertype != "K11") {
      common_vendor.wx$1.showToast({
        title: "权限不足",
        icon: "none",
        duration: 1500
      });
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }, 1e3);
    }
    let TJTTer_id = common_vendor.index.getStorageSync("TJTTer_id");
    if (!TJTTer_id) {
      common_vendor.wx$1.showToast({
        title: "服务器繁忙，请稍后再试",
        icon: "none",
        duration: 1500
      });
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }, 1e3);
    } else {
      utils_js_api.uniRequest("POST", "get_this_TJTTer", { "TJTTer_id": TJTTer_id }, "user", (res) => {
        this.TJTTer = res.data.TJTTer;
      });
    }
  },
  methods: {
    onInput(e) {
      this.description = e.target.value;
    },
    which_department(e) {
      this.department = e.detail.value;
    },
    which_job(e) {
      this.job = e.detail.value;
    },
    which_property(e) {
      this.property = e.detail.value;
    },
    backref() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    modify() {
      common_vendor.wx$1.showToast({
        title: "修改中",
        icon: "loading",
        duration: 1e5
      });
      let data = {
        "my_id": this.user.id,
        "TJTTer_id": this.TJTTer.id,
        "department": this.department,
        "job": this.job,
        "property": this.property,
        "description": this.description
      };
      utils_js_api.uniRequest("POST", "modify_TJTTer_info", data, "user", (res) => {
        common_vendor.wx$1.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1e3
        });
        if (res.data.status == 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/apps/TJTTers"
            });
          }, 1e3);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.backref()),
    c: $data.TJTTer.name,
    d: common_vendor.f(["技术端", "组织端", "文化端"], (department, k0, i0) => {
      return {
        a: department,
        b: $data.TJTTer.department === department,
        c: common_vendor.t(department),
        d: department
      };
    }),
    e: common_vendor.o((...args) => $options.which_department && $options.which_department(...args)),
    f: common_vendor.f(["负责人", "顾问", "组长", "成员"], (job, k0, i0) => {
      return {
        a: job,
        b: $data.TJTTer.job === job,
        c: common_vendor.t(job),
        d: job
      };
    }),
    g: common_vendor.o((...args) => $options.which_job && $options.which_job(...args)),
    h: common_vendor.f(["0期创始成员", "1期成员", "2期成员"], (property, k0, i0) => {
      return {
        a: property,
        b: $data.TJTTer.property === property,
        c: common_vendor.t(property),
        d: property
      };
    }),
    i: common_vendor.o((...args) => $options.which_property && $options.which_property(...args)),
    j: $data.TJTTer.description,
    k: $data.description,
    l: common_vendor.o(($event) => $data.description = $event.detail.value),
    m: common_vendor.o((...args) => $options.modify && $options.modify(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/apps/modify-TJTTer-info.js.map
