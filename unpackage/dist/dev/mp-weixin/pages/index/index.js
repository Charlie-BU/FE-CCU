"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_js_api = require("../../utils/js/api.js");
const utils_js_loginCheck = require("../../utils/js/loginCheck.js");
const utils_js_utils = require("../../utils/js/utils.js");
const utils_js_magic = require("../../utils/js/magic.js");
if (!Array) {
  const _component_tabbar = common_vendor.resolveComponent("tabbar");
  _component_tabbar();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const show = utils_js_magic.magic();
    const briefUserInfo = common_vendor.ref(null);
    const swiperItems = common_vendor.ref([]);
    for (let i = 1; i < 29; i++) {
      swiperItems.value.push(`https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/figures/${i}.png`);
    }
    common_vendor.onMounted(async () => {
      briefUserInfo.value = await utils_js_loginCheck.loginCheck();
      await getAllNotices();
    });
    common_vendor.onPullDownRefresh(async () => {
      try {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
        common_vendor.index.stopPullDownRefresh();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:88", error);
      }
    });
    const notices = common_vendor.ref([]);
    const getAllNotices = async () => {
      const data = {
        sessionid: common_vendor.index.getStorageSync("sessionid")
      };
      const res = await utils_js_api.uniRequest("POST", "extras", "/getAllNotice", data);
      if (res.status < 0)
        return;
      notices.value = res.notices;
    };
    const gotoReleaseNotice = () => {
      common_vendor.index.navigateTo({
        url: "/pages/index/release-notice"
      });
    };
    const deleteNotice = async (noticeId) => {
      common_vendor.index.showModal({
        title: "删除通知公告",
        content: "通知公告删除后不可恢复，您确认删除该通知公告？",
        success: async (r) => {
          if (r.confirm) {
            common_vendor.index.showToast({
              title: "删除中",
              icon: "loading",
              duration: 1e5
            });
            const data = {
              sessionid: common_vendor.index.getStorageSync("sessionid"),
              noticeId
            };
            const res = await utils_js_api.uniRequest("POST", "extras", "/deleteNotice", data);
            common_vendor.index.showToast({
              title: res.message,
              icon: "none",
              duration: 800
            });
            if (res.status < 0)
              return;
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/index/index"
              });
            }, 800);
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: briefUserInfo.value
      }, briefUserInfo.value ? {
        b: common_vendor.t(briefUserInfo.value.username)
      } : {}, {
        c: common_vendor.o(($event) => utils_js_utils.previewImage("https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/group.jpg")),
        d: common_vendor.o(() => {
        }),
        e: common_assets._imports_0$1,
        f: common_vendor.o(() => {
        }),
        g: common_vendor.o(() => {
        }),
        h: common_assets._imports_1$1,
        i: common_vendor.o(() => {
        }),
        j: swiperItems.value.length !== 0
      }, swiperItems.value.length !== 0 ? {
        k: common_vendor.f(swiperItems.value, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        })
      } : {}, {
        l: briefUserInfo.value && common_vendor.unref(show)
      }, briefUserInfo.value && common_vendor.unref(show) ? common_vendor.e({
        m: common_vendor.o(gotoReleaseNotice),
        n: notices.value.length === 0
      }, notices.value.length === 0 ? {} : {}, {
        o: common_vendor.f(notices.value, (notice, index, i0) => {
          return {
            a: common_vendor.t(notice.title),
            b: common_vendor.t(notice.content),
            c: common_vendor.t(utils_js_utils.format_time(notice.time)),
            d: common_vendor.o(($event) => deleteNotice(notice.id), index),
            e: index
          };
        })
      }) : {}, {
        p: common_vendor.p({
          ["current-page"]: 0
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
