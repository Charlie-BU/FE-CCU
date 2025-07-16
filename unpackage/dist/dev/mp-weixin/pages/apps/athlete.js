"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_magic = require("../../utils/js/magic.js");
const _sfc_main = {
  data() {
    return {
      user: "",
      message: "",
      search_athlete: "",
      athletes: [],
      athlete_list: [
        {
          name: "中国运动员"
        },
        {
          name: "外国运动员"
        },
        {
          name: "男子运动员"
        },
        {
          name: "女子运动员"
        },
        {
          name: "全部"
        }
      ],
      current: 0,
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
    utils_js_api.uniRequest("POST", "get_Chinese_athletes", null, "application", (res) => {
      this.athletes = res.data.athletes;
      common_vendor.wx$1.hideToast();
    });
  },
  methods: {
    onInput(e) {
      this.search_athlete = e.target.value;
    },
    back() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    search() {
      this.current = 4;
      common_vendor.wx$1.showToast({
        title: "加载中",
        icon: "loading",
        duration: 1e5
      });
      let data = { "search_athlete": this.search_athlete };
      utils_js_api.uniRequest("POST", "find_athlete_by_name", data, "application", (res) => {
        this.athletes = res.data.athletes;
        common_vendor.wx$1.hideToast();
      });
    },
    change(index) {
      this.current = index;
      if (index == 0) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_Chinese_athletes", null, "application", (res) => {
          this.athletes = res.data.athletes;
          common_vendor.wx$1.hideToast();
        });
      } else if (index == 1) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_foreign_athletes", null, "application", (res) => {
          this.athletes = res.data.athletes;
          common_vendor.wx$1.hideToast();
        });
      } else if (index == 2) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_male_athletes", null, "application", (res) => {
          this.athletes = res.data.athletes;
          common_vendor.wx$1.hideToast();
        });
      } else if (index == 3) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_female_athletes", null, "application", (res) => {
          this.athletes = res.data.athletes;
          common_vendor.wx$1.hideToast();
        });
      } else if (index == 4) {
        common_vendor.wx$1.showToast({
          title: "加载中",
          icon: "loading",
          duration: 1e5
        });
        utils_js_api.uniRequest("POST", "get_athletes", null, "application", (res) => {
          this.athletes = res.data.athletes;
          common_vendor.wx$1.hideToast();
        });
      }
    },
    image_operation(image_url) {
      common_vendor.wx$1.previewImage({
        urls: [image_url],
        current: image_url
      });
    },
    anecdote(athlete) {
      if (!athlete.anecdote) {
        common_vendor.wx$1.showToast({
          title: "该运动员暂未完善轶闻趣事",
          icon: "none",
          duration: 1e3
        });
        return;
      }
      common_vendor.wx$1.showModal({
        title: athlete.name + "的轶闻趣事",
        content: athlete.anecdote,
        showCancel: false,
        confirmText: "退出"
      });
    },
    comment(athlete) {
      if (!athlete.comment) {
        common_vendor.wx$1.showToast({
          title: "该运动员暂未完善人物评价",
          icon: "none",
          duration: 1e3
        });
        return;
      }
      common_vendor.wx$1.showModal({
        title: athlete.name + "的人物评价",
        content: athlete.comment,
        showCancel: false,
        confirmText: "退出"
      });
    }
  }
};
if (!Array) {
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  (_easycom_u_tabs2 + _easycom_u_search2)();
}
const _easycom_u_tabs = () => "../../uni_modules/vk-uview-ui/components/u-tabs/u-tabs.js";
const _easycom_u_search = () => "../../uni_modules/vk-uview-ui/components/u-search/u-search.js";
if (!Math) {
  (_easycom_u_tabs + _easycom_u_search)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.change),
    b: common_vendor.p({
      list: $data.athlete_list,
      ["bg-color"]: "null",
      ["active-color"]: "#F25C07",
      ["font-size"]: "20rpx",
      ["is-scroll"]: "true",
      current: $data.current
    }),
    c: common_vendor.o(($event) => $data.search_athlete = $event),
    d: common_vendor.p({
      ["bg-color"]: "#ffffff",
      ["show-action"]: false,
      placeholder: "输入运动员姓名",
      modelValue: $data.search_athlete
    }),
    e: common_vendor.o((...args) => $options.search && $options.search(...args)),
    f: $data.athletes.length != 0
  }, $data.athletes.length != 0 ? {
    g: common_vendor.f($data.athletes, (athlete, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: athlete.nationality
      }, athlete.nationality ? {
        c: common_vendor.t(athlete.nationality)
      } : {}, {
        d: athlete.image_url
      }, athlete.image_url ? {
        e: athlete.image_url,
        f: common_vendor.o(($event) => $options.image_operation(athlete.image_url), index)
      } : {}, {
        g: athlete.glory
      }, athlete.glory ? {
        h: common_vendor.t(athlete.glory)
      } : {}, {
        i: athlete.name && athlete.gender == "男"
      }, athlete.name && athlete.gender == "男" ? {
        j: common_vendor.t(athlete.name)
      } : athlete.name && athlete.gender == "女" ? {
        l: common_vendor.t(athlete.name)
      } : {}, {
        k: athlete.name && athlete.gender == "女",
        m: athlete.hand && athlete.grip && athlete.particle == "否"
      }, athlete.hand && athlete.grip && athlete.particle == "否" ? {
        n: common_vendor.t(athlete.hand),
        o: common_vendor.t(athlete.grip)
      } : athlete.hand && athlete.grip && athlete.particle == "是" ? {
        q: common_vendor.t(athlete.hand),
        r: common_vendor.t(athlete.grip)
      } : {}, {
        p: athlete.hand && athlete.grip && athlete.particle == "是",
        s: athlete.blade
      }, athlete.blade ? {
        t: common_vendor.t(athlete.blade)
      } : {}, {
        v: athlete.forehand
      }, athlete.forehand ? {
        w: common_vendor.t(athlete.forehand)
      } : {}, {
        x: athlete.backhand
      }, athlete.backhand ? {
        y: common_vendor.t(athlete.backhand)
      } : {}, {
        z: athlete.description
      }, athlete.description ? {
        A: common_vendor.t(athlete.description)
      } : {}, {
        B: athlete.personal_style
      }, athlete.personal_style ? {
        C: common_vendor.t(athlete.personal_style)
      } : {}, {
        D: common_vendor.o(($event) => $options.anecdote(athlete), index),
        E: common_vendor.o(($event) => $options.comment(athlete), index),
        F: index
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-00dfaea5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/apps/athlete.js.map
