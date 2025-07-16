import { ref } from "vue";

import { uniRequest } from "@/utils/js/api.js";

export const loginCheck = async () => {
    const sessionid = uni.getStorageSync("sessionid");
    if (!sessionid) {
        console.log("用户未登录");
        uni.clearStorageSync();
        return null;
    }
    const res = await uniRequest("POST", "user", "/loginCheck", {
        sessionid: sessionid
    });
    console.log(res.message);
    if (res.status !== 200) {
        uni.clearStorageSync();
        return null;
    }
    // briefUserInfo
    return {
        id: res.data.id,
        username: res.data.username,
        usertype: res.data.usertype
    };
};

export const getUserInfo = async () => {
    const res = await uniRequest("POST", "user", "/getUserInfo", { sessionid: uni.getStorageSync("sessionid") });
    if (res.status === 200) {
        return res.user;
        // uni.setStorageSync("user", res.user);
    }
};

export const onlyLoginedAccess = async () => {
    const briefUserInfo = await loginCheck();
    if (!briefUserInfo) {
        uni.showToast({
            title: "请登录",
            icon: "none",
            duration: 1000
        });
        setTimeout(() => {
            uni.reLaunch({
                url: "/pages/login/login"
            });
        }, 1000);
    }
};
