"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_vkUviewUi_index = require("./uni_modules/vk-uview-ui/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/equipment/index.js";
  "./pages/equipment/add-or-modify.js";
  "./pages/chemicals/index.js";
  "./pages/chemicals/detail.js";
  "./pages/chemicals/add-or-modify.js";
  "./pages/chemicals/chemical-use-logs.js";
  "./pages/index/release-notice.js";
  "./pages/user-list/index.js";
  "./pages/user-list/unchecked-users.js";
  "./pages/my/index.js";
  "./pages/my/modifyPwd.js";
  "./pages/login/login.js";
  "./pages/login/register.js";
  "./pages/login/forgetPwd.js";
  "./pages/management/index.js";
  "./pages/apps/index.js";
  "./pages/apps/standard.js";
  "./pages/apps/TJTTers.js";
  "./pages/apps/modify-TJTTer-info.js";
  "./pages/apps/athlete.js";
  "./page_subjec/user/user-list.js";
  "./page_subjec/user/add-user.js";
  "./page_subjec/user/user-detail.js";
  "./page_subjec/user/modify-user-info.js";
  "./page_subjec/organization/organ-list.js";
  "./page_subjec/organization/add-organ.js";
  "./page_subjec/match/score-update.js";
  "./page_subjec/team/team-list.js";
  "./page_subjec/team/add-team.js";
  "./page_subjec/team/members.js";
  "./page_subjec/match/index.js";
  "./page_subjec/match/sign_up.js";
  "./page_subjec/match/detail.js";
  "./page_subjec/match/hold-match.js";
  "./page_subjec/match/modify-match-info.js";
  "./page_subjec/match/players.js";
  "./page_subjec/match/result-management.js";
  "./page_subjec/match/result-record.js";
  "./page_subjec/match/result-announce.js";
  "./page_subjec/agendas/index.js";
  "./page_subjec/log/score-log.js";
  "./page_subjec/log/action-log.js";
  "./page_subjec/webview/TTTA.js";
  "./page_subjec/webview/studio-intro.js";
  "./page_subjec/motto/add-motto.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
const Tabbar = () => "./components/tabbar/index.js";
const cuCustom = () => "./components/colorui/components/cu-custom.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("tabbar", Tabbar);
  app.component("cu-custom", cuCustom);
  app.use(uni_modules_vkUviewUi_index.uView);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
