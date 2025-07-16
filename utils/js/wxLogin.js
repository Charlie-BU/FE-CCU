import { uniRequest } from "@/utils/js/api.js";
import * as utils from "@/utils/js/utils.js";

const getTempCode = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: "weixin",
			onlyAuthorize: true,
			success: (res) => {
				if (res) resolve(res);
				else {
					console.log("openid获取失败");
					reject(res);
				}
			},
			fail: (e) => {
				console.log("openid获取失败");
				reject(e);
			}
		});
	});
};

export const getOpenidAndSessionKey = async () => {
	const response = await getTempCode();
	if (response.code) {
		const res = await uniRequest("POST", "user", "/getOpenidAndSessionKey", { tempCode: response.code });
		console.log(res.message);
		if (res.status !== 200) {
			return null;
		}
		return [res.openid, res.session_key];
	}
	return null;
};



// export function wxLogin() {
// 	getOpenidAndSessionKey((openid) => {
// 		if (openid) {
// 			uniRequest(
// 				"POST",
// 				"wxLogin",
// 				{
// 					open_id: openid
// 				},
// 				"user",
// 				(res) => {
// 					// 登录成功
// 					if (res.data.status == 200) {
// 						wx.showToast({
// 							title: res.data.message,
// 							icon: "none",
// 							duration: 700
// 						});
// uni.setStorageSync("user_token", res.data.user_token);
// 						var user_token = res.data.user_token;
// 						// 异步获取用户信息
// 						function asyncTask(callback) {
// 							var user_id = utils.get_user_info(user_token)[0];
// 							utils.get_my_rank(user_id);
// 							callback();
// 						}
// 						asyncTask(() => {
// 							console.log("async task finished");
// 						});
// 						// -----异步进程结束-----

// 						setTimeout(() => {
// 							uni.reLaunch({
// 								url: "/pages/index/index"
// 							});
// 						}, 700);
// 					}
// 					// 微信未被绑定
// 					else {
// 						wx.showModal({
// 							title: res.data.message,
// 							content: "是否前往绑定微信？",
// 							callback: (res) => {
// 								if (res.confirm) {
// 									uni.navigateTo({
// 										url: "/pages/login/wx-bind"
// 									});
// 								}
// 							}
// 						});
// 					}
// 				}
// 			);
// 		} else {
// 			wx.showToast({
// 				title: "登录失败，请换其他方式登录",
// 				icon: "none",
// 				duration: 700
// 			});
// 		}
// 	});
// }
