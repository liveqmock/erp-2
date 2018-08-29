<template>
	<Row>
		<Col span="6" style="padding-right: 30px;" v-show="showCategory">
			<div class="ui-tree" :class="{'search': showCategorySearch}">
			    <div class="ui-tree-header">
			    	<Row>
				    	<Col span="18" style="padding-right: 5px;">
				    		<Input v-model="categoryKeywords" size="small" placeholder="请输入品类关键词"></Input>
				    	</Col>
				    	<Col span="6">
				    		<Button type="primary" size="small" @click="handleSearchCategory">搜索</Button>
				    	</Col>
				    </Row>
			    </div>
				<a class="ui-tree-clear" v-show="showCategorySearch" @click="handleClearCategorySearch">清除搜索</a>
				<div class="ui-tree-box">
					<Tree :data="category" @on-select-change="handleChangeCategory"></Tree>
				</div>
			</div>
		</Col>
		<Col :span="showCategory?18:24">
			<Row style="margin-bottom: 3px;">
		    	<Col span="8" style="padding-right: 5px;">
		    		<Input v-model="goodsKeywords" placeholder="请输入sku名称/平台码/本地货号"></Input>
		    	</Col>
		    	<Col span="4">
		    		<Button type="primary" @click="requestData(goodsKeywords)">搜索</Button>
		    	</Col>
		    </Row>
			<Table
				ref="table"
				:columns="tableColumns"
				:data="datas"
				:highlight-row="!multiple"
				@on-selection-change="handleSelect"
				@on-current-change="handleCurrentChange"
			></Table>
			<div style="margin: 10px; overflow: hidden">
		        <div style="float: right;">
		            <Page :total="pageTotal" :current="params.page" :page-size="params.limit" @on-change="changePage"></Page>
		        </div>
		    </div>
		</Col>
	</Row>
</template>

<script>
import Util from '@/libs/util';
export default {
	props: {
		value: {						// 值
			type: Array,
			default: function() {
				return [];
			}
		},
		extraColumns: {					// 表格拓展配置项
			type: Array,
			default: function() {
				return [];
			}
		},
		extraParams: Object,			// 表格数据请求参数拓展配置项
		extraCategoryParams: Object,	// 品类数据请求参数拓展配置项
		multiple: false,				// 选择模式，true为多选，false为单选
		showCategory: {					// 是否显示品类
			type: Boolean,
			default: true
		},
		getAll: false					// 获取数据，true为获取所有sku，false为获取当前登录用户的sku
	},
	data() {
		return {
			datas: [],
			params: {
				pid: 0,
				page: 1,
				limit: 10
			},
			pageTotal: 0,
			showCategorySearch: false,
			categoryKeywords: '',
			goodsKeywords: '',
			tableColumns: [
				{
                    title: '名称',
                    key: 'skuname',
                    render: (h, params) => {
                        return h('div', {
                        	props: {
                        		
                        	},
                        	attrs: {
                        		class: 'ui-ellipsis',
                        		title: params.row.skuname
                        	}
                        }, params.row.skuname)
                    }
                },
                {
                    title: '本地编码',
                    key: 'localsn',
                    width: 126
                },
                {
                    title: '状态',
                    key: 'status_text',
                    width: 68
                }
			],
			category: [
				{
					id: 0,
                    title: '全部分类',
                    expand: true,
                    children: []
                }
			],
			categoryData: []
		}
	},
	mounted() {
		
		// 合并table拓展的table columns
		this.extraColumns.forEach(item => {
			this.tableColumns.push(item);
		})
		
		// 合并sku拓展的请求参数
		for(let key in this.extraParams){
			this.params[key] = this.extraParams[key];
		}
		
		// 是否多选
		if(this.multiple) {
			this.tableColumns.unshift({
                type: 'selection',
                width: 60,
                align: 'center'
           	})
		}
		
		// 是否获取所有数据
		if(this.getAll){
			this.params['custom_id'] = -1;
		}
		
		this.requestData();
		this.requestCategory();
	},
	methods: {
		requestData(keywords) {
			let params = JSON.parse(JSON.stringify(this.params));
			if(keywords){
				params.keywords = keywords;
			}
			Util.ajax.post("/goods.goods_sku/lists", params).then(res => {
				this.pageTotal = res.total;
				this.params.page = res.current_page;
				this.datas = res.data;
	       	}).catch(() => {
	       		
	       	})
		},
		changePage(page) {
			this.params.page = page;
			this.requestData();
		},
		requestCategory(keywords) {
			let params = {
				status: 1,
				tree: true,
				limit: false,
				page: false
			}
			if(keywords){
				params.keywords = keywords;
			}
			if(this.getAll){
				params['custom_id'] = -1;
			}
			// 合并品类拓展请求参数
			for(let key in this.extraCategoryParams){
				params[key] = this.extraCategoryParams[key];
			}
			Util.ajax.post("/goods.goods_category/lists", params).then(res => {
				let datas = this.formatCategory(res);
				if(!keywords){
					this.categoryData = this.getArray(datas);
				}
				this.setCategory(datas);
	       	}).catch(() => {
	       		this.setCategory([]);
	       	})
		},
		setCategory(datas) {
			if(this.getAll){
				this.category[0].children = datas;
			}else{
				this.category = datas;
			}
		},
		getArray (datas){
			let arr = datas.map(item => {
				return {
					id: item.id,
					pid: item.pid,
					title: item.title,
					children: item.children
				}
			})
			return arr;
		},
		formatCategory(datas) {
			datas = datas.map(item => {
				let obj = {
					id: item.id,
					pid: item.pid,
					title: item.name
				};
				if(item._children && item._children.length > 0){
					obj.children = this.formatCategory(item._children);
				}
				return obj;
			})
			return datas;
		},
		handleChangeCategory(row) {
			if(row.length == 0) return;
			this.params.pid = row[0].id;
			this.params.page = 1;
			this.requestData();
		},
		handleSearchCategory() {
			if(!this.categoryKeywords) return;
			this.showCategorySearch = true;
			this.requestCategory(this.categoryKeywords);
		},
		handleClearCategorySearch() {
			this.categoryKeywords = '';
			this.showCategorySearch = false;
			this.setCategory(this.getArray(this.categoryData));
		},
		// 多选
		handleSelect(selection) {
			this.$emit('input', selection);
		},
		// 单选
		handleCurrentChange(currentRow, oldCurrentRow) {
			this.$emit('input', [currentRow]);
		}
	}
}
</script>

<style>
.ui-ellipsis {
	word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ui-tree {
	position: relative;
	border: 1px solid #dddee1;
	width: 100%;
	height: 556px;
}
.ui-tree .ui-tree-header {
	position: relative;
	padding: 5px;
	border-bottom: 1px solid #dddee1;
	z-index: 3;
}
.ui-tree .ui-tree-clear {
	display: block;
	position: absolute;
	top: 35px;
	left: 0;
	width: 100%;
	height: 22px;
	text-align: center;
	line-height: 22px;
	background-color: #f9f9f9;
	z-index: 2;
}
.ui-tree .ui-tree-box {
	position: relative;
	padding: 0 10px;
	width: 100%;
	height: 519px;
	overflow: auto;
	z-index: 1;
}
.ui-tree.search .ui-tree-box {
	margin-top: 22px;
	height: 462px;
}
</style>