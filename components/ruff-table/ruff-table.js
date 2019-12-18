Component({
    properties: {
        header: { // 表头
            type: Array,
            value: []
        },
        list: { // 数据列表
            type: Array,
            value: []
        },
		options :{ //设置的属性
			type: JSON,
			value:[]
		}
    },
    observers: {
        'header': function(newData, oldData) {
            let arr = newData.map(item => {
                return item.width;
            });
            this.setData({
                cellWidthList: arr
            });
        },
        'list': function(newData, oldData) {
			console.log(newData);
			this.setData({
				total: newData.length
			})
		},
		'options': function(newData, oldData){
			console.log(newData);
			if(newData.setCellWidth != null){
				this.setData({
					setCellWidth : newData.setCellWidth
				})
			}
			if(newData.pagination != null){
				this.setData({
					pagination : newData.pagination
				})
			}
			if(newData.pageSize != null){
				this.setData({
					pageSize : newData.pageSize
				})
            }
            if(newData.convertBool != null){
                this.setData({
                    convertBool : newData.convertBool
                })
            }
		}
    },
    data: {
		total: 0, //数据总行数
		setCellWidth: true, // 是否设置列宽度
        pageSize: 10, //每页的行数
        convertBool: false, //是否转换bool值为是或否
		pagination: false, //是否进行分页
        jumpAble: false, //是否可以跳转
        currPage: 1, //当前页数
        cellWidthList: []
    },
    methods: {
		/**
		 * 点击事件的函数，返回包含当前点击的行数和页面的对象
		 */
        clickHere(e) {
			this.triggerEvent('click', { code: 1, index: e.currPageTarget.dataset.no, currPage:this.data.currPage }, { bubbles: true });
        },
		/**
		 * 跳转到上一页
		 */
        previous() {
            if (this.data.currPage - 1 > 0) {
                this.setData({
                    jumpAble: true,
                    currPage: this.data.currPage - 1
                });
				this.triggerEvent('change', { code: 1, currPage: this.data.currPage, total: this.data.total }, { bubbles: true });
            } else {
                this.triggerEvent('change', { code: 0, msg: '跳转页数不能小于0' }, { bubbles: true });
            }
        },
		/**
		 * 跳转到下一页
		 */
        next() {
            if (this.data.currPage + 1 <= this.data.total) {
                this.setData({
                    jumpAble: true,
                    currPage: this.data.currPage + 1
                });
				this.triggerEvent('change', { code: 1, currPage: this.data.currPage, total: this.data.total }, { bubbles: true });
            } else {
                this.triggerEvent('change', { code: 0, msg: '跳转页数不能大于总页数' }, { bubbles: true });
            }
        },
		/**
		 * 跳转到指定页面
		 */
        jump() {
            if (!this.data.jumpAble) {
                this.triggerEvent('change', { code: 0, msg: '跳转页数不能小于0或者大于总页数' }, { bubbles: true });
            } else {
                this.triggerEvent('change', { code: 1, currPage: this.data.currPage, total: this.data.total }, { bubbles: true });
            }
        },
		/**
		 * 跳转页数输入框失去焦点的事件函数
		 */
        pageBlur(e) {
			//如果输入的页面合法，设置当前页数为跳转的页数
            if (Number(e.detail.value) > 0 && Number(e.detail.value) <= this.data.total) {
                this.setData({
					jumpAble:true,
                    currPage: Number(e.detail.value)
                });
            } 
			//否则设置flag为false，禁止跳转
			else {
                this.setData({
                    jumpAble: false
                });
            }
        }
    },
    created() {}, // 组件在内存中创建完毕执行 created 组件实例化，但节点树还未导入，因此这时不能用setData
    attached() {}, // 组件挂载之前执行 节点树完成，可以用setData渲染节点，但无法操作节点
    ready() {}, // 组件挂载后执行 组件布局完成，这时可以获取节点信息，也可以操作节点
    detached() {}, // 组件移除执行 组件实例从节点树中移除
    moved() {}, // 组件移动的时候执行 组件实例被移动到树的另一个位置
});