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
      username: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      school: "",
      role: "",
      stu_num: "",
      password: "",
      score: "",
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    if (!this.user || this.user.usertype != "K9" && this.user.usertype != "K10" && this.user.usertype != "K11") {
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
  },
  methods: {
    onInput(e) {
      this.username = e.target.value;
      this.phone = e.target.value;
      this.email = e.target.value;
      this.school = e.target.value;
      this.stu_num = e.target.value;
      this.password = e.target.value;
      this.score = e.target.value;
    },
    pick_addr(event) {
      const selected_addr = event.detail.value;
      this.address = selected_addr[1];
    },
    which_gender(e) {
      this.gender = e.detail.value;
    },
    which_role(e) {
      this.role = e.detail.value;
    },
    backref() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    add_user() {
      common_vendor.wx$1.showToast({
        title: "添加中",
        icon: "loading",
        duration: 1e5
      });
      let data = {
        "my_id": this.user.id,
        "username": this.username,
        "gender": this.gender,
        "phone": this.phone,
        "email": this.email,
        "address": this.address,
        "school": this.school,
        "role": this.role,
        "stu_num": this.stu_num,
        "password": this.password,
        "score": this.score
      };
      utils_js_api.uniRequest("POST", "add_user", data, "user", (res) => {
        common_vendor.wx$1.showToast({
          title: res.data.message,
          icon: "none",
          duration: 700
        });
        if (res.data.status == 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/page_subjec/user/user-list"
            });
          }, 700);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.backref()),
    c: $data.username,
    d: common_vendor.o(($event) => $data.username = $event.detail.value),
    e: common_vendor.o((...args) => $options.which_gender && $options.which_gender(...args)),
    f: $data.phone,
    g: common_vendor.o(($event) => $data.phone = $event.detail.value),
    h: $data.email,
    i: common_vendor.o(($event) => $data.email = $event.detail.value),
    j: common_vendor.t($data.address ? $data.address : "请选择用户所在地区"),
    k: common_vendor.p({
      name: "arrow-down",
      size: "28"
    }),
    l: common_vendor.o((...args) => $options.pick_addr && $options.pick_addr(...args)),
    m: $data.school,
    n: common_vendor.o(($event) => $data.school = $event.detail.value),
    o: common_vendor.o((...args) => $options.which_role && $options.which_role(...args)),
    p: $data.stu_num,
    q: common_vendor.o(($event) => $data.stu_num = $event.detail.value),
    r: $data.password,
    s: common_vendor.o(($event) => $data.password = $event.detail.value),
    t: $data.score,
    v: common_vendor.o(($event) => $data.score = $event.detail.value),
    w: common_vendor.o((...args) => $options.add_user && $options.add_user(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/user/add-user.js.map
