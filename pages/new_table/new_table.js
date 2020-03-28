import utils from '../../utils/util.js'
import base64Transform from '../../utils/base64Transform.js'
import networkUtils from '../../utils/networkUtils.js'
const appInst = getApp()
Page({
	data: {
		bgHeight: appInst.globalData.bgHeight,
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		isPrivate: false,
		isLimit: false,
		nowDate: null,
		nowTime: null,
		endDate: null,
		endTime: null,
		endDateTime: null,
		fileName: null,
		newColumns: [],
		hasColumnName: false,
		// 处理错误
		processError: false,
		// 进度条百分比
		processingPercent: 0,
		// 处理结果
		processResult: "",
		// 处理完成
		processFinished: false,
		newColumnName: "",
		newColumnComment: "",
		canCreateTable: false,
		modalName: "",
		lastPage: null,
		signIned: appInst.globalData.signIned
	},
	onLoad: function (options) {
		this.setData({
			lastPage: options.lastPage
		});
		appInst.checkToken();
		wx.hideShareMenu({
			success: (result) => {},
			fail: () => {},
			complete: () => {}
		});
	},
	onReady: function () {},
	onShow: function () {},
	onHide: function () {},
	onUnload: function () {},
	onPullDownRefresh: function () {},
	onReachBottom: function () {},
	onPageScroll: function (object) {

	},
	/**
	 * 切换表格截止属性
	 */
	isLimitSwitchChange: function () {
		if (!this.data.isLimit) {
			this.setData({
				isLimit: !this.data.isLimit,
				nowDate: Date.now(),
				nowTime: Date.now(),
				endDate: utils.formatToDate(Date.now()),
				endTime: utils.formatToTime(Date.now()),
				endDateTime: utils.formatToDateTime(Date.now())
			})
		} else {
			this.setData({
				isLimit: !this.data.isLimit,
			})
		}

	},
	/**
	 * 切换私密表格属性
	 */
	isPrivateSwitchChange: function () {
		this.setData({
			isPrivate: !this.data.isPrivate
		})
	},
	/**
	 * 改变截止时间
	 */
	TimeChange(e) {
		this.setData({
			endTime: e.detail.value,
			endDateTime: this.data.endDate + " " + e.detail.value
		})
	},
	/**
	 * 改变截止日期
	 */
	DateChange(e) {
		this.setData({
			endDate: e.detail.value,
			endDateTime: e.detail.value + " " + this.data.endTime
		})
	},
	/**
	 * 显示模态框
	 * @param {事件参数} e 
	 */
	showNewColumnModal(e) {
		this.setData({
			modalName: e.currentTarget.dataset.target
		})
		this.clearInputValue();
	},
	/**
	 * 隐藏模态框
	 */
	hideModal() {

		this.setData({
			modalName: ""
		})
	},
	/**
	 * 获取表格名称输入框的值
	 * @param {事件参数} e 
	 */
	getFileName(e) {
		var _fileName = e.detail.value;
		if (utils.stringNotNull(_fileName)) {
			this.setData({
				fileName: _fileName,
			})
		}
		this.checkCreateTable();
	},
	/**
	 * 获取新列的列名,并设置确认按钮的状态
	 * @param {事件参数} e 
	 */
	getNewColumnName(e) {
		var _newColumnName = e.detail.value;
		if (utils.stringNotNull(_newColumnName)) {
			this.setData({
				newColumnName: _newColumnName,
				hasColumnName: true
			})
		} else {
			this.setData({
				hasColumnName: false
			})
		}
		this.checkCreateTable();
	},
	/**
	 * 获取新列的备注
	 * @param {事件参数} e 
	 */
	getNewColumnComment(e) {
		this.setData({
			newColumnComment: e.detail.value
		})
	},
	/**
	 * 清除新列输入框的值
	 */
	clearInputValue() {
		this.setData({
			newColumnName: "",
			newColumnComment: "",
			hasColumnName: false
		})
	},
	/**
	 * 点击模态框的确认按钮
	 * @param {事件参数} e 
	 */
	comfirmAddColumn(e) {
		var name = this.data.newColumnName;
		var comment = this.data.newColumnComment;
		var _newColumns = this.data.newColumns;
		var _length = _newColumns.length;
		_newColumns.push({
			"index": _length,
			"unique": base64Transform.encode(_length + '_' + name),
			"data": name,
			"comment": comment != null ? comment : ""
		})
		this.setData({
			newColumns: _newColumns
		})
		this.clearInputValue();
		this.hideModal();
		this.checkCreateTable();
	},
	/**
	 * 删除数据列，行修正数组中的数据
	 * @param {事件参数} e 
	 */
	removeColumn(e) {
		var _unique = e.currentTarget.id
		var _index = null;
		var _newColumns = this.data.newColumns;
		for (let i = 0; i < _newColumns.length; i++) {
			if (_newColumns[i].unique == _unique) {
				_index = _newColumns[i].index;
				_newColumns.splice(_index, 1);
				break;
			}
		}
		for (let i = _index; i < _newColumns.length; i++) {
			_newColumns[i].index = i;
			_newColumns[i].unique = base64Transform.encode(_newColumns[i].index + '_' + _newColumns[i].name)
		}
		this.setData({
			newColumns: _newColumns,
		})
		this.checkCreateTable();
	},
	/**
	 * 显示进度条模态框
	 */
	showProcessingModal() {
		this.setData({
			modalName: "processingModal"
		})
	},
	checkCreateTable() {
		var _fileName = this.data.fileName;
		if (utils.stringNotNull(_fileName) && this.data.newColumns.length >= 1) {
			this.setData({
				canCreateTable: true
			})
		} else {
			this.setData({
				canCreateTable: false
			})
		}
	},
	/**
	 * 开始新建表格
	 */
	CreateTable() {
		if (this.data.newColumns.length >= 1 && utils.stringNotNull(this.data.fileName) && appInst.globalData.signIned) {
			var _userInfo = wx.getStorageSync('_userInfo');
			this.setProcess(0, false, false, "准备中...");
			this.showProcessingModal();
			utils.delay(1000).then(() => {
				this.setProcess(20, false, false, "准备中...");
			})
			utils.delay(1600).then(() => {
				this.setProcess(40, false, false, "准备中...");
			})
			var _url = networkUtils.api_path + "/event/create";
			var _data = {
				"userId": _userInfo.userId,
				"rowJsonData": JSON.stringify(this.data.newColumns),
				"colCount": this.data.newColumns.length,
				"fileName": this.data.fileName,
				"isPrivate": this.data.isPrivate,
				"isLimit": this.data.isLimit,
				"limitTime": this.data.isLimit ? this.data.endDateTime : null
			}
			utils.delay(2200).then(() => {
				this.setProcess(50, false, false, "准备中...");
			})
			utils.delay(3000).then(() => {
				this.setProcess(70, false, false, "正在新建，请稍等");
			})
			utils.delay(3600).then(() => {
				networkUtils.httpRequest(_url, _data, 'POST').then(res => {
					if (res.data.status == 1) {
						this.setProcess(100, true, false, "新建完成");
					} else {
						this.setProcess(90, true, true, "新建失败，服务器繁忙");
					}
				}).catch(err => {
					console.log(err);
					this.setProcess(80, true, true, "新建失败，网络错误");
				});
			});

		}

	},
	/**
	 * 点击进度条模态框关闭按钮
	 * @param {事件参数} e 
	 */
	closeProcessModal: function (e) {
		if (this.data.processFinished) {
			if (!this.data.processError) {
				wx.navigateBack({
					delta: 1
				})
			} else {
				this.hideModal();
			}
		}
	},
	/**
	 * 设置进度条状态和文字
	 * @param {进度条百分比} percent 
	 * @param {是否完成} finished 
	 * @param {是否发生错误} error 
	 * @param {处理结果} result 
	 */
	setProcess: function (percent, finished, error, result) {

		this.setData({
			processingPercent: percent,
			processFinished: finished,
			processError: error,
			processResult: result
		})
	}
})