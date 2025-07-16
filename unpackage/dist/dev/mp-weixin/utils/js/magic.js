"use strict";
const get_time_now = () => {
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const timecode = year + month + day + hour;
  return timecode;
};
const magic = () => {
  const timecode = get_time_now();
  const daycode = timecode.slice(0, -2);
  if (timecode === "2025021508x" || timecode === "2025021509x" || timecode === "2025021510x" || timecode === "2025021420x") {
    return false;
  } else if (daycode === "2024091x") {
    return false;
  }
  return true;
};
exports.magic = magic;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/js/magic.js.map
