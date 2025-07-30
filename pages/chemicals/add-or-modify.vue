<template>
	<view class="main">
		<view class="pagenation">
			<view class="pagenation_back" @click="goBack">
				<image class="back_arrow" src="../../static/tabbar/back.png" mode="aspectFill" />
			</view>
		</view>
		<view v-if="show" class="login">
			<view class="kuang shadow">
				<view class="hint">{{ chemicalId ? "药品信息修改" : "药品入库" }}</view>
				<view class="form-group">
					<image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg"
						mode="aspectFill" />
					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							药品名称：
						</view>
						<input :placeholder="chemicalId ? chemical.name : '请输入药品名称'" maxlength="100" class="ipt tpyA"
							v-model="form.name" placeholder-class="phc ipt" />
					</view>
					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							化学式 / 分子式：
						</view>
						<input :placeholder="chemicalId ? chemical.formula : '请输入化学式或分子式'" maxlength="100"
							class="ipt tpyA" v-model="form.formula" placeholder-class="phc ipt" />
					</view>
					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							CAS：
						</view>
						<input :placeholder="chemicalId ? chemical.CAS : '请输入 CAS 号'" maxlength="100" class="ipt tpyA"
							v-model="form.CAS" placeholder-class="phc ipt" />
					</view>
					<view class="inputSection">
						<view class="title ipt">
							规格：
						</view>
						<input :placeholder="chemicalId ? chemical.specification : '请输入规格'" maxlength="100"
							class="ipt tpyA" v-model="form.specification" placeholder-class="phc ipt" />
					</view>
					<view class="inputSection">
						<view class="title ipt">
							纯度：
						</view>
						<input :placeholder="chemicalId ? chemical.purity : '请输入纯度'" maxlength="100" class="ipt tpyA" 
							v-model="form.purity" placeholder-class="phc ipt" />
					</view>
					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							药品种类：
						</view>
						<radio-group @change="handleTypeChange">
							<label class="radio">
								<radio value="1" color="#FFCC33" style="transform: scale(0.7)"
									:checked="chemicalId && chemical.type === 1" />
								无机
							</label>
							<label class="radio">
								<radio value="2" color="#FFCC33" style="transform: scale(0.7)"
									:checked="chemicalId && chemical.type === 2" />
								有机
							</label>
						</radio-group>
					</view>
					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							危险性：
						</view>
						<checkbox-group v-if="chemicalId" @change="handleDangerLevelChange">
							<label class="checkbox" v-for="(item, index) in dangerLevels" :key="index">
								<checkbox v-if="chemical?.dangerLevel?.includes(+item.value)" :value="item.value"
									color="#FFCC33" style="transform: scale(0.7)" checked="true" />
								<checkbox v-else :value="item.value" color="#FFCC33" style="transform: scale(0.7)" />
								{{ item.label }}
								<br />
							</label>
						</checkbox-group>
						<checkbox-group v-else @change="handleDangerLevelChange">
							<label class="checkbox" v-for="(item, index) in dangerLevels" :key="index">
								<checkbox :value="item.value" color="#FFCC33" style="transform: scale(0.7)" />
								{{ item.label }}
								<br />
							</label>
						</checkbox-group>
					</view>
					<view class="inputSection">
						<view class="title ipt">
							位置：
						</view>
						<input :placeholder="chemicalId ? chemical.site : '请输入位置'" maxlength="100" class="ipt tpyA"
							v-model="form.site" placeholder-class="phc ipt" />
					</view>
					<view class="inputSection">
						<view class="title ipt">备注：</view>
						<textarea :placeholder="chemicalId ? chemical.info : '请输入备注（非必填）'" class="ipt tpyA"
							auto-height="true" v-model="form.info" placeholder-class="phc ipt" />
					</view>
					<view v-if="briefUserInfo && !chemicalId" class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							药品负责人：
						</view>
						<input :value="briefUserInfo.username" maxlength="100" class="ipt tpyA"
							placeholder-class="phc ipt" disabled="true" />
					</view>
					<view v-if="briefUserInfo && !chemicalId" class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							入库人：
						</view>
						<input :value="briefUserInfo.username" maxlength="100" class="ipt tpyA"
							placeholder-class="phc ipt" disabled="true" />
					</view>
				</view>
				<button class="btn round" style="background-color: #f05b05" @click="submit">确定</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uniRequest } from "@/utils/js/api";
import { loginCheck, onlyLoginedAccess } from "@/utils/js/loginCheck";
import { onLoad } from "@dcloudio/uni-app";
import { magic } from "@/utils/js/magic";
const show = magic();

const chemicalId = ref(null);
const chemical = ref({});
onLoad((options) => {
	chemicalId.value = options.id;
});

const briefUserInfo = ref(null);
onMounted(async () => {
	// 检查用户是否登录
	briefUserInfo.value = await loginCheck();
	await onlyLoginedAccess();
	await getThisChemical();
});

