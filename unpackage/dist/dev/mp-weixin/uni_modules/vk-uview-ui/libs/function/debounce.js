"use strict";
let timeout = null;
function debounce(func, wait = 500, immediate = false) {
  if (timeout !== null)
    clearTimeout(timeout);
  if (immediate) {
    var callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow)
      typeof func === "function" && func();
  } else {
    timeout = setTimeout(() => {
      typeof func === "function" && func();
    }, wait);
  }
}
exports.debounce = debounce;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/vk-uview-ui/libs/function/debounce.js.map
