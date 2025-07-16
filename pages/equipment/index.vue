<template>
    <div class="app">
        <div class="phb flex" style="margin: 0 0 15rpx 0">
            <div>
                <div>
                    <span class="num">{{ normalEquipmentLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">台 / 套</span>
                </div>
                <div style="color: black; margin-top: 20rpx" class="jf">
                    <u-icon style="margin-right: 10rpx" name="checkmark-circle-fill" color="green" size="28" />
                    正常
                </div>
            </div>
            <div>
                <div>
                    <span class="num">{{ repairingEquipmentLength }} / {{ impairedEquipmentLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">台 / 套</span>
                </div>
                <div style="color: black; margin-top: 20rpx; margin-left: 15rpx" class="jf">
                    <u-icon style="margin-right: 10rpx" name="setting-fill" color="#F25C07" size="28" />
                    维修 / 异常
                </div>
            </div>
            <div>
                <div>
                    <span class="num">{{ damagedEquipmentLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">台 / 套</span>
                </div>
                <div style="color: black; margin-top: 20rpx" class="jf">
                    <u-icon style="margin-right: 10rpx" name="close-circle-fill" color="red" size="28" />
                    报废
                </div>
            </div>
        </div>

        <div style="display: flex">
            <u-icon name="plus-circle-fill" color="#5853bf" size="50" style="margin-top: 5rpx" @click="gotoAddOrModifyEquipment" />
            <u-search class="search_bar" v-model="searchContent" bg-color="#ffffff" :show-action="false" placeholder="输入设备名称"></u-search>
            <button class="cu-btn btn round search-btn" @click="search">查找</button>
        </div>
        <scroll-view class="scroll" scroll-y="auto">
            <div v-if="equipments.length !== 0" class="box" v-for="(equipment, index) in equipments" :key="index">
                <div class="flex top">
                    <div class="l">设备 {{ index + 1 }}</div>
                    <div class="r" :style="equipment.status === 1 ? 'color: green;' : ''">
                        {{ conventions.getEquipmentStatus(equipment.status) }}
                    </div>
                </div>
                <div class="bc flex">
                    <div class="left"><img class="bcImg" :src="equipment.imageUrl || 'https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/equipment.jpg'" alt="" /></div>
                    <div class="right">
                        <div class="text1" style="margin-top: 17rpx">{{ equipment.name }}</div>
                        <div class="text2">设备负责人: {{ equipment.responsorName }}</div>
                    </div>
                </div>
                <div v-if="equipment.function" class="time" style="background: #d7edee">功能：{{ equipment.function }}</div>
                <div v-if="equipment.operateRegulation" class="time" style="background: #ffe3e6">操作规范：{{ equipment.operateRegulation }}</div>
                <div v-if="equipment.info" class="time" style="background: #fff3eb">备注：{{ equipment.info }}</div>
                <div v-if="briefUserInfo.id === equipment.responsorId" style="text-align: right; margin-top: 20rpx">
                    <button class="cu-btn btn round bg-cyan" @click="gotoAddOrModifyEquipment(equipment.id)">修改信息</button>
                    <button class="cu-btn btn round bg-red" @click="deleteEquipment(equipment.id)">删除设备</button>
                </div>
            </div>

            <div v-else style="text-align: center; margin-top: 40rpx">无设备信息</div>
        </scroll-view>

        <div style="height: 100rpx"></div>
    </div>
    <tabbar :current-page="1" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { onlyLoginedAccess, loginCheck } from "@/utils/js/loginCheck.js";
import * as utils from "@/utils/js/utils.js";
import * as conventions from "@/utils/js/conventions.js";
import { onPullDownRefresh } from "@dcloudio/uni-app";

const briefUserInfo = ref(null);
const equipments = ref([]);

onMounted(async () => {
    uni.showToast({
        title: "加载中",
        icon: "loading",
        duration: 100000
    });
    await onlyLoginedAccess();
    briefUserInfo.value = await loginCheck();
    // 使用 Promise.all 并行获取
    await Promise.all([getEquipmentAmount(), getEquipments()]);
    uni.hideToast();
});

onPullDownRefresh(async () => {
    try {
        uni.reLaunch({
            url: "/pages/equipment/index"
        });
        uni.stopPullDownRefresh();
    } catch (error) {
        console.error(error);
    }
});

const normalEquipmentLength = ref(0);
const repairingEquipmentLength = ref(0);
const impairedEquipmentLength = ref(0);
const damagedEquipmentLength = ref(0);

const getEquipmentAmount = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid")
    };
    const res = await uniRequest("POST", "equipment", "/getEquipmentAmount", data);
    if (res.status < 0) return;
    normalEquipmentLength.value = res.data.normalEquipmentLength;
    repairingEquipmentLength.value = res.data.repairingEquipmentLength;
    impairedEquipmentLength.value = res.data.impairedEquipmentLength;
    damagedEquipmentLength.value = res.data.damagedEquipmentLength;
};

const getEquipments = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid")
    };
    const res = await uniRequest("POST", "equipment", "/getEquipments", data);
    if (res.status < 0) return;
    equipments.value = res.equipments;
};

const searchContent = ref("");
const search = async () => {
    uni.showToast({
        title: "加载中",
        icon: "loading",
        duration: 100000
    });
    let data = {
        sessionid: uni.getStorageSync("sessionid"),
        searchContent: searchContent.value
    };
    const res = await uniRequest("POST", "equipment", "/searchEquipment", data);
    if (res.status < 0) {
        uni.showToast({
            title: res.message,
            icon: "none",
            duration: 1000
        });
    }
    equipments.value = res.equipments;
    uni.hideToast();
};

const gotoAddOrModifyEquipment = (equipmentId = null) => {
    let url = "/pages/equipment/add-or-modify";
    if (equipmentId) url = url + `?id=${equipmentId}`;
    uni.navigateTo({
        url: url
    });
};

const deleteEquipment = async (equipmentId) => {
    uni.showModal({
        title: "删除设备",
        content: "设备删除后数据不可恢复，您确认删除该设备？",
        success: async (r) => {
            if (r.confirm) {
                uni.showToast({
                    title: "删除中",
                    icon: "loading",
                    duration: 100000
                });
                const data = {
                    sessionid: uni.getStorageSync("sessionid"),
                    equipmentId: equipmentId
                };
                const res = await uniRequest("POST", "equipment", "/deleteEquipment", data);
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
            }
        }
    });
};
</script>

<style lang="scss" scoped>
@import "@/utils/scss/common-styles.scss";

.head {
    position: relative;
    height: 100rpx;

    .headTitle {
        font-weight: 600;
        font-size: 35rpx;
        color: #212121;
        line-height: 36rpx;
        position: absolute;
        text-align: center;
        width: 100%;
        top: 100rpx;
        z-index: 999;
        position: fixed;
    }
}

.section {
    background: #ffffff;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    box-sizing: border-box;
    padding: 20rpx;

    .cu-btn {
        margin-right: 20rpx;
    }

    .boxList {
        margin-top: 6rpx;
        box-sizing: border-box;
        padding: 30rpx 20rpx;
        padding-top: 40rpx;
        border-bottom: 1px solid #f2f2f2;

        .left {
            width: 15%;
        }

        .right {
            .quan {
                margin-right: 4rpx;
                border-radius: 50%;
                background: #d9d9d9;
                width: 28rpx;
                height: 28rpx;
                display: inline-block;
                position: relative;
                top: 4rpx;
            }

            .text1 {
                font-weight: 500;
                font-size: 32rpx;
                color: #999999;
                line-height: 32rpx;
            }

            .text2 {
                margin-top: 28rpx;
                font-weight: 500;
                font-size: 28rpx;
                color: black;
                line-height: 20rpx;
            }

            .text3 {
                margin-top: 28rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #999999;
                line-height: 24rpx;
            }

            width: 83%;
        }

        .lIcon {
            width: 80rpx;
            height: 80rpx;

            border-radius: 12rpx 12rpx 12rpx 12rpx;
        }
    }
}

.search-btn {
    margin-top: 15rpx;
    background-color: #5853bf;
    color: white;
    white-space: nowrap;
}

.phb {
    .yjfk {
        font-size: 28rpx;
        color: #333333;
        line-height: 28rpx;
    }

    box-sizing: border-box;
    padding: 30rpx;
    background-color: white;
    margin-top: 50rpx;
    background: linear-gradient(135deg, #bef0e5, #f2a6c1);
    border-radius: 20rpx;

    .jf {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #282456;
        line-height: 36rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .num {
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        font-size: 40rpx;
        color: #282456;
        line-height: 48rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }
}

.headBox {
    box-sizing: border-box;
    padding: 20rpx;
}

.topHead {
    margin-top: 50rpx;
}

.icon {
    margin-right: 30rpx;
    width: 37rpx;
    height: 37rpx;
}

.picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.picker .txt {
    margin-right: 10px;
    font-size: 16px;
    color: #333;
}

.picker .p-left,
.picker .p-right {
    flex: 1;
    margin: 0 5px;
}

.uni-input {
    border: 1px solid #ccc;
    border-radius: 40rpx;
    padding: 8px;
    color: #333;
    text-align: center;
    transition: all 0.3s ease;
}

.uni-input:hover {
    border-color: #007aff;
}

.scroll {
    height: 90vh;
}

.search_bar {
    width: 540rpx;
    margin: 15rpx 20rpx;
}

.box {
    box-sizing: border-box;
    padding: 40rpx 20rpx;
    background-color: white;
    margin-top: 8rpx;
    background: #ffffff;
    border-radius: 20rpx 20rpx 20rpx 20rpx;

    .btn {
        margin-left: 20rpx;
    }

    .mon {
        margin-top: 20rpx;
        text-align: right;
        font-weight: 600;
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;

        .q {
            font-size: 38rpx;
            color: #f25c05;
        }
    }

    .time {
        box-sizing: box-sizing;
        padding: 20rpx;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #f25c07;
        line-height: 24rpx;
        margin-top: 10rpx;
    }

    .l {
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        line-height: 24rpx;
        margin-left: 10rpx;
    }

    .r {
        font-weight: 600;
        font-size: 28rpx;
        color: #f25c07;
        line-height: 28rpx;
        margin-right: 20rpx;
    }

    .bc {
        border-radius: 12rpx 12rpx 12rpx 12rpx;

        .text1 {
            margin-top: 4rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: bold;
            font-size: 28rpx;
            color: #282456;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }

        .text2 {
            margin-top: 34rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 26rpx;
            color: #f25c07;
            line-height: 28rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }

        .text3 {
            margin-top: 34rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #666666;
            line-height: 5rpx;
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

        margin-top: 30rpx;
        background-color: white;
        box-sizing: box-sizing;
        padding: 18rpx 0rpx;
    }
}

// .app {
// 	box-sizing: border-box;
// 	padding: 20rpx;
// 	background: linear-gradient(135deg, #1abfc0, #ffd5a4);
// }

.tabA {
    background-color: #f25c07 !important;
    color: white !important;
}

.tabs {
    width: 16%;
    text-align: center;
    font-weight: 400;
    font-size: 24rpx !important;
    color: #999999;
    background-color: red;
    box-sizing: border-box;
    padding: 5rpx 20rpx;
    background: #ffffff;
    border-radius: 40rpx 40rpx 40rpx 40rpx;
}
</style>