const getThisChemical = async () => {
	if (!chemicalId.value) return;
	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		chemicalId: chemicalId.value
	};
	const res = await uniRequest("POST", "chemical", "/getThisChemical", data);
	if (res.status < 0) return;
	chemical.value = res.chemical;
};

const goBack = () => {
	uni.navigateBack();
};

const form = ref({
	name: "",
	formula: "",
	CAS: "",
	type: null,
	dangerLevel: [],
	info: "",
	responsorId: null,
	registerIds: [],
	specification: "",
	purity: "",
	site: ""
});

const dangerLevels = [
	{ value: 1, label: "常规" },
	{ value: 2, label: "易燃" },
	{ value: 3, label: "易爆" },
	{ value: 4, label: "腐蚀" },
	{ value: 5, label: "易制毒" },
	{ value: 6, label: "易制爆" }
];

const handleTypeChange = (e) => {
	form.value.type = +e.detail.value;
};

const handleDangerLevelChange = (e) => {
	form.value.dangerLevel = e.detail.value.map(Number); // 把字符串数组转换成数字数组
};

const requiredFields = ref({
	name: "药品名称",
	formula: "化学式",
	CAS: " CAS 号",
	type: "药品种类", // 无机1/有机2
	dangerLevel: "危险性" // 常规1/易燃2/易爆3/腐蚀4/易制毒5/易制爆6
});

const submit = async () => {
	uni.showToast({
		title: "提交中",
		icon: "loading",
		duration: 100000
	});

	// 验证纯度字段
	if (form.value.purity !== '' && form.value.purity !== null && form.value.purity !== undefined) {
		const purityValue = parseFloat(form.value.purity);
		if (isNaN(purityValue) || purityValue < 0 || purityValue > 1) {
			uni.showToast({
				title: "纯度必须为0-1之间的数字或留空",
				icon: "none",
				duration: 1500
			});
			return;
		}
	}

	// 修改药品信息
	if (chemicalId.value) {
		const data = {
			sessionid: uni.getStorageSync("sessionid"),
			chemicalId: chemicalId.value,
			chemicalData: form.value
		};
		const res = await uniRequest("POST", "chemical", "/modifyChemicalInfo", data);
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
		return;
	}

	form.value.responsorId = briefUserInfo.value.id;
	form.value.registerIds.push(briefUserInfo.value.id);
	const chemicalData = form.value;

	for (let requiredField in requiredFields.value) {
		if (!form.value[requiredField]) {
			uni.showToast({
				title: `请输入${requiredFields.value[requiredField]}`,
				icon: "none",
				duration: 800
			});
			return;
		}
	}

	if (chemicalData.dangerLevel.length === 0) {
		uni.showToast({
			title: "请选择药品危险性",
			icon: "none",
			duration: 800
		});
		return;
	}

	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		chemicalData: chemicalData
	};
	const res = await uniRequest("POST", "chemical", "/addChemical", data);
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
};
</script>

<style lang="scss">
.pagenation {
	.pagenation_back {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 76rpx;
		height: 76rpx;
		border-radius: 50%;
		border: 1rpx solid #bcbcbc;
		margin: 85rpx 40rpx;

		.back_arrow {
			width: 50rpx;
			height: 50rpx;
		}
	}
}

.main {
	width: 100%;
	height: 100%;
	background: linear-gradient(0deg, #efefef 0%, #f6f6f6 25%, #1abfc0 100%);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.main .login {
	margin-top: 150rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	flex: 1;
}

.main .login .kuang {
	width: 650rpx;
	background-color: #fff;
	height: 100%;
	margin-top: 85rpx;
	border-radius: 20rpx;
	/* display: flex; */
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 20rpx;
}

.main .login .kuang .btn {
	width: 85%;
	color: #fff;
	font-size: 32rpx;
	margin: 40rpx;
}

.main .login .kuang .hint {
	width: 100%;
	color: black;
	font-size: 50rpx;
	font-weight: bold;
	text-align: center;
}

.main .login .kuang .return {
	width: 100%;
	color: #1abfc0;
	font-size: 30rpx;
	text-align: center;
	font-size: 26rpx;
}

.main .avatar-open {
	width: 180rpx;
	height: 180rpx;
	clip-path: circle(90rpx at center);
}

.main .bottom {
	width: 100%;
	align-self: flex-end;
	font-size: 26rpx;
	height: 120rpx;
	text-align: center;
	color: #fff;
	display: flex;
	flex-direction: column;
}

.form-group {
	margin: 40rpx;
	text-align: center;
}

.form-group .title {
	white-space: nowrap;
	font-weight: normal;
}

.form-group .inputSection {
	margin: 40rpx;
	display: flex;
	flex-direction: row;
	text-align: justify;
}

.title {
	line-height: 42rpx !important;
}

.images {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
}

.tpyA {
	padding: 0px 20rpx;
}

.ipt {
	font-size: 26rpx;
}
</style>
