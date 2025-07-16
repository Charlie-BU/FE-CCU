"use strict";
const getUserGender = (gender) => ({ 1: "男", 2: "女" })[gender] || "未知";
const getUserRole = (role) => ({ 1: "学生", 2: "教师" })[role] || "未知";
const getUserDegree = (degree) => ({
  1: "学士",
  2: "硕士",
  3: "博士",
  4: "其他"
})[degree] || "未知";
const getChemicalType = (type) => ({ 1: "无机", 2: "有机" })[type] || "未知";
const getChemicalStatus = (status) => ({ 1: "充足", 2: "短缺" })[status] || "未知";
const getChemicalDangerLevel = (levels) => {
  const mapping = {
    1: "常规",
    2: "易燃",
    3: "易爆",
    4: "腐蚀",
    5: "易制毒",
    6: "易制爆"
  };
  return levels.map((level) => mapping[level] || "未知").join(" / ");
};
const getEquipmentStatus = (status) => ({ 1: "正常", 2: "异常", 3: "维修", 4: "报废" })[status] || "未知";
exports.getChemicalDangerLevel = getChemicalDangerLevel;
exports.getChemicalStatus = getChemicalStatus;
exports.getChemicalType = getChemicalType;
exports.getEquipmentStatus = getEquipmentStatus;
exports.getUserDegree = getUserDegree;
exports.getUserGender = getUserGender;
exports.getUserRole = getUserRole;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/js/conventions.js.map
