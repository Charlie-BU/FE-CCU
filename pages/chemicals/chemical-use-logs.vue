<template>
    <div class="app">
        <scroll-view class="scroll" scroll-y="auto">
            <div class="box">
                <div class="search-box">
                    <div class="search-input">
                        <input type="text" v-model="searchKeyword" placeholder="输入药品/人名/日期（如2025年3月）"
                            @keyup.enter="searchLogs" />
                        <button @click="searchLogs">搜索</button>
                    </div>
                </div>

                <div class="wrapper">
                    <div class="logs-list" v-if="logs.length > 0">
                        <div class="log-item" v-for="(log, index) in logs" :key="index">
                            <div class="log-content">
                                <div class="log-info">
                                    <div class="info-item">
                                        <span class="label">姓名：</span>
                                        <span class="value">{{ log.operatorName }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">操作：</span>
                                        <span class="value">{{ log.operation }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">时间：</span>
                                        <span class="value">{{ formatDate(log.time) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="empty-state" v-else>
                        <div class="empty-text">暂无药品使用记录</div>
                    </div>
                </div>
            </div>
        </scroll-view>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { uniRequest } from '@/utils/js/api.js';
import { loginCheck } from '@/utils/js/loginCheck.js';

const logs = ref([]);
const searchKeyword = ref('');

onMounted(async () => {
    // 检查用户是否登录
    const user = await new Promise(resolve => {
        loginCheck(user => {
            resolve(user);
        });
    });

    if (user) {
        fetchLogs();
    } else {
        uni.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
        });
        setTimeout(() => {
            uni.navigateTo({
                url: '/pages/login/login'
            });
        }, 2000);
    }
});

const fetchLogs = async () => {
    try {
        const data = {
            sessionid: uni.getStorageSync('sessionid'),
            keyword: searchKeyword.value
        };

        const res = await uniRequest('POST', 'chemical', '/getLogs', data);

        if (res.status === 200) {
            logs.value = res.logs;
        } else {
            uni.showToast({
                title: res.message || '获取数据失败',
                icon: 'none'
            });
        }
    } catch (error) {
        console.error('获取药品使用记录失败:', error);
        uni.showToast({
            title: '获取数据失败，请稍后再试',
            icon: 'none'
        });
    }
};

const searchLogs = () => {
    fetchLogs();
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
.scroll {
    height: 90vh;
}

.app {
    box-sizing: border-box;
    padding: 20rpx;
    background: linear-gradient(135deg, #1ABFC0, #FFD5A4);
    min-height: 100vh;
}

.box {
    box-sizing: border-box;
    padding: 40rpx 20rpx;
    background-color: white;
    margin-top: 8rpx;
    background: #ffffff;
    border-radius: 20rpx;
}

.wrapper {
    margin-top: 20rpx;
}

.search-box {
    margin-bottom: 20rpx;

    .search-input {
        display: flex;
        align-items: center;
        background-color: #f5f5f5;
        border-radius: 50rpx;
        overflow: hidden;

        input {
            flex: 1;
            height: 70rpx;
            padding: 0 20rpx;
            font-size: 28rpx;
            border: none;
            background-color: transparent;
            border-radius: 12rpx 0 0 12rpx;
        }

        button {
            width: 120rpx;
            height: 70rpx;
            line-height: 70rpx;
            text-align: center;
            background-color: #1ABFC0;
            color: #ffffff;
            font-size: 28rpx;
            border: none;
            border-radius: 0 12rpx 12rpx 0;
        }
    }
}

.logs-list {
    .log-item {
        background-color: #ffffff;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;

        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15rpx;

            .chemical-name {
                font-size: 32rpx;
                font-weight: 600;
                color: #f25c07;
            }

            .log-time {
                font-size: 24rpx;
                color: #999999;
            }
        }

        .log-content {
            margin-top: 18rpx;

            .log-info {
                .info-item {
                    display: flex;
                    margin-bottom: 10rpx;

                    .label {
                        width: 150rpx;
                        font-size: 28rpx;
                        color: #666666;
                    }

                    .value {
                        flex: 1;
                        font-size: 28rpx;
                        color: #333333;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}

.empty-state {
    padding: 100rpx 0;
    text-align: center;

    .empty-text {
        font-size: 30rpx;
        color: #999999;
    }
}
</style>