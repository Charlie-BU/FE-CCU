// 用户相关
export const getUserGender = (gender) => ({ 1: "男", 2: "女" }[gender] || "未知");

export const getUserRole = (role) => ({ 1: "学生", 2: "教师" }[role] || "未知");

export const getUserDegree = (degree) =>
	({
		1: "学士",
		2: "硕士",
		3: "博士",
		4: "其他"
	}[degree] || "未知");

// 药品相关
export const getChemicalType = (type) => ({ 1: "无机", 2: "有机" }[type] || "未知");

export const getChemicalStatus = (status) => ({ 1: "充足", 2: "短缺" }[status] || "未知");

export const getChemicalDangerLevel = (levels) => {
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

// 设备相关
export const getEquipmentStatus = (status) => ({ 1: "正常", 2: "异常", 3: "维修", 4: "报废" }[status] || "未知");

// 项目相关
export const getProjectType = (type) => ({ 1: "国家级", 2: "省级", 3: "校级" }[type] || "未知");

export const getProjectStatus = (status) => ({ 1: "未开始", 2: "进行中", 3: "已完成" }[status] || "未知");

// 报告相关
export const getReportType = (type) => ({ 1: "文献类", 2: "工作类" }[type] || "未知");
