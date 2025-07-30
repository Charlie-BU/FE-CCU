"use strict";
const common_vendor = require("../../common/vendor.js");
function format_time(datetime) {
  const date = new Date(datetime);
  if (isNaN(date.getTime())) {
    common_vendor.index.__f__("log", "at utils/js/utils.js:99", "Invalid datetime:", datetime);
    return null;
  }
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const previewImage = (URLs) => {
  if (typeof URLs === "string") {
    common_vendor.index.previewImage({
      urls: [URLs],
      current: URLs
    });
  } else if (Array.isArray(URLs)) {
    common_vendor.index.previewImage({
      urls: URLs,
      current: URLs[0] || ""
    });
  }
};
exports.format_time = format_time;
exports.previewImage = previewImage;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/js/utils.js.map
