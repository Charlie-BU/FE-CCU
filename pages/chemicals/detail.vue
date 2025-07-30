<template>
	<div class="app">
		<div class="bc flex">
			<div class="left">
				<img class="bcImg" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/chemical.jpg" alt="" />
			</div>
			<div class="right">
				<div class="wrapper">
					<div class="text1">{{ chemical.name }}</div>
				</div>
				<div class="text2">{{ chemical.formula }}</div>
			</div>
		</div>
		<div class="code">
			<div class="title">扫码查看{{ chemical.name }}百科资料</div>
			<div class="tis">致力于权威的科学百科</div>
			<div style="text-align: center" @click="previewQRCode">
				<canvas class="codeImg" style="margin: 50rpx 173rpx -20rpx" id="qrcode" canvas-id="qrcode"></canvas>
			</div>
		</div>

		<div class="codeA code" style="margin-top: 20rpx">
			<div class="textDiv">
				<div class="tipTit">药品基本信息</div>
				<div style="margin-top: 20rpx">
					<p>药品名称：{{ chemical.name }}</p>
					<p>化学式 / 分子式：{{ chemical.formula }}</p>
					<p>CAS：{{ chemical.CAS }}</p>
					<p>类别：{{ conventions.getChemicalType(chemical.type) }}</p>
					<div class="divider"></div>
					<p v-if="chemical.dangerLevel">危险级别：{{ conventions.getChemicalDangerLevel(chemical.dangerLevel) }}
					</p>
					<p>状态：{{ conventions.getChemicalStatus(chemical.status) }}</p>
					<p>库存量：{{ chemical.amount?.toFixed(1) }} 瓶</p>
					<div v-if="chemical.info" class="divider"></div>
					<p v-if="chemical.specification">规格：{{ chemical.specification }}
					</p>
					<p v-if="chemical.purity">纯度：{{ chemical.purity }}</p>
					<p v-if="chemical.site">存储位置：{{ chemical.site }}</p>
					<div v-if="chemical.info" class="divider"></div>
					<p v-if="chemical.info">备注：{{ chemical.info }}</p>
				</div>
			</div>
			<div class="divider"></div>
			<div class="textDiv">
				<div class="tipTit">人员信息</div>
				<div style="margin-top: 20rpx">
					<p v-if="registers">入库人：{{registers.map(({ username }) => username).join("、") || "无"}}</p>
					<p v-if="responsor">负责人：{{ responsor.username || "无" }}</p>
					<p v-if="takers">领用人：{{takers.map(({ username }) => username).join("、") || "无"}}</p>
				</div>
			</div>
			<div class="divider"></div>
			<div class="textDiv">
				<div class="tipTit">药品入库 / 领用信息</div>
				<!-- 年-月筛选框 -->
				<div class="filter-section">
					<div class="filter-row">
						<div class="filter-item">
							<text class="filter-text">筛选年份<text class="required-mark">*</text>：</text>
							<picker mode="selector" :range="yearOptions" :value="selectedYearIndex"
								@change="onYearChange">
								<view class="picker-display">{{ selectedYear || '请选择年份' }}</view>
							</picker>
						</div>
						<div class="filter-item">
							<text class="filter-text">筛选月份：</text>
							<picker mode="selector" :range="monthOptions" :value="selectedMonthIndex"
								@change="onMonthChange">
								<view class="picker-display">{{ selectedMonth || '全年' }}</view>
							</picker>
						</div>
					</div>
					<div class="filter-buttons">
						<view class="filter-button primary" @click="filterChemicalRecords">
							<u-icon name="search" size="16" color="#ffffff" style="margin-right: 8rpx;" />
							筛选
						</view>
						<view class="filter-button secondary" @click="resetFilter">
							<u-icon name="reload" size="16" color="#666666" style="margin-right: 8rpx;" />
							重置
						</view>
					</div>
				</div>
				<!-- 筛选结果显示 -->
				<div v-if="filterResult" class="filter-results">
					<div class="divider"></div>
					<p><strong>统计结果：</strong></p>
					<p>入库次数：<span class="highlight-number">{{ filterResult.inboundCount }}</span> 次</p>
					<p>领用次数：<span class="highlight-number">{{ filterResult.outboundCount }}</span> 次</p>
				</div>
			</div>
		</div>

		<div class="codeA code" style="margin-top: 30rpx">
			<div class="textDiv">
				<div class="tipTit">操作面板</div>
				<div style="margin-top: 14rpx">
					<div class="userList flex">
						<view v-if="!chemical.takerIds?.includes(briefUserInfo.id)" @click="takeChemical">
							<p style="color: #7b34aa" class="p">
								<u-icon name="coupon-fill" size="40" />
							</p>
							<div style="color: #7b34aa" class="span">领用药品</div>
						</view>
						<view v-else @click="returnChemical">
							<p style="color: #7b34aa" class="p">
								<u-icon name="coupon" size="40" />
							</p>
							<div style="color: #7b34aa" class="span">归还药品</div>
						</view>
						<view @click="supplementChemical">
							<p style="color: #7b34aa" class="p">
								<u-icon name="plus-circle-fill" size="40" />
							</p>
							<div style="color: #7b34aa" class="span">补充药品</div>
						</view>
						<view @click="gotoModifyChemicalInfo">
							<p class="p">
								<u-icon name="setting-fill" size="40" />
							</p>
							<div class="span">修改药品信息</div>
						</view>
						<view @click="deleteChemical">
							<p style="color: red" class="p">
								<u-icon name="trash-fill" size="40" />
							</p>
							<div style="color: red" class="span">删除药品</div>
						</view>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { loginCheck, onlyLoginedAccess } from "@/utils/js/loginCheck.js";
