"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_wxLogin = require("../../utils/js/wxLogin.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const show = utils_js_magic.magic();
    const gotoHomepage = () => {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    };
    const gotoRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    };
    const gotoForgetPwd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/forgetPwd"
      });
    };
    const policy = () => {
      common_vendor.wx$1.showModal({
        title: "用户服务协议与隐私政策",
        content: "1.在您注册、登录本平台之前，请仔细阅读以下用户服务协议。注册/登录本平台，即表示您同意遵守以下协议;2.我们将严格保护用户的个人隐私信息，不会将用户的个人信息透露给任何第三方。但在法律规定的情况下，我们可能会根据相关法律法规要求向有关部门提供用户的个人信息;3. 本平台不对用户因使用本平台服务而产生的任何直接或间接损失承担责任。用户在使用本平台服务时，需自行承担风险，并且同意在任何情况下不追究本平台的责任;4.本平台有权根据需要对用户服务协议进行修改，修改后的协议将在平台上公布。用户继续使用本平台服务即视为同意修改后的协议。",
        showCancel: false,
        confirmText: "同意"
      });
    };
    const nameOrPhone = common_vendor.ref("");
    const password = common_vendor.ref("");
    const bindWxLogin = common_vendor.ref(true);
    const whetherBindWxLogin = (e) => {
      bindWxLogin.value = e.detail.value.includes("agreed");
      common_vendor.index.__f__("log", "at pages/login/login.vue:87", bindWxLogin.value);
    };
    const agree = common_vendor.ref(false);
    const whetherAgree = (e) => {
      agree.value = e.detail.value === "agreed" ? true : false;
    };
    const login = async () => {
      common_vendor.index.showToast({
        title: "登录中",
        icon: "loading",
        duration: 1e5
      });
      const loginData = {
        nameOrPhone: nameOrPhone.value,
        password: password.value,
        agree: agree.value
      };
      if (!loginData.nameOrPhone || !loginData.password) {
        common_vendor.index.showToast({
          title: "请填写完整",
          icon: "none",
          duration: 700
        });
        return;
      }
      if (!loginData.agree) {
        common_vendor.index.showToast({
          title: "请同意小程序的协议与隐私政策",
          icon: "none",
          duration: 700
        });
        return;
      }
      try {
        const res = await utils_js_api.uniRequest("POST", "user", "/login", loginData);
        if (res.status !== 200) {
          common_vendor.index.showToast({
            title: res.message,
            icon: "none",
            duration: 700
          });
          return;
        }
        common_vendor.index.setStorageSync("sessionid", res.sessionid);
        if (bindWxLogin.value) {
          const openidAndSessionKey = await utils_js_wxLogin.getOpenidAndSessionKey();
          if (openidAndSessionKey) {
            const res2 = await utils_js_api.uniRequest("POST", "user", "/storeOpenid", { sessionid: res.sessionid, openid: openidAndSessionKey[0] });
            if (res2.status === 200) {
              common_vendor.index.showToast({
                title: res.message + "，之后可进行微信一键登录",
                icon: "none",
                duration: 800
              });
              setTimeout(() => {
                common_vendor.index.reLaunch({
                  url: "/pages/index/index"
                });
              }, 800);
              return;
            }
          }
        }
        common_vendor.index.showToast({
          title: res.message,
          icon: "none",
          duration: 800
        });
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        }, 800);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/login/login.vue:166", "Login fail: ", e);
      }
    };
    const wxLogin = async () => {
      if (!agree.value) {
        common_vendor.index.showToast({
          title: "请同意小程序的协议与隐私政策",
          icon: "none",
          duration: 700
        });
        return;
      }
      common_vendor.index.showToast({
        title: "登录中",
        icon: "loading",
        duration: 1e5
      });
      const openidAndSessionKey = await utils_js_wxLogin.getOpenidAndSessionKey();
      if (!openidAndSessionKey) {
        common_vendor.index.showToast({
          title: "登录失败，请换其他方式登录",
          icon: "none",
          duration: 700
        });
        return;
      }
      const res = await utils_js_api.uniRequest("POST", "user", "/wxLogin", { openid: openidAndSessionKey[0], session_key: openidAndSessionKey[1] });
      if (res.status < -3) {
        common_vendor.index.showToast({
          title: res.message,
          icon: "none",
          duration: 1e3
        });
        return;
      }
      if (res.status !== 200) {
        common_vendor.index.__f__("log", "at pages/login/login.vue:204", res.message);
        common_vendor.index.showToast({
          title: "登录失败，请换其他方式登录",
          icon: "none",
          duration: 700
        });
        return;
      }
      common_vendor.index.setStorageSync("sessionid", res.sessionid);
      common_vendor.index.showToast({
        title: res.message,
        icon: "none",
        duration: 700
      });
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }, 700);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.o(gotoHomepage),
        c: nameOrPhone.value,
        d: common_vendor.o(($event) => nameOrPhone.value = $event.detail.value),
        e: password.value,
        f: common_vendor.o(($event) => password.value = $event.detail.value),
        g: common_vendor.o(whetherBindWxLogin),
        h: common_vendor.o(policy),
        i: common_vendor.o(whetherAgree),
        j: common_vendor.o(login),
        k: common_vendor.o(wxLogin),
        l: common_vendor.unref(show)
      }, common_vendor.unref(show) ? {
        m: common_vendor.o(gotoRegister)
      } : {}, {
        n: common_vendor.unref(show)
      }, common_vendor.unref(show) ? {
        o: common_vendor.o(gotoForgetPwd)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
