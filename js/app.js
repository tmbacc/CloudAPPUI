/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
var serverurl="192.168.1.106:8080";


function getFormatDate() {
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
	var date = nowDate.getDate() < 10 ? "0" + (nowDate.getDate() - 1) : nowDate.getDate() - 1;
	return year + "-" + month + "-" + date;
}

function getRobotData(startdatesearch, robottype, inserttablearray, devicePR, chartid, callback) {

	console.log(startdatesearch);
	mui.ajax('http://'+serverurl+'/dayreportlog/searchdayreportlog', {
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
				drawchart(jsondata, chartid, devicePR);
				return callback('当日数据还未更新');
			} else {

				for (let s of data.data) {
					var row = {};
					var row2 = {};
					var row3= {};
					row.typename = s.typename;
					row.counttype = '设备总台数';
					row.count = s.totalnums;
					jsondata.push(row);
					row2.typename = s.typename;
					row2.counttype = '在线设备台数';
					row2.count = s.onlineworknums;
					jsondata.push(row2);

					row3.typename = s.typename;
					row3.counttype = '在线未工作台数';
					row3.count = s.onlinenoworknums;
					jsondata.push(row3);
					
					
					var x1 = inserttablearray[0].insertRow(0);
					var a11 = x1.insertCell(0);
					var a12 = x1.insertCell(1);
					var a13 = x1.insertCell(2);
					var a14 = x1.insertCell(3);


					var x2 = inserttablearray[1].insertRow(0);
					var a21 = x2.insertCell(0);
					var a22 = x2.insertCell(1);
					var a23 = x2.insertCell(2);
					var a24 = x2.insertCell(3);

					var x3 = inserttablearray[2].insertRow(0);
					var a31 = x3.insertCell(0);
					var a32 = x3.insertCell(1);
					var a33 = x3.insertCell(2);
					var a34 = x3.insertCell(3);

					var x4 = inserttablearray[3].insertRow(0);
					var a41 = x4.insertCell(0);
					var a42 = x4.insertCell(1);
					var a43 = x4.insertCell(2);


					a11.innerHTML = s.typename;
					a12.innerHTML = s.totalnums;
					a13.innerHTML = s.onlineworknums;
					a14.innerHTML = s.onlinenoworknums;

					a21.innerHTML = s.typename;
					a22.innerHTML = s.servicetimes;
					a23.innerHTML = s.errornums;
					a24.innerHTML = s.traineronlinenums;

					a31.innerHTML = s.typename;
					a32.innerHTML = s.newcustomer;
					a33.innerHTML = s.newarragedevicesnums;
					a34.innerHTML = s.newonlinedevicesnums;

					a41.innerHTML = s.typename;
					a42.innerHTML = s.servicedevicesnums;
					a43.innerHTML = s.delivernums;

				}
				drawchart(jsondata, chartid, devicePR);

			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("++++++++++++++++++++++++");
			return callback('当日数据还未更新');
		}
	});


}

function drawchart(data, myChart, windowstemp) {
	console.log(myChart + "chart+++++++++++++++++++++");
	const chart = new F2.Chart({
		id: myChart,
		pixelRatio: windowstemp, // 指定分辨率
	});

	for (var s of data) {
		console.log(s.typename + "+++++++++++++++++++++");
		console.log(s.counttype + "+++++++++++++++++++++");
		console.log(s.count + "+++++++++++++++++++++");
		//finalData.push({year: s.typename,sales: s.trainernums});
	}
	chart.source(data, {
		count: {
			tickCount: 5
		}
	});

	chart.tooltip({
		showItemMarker: false,
		onShow: function onShow(ev) {
			const items = ev.items;
			
			//items[0].name = items[0].name;
		//	items[0].value =  items[0].value;
		}
	});
	//chart.tooltip(false);


	chart.interval()
		.position('counttype*count')
		.color('typename')
		.adjust({
			type: 'dodge',
			marginRatio: 0.05 // 设置分组间柱子的间距
		});
	chart.render();

	// 绘制柱状图文本
	// const offset = -5;
	// const canvas = chart.get('canvas');
	// const group = canvas.addGroup();
	// const shapes = {};
	// data.forEach(function(obj) {
	// 	const point = chart.getPosition(obj);
	// 	const text = group.addShape('text', {
	// 		attrs: {
	// 			x: point.x+offset,
	// 			y: point.y + offset,
	// 			text: obj.count,
	// 			textAlign: 'center',
	// 			textBaseline: 'bottom',
	// 			fill: '#808080'
	// 		}
	// 	});

	// 	shapes[obj.typename] = text; // 缓存该 shape, 便于后续查找
	// }); 

	/* let lastTextShape; // 上一个被选中的 text
	// 配置柱状图点击交互
	chart.interaction('interval-select', {
	  selectAxisStyle: {
	    fill: '#000',
	    fontWeight: 'bold'
	  },
	  mode: 'range',
	  defaultSelected: {
	    typename: '1962 年',
	    totalnums: 38
	  },
	  onEnd: function onEnd(ev) {
	    const data = ev.data,
	      selected = ev.selected;
	
	    lastTextShape && lastTextShape.attr({
	      fill: '#808080',
	      fontWeight: 'normal'
	    });
	    if (selected) {
	      const textShape = shapes[data.typename];
	      textShape.attr({
	        fill: '#000',
	        fontWeight: 'bold'
	      });
	      lastTextShape = textShape;
	    }
	    canvas.draw();
	  }
	});

	 */

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

		mui.ajax('http://'+serverurl+'/user/searchuser', {
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

		mui.ajax('http://'+serverurl+'/dayreportlog/searchdayreportlog', {
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
