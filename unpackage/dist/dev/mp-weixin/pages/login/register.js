"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const show = utils_js_magic.magic();
    const user = common_vendor.ref(null);
    common_vendor.onMounted(async () => {
      const briefUserInfo = await utils_js_loginCheck.loginCheck();
      if (briefUserInfo) {
        user.value = await utils_js_loginCheck.getUserInfo();
      }
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const gotoLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    const form = common_vendor.ref({
      username: null,
      gender: null,
      // 1 for male, 2 for female
      email: "",
      phone: null,
      role: null,
      // 1 for student, 2 for teacher
      degree: null,
      // 1 for Bachelor, 2 for Master, 3 for PhD, 4 for Others
      workNum: null,
      graduateTime: "",
      password: null,
      confirmPassword: null
    });
    const handleGenderChange = (e) => {
      form.value.gender = +e.detail.value;
    };
    const handleRoleChange = (e) => {
      form.value.role = +e.detail.value;
    };
    const handleDegreeChange = (e) => {
      form.value.degree = +e.detail.value;
    };
    const handleGraduateTimeChange = (e) => {
      form.value.graduateTime = e.detail.value;
    };
    const requiredFields = common_vendor.ref({
      username: "姓名",
      gender: "性别",
      phone: "手机号",
      email: "电子邮箱",
      role: "身份",
      degree: "学位",
      workNum: "学号 / 工号",
      password: "密码",
      confirmPassword: "确认密码"
    });
    const register = async () => {
      common_vendor.index.showToast({
        title: "提交中",
        icon: "loading",
        duration: 1e5
      });
      const registerData = form.value;
      for (let requiredField in requiredFields.value) {
        if (!form.value[requiredField]) {
          common_vendor.index.showToast({
            title: `请输入${requiredFields.value[requiredField]}`,
            icon: "none",
            duration: 800
          });
          return;
        }
      }
      if (form.value.role == 1 && !form.value.graduateTime) {
        common_vendor.index.showToast({
          title: "请选择预计毕业时间",
          icon: "none"
        });
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^1[3-9]\d{9}$/;
      const pwdPattern = /^.{4,}$/;
      if (!emailPattern.test(registerData.email)) {
        common_vendor.index.showToast({
          title: "请输入有效的邮箱",
          icon: "none"
        });
        return;
      }
      if (!phonePattern.test(registerData.phone)) {
        common_vendor.index.showToast({
          title: "请输入有效的手机号",
          icon: "none"
        });
        return;
      }
      if (!pwdPattern.test(registerData.password)) {
        common_vendor.index.showToast({
          title: "密码长度必须大于3位",
          icon: "none"
        });
        return;
      }
      if (registerData.password !== registerData.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
        return;
      }
      const res = await utils_js_api.uniRequest("POST", "user", "/register", registerData);
      common_vendor.index.showToast({
        title: res.message,
        icon: "none",
        duration: 1e3
      });
      if (res.status === 200) {
        setTimeout(() => {
          gotoLogin();
        }, 1e3);
      }
    };
    const modifySubmit = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid"),
        userData: form.value
      };
      const res = await utils_js_api.uniRequest("POST", "user", "/modifyUserInfo", data);
      common_vendor.index.showToast({
        title: res.message,
        icon: "none",
        duration: 1e3
      });
      if (res.status === 200) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: `/pages/my/index`
          });
        }, 1e3);
      }
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.o(goBack),
        c: common_vendor.unref(show)
      }, common_vendor.unref(show) ? common_vendor.e({
        d: common_vendor.t(user.value ? "修改个人信息" : "用户注册"),
        e: user.value ? user.value.username : "请输入真实姓名",
        f: form.value.username,
        g: common_vendor.o(($event) => form.value.username = $event.detail.value),
        h: ((_a = user.value) == null ? void 0 : _a.gender) === 1,
        i: ((_b = user.value) == null ? void 0 : _b.gender) === 2,
        j: common_vendor.o(handleGenderChange),
        k: user.value ? user.value.phone : "请输入手机号",
        l: form.value.phone,
        m: common_vendor.o(($event) => form.value.phone = $event.detail.value),
        n: user.value ? user.value.email : "请输入电子邮箱",
        o: form.value.email,
        p: common_vendor.o(($event) => form.value.email = $event.detail.value),
        q: ((_c = user.value) == null ? void 0 : _c.role) === 1,
        r: user.value,
        s: ((_d = user.value) == null ? void 0 : _d.role) === 2,
        t: user.value,
        v: common_vendor.o(handleRoleChange),
        w: ((_e = user.value) == null ? void 0 : _e.degree) === 1,
        x: ((_f = user.value) == null ? void 0 : _f.degree) === 2,
        y: ((_g = user.value) == null ? void 0 : _g.degree) === 3,
        z: ((_h = user.value) == null ? void 0 : _h.degree) === 4,
        A: common_vendor.o(handleDegreeChange),
        B: user.value ? user.value.workNum : "请输入学号 / 工号",
        C: form.value.workNum,
        D: common_vendor.o(($event) => form.value.workNum = $event.detail.value),
        E: form.value.role == 1 || ((_i = user.value) == null ? void 0 : _i.role) === 1
      }, form.value.role == 1 || ((_j = user.value) == null ? void 0 : _j.role) === 1 ? {
        F: common_vendor.t(form.value.graduateTime || ((_k = user.value) == null ? void 0 : _k.graduateTime) || "请选择毕业时间"),
        G: form.value.graduateTime,
        H: common_vendor.o(handleGraduateTimeChange)
      } : {}, {
        I: !user.value
      }, !user.value ? {
        J: form.value.password,
        K: common_vendor.o(($event) => form.value.password = $event.detail.value)
      } : {}, {
        L: !user.value
      }, !user.value ? {
        M: form.value.confirmPassword,
        N: common_vendor.o(($event) => form.value.confirmPassword = $event.detail.value)
      } : {}, {
        O: !user.value
      }, !user.value ? {
        P: common_vendor.o(register)
      } : {
        Q: common_vendor.o(modifySubmit)
      }, {
        R: !user.value
      }, !user.value ? {
        S: common_vendor.o(gotoLogin)
      } : {}) : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
