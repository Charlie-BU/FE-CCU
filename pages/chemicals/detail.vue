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
					<p v-if="chemical.dangerLevel">危险级别：{{ conventions.getChemicalDangerLevel(chemical.dangerLevel) }}</p>
					<p>状态：{{ conventions.getChemicalStatus(chemical.status) }}</p>
					<p>库存量：{{ utils.toPercentage(chemical.amount, (decimals = 0)) }}</p>
					<div v-if="chemical.info" class="divider"></div>
					<p v-if="chemical.info">备注：{{ chemical.info }}</p>
				</div>
			</div>
			<div class="divider"></div>
			<div class="textDiv">
				<div class="tipTit">管理使用信息</div>
				<div style="margin-top: 20rpx">
					<p v-if="registers">入库人：{{ registers.map(({ username }) => username).join("、") || "无" }}</p>
					<p v-if="responsor">负责人：{{ responsor.username || "无" }}</p>
					<p v-if="takers">领用人：{{ takers.map(({ username }) => username).join("、") || "无" }}</p>
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

onLoad((options) => {
	chemicalId.value = options.id;
});

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
		placeholderText: "请输入领用药品数量（填写1～100间数字，表示领用该药品数量百分比）",
		success: async (r) => {
			if (r.confirm) {
				uni.showToast({
					title: "请稍后",
					icon: "loading",
					duration: 100000
				});
				const amount = +r.content;
				if (isNaN(amount) || !amount || amount <= 0 || amount > 100) {
					uni.showToast({
						title: "请输入1～100间数字，表示领用该药品数量百分比",
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
		content: "补充药品后，您将成为药品入库人。确定要补充药品？",
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
</style>
