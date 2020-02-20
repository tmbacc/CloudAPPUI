/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/

function getFormatDate() {
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
	var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
	return year + "-" + month + "-" + date;
}

function getRobotData(startdatesearch,robottype,inserttable,callback){
	mui.ajax('http://192.168.1.106:8080/dayreportlog/searchdayreportlog', {
		data: {
			searchday: startdatesearch,
			//searchday: '2020-02-19',
			robottype: robottype
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			console.log(JSON.stringify(data.data));
			var jsondata = [];
			if ("[]" == JSON.stringify(data.data)) {
				jsondata = [];
				return callback('当日数据还未更新');
			} else {
	
				for (let s of data.data) {
					var row = {};
					row.year = s.typename;
					row.sales = s.totalnums;
					jsondata.push(row);	
					var x = inserttable.insertRow(0);
					var a1 = x.insertCell(0);
					var a2 = x.insertCell(1);
					var a3 = x.insertCell(2);
					var a4 = x.insertCell(3);
					var a5 = x.insertCell(4);
				
					a1.innerHTML = s.typename;
					a2.innerHTML = s.totalnums;
					a3.innerHTML = s.onlineworknums;
					a4.innerHTML = s.onlinenoworknums;
					a5.innerHTML = s.servicetimes;
				
				}
	
	
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("++++++++++++++++++++++++");	
			return callback('当日数据还未更新');
		}
	});
	
	
}

function drawchart(data, myChart, windowstemp) {
	 console.log("chart+++++++++++++++++++++");
	
	
	
	const chart = new F2.Chart({
		id: myChart,
		pixelRatio: windowstemp, // 指定分辨率
	});
	
	for (var s of data) {
     console.log(s.year+"+++++++++++++++++++++");
	console.log(s.sales+"+++++++++++++++++++++");
	   //finalData.push({year: s.typename,sales: s.trainernums});
	  }
	
	
	
	
	chart.source(data, {
		sales: {
			tickCount: 5
		}
	});

	chart.tooltip({
		showItemMarker: false,
		onShow: function onShow(ev) {
			const items = ev.items;
			items[0].name = null;
			items[0].name = items[0].title;
			items[0].value = '台数:' + items[0].value;
		}
	});

	chart.interval()
		.position('year*sales')
		.color('l(90) 0:#1890ff 1:#70cdd0'); // 定义柱状图渐变色
	chart.render();
}
(function($, owner) {
	/**
	 * 用户登录
	 **/

	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 3) {
			return callback('账号最短为 4 个字符');
		}
		if (loginInfo.password.length < 3) {
			return callback('密码最短为 4 个字符');
		}

		mui.ajax('http://192.168.1.106:8080/user/searchuser', {
			data: {
				username: loginInfo.account,
				password: loginInfo.password
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				console.log(JSON.stringify(data.data));

				if ("[]" == JSON.stringify(data.data)) {
					return callback('用户名或密码错误');
				} else {
					return owner.createState(loginInfo.account, callback);
				}


			},
			error: function(xhr, type, errorThrown) {
				console.log("++++++++++++++++++++++++");

				return callback('用户名或密码错误');
			}
		});

	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};
	//ajax从后台获取数据
	owner.getDayreportLogdata = function(startdatesearch, inserttable, windowstemp, myChart, callback) {
	
		mui.ajax('http://192.168.1.106:8080/dayreportlog/searchdayreportlog', {
			data: {
				searchday: startdatesearch
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				console.log(JSON.stringify(data.data));
				var jsondata = [];
				if ("[]" == JSON.stringify(data.data)) {
					jsondata = [];
					drawchart(jsondata, myChart, windowstemp);
					return callback('当日数据还未更新');
				} else {

					for (let s of data.data) {
						var row = {};
						row.year = s.typename;
						row.sales = s.totalnums;
						jsondata.push(row);
						var x = inserttable.insertRow(0);
						var a1 = x.insertCell(0);
						var a2 = x.insertCell(1);
						var a3 = x.insertCell(2);
						var a4 = x.insertCell(3);
						var a5 = x.insertCell(4);
						var a6 = x.insertCell(5);
						var a7 = x.insertCell(6);
						var a8 = x.insertCell(7);
						var a9 = x.insertCell(8);
						var a10 = x.insertCell(9);
						var a11 = x.insertCell(10);
						var a12 = x.insertCell(11);
						a1.innerHTML = s.typename;
						a2.innerHTML = s.totalnums;
						a3.innerHTML = s.onlineworknums;
						a4.innerHTML = s.onlinenoworknums;
						a5.innerHTML = s.servicetimes;
						a6.innerHTML = s.errornums;
						a7.innerHTML = s.traineronlinenums;
						a8.innerHTML = s.newcustomer;
						a9.innerHTML = s.newarragedevicesnums;
						a10.innerHTML = s.newonlinedevicesnums;
						a11.innerHTML = s.servicedevicesnums;
						a12.innerHTML = s.delivernums;
					}

					drawchart(jsondata, myChart, windowstemp);

				}
			},
			error: function(xhr, type, errorThrown) {
				console.log("++++++++++++++++++++++++");

				return callback('当日数据还未更新');
			}
		});
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));
