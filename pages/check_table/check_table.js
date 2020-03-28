// pages/check_table/check_table.js
import networkUtils from '../../utils/networkUtils.js'
import wxApi from '../../utils/wxApi.js'
var appInst = getApp();
Page({
	data: {
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		bgHeight: appInst.globalData.bgHeight,
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		tarBarHeight: appInst.globalData.tarBarHeight,
		CustomBar: appInst.globalData.CustomBar,
		signIned: appInst.globalData.signIned,
		modalName: "",
		routeType: null,
		event: null,
		nickName: null,
		// 注意：这是当前用户的id，不是事件创建的id
		curUserId: null,
		btnDisabled: false,
		isloading: true,
		tempFilePath: null,
		filePath: null,
		downloaded: false,
		curUserId: null,
		isPrivate: null,
	},
	onLoad: function (options) {
		var that = this;
		var userInfo = wx.getStorageSync('_userInfo');
		that.setData({
			eventId: options.eventId,
			routeType: options.type,
			curUserId: userInfo.userId
		});
		// 设置当前页面分享带shareTicket
		wx.showShareMenu({
			withShareTicket: true,
		})
		// 获取当前事件的信息
		// this.getEvent(that.data.eventId);
		var _geteventurl = networkUtils.api_path + '/event/get/' + options.eventId;
		var _event = null;
		var _curUserId = null;
		networkUtils.httpRequest(_geteventurl, null).then(res => {
			if (res.data.status == 1) {
				_event = res.data.eventList[0];
				_curUserId = wx.getStorageSync('_userInfo').userId;
				that.setData({
					event: _event,
					curUserId: _curUserId,
					btnDisabled: (_curUserId == _event.userId) ? false : true,
				})
				that.data.isPrivate = _event.isPrivate
				var _url = networkUtils.api_path + '/user/getName/' + _event.userId;
				networkUtils.httpRequest(_url, null, 'GET').then(res => {
					if (res.data.status == 1) {
						that.setData({
							userName: res.data.nickName,
							isloading: false
						});
					}
				}).catch(err => {
					console.log(err);
				})
				// 检查当前页面的类型和是否已经登陆
				if (that.data.routeType == 'share' && appInst.globalData.signIned) {
					var shareOptions = wx.getStorageSync('_shareOptions');
					// 通过分享进来
					if (shareOptions.shareTicket != null && shareOptions.shareTicket != undefined) {
						// 通过shareTicket获取加密数据
						wx.getShareInfo({
							shareTicket: shareOptions.shareTicket,
							success: function (res) {
								console.log(res);
								var encryptedData = res.encryptedData;
								var iv = res.iv;
								// 使用login接口获取用户的code
								networkUtils.wxLogin().then(res => {
									var jscode = res.code;
									var _url = networkUtils.api_path + '/group/addEventGroup';
									var _data = {
										userId: that.data.curUserId,
										eventId: that.data.event.eventId,
										jscode: jscode,
										encryptedData: encryptedData,
										iv: iv
									}
									// 将获取到的加密数据和签名和code发送到后端，获取群的opengid
									networkUtils.httpRequest(_url, _data, 'POST').then(res => {
										console.log(res)
									}).catch(err => {
										console.log(err);
									})
								}).catch(err => {
									console.log(err);
								})
							},
							fail: function (res) {
								console.log(res)
							},
						})
					}
					// 通过单聊进来的，但是表格是私密的
					if ((shareOptions.shareTicket == null || shareOptions.shareTicket == undefined) && that.data.isPrivate) {
						that.showModal('warnModal');
					}
					wx.removeStorageSync('_shareOptions');
					appInst.checkToken();
				} else if (that.data.routeType == 'normal' && appInst.globalData.signIned) {
					appInst.checkToken();
				}
			}
		}).catch(err => {
			console.log(err);
		})

	},
	onReady: function () {},
	onShow: function (options) {
		this.getEvent(this.data.eventId);

	},
	onHide: function () {},
	onUnload: function () {},
	onPullDownRefresh: function () {},
	onReachBottom: function () {},
	onShareAppMessage: function () {
		var targetUrl = encodeURIComponent('/pages/check_table/check_table?eventId=' + this.data.eventId + '&type=share');
		console.log(targetUrl);
		return {
			title: '邀你一起编辑:' + this.data.event.fileInfo.fileName,
			path: '/pages/home/home?targetUrl=' + targetUrl + '?type=checkTable'
		}
	},
	/**
	 * 获取指定id的事件信息
	 * @param {事件id} eventId 
	 */
	getEvent: function (eventId) {
		var _geteventurl = networkUtils.api_path + '/event/get/' + eventId;
		wx.request({
			url: _geteventurl,
			data: {},
			header: {
				'content-type': 'application/json'
			},
			method: 'GET',
			dataType: 'json',
			responseType: 'text',
			success: (res) => {
				if (res.data.status == 1) {
					var _event = res.data.eventList[0];
					var _url = networkUtils.api_path + '/user/getName/' + _event.userId;
					var _curUserId = wx.getStorageSync('_userInfo').userId;
					this.setData({
						event: _event,
						curUserId: _curUserId,
						btnDisabled: (_curUserId == _event.userId) ? false : true,
					})
					networkUtils.httpRequest(_geteventurl, null).then(res => {
						if (res.data.status == 1) {
							networkUtils.httpRequest(_url, null, 'GET').then(res => {
								if (res.data.status == 1) {
									this.setData({
										userName: res.data.nickName,
										isloading: false
									});
								}
							}).catch(err => {
								console.log(err);
							})
						}
					}).catch(err => {
						console.log(err);
					})
				}
			},
			fail: () => {},
			complete: () => {}
		});
	},
	/**
	 * 显示指定的模态框
	 * @param {目标模态框名称} _modalName 
	 */
	showModal: function (_modalName) {
		this.setData({
			modalName: _modalName
		})
	},
	/**
	 * 隐藏所有模态框
	 */
	hideModal: function () {
		this.setData({
			modalName: ""
		})
	},
	/**
	 * 点击删除按钮
	 * @param {事件参数} e 
	 */
	clickDelete: function (e) {
		if (!this.data.isloading) {
			this.showModal("deleteModal");
		}
	},
	/**
	 * 确定删除
	 * @param {时间参数} e 
	 */
	comfirmDelete: function (e) {
		var url = networkUtils.api_path + '/event/delete/' + this.data.event.eventId;
		networkUtils.httpRequest(url, null, 'GET').then(res => {
			if (res.data.status == 1) {
				setTimeout(() => {
					wx.navigateBack({
						delta: 1
					})
				}, 1000);
			} else {
				console.log(res.data.errMsg);
			}
			this.hideModal();
		}).catch(err => {
			console.log(err);
		})
	},
	/**
	 * 跳转到查看表格数据的页面，附带文件信息参数
	 * @param {事件参数} e 
	 */
	toCheckTableData: function (e) {
		if (!this.dataisloading) {
			wx.navigateTo({
				url: '/pages/check_table_data/check_table_data?event=' + JSON.stringify(this.data.event)
			})
		}
	},
	/**
	 * 跳转到填写页面，附带表格事件参数
	 * @param {事件参数} e 
	 */
	toFillTable: function (e) {
		if (!this.data.isloading) {
			wx.navigateTo({
				url: '/pages/fill_table/fill_table?fileInfo=' + JSON.stringify(this.data.event.fileInfo)
			})
		}
	},
	generateFile: function (e) {
		var _url = networkUtils.api_path + '/file/generate/' + this.data.event.fileInfo.fileId;
		networkUtils.httpRequest(_url, null).then(res => {
			if (res.data.status == 1) {
				this.setData({
					['event.fileInfo']: res.data.fileInfo
				})
			} else {
				console.log(err);
			}
		}).catch(err => {
			console.log(err);
		})
	},
	/**
	 * 点击下载文件
	 * @param {事件参数} e 
	 */
	downloadFile: function (e) {
		appInst.checkToken();
		var _token = wx.getStorageSync('_tokenInfo');
		var _url = networkUtils.api_path + '/file/download/' + this.data.event.fileInfo.fileId + '?token=' + _token.token;
		wx.setClipboardData({
			data: _url,
		});
	},
	/**
	 * 点击打开文件
	 * @param {事件参数} e 
	 */
	openFile: function (e) {
		wxApi.wxOpenDocumentApi(this.data.filePath, 'xlsx').then(res => {
			console.log('open file success');
		}).catch(err => {
			console.log('openDocument file');
			console.log(err);
		})
	},
	closePage: function (e) {
		this.hideModal();
		setTimeout(() => {
			wx.navigateBack({
				delta: 1
			})
		}, 500);
	}
})