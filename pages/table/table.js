import utils from '../../utils/util';
const app = getApp();

Page({
	data: {
		count: 0,
		total: 0,
		header: [{
			label: '故障时间',
			prop: 'time',
			width: 180
		}, {
			label: '设备名称',
			prop: 'equipName',
			width: 100
		}, {
			label: '故障代码',
			prop: 'warnCode',
			width: 60
		}, {
			label: '故障内容',
			prop: 'content',
			width: 250
		}, {
			label: '解除时间',
			prop: 'releaseTime',
			width: 150
		}, {
			label: '是否解除',
			prop: 'isRelease',
			width: 70
		}],
		originList: [],
		list: [{
			time: '2019-01-01 00:01:01',
			equipName: '西城区52号3502',
			warnCode: 113,
			content: '电压波动幅度过大',
			releaseTime: '2019-01-01 00:07:52',
			isRelease: true
		}],
		options:{
			setCellWidth: true,
			pagination: true,
			pageSize: 6,
			convertBool: true
		}
	},
	onLoad: function () {
		this.createData();
	},
	createData() {
		let arr = [], origin = this.data.list[0];
		for (let i = 0; i < 24; i++) {
			let t = new Date(origin.time),
				rt = new Date(origin.releaseTime);
			let r = Math.round(Math.random() * 10);
			arr.push({
				equipName: `西城区52号35${i < 10 ? '0' + i : i}`,
				warnCode: origin.warnCode + i,
				content: origin.content,
				isRelease: i % 2 === 0 ? utils.formatBool(true) : utils.formatBool(false),
				time: utils.formatTime(new Date(t - r * 24 * 3600 * 1000)),
				releaseTime: utils.formatTime(new Date(rt - (r - 2) * 24 * 3600 * 1000))
			});
		}
		this.setData({
			pageSize: 10,
			originList: arr,
			list: this.data.list.concat(arr).slice(0, this.data.options.pageSize)
		});
	},
	tableClick(e) {
		console.log(e.detail);
	},
	tableChange(e) {
		console.log(e.detail);
		if(e.detail.code != 0){
			let arr = this.data.originList;
			this.setData({
				list: arr.slice(e.detail.current - 1, e.detail.current - 1 + this.data.options.pageSize)
			});
		}
	},
});