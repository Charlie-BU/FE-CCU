<template>
	<view class="main">
		<view class="pagenation">
			<view class="pagenation_back" @click="goBack">
				<image class="back_arrow" src="../../static/tabbar/back.png" mode="aspectFill" />
			</view>
		</view>
		<view v-if="show" class="login">
			<view class="kuang shadow">
				<view class="hint">{{ equipmentId ? "设备信息修改" : "添加设备" }}</view>
				<view class="form-group">
					<image class="images" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/logo.jpg" mode="aspectFill" />
					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							设备名称：
						</view>
						<input :placeholder="equipmentId ? equipment.name : '请输入设备名称'" maxlength="60" class="ipt tpyA" v-model="form.name" placeholder-class="phc ipt" />
					</view>

					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							设备状态：
						</view>
						<radio-group @change="handleStatusChange">
							<label class="radio" v-for="(item, index) in statusOptions" :key="index">
								<radio :value="item.value" color="#FFCC33" style="transform: scale(0.7)" :checked="equipmentId && equipment.status === item.value" />
								{{ item.label }}
								<br />
							</label>
						</radio-group>
					</view>

					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							设备功能：
						</view>
						<textarea
							:placeholder="equipmentId ? equipment.function : '请输入设备功能'"
							class="ipt tpyA"
							auto-height="true"
							v-model="form.function"
							placeholder-class="phc ipt"
						/>
					</view>

					<view class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							操作规范：
						</view>
						<textarea
							:placeholder="equipmentId ? equipment.operateRegulation : '请输入操作规范'"
							class="ipt tpyA"
							auto-height="true"
							v-model="form.operateRegulation"
							placeholder-class="phc ipt"
						/>
					</view>

					<!-- <view class="inputSection">
						<view class="title ipt">设备图片：</view>
						<input type="text" class="ipt tpyA" v-model="form.imageUrl" placeholder="请输入图片URL" />
					</view> -->

					<view v-if="briefUserInfo && !equipmentId" class="inputSection">
						<view class="title ipt">
							<span style="color: red">*</span>
							设备负责人：
						</view>
						<input :value="briefUserInfo.username" maxlength="100" class="ipt tpyA" disabled="true" />
					</view>

					<view class="inputSection">
						<view class="title ipt">备注：</view>
						<textarea
							:placeholder="equipmentId ? equipment.info : '请输入备注（非必填）'"
							class="ipt tpyA"
							auto-height="true"
							v-model="form.info"
							placeholder-class="phc ipt"
						/>
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

const equipmentId = ref(null);
const equipment = ref({});

onLoad((options) => {
	equipmentId.value = options.id;
});

const briefUserInfo = ref(null);
onMounted(async () => {
	briefUserInfo.value = await loginCheck();
	await onlyLoginedAccess();
	if (equipmentId.value) await getThisEquipment();
});

const getThisEquipment = async () => {
	if (!equipmentId.value) return;
	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		equipmentId: equipmentId.value
	};
	const res = await uniRequest("POST", "equipment", "/getThisEquipment", data);
	if (res.status < 0) return;
	equipment.value = res.equipment;
};

const goBack = () => {
	uni.navigateBack();
};

const form = ref({
	name: "",
	status: null,
	function: "",
	operateRegulation: "",
	imageUrl: "",
	responsorId: null,
	info: ""
});

const statusOptions = [
	{ value: 1, label: "正常" },
	{ value: 2, label: "异常" },
	{ value: 3, label: "维修" },
	{ value: 4, label: "报废" }
];

const handleStatusChange = (e) => {
	form.value.status = +e.detail.value;
};

const requiredFields = ref({
	name: "设备名称",
	status: "设备状态",
	function: "设备功能",
	operateRegulation: "操作规范",
	status: "设备状态"
});

const submit = async () => {
	uni.showToast({ title: "提交中", icon: "loading", duration: 100000 });

	// 修改设备信息
	if (equipmentId.value) {
		const data = {
			sessionid: uni.getStorageSync("sessionid"),
			equipmentId: equipmentId.value,
			equipmentData: form.value
		};
		const res = await uniRequest("POST", "equipment", "/modifyEquipmentInfo", data);
		uni.showToast({
			title: res.message,
			icon: "none",
			duration: 1000
		});
		if (res.status === 200) {
			setTimeout(() => {
				uni.reLaunch({
					url: "/pages/equipment/index"
				});
			}, 1000);
		}
		return;
	}

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
	form.value.responsorId = briefUserInfo.value.id;

	const data = {
		sessionid: uni.getStorageSync("sessionid"),
		equipmentData: form.value
	};
	const res = await uniRequest("POST", "equipment", "/addEquipment", data);
	uni.showToast({ title: res.message, icon: "none", duration: 1000 });
	if (res.status === 200) {
		setTimeout(() => {
			uni.reLaunch({ url: "/pages/equipment/index" });
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
