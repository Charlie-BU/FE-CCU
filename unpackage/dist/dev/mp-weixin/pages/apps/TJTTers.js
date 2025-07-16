"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  data() {
    return {
      user: "",
      activeBtn: 0,
      current: 0,
      TJTTers: [],
      hide_this: utils_js_magic.magic()
    };
  },
  onLoad() {
    utils_js_loginCheck.loginCheck();
    common_vendor.wx$1.showToast({
      title: "加载中",
      icon: "loading",
      duration: 1e5
    });
    utils_js_api.uniRequest("POST", "update_TJTTers", null, "application", (res) => {
      common_vendor.index.__f__("log", "at pages/apps/TJTTers.vue:66", res.data.message);
    });
    utils_js_api.uniRequest("POST", "get_TJTTers", null, "application", (res) => {
      this.TJTTers = res.data.TJTTers;
      common_vendor.wx$1.hideToast();
    });
  },
  methods: {
    setAbtn(e) {
      this.activeBtn = e;
      if (e == 0) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_TJTTers", null, "application", (res) => {
          this.TJTTers = res.data.TJTTers;
          common_vendor.wx$1.hideToast();
        });
      } else if (e == 1) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_dept_technology_TJTTers", null, "application", (res) => {
          this.TJTTers = res.data.TJTTers;
          common_vendor.wx$1.hideToast();
        });
      } else if (e == 2) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_dept_organizing_TJTTers", null, "application", (res) => {
          this.TJTTers = res.data.TJTTers;
          common_vendor.wx$1.hideToast();
        });
      } else if (e == 3) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_dept_culture_TJTTers", null, "application", (res) => {
          this.TJTTers = res.data.TJTTers;
          common_vendor.wx$1.hideToast();
        });
      }
    },
    avatar_operation(TJTTer) {
      if (this.user.usertype != "K11") {
        let avatarUrl = TJTTer.avatar_url;
        if (avatarUrl) {
          common_vendor.wx$1.previewImage({
            urls: [avatarUrl],
            current: avatarUrl
          });
        }
      } else {
        common_vendor.wx$1.showActionSheet({
          itemList: ["查看头像", "修改信息"],
          success: (res) => {
            if (!res.cancel) {
              let avatarUrl = TJTTer.avatar_url;
              if (res.tapIndex == 0) {
                if (avatarUrl) {
                  common_vendor.wx$1.previewImage({
                    urls: [avatarUrl],
                    current: avatarUrl
                  });
                } else {
                  common_vendor.wx$1.showToast({
                    title: "该成员暂未上传头像",
                    icon: "none",
                    duration: 1e3
                  });
                }
              } else if (res.tapIndex == 1) {
                common_vendor.index.setStorageSync("TJTTer_id", TJTTer.id);
                common_vendor.index.navigateTo({
                  url: "/pages/apps/modify-TJTTer-info"
                });
              } else if (res.tapIndex == 2) {
                if (!avatarUrl) {
                  common_vendor.wx$1.showToast({
                    title: "该用户还未上传头像",
                    icon: "none",
                    duration: 1e3
                  });
                  return;
                }
                common_vendor.wx$1.showModal({
                  title: "删除头像",
                  content: "确定删除该用户头像？",
                  success: (res2) => {
                    if (res2.confirm) {
                      let data = {
                        "my_id": this.user.id,
                        "user_id": this.user_x.id
                      };
                      utils_js_api.uniRequest("POST", "delete_user_profile_img", data, "user", (res3) => {
                        common_vendor.wx$1.showToast({
                          title: res3.data.message,
                          icon: "none",
                          duration: 1e3
                        });
                        if (res3.data.status == 200) {
                          setTimeout(() => {
                            common_vendor.index.reLaunch({
                              url: "/page_subjec/user/user-detail"
                            });
                          }, 1e3);
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.setAbtn(0)),
    b: common_vendor.n($data.activeBtn == 0 ? "bg-cyan cu-btn" : " cu-btn line-cyan"),
    c: common_vendor.o(($event) => $options.setAbtn(1)),
    d: common_vendor.n($data.activeBtn == 1 ? "cu-btn bg-purple" : "cu-btn line-purple"),
    e: common_vendor.o(($event) => $options.setAbtn(2)),
    f: common_vendor.n($data.activeBtn == 2 ? "cu-btn bg-blue" : "cu-btn line-blue"),
    g: common_vendor.o(($event) => $options.setAbtn(3)),
    h: common_vendor.n($data.activeBtn == 3 ? "cu-btn bg-orange" : "cu-btn line-orange"),
    i: common_vendor.f(this.TJTTers, (TJTTer, index, i0) => {
      return common_vendor.e({
        a: TJTTer.avatar_url
      }, TJTTer.avatar_url ? {
        b: TJTTer.avatar_url
      } : {}, {
        c: common_vendor.o(($event) => $options.avatar_operation(TJTTer), index),
        d: TJTTer.gender == "男"
      }, TJTTer.gender == "男" ? common_vendor.e({
        e: common_vendor.t(TJTTer.name),
        f: TJTTer.email
      }, TJTTer.email ? {
        g: common_vendor.t(TJTTer.email)
      } : {}) : TJTTer.gender == "女" ? common_vendor.e({
        i: common_vendor.t(TJTTer.name),
        j: TJTTer.email
      }, TJTTer.email ? {
        k: common_vendor.t(TJTTer.email)
      } : {}) : {}, {
        h: TJTTer.gender == "女",
        l: common_vendor.t(TJTTer.department),
        m: common_vendor.t(TJTTer.job),
        n: common_vendor.t(TJTTer.property),
        o: TJTTer.description
      }, TJTTer.description ? {
        p: common_vendor.t(TJTTer.description)
      } : {}, {
        q: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a9121e35"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/apps/TJTTers.js.map
