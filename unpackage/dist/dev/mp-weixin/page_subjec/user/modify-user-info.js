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
      user_x: "",
      organs: [],
      gender: "",
      address: "",
      phone: "",
      email: "",
      school: "",
      role: "",
      organ_id: "",
      stu_num: "",
      hand: "",
      grip: "",
      blade: "",
      forehand: "",
      backhand: "",
      particle: "",
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
    let user_id = common_vendor.index.getStorageSync("user_id");
    if (!user_id) {
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
      utils_js_api.uniRequest("POST", "get_this_user", { "user_id": user_id }, "user", (res) => {
        this.user_x = res.data.user;
      });
    }
    utils_js_api.uniRequest("POST", "fetch_organs", null, "competition", (res) => {
      this.organs = res.data.organs;
    });
  },
  methods: {
    onInput(e) {
      this.phone = e.target.value;
      this.email = e.target.value;
      this.school = e.target.value;
      this.stu_num = e.target.value;
      this.blade = e.target.value;
      this.forehand = e.target.value;
      this.backhand = e.target.value;
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
    which_organ_id(e) {
      this.organ_id = parseInt(e.detail.value);
    },
    which_hand(e) {
      this.hand = e.detail.value;
    },
    which_grip(e) {
      this.grip = e.detail.value;
    },
    which_particle(e) {
      this.particle = e.detail.value;
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
        "user_id": this.user_x.id,
        "gender": this.gender,
        "address": this.address,
        "phone": this.phone,
        "email": this.email,
        "school": this.school,
        "role": this.role,
        "organ_id": this.organ_id,
        "stu_num": this.stu_num,
        "hand": this.hand,
        "grip": this.grip,
        "blade": this.blade,
        "forehand": this.forehand,
        "backhand": this.backhand,
        "particle": this.particle
      };
      utils_js_api.uniRequest("POST", "modify_user", data, "user", (res) => {
        common_vendor.wx$1.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1e3
        });
        if (res.data.status == 200) {
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/page_subjec/user/user-detail"
            });
          }, 1e3);
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
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.backref()),
    c: $data.user_x.username,
    d: $data.user_x.gender == "男"
  }, $data.user_x.gender == "男" ? {} : {}, {
    e: $data.user_x.gender == "女"
  }, $data.user_x.gender == "女" ? {} : {}, {
    f: common_vendor.o((...args) => $options.which_gender && $options.which_gender(...args)),
    g: common_vendor.t($data.address ? $data.address : $data.user_x.address),
    h: common_vendor.p({
      name: "arrow-down",
      size: "28"
    }),
    i: common_vendor.o((...args) => $options.pick_addr && $options.pick_addr(...args)),
    j: $data.user_x.phone,
    k: $data.phone,
    l: common_vendor.o(($event) => $data.phone = $event.detail.value),
    m: $data.user_x.email,
    n: $data.email,
    o: common_vendor.o(($event) => $data.email = $event.detail.value),
    p: $data.user_x.school,
    q: $data.school,
    r: common_vendor.o(($event) => $data.school = $event.detail.value),
    s: $data.user_x.role == "学生"
  }, $data.user_x.role == "学生" ? {} : {}, {
    t: $data.user_x.role == "教师"
  }, $data.user_x.role == "教师" ? {} : {}, {
    v: $data.user_x.role == "校友及校外人士"
  }, $data.user_x.role == "校友及校外人士" ? {} : {}, {
    w: common_vendor.o((...args) => $options.which_role && $options.which_role(...args)),
    x: $data.user_x.stu_num,
    y: $data.stu_num,
    z: common_vendor.o(($event) => $data.stu_num = $event.detail.value),
    A: common_vendor.f(this.organs, (organ, index, i0) => {
      return common_vendor.e({
        a: $data.user_x.organ_id == organ.id
      }, $data.user_x.organ_id == organ.id ? {
        b: organ.id,
        c: common_vendor.t(organ.organname)
      } : {
        d: organ.id,
        e: common_vendor.t(organ.organname)
      }, {
        f: index
      });
    }),
    B: common_vendor.o((...args) => $options.which_organ_id && $options.which_organ_id(...args)),
    C: $data.user_x.hand == "右手"
  }, $data.user_x.hand == "右手" ? {} : {}, {
    D: $data.user_x.hand == "左手"
  }, $data.user_x.hand == "左手" ? {} : {}, {
    E: common_vendor.o((...args) => $options.which_hand && $options.which_hand(...args)),
    F: $data.user_x.grip == "横拍"
  }, $data.user_x.grip == "横拍" ? {} : {}, {
    G: $data.user_x.grip == "直拍"
  }, $data.user_x.grip == "直拍" ? {} : {}, {
    H: common_vendor.o((...args) => $options.which_grip && $options.which_grip(...args)),
    I: $data.user_x.blade,
    J: $data.blade,
    K: common_vendor.o(($event) => $data.blade = $event.detail.value),
    L: $data.user_x.forehand,
    M: $data.forehand,
    N: common_vendor.o(($event) => $data.forehand = $event.detail.value),
    O: $data.user_x.backhand,
    P: $data.backhand,
    Q: common_vendor.o(($event) => $data.backhand = $event.detail.value),
    R: $data.user_x.particle == "是"
  }, $data.user_x.particle == "是" ? {} : {}, {
    S: $data.user_x.particle == "否"
  }, $data.user_x.particle == "否" ? {} : {}, {
    T: common_vendor.o((...args) => $options.which_particle && $options.which_particle(...args)),
    U: common_vendor.o((...args) => $options.modify && $options.modify(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/page_subjec/user/modify-user-info.js.map
