// 服务器ip
let local = "http://127.0.0.1:8050";
let release = "https://charlie.black";
let run = release;

// 封装Promise
export const uniRequest = (method = "GET", blue = null, url = null, data = null, headers = null) => {
	let fullURL = run + "/" + blue + url;

	if (method === "GET" && data) {
		const params = new URLSearchParams(data).toString();
		fullURL += "?" + params;
		data = null;
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: fullURL,
			method: method,
			header: {
				"Content-Type": "application/json",
				...(headers || {})
			},
			data: method === "GET" ? data : JSON.stringify(data),
			dataType: "json",
			sslVerify: false,
			withCredentials: false,
			firstIpv4: false,
			success: (res) => {
				if (res.statusCode === 200) {
					resolve(res.data);
				} else {
					reject(res.data);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: "服务器繁忙，请稍后再试",
					icon: "none",
					duration: 1000
				});
				reject(err);
			}
		});
	});
};

// 使用地狱回调
// export const uniRequest = (request_type = null, blue = null, url = null, data = null, success = null) => {
// 	let fullURL = run + '/' + blue + '/' + url;
// 	uni.request({
// 		url: fullURL,
// 		data: data,
// 		dataType: "json",
// 		method: request_type,
// 		sslVerify: false,
// 		withCredentials: false,
// 		firstIpv4: false,
// 		success(res) {
// 			if (success) {
// 				success(res)
// 				// console.log("success :", res.data)		// 包含敏感信息，生产环境切勿加
// 			}
// 		},
// 		fail(e) {
// 			console.log('fail :', e);

// 		},
// 		// complete(res) {
// 		// 	console.log("complete :", res);
// 		// },
// 	});
// }