import * as utils from "@/utils/js/utils.js";
import * as conventions from "@/utils/js/conventions.js";
import UQRCode from "@/utils/js/uqrcode.js";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";

const chemicalId = ref(null);
const chemical = ref({});
const briefUserInfo = ref(null);

// 筛选相关数据
const selectedYear = ref('');
const selectedMonth = ref('');
const selectedYearIndex = ref(0);
const selectedMonthIndex = ref(0);
const yearOptions = ref([]);
const monthOptions = ref(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']);
const filterResult = ref(null);

onLoad((options) => {
	chemicalId.value = options.id;
});

// 初始化年份选项
const initYearOptions = () => {
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let i = currentYear; i >= currentYear - 10; i--) {
		years.push(i + '年');
	}
	yearOptions.value = years;
};

// 年份选择变化
const onYearChange = (e) => {
	selectedYearIndex.value = e.detail.value;
	selectedYear.value = yearOptions.value[e.detail.value];
};

// 月份选择变化
const onMonthChange = (e) => {
	selectedMonthIndex.value = e.detail.value;
	selectedMonth.value = monthOptions.value[e.detail.value];
};

// 筛选药品记录
const filterChemicalRecords = async () => {
	if (!selectedYear.value) {
		uni.showToast({
			title: "请选择年份",
			icon: "none",
			duration: 1500
		});
		return;
	}

	uni.showToast({
		title: "筛选中",
		icon: "loading",
		duration: 100000
	});

	const year = parseInt(selectedYear.value.replace('年', ''));
	const month = selectedMonth.value ? parseInt(selectedMonth.value.replace('月', '')) : null;

	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		chemicalId: chemicalId.value,
		year: year,
		month: month
	};

	try {
		const res = await uniRequest("POST", "chemical", "/getChemicalRecordsByTime", data);
		uni.hideToast();

		if (res.status === 200) {
			filterResult.value = {
				inboundCount: res.inboundCount || 0,
				outboundCount: res.outboundCount || 0
			};
			uni.showToast({
				title: "筛选完成",
				icon: "success",
				duration: 1500
			});
		} else {
			uni.showToast({
				title: res.message || "筛选失败",
				icon: "none",
				duration: 1500
			});
		}
	} catch (error) {
		uni.hideToast();
		uni.showToast({
			title: "网络错误，请重试",
			icon: "none",
			duration: 1500
		});
	}
};

// 重置筛选
const resetFilter = () => {
	selectedYear.value = '';
	selectedMonth.value = '';
	selectedYearIndex.value = 0;
	selectedMonthIndex.value = 0;
	filterResult.value = null;
};

onMounted(async () => {
	uni.showToast({
		title: "加载中",
		icon: "loading",
		duration: 100000
	});
	briefUserInfo.value = await loginCheck();
	await onlyLoginedAccess();
	await getThisChemical();
	generateQRCode();
	// 使用 Promise.all 并行获取
	await Promise.all([getRegistersInfo(), getResponsorInfo(), getTakersInfo()]);
	// 初始化年份选项
	initYearOptions();
	uni.hideToast();
});

const getThisChemical = async () => {
	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		chemicalId: chemicalId.value
	};
	const res = await uniRequest("POST", "chemical", "/getThisChemical", data);
	if (res.status < 0) return;
	chemical.value = res.chemical;
};

const generateQRCode = () => {
	let qrcode = new UQRCode();
	qrcode.data = `https://baike.baidu.com/item/${chemical.value.name}`;
	qrcode.size = 150;
	qrcode.make();
	let canvasContext = uni.createCanvasContext("qrcode", this);
	qrcode.canvasContext = canvasContext;
	qrcode.drawCanvas();
};

