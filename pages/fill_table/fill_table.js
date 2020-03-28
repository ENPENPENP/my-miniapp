// pages/fill_table/fill_table.js
import networkUtils from '../../utils/networkUtils.js'
import base64Transform from '../../utils/base64Transform.js'
var appInst = getApp();
Page({
	data: {
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		bgHeight: appInst.globalData.bgHeight,
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		tarBarHeight: appInst.globalData.tarBarHeight,
		CustomBar: appInst.globalData.CustomBar,
		fileInfo: null,
		colList: null,
		newData: null
	},
	onLoad: function (options) {
		this.setData({
			fileInfo: JSON.parse(options.fileInfo)
		})
	},
	onReady: function () {},
	onShow: function () {
		var _url = networkUtils.api_path + '/file/getColName/' + this.data.fileInfo.fileId;
		networkUtils.httpRequest(_url, null).then(res => {
			if (res.data.status == 1) {
				var _colList = res.data.fileDataList[0];
				// 使用json生成一个新的对象
				var _newData = JSON.parse(JSON.stringify(res.data.fileDataList[0]));
				_colList.rowData = JSON.parse(_colList.rowData);
				_newData.rowData = JSON.parse(_newData.rowData);
				// 直接用列名的数据行复制并清空内容作为存储新数据行的变量
				// 将新数据行的类型改为0， 代表为普通的数据行
				_newData.rowType = 0;
				_newData.userId = wx.getStorageSync('_userInfo').userId;
				// 因为不知道该行是文件中的第几行，所以在服务端设置行号
				_newData.rowIndex = null;
				// 清空行数据
				for (let i = 0; i < _newData.rowData.length; i++) {
					_newData.rowData[i].data = null;
					_newData.rowData[i].comment = null;
					_newData.rowData[i].unique = null;
					_newData.rowData[i].index = null;
				}
				this.setData({
					colList: _colList,
					newData: _newData
				})
			} else {
				console.log(res.data);
			}
		}).catch(err => {
			console.log(err)
		});

	},
	onHide: function () {},
	onUnload: function () {},
	/**
	 * 获取input组件的值，并更新到存放行数据的数组中
	 * @param {事件参数} e 
	 */
	getInputValue: function (e) {
		var _index = e.currentTarget.dataset.idx
		var _dataobj = JSON.parse(JSON.stringify(this.data.newData.rowData));
		_dataobj[_index].data = e.detail.value;
		_dataobj[_index].index = _index;
		_dataobj[_index].unique = base64Transform.encode(_index + "_" + e.detail.value);
		this.setData({
			'newData.rowData': _dataobj
		})
	},
	/**
	 * 点击保存按钮，提交新的数据行
	 * @param {事件参数} e 
	 */
	saveData: function (e) {
		var _newData = this.data.newData;
		var _url = networkUtils.api_path + '/file/addData';
		var _data = {
			"fileId": _newData.fileId,
			"userId": _newData.userId,
			"rowType": _newData.rowType,
			"rowData": JSON.stringify(_newData.rowData)
		}
		networkUtils.httpRequest(_url, _data, 'POST').then(res => {
			if (res.data.status == 1) {
				wx.navigateBack({
					delta: 1
				})
			}
		}).catch(err => {

		})
	}
})