<template>
    <div class="app">
        <div class="phb flex" style="margin: 0 0 15rpx 0">
            <div>
                <div>
                    <span class="num">{{ allChemicalLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">种</span>
                </div>
                <div style="color: black; margin-top: 20rpx" class="jf">
                    <u-icon style="margin-right: 10rpx" name="hourglass" color="#F25C07" size="28" />
                    现有药品
                </div>
            </div>
            <div>
                <div>
                    <span class="num">{{ inorganicChemicalLength }} / {{ organicChemicalLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">种</span>
                </div>
                <div style="color: black; margin-top: 20rpx; margin-left: 15rpx" class="jf">
                    <u-icon style="margin-right: 10rpx" name="hourglass-half-fill" color="#F25C07" size="28" />
                    无机 / 有机
                </div>
            </div>
            <div>
                <div>
                    <span class="num">{{ dangerousChemicalLength }}</span>
                    <span class="jf" style="margin-left: 20rpx">种</span>
                </div>
                <div style="color: black; margin-top: 20rpx" class="jf">
                    <u-icon style="margin-right: 10rpx" name="warning-fill" color="#F25C07" size="28" />
                    易制毒制爆
                </div>
            </div>
        </div>

        <u-tabs
            style="position: relative; bottom: 4rpx"
            :list="categories"
            bg-color="null"
            active-color="#F25C07"
            font-size="20rpx"
            is-scroll="true"
            :current="current"
            @change="change"
        ></u-tabs>
        <div style="display: flex">
            <u-icon name="plus-circle-fill" color="#5853bf" size="50" style="margin-top: 5rpx" @click="gotoAddChemical" />
            <u-search class="search_bar" v-model="searchContent" bg-color="#ffffff" :show-action="false" placeholder="输入药品名称或化学式"></u-search>
            <button class="cu-btn btn round search-btn" @click="search">查找</button>
        </div>
        <scroll-view class="scroll" scroll-y="auto">
            <div v-if="chemicals.length !== 0" class="box" v-for="(chemical, index) in chemicals" :key="index">
                <div class="flex top">
                    <div class="l">药品 {{ index + 1 }}</div>
                    <div class="r">
                        {{ conventions.getChemicalType(chemical.type) }}
                    </div>
                </div>
                <div class="bc flex">
                    <div class="left">
                        <img class="bcImg" src="https://ccu-assets.oss-cn-beijing.aliyuncs.com/images/chemical.jpg" alt="" />
                    </div>
                    <div class="right">
                        <div class="text1">{{ chemical.name }} - {{ chemical.formula }}</div>
                        <div class="text3">CAS: {{ chemical.CAS }}</div>
                        <div class="text2">{{ conventions.getChemicalDangerLevel(chemical.dangerLevel) }}</div>
                    </div>
                </div>
                <div v-if="chemical.info" class="time">{{ chemical.info }}</div>

                <div class="mon">
                    药品状态：{{ conventions.getChemicalStatus(chemical.status) }}&nbsp;
                    <span class="q">{{ utils.toPercentage(chemical.amount, (decimals = 0)) }}</span>
                </div>
                <div style="text-align: right; margin-top: 20rpx">
                    <button class="cu-btn btn round bg-cyan" @click="gotoChemicalDetail(chemical.id)">药品详情</button>
                </div>
            </div>

            <div v-else style="text-align: center; margin-top: 40rpx">无药品信息</div>
        </scroll-view>

        <div style="height: 100rpx"></div>
    </div>
    <tabbar :current-page="3" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uniRequest } from "@/utils/js/api.js";
import { onlyLoginedAccess } from "@/utils/js/loginCheck.js";
import * as utils from "@/utils/js/utils.js";
import * as conventions from "@/utils/js/conventions.js";
import { onPullDownRefresh } from "@dcloudio/uni-app";

const categories = ref([
    {
        name: "全部药品"
    },
    {
        name: "我的领用"
    },
    {
        name: "无机药品"
    },
    {
        name: "有机药品"
    },
    {
        name: "易制毒制爆药品"
    }
]);
const chemicals = ref([]);

onMounted(async () => {
    uni.showToast({
        title: "加载中",
        icon: "loading",
        duration: 100000
    });
    await onlyLoginedAccess();
    // 使用 Promise.all 并行获取
    await Promise.all([getChemicalAmount(), getChemicals()]);
    uni.hideToast();
});

onPullDownRefresh(async () => {
    try {
        uni.reLaunch({
            url: "/pages/chemicals/index"
        });
        uni.stopPullDownRefresh();
    } catch (error) {
        console.error(error);
    }
});

const allChemicalLength = ref(0);
const inorganicChemicalLength = ref(0);
const organicChemicalLength = ref(0);
const dangerousChemicalLength = ref(0);

const getChemicalAmount = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid")
    };
    const res = await uniRequest("POST", "chemical", "/getChemicalAmount", data);
    if (res.status < 0) return;
    allChemicalLength.value = res.data.allChemicalLength;
    inorganicChemicalLength.value = res.data.inorganicChemicalLength;
    organicChemicalLength.value = res.data.organicChemicalLength;
    dangerousChemicalLength.value = res.data.dangerousChemicalLength;
};

const getChemicals = async (filterType = 0) => {
    const data = {
        sessionid: uni.getStorageSync("sessionid"),
        filterType: filterType
    };
    const res = await uniRequest("POST", "chemical", "/getChemicals", data);
    if (res.status < 0) return;
    chemicals.value = res.chemicals;
};

const getMyChemicals = async () => {
    const data = {
        sessionid: uni.getStorageSync("sessionid")
    };
    const res = await uniRequest("POST", "chemical", "/getMyChemicals", data);
    if (res.status < 0) return;
    chemicals.value = res.chemicals;
};

let current = ref(0);
const change = async (index) => {
    uni.showToast({
        title: "加载中",
        icon: "loading",
        duration: 100000
    });
    current.value = index; // 按钮切换状态
    if (index === 1) {
        await getMyChemicals();
        uni.hideToast();
        return;
    }
    if (index > 1) index--;
    await getChemicals(index);
    uni.hideToast();
};

const searchContent = ref("");
const search = async () => {
    current.value = 0;
    uni.showToast({
        title: "加载中",
        icon: "loading",
        duration: 100000
    });
    let data = {
        sessionid: uni.getStorageSync("sessionid"),
        searchContent: searchContent.value
    };
    const res = await uniRequest("POST", "chemical", "/searchChemical", data);
    if (res.status < 0) {
        uni.showToast({
            title: res.message,
            icon: "none",
            duration: 1000
        });
    }
    chemicals.value = res.chemicals;
    uni.hideToast();
};

const gotoChemicalDetail = (chemicalId) => {
    uni.navigateTo({
        url: `/pages/chemicals/detail?id=${chemicalId}`
    });
};

const gotoAddChemical = () => {
    uni.navigateTo({
        url: "/pages/chemicals/add-or-modify"
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
        background: #fff3eb;
        border-radius: 8rpx 8rpx 8rpx 8rpx;

        font-weight: 500;
        font-size: 24rpx;
        color: #f25c07;
        line-height: 24rpx;
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