const previewQRCode = () => {
	uni.canvasToTempFilePath({
		canvasId: "qrcode",
		success: (res) => {
			const tempFilePath = res.tempFilePath;
			utils.previewImage(tempFilePath);
		},
		fail: (err) => {
			console.error(err);
		}
	});
};

const registers = ref([]);
const responsor = ref(null);
const takers = ref([]);

const getRegistersInfo = async () => {
	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		userIds: [...chemical.value.registerIds]
	};
	const res = await uniRequest("POST", "user", "/getUsersInfoByIds", data);
	if (res.status < 0) return;
	registers.value = res.users;
};
const getResponsorInfo = async () => {
	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		userIds: [chemical.value.responsorId]
	};
	const res = await uniRequest("POST", "user", "/getUsersInfoByIds", data);
	if (res.status < 0) return;
	responsor.value = res.users[0];
};
const getTakersInfo = async () => {
	const userIds = chemical.value.takerIds ? [...chemical.value.takerIds] : [];
	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		userIds: userIds
	};
	const res = await uniRequest("POST", "user", "/getUsersInfoByIds", data);
	if (res.status < 0) return;
	takers.value = res.users;
};

const takeChemical = async () => {
	uni.showModal({
		title: "领用药品",
		editable: true,
		placeholderText: "请输入领用药品瓶数（可填写小数）",
		success: async (r) => {
			if (r.confirm) {
				uni.showToast({
					title: "请稍后",
					icon: "loading",
					duration: 100000
				});
				const amount = +r.content;
				if (isNaN(amount) || !amount || amount <= 0) {
					uni.showToast({
						title: "请输入领用药品瓶数（可填写小数）",
						icon: "none",
						duration: 1000
					});
					return;
				}
				if (amount > chemical.value.amount) {
					uni.showToast({
						title: "领用药品瓶数不能大于库存",
						icon: "none",
						duration: 1000
					});
					return;
				}
				const data = {
					sessionid: uni.getStorageSync("sessionid"),
					chemicalId: chemicalId.value,
					amount: amount
				};
				const res = await uniRequest("POST", "chemical", "/takeChemical", data);
				uni.showToast({
					title: res.message,
					icon: "none",
					duration: 1000
				});
				if (res.status === 200) {
					setTimeout(() => {
						uni.reLaunch({
							url: `/pages/chemicals/detail?id=${chemicalId.value}`
						});
					}, 1000);
				}
			}
		}
	});
};

const returnChemical = async () => {
	uni.showModal({
		title: "归还药品",
		content: "确定归还领用的全部药品？",
		success: async (r) => {
			if (r.confirm) {
				uni.showToast({
					title: "请稍后",
					icon: "loading",
					duration: 100000
				});
				const data = {
					sessionid: uni.getStorageSync("sessionid"),
					chemicalId: chemicalId.value
				};
				const res = await uniRequest("POST", "chemical", "/returnChemical", data);
				uni.showToast({
					title: res.message,
					icon: "none",
					duration: 1000
				});
				if (res.status === 200) {
					setTimeout(() => {
						uni.reLaunch({
							url: `/pages/chemicals/detail?id=${chemicalId.value}`
						});
					}, 1000);
				}
			}
		}
	});
};

const supplementChemical = async () => {
	uni.showModal({
		title: "补充药品",
		editable: true,
		placeholderText: "请输入补充药品瓶数（可填写小数）",
		success: async (r) => {
			if (r.confirm) {
				uni.showToast({
					title: "请稍后",
					icon: "loading",
					duration: 100000
				});
				const amount = +r.content;
				if (isNaN(amount) || !amount || amount <= 0) {
					uni.showToast({
						title: "请输入领用药品瓶数（可填写小数）",
						icon: "none",
						duration: 1000
					});
					return;
				}
				const data = {
					sessionid: uni.getStorageSync("sessionid"),
					chemicalId: chemicalId.value,
					amount: amount
				};
				const res = await uniRequest("POST", "chemical", "/supplementChemical", data);
				uni.showToast({
					title: res.message,
					icon: "none",
					duration: 1000
				});
				if (res.status === 200) {
					setTimeout(() => {
						uni.reLaunch({
							url: `/pages/chemicals/detail?id=${chemicalId.value}`
						});
					}, 1000);
				}
			}
		}
	});
};

const gotoModifyChemicalInfo = () => {
	uni.navigateTo({
		url: `/pages/chemicals/add-or-modify?id=${chemicalId.value}`
	})
};

const deleteChemical = async () => {
	uni.showModal({
		title: "删除药品",
		content: "药品删除后数据不可恢复，您确认删除该药品？",
		success: async (r) => {
			if (r.confirm) {
				uni.showToast({
					title: "删除中",
					icon: "loading",
					duration: 100000
				});
				const data = {
					sessionid: uni.getStorageSync("sessionid"),
					chemicalId: chemicalId.value
				};
				const res = await uniRequest("POST", "chemical", "/deleteChemical", data);
				uni.showToast({
					title: res.message,
					icon: "none",
					duration: 1000
				});
				if (res.status === 200) {
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/chemicals/index"
						});
					}, 1000);
				}
			}
		}
	});
};
</script>

