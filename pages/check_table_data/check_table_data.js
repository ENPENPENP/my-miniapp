// pages/test_table/test_table.js
import networkUtils from '../../utils/networkUtils.js'
var appInst = getApp();
Page({
	data: {
		bgHeight: appInst.globalData.bgHeight,
		navigateBarTitleFontSize: appInst.globalData.navigateBarTitleFontSize,
		tarBarHeight: appInst.globalData.tarBarHeight,
		CustomBar: appInst.globalData.CustomBar,
		//* 登录状态
		signIned: appInst.globalData.signIned,
		//* 列名滚动条的位置
		colScroll_left: 0,
		//* 行号滚动条的位置
		rowScroll_top: 0,
		//* 数据滚动条距离左侧的位置
		dataScroll_left: 0,
		//* 数据滚动条距离顶部的位置
		dataScroll_top: 0,
		//* 单元格宽度
		// cellWidth: 100,
		//* 单元格最大宽度
		cellWidths: null,
		//* 单元格高度
		cellHeight: 35,
		//* 标志当前点击的scroll-view
		curTapScroll: null,
		//* 表格的高度占比
		tableHeightPercent: 100,
		//* 列数
		colCount: null,
		//* 行数
		rowCount: null,
		//* 列的最大宽度
		// colMaxWidth: null,
		//* 行的最大宽度
		// rowMaxWidth: null,
		//* 事件
		event: null,
		//! 当前登录用户的id
		curUserId: null,
		//* 数据列表
		fileDataList: null,
		//* 单元格的内容
		cellContent: "",
		//* 当前选择的单元格的列索引
		selectColIndex: -2,
		//* 当前选择的单元格的行索引
		selectRowIndex: -2,
		//! 输入框的可编辑属性
		editAble: false,
		//! 表格是否被修改过
		isEdited: false
	},
	onLoad: function (options) {
		var _userInfo = wx.getStorageSync('_userInfo')
		var _event = JSON.parse(options.event);
		var _url = networkUtils.api_path + '/file/get/' + _event.fileInfo.fileId + '?type=data';
		networkUtils.httpRequest(_url, null).then(res => {
			if (res.data.status == 1) {
				var _fileDataList = res.data.fileDataList;
				for (let i = 0; i < _fileDataList.length; i++) {
					_fileDataList[i].rowData = JSON.parse(_fileDataList[i].rowData);
				}
				this.setData({
					fileDataList: _fileDataList,
					event: _event,
					curUserId: _userInfo.userId,
					rowCount: _fileDataList.length,
					colCount: _fileDataList[0].rowData.length
				})
				this.getMaxCellWidth();
			}
		}).catch(err => {
			console.log(err);
		})
	},
	onReady: function () {},
	onShow: function () {},
	onHide: function () {},
	onUnload: function () {},
	/**
	 * *获取单元格的最大宽度
	 */
	getMaxCellWidth: function () {
		var _cellWidths = new Array(this.data.colCount);
		for (var row = 0; row < this.data.rowCount; row++) {
			var rowObj = this.data.fileDataList[row];
			for (var col = 0; col < this.data.colCount; col++) {
				var cellData = rowObj.rowData[col].data;
				if (_cellWidths[col] == null || cellData.length > _cellWidths[col]) {
					_cellWidths[col] = cellData.length;
				}
			}
		}
		this.setData({
			cellWidths: _cellWidths
		})
	},
	/**
	 * *获取列名scroll-view的滚动值，同步设置数据scroll-view的滚动值
	 * @param {事件参数} e 
	 */
	colScroll: function (e) {
		if (this.data.curTapScroll == null) {
			this.setData({
				curTapScroll: 'col',
				dataScroll_left: e.detail.scrollLeft
			})
			setTimeout(() => {
				this.setData({
					curTapScroll: null
				})
			}, 50);
		}
	},
	/**
	 * *获取行数scroll-view的滚动值，同步设置数据scroll-view的滚动值
	 * @param {事件参数} e 
	 */
	rowScroll: function (e) {
		if (this.data.curTapScroll == null) {
			this.setData({
				curTapScroll: 'row',
				dataScroll_top: e.detail.scrollTop
			})
			setTimeout(() => {
				this.setData({
					curTapScroll: null
				})
			}, 50);
		}
	},
	/**
	 * *获取数据scroll-view的滚动值，并设置行号和列名的滚动值
	 * @param {事件参数} e 
	 */
	scroll: function (e) {
		if (this.data.curTapScroll == null) {
			this.setData({
				curTapScroll: 'data',
				colScroll_left: e.detail.scrollLeft,
				rowScroll_top: e.detail.scrollTop
			})
			setTimeout(() => {
				this.setData({
					curTapScroll: null
				}, 50)
			})
		}
	},
	/**
	 * *点击表格元素的触发事件，
	 * *判断当前的单元格的属性，如果是普通单元格设置可编辑属性和获取单元格的值
	 * *如果是行号或者列名，则取消可编辑属性
	 * @param {事件参数} e 
	 */
	cellTap: function (e) {
		var colNum = e.currentTarget.dataset.colNum;
		var rowNum = e.currentTarget.dataset.rowNum;
		var _cellContent = (colNum >= 0 && rowNum > 0) ? this.data.fileDataList[rowNum].rowData[colNum].data : "";
		var _editAble = (colNum >= 0 && rowNum > 0 && this.data.curUserId == this.data.event.userId)
		this.setData({
			selectColIndex: colNum,
			selectRowIndex: rowNum,
			cellContent: _cellContent,
			editAble: _editAble
		})
	},
	/**
	 * *获取修改的单元格的值
	 * @param {事件参数} e 
	 */
	modifyValue: function (e) {
		if (this.data.selectRowIndex > 0 && this.data.selectColIndex >= 0) {
			var _row = this.data.selectRowIndex;
			var _col = this.data.selectColIndex;
			var _data = 'fileDataList[' + _row + '].rowData[' + _col + '].data';
			this.setData({
				[_data]: e.detail.value,
				isEdited: true
			})
		}
	},
	/**
	 * *当输入框失去焦点时将cellContent设置为空字符串，避免点击到下一个单元格时发生赋值错误
	 * @param {事件参数} e 
	 */
	// 
	inputBlur: function (e) {
		this.setData({
			cellContent: ""
		})
	},
	/**
	 * 清除单元格的值
	 * @param {事件参数} e 
	 */
	clearValue:function(e){
		if (this.data.selectRowIndex > 0 && this.data.selectColIndex >= 0) {
			var _row = this.data.selectRowIndex;
			var _col = this.data.selectColIndex;
			var _data = 'fileDataList[' + _row + '].rowData[' + _col + '].data';
			this.setData({
				[_data]: "",
				isEdited: true,
				cellContent:""
			})
		}
	},
	/**
	 * *提交修改
	 * @param {事件参数} e 
	 */
	submitChange: function (e) {
		var _url = networkUtils.api_path + '/file/updateData';
		var _fileDataList = new Array();
		for (var index = 0; index < this.data.fileDataList.length; index++) {
			var element = JSON.parse(JSON.stringify(this.data.fileDataList[index]));
			element.rowData = JSON.stringify(element.rowData);
			_fileDataList.push(element);
		}
		networkUtils.post(_url, {
			'fileId': this.data.event.fileId,
			'fileDataList': JSON.stringify(_fileDataList)
		}).then(res => {
			if (res.data.status == 1) {
				console.log(res);
			}
		}).catch(err => {
			console.log(err);
		});
	}
})