<style lang="scss" scoped>
@import "@/utils/scss/common-styles.scss";

.wrapper {
	height: 65rpx;
}

.foot {
	.left {
		text-align: center;
		background-color: #ffffff;
		box-sizing: box-sizing;
		padding: 20rpx;
		padding-top: 36rpx;
		width: 47%;
		height: 208rpx;

		border-radius: 20rpx 20rpx 20rpx 20rpx;
	}

	.lIcons {
		width: 104rpx;
		height: 104rpx;
		border-radius: 50%;
	}

	.pt {
		font-weight: 500;
		font-size: 28rpx;
		color: #212121;
		margin-top: 14rpx;
		line-height: 28rpx;
	}

	.r {
		background-color: #f9d67a !important;
	}
}

.textT {
	font-weight: 600;
	font-size: 32rpx;
	box-sizing: border-box;
	padding-top: 22rpx;
}

.codeA {
	text-align: left !important;
	padding: 30rpx !important;

	.divider {
		background-color: #f2f2f2;
		margin: 28rpx 0rpx;
		height: 1rpx;
	}

	.tipTit {
		font-weight: 600;
		font-size: 32rpx;
		color: #333333;
		line-height: 32rpx;
	}

	.textDiv {
		margin-top: 20rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		line-height: 44rpx;
	}
}

.code {
	box-sizing: border-box;
	padding: 50rpx;
	background-color: white;
	position: relative;
	top: -70rpx;
	border-radius: 28rpx;
	text-align: center;

	.codeImg {
		width: 320rpx;
		height: 320rpx;
	}

	.tis {
		margin: 36rpx 0rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
	}

	.title {
		margin-top: 22rpx;
		font-weight: 600;
		font-size: 40rpx;
		color: #f25c07;
		line-height: 40rpx;
	}
}

.bc {
	background-color: #eed4bd;
	box-sizing: box-sizing;
	padding: 18rpx 20rpx;
	border-radius: 20rpx;
	padding-bottom: 90rpx;

	.text1 {
		margin-top: 20rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: bold;
		font-size: 32rpx;
		color: #333333;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.text2 {
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;
		font-size: 32rpx;
		color: #f25c07;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.right {
		width: 62%;
	}

	.left {
		width: 34%;

		.bcImg {
			border-radius: 12rpx;
			width: 100%;
			height: 144rpx;
		}
	}
}

.userList {
	position: relative;
	box-sizing: box-sizing;
	margin-top: 40rpx;
	background: #ffffff;
	border-radius: 20rpx 20rpx 20rpx 20rpx;

	.p {
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;
		font-size: 36rpx;
		color: #282456;
		line-height: 40rpx;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}

	.span {
		margin-top: 24rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}
}

.itemList {
	text-align: center;
	width: 24%;
}

.filter-container {
	margin-top: 20rpx;
	padding: 20rpx;
	background-color: #f8f9fa;
	border-radius: 12rpx;
	border: 1rpx solid #e9ecef;
}

// 删除原有的筛选器样式，替换为以下样式：

.filter-section {
	margin-top: 28rpx;
}

.filter-row {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.filter-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.filter-text {
	font-weight: 400;
	font-size: 24rpx;
	color: #333333;
	line-height: 44rpx;
}

.required-mark {
	color: #f25c07;
	font-weight: 600;
}

.picker-display {
	padding: 12rpx 20rpx;
	background-color: #f8f9fa;
	border-radius: 8rpx;
	font-size: 24rpx;
	color: #333333;
	min-width: 200rpx;
	text-align: center;
	border: 1rpx solid #e9ecef;
}

.filter-buttons {
	display: flex;
	gap: 20rpx;
	margin-top: 28rpx;
	justify-content: center;
}

.filter-button {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16rpx 32rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
	min-width: 120rpx;
}

.filter-button.primary {
	background-color: #7b34aa;
	color: #ffffff;
}

.filter-button.secondary {
	background-color: #f8f9fa;
	color: #666666;
	border: 1rpx solid #e9ecef;
}

.filter-results {
	margin-top: 20rpx;
}

.highlight-number {
	color: #f25c07;
	font-weight: 600;
}

.result-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8rpx 0;
	border-bottom: 1rpx solid #d4edda;
}

.result-item:last-child {
	border-bottom: none;
}

.result-label {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.result-value {
	font-size: 28rpx;
	color: #28a745;
	font-weight: 600;
}
</style>
