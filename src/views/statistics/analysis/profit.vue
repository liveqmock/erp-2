<template>
	<div>
		<Card>
			<div class = "profit">
				<Row>
					<div class = "searchBox">
						<div class = "searchBar">
							<span>统计周期：</span>
							<DatePicker v-model = "dateRange" :options = "timeOptions" type="daterange" placeholder="请选择日期" style="width: 300px" @on-change="dateChange"></DatePicker>
						</div>
					</div>
					<div class = "searchBox">
						<span>统计维度：</span>
						<div class = "searchBar">
							<Select style="width:100px" v-model = "params.group" placeholder="" @on-change="groupChange">
								<Option v-for = "item in groupOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
							</Select>
						</div>
						<div class = "searchBar" v-if = "params.group === 'skusn'">
							<Select style="width:250px" clearable filterable v-model = "spuId" placeholder="请选择产品名称" @on-change="getSKU">
								<Option v-for = "item in spuOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
							</Select>
						</div>
						<div class = "searchBar" v-if = "params.group === 'skusn'">
							<Select style="width:250px" clearable filterable v-model = "params.skusn" placeholder="请选择品种名称">
								<Option v-for = "item in skuOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
							</Select>
						</div>
						<div class = "searchBar" v-if = "params.group === 'catid'">
							<Select style="width:200px" clearable filterable v-model = "params.catid" placeholder="请选择类别">
								<Option v-for = "item in cateOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
							</Select>
						</div>
						<div class = "searchBar positionRight">
							<Button type="primary" @click = "exportTable"><Icon type="ios-download-outline" style="font-size: 16px;"></Icon> 导出报表</Button>
						</div>
					</div>
					<Row>
						<Col span = "24">
							<thrgo-table
          		  ref = "profitGrid"
								:isSearch="false"
          		  :border="false"
          		  path="/statistics/statistics_business/count_profit"
          		  :params="params"
          		  :pagination="true"
          		  :columns="profitGridCol"
          		  :loading="true"
          		></thrgo-table>
						</Col>
					</Row>
				</Row>
			</div>
		</Card>
	</div>
</template>

<script>
import thrgoTable from '@/views/components/thrgo/table/table.vue'
import Util from '@/libs/util'

export default {
	name: 'profitIndex',
	components: {
		thrgoTable
	},
	data() {
		return {
			// 时间筛选选项
			timeOptions: {
				disabledDate (date) {
					return date && date.valueOf() - Date.now() >= 0
				}
			},
			// spuId
			spuId: '',
			// 表格字段
			/* profitGridCol: [
				{
					title: '产品',
					key: 'skuname',
					renderHeader: (createEle, params) => {
						debugger
						// return createEle('span', {}, )
						if (this.params.group === 'skusn') {
							params.column.title = '产品',
							params.column.key = 'skuname'
						} else if (this.params.group === 'catid') {
							params.column.title = '分类',
							params.column.key = 'catname'
						}
					}
				},
				{
					title: '期初存货价值',
					key: 'pre_stock_amount'
				},
				{
					title: '当期销售收入',
					key: 'current_sale_amount'
				},
				{
					title: '当期采购支出',
					key: 'current_purchase_amount'
				},
				{
					title: '当期损耗价值',
					key: 'current_loss_amount'
				},
				{
					title: '当期存货价值',
					key: 'current_stock_amount'
				},
				{
					title: '当期毛利金额',
					key: 'current_profit_amount'
				},
				{
					title: '当期毛利占比',
					key: 'profit_proportion',
					render: (createEle, params) => {
						return createEle('span', {}, Number(params.row.pre_profit_balance) + Number(params.row.current_profit_amount))
					}
				},
				{
					title: '毛利率',
					key: 'profit_rate'
				}
			], */
			// 参数
			params: {
				group: 'skusn',
				catid: '',
				skusn: '',
				starttime: '',// this.getLastDays(),
				endtime: '',//this.getCurrentDate(),
			},
			// 统计维度下拉选项
			groupOptions: [
				{
					label: '按产品',
					value: 'skusn'
				},
				{
					label: '按分类',
					value: 'catid'
				}
			],
			// 按产品分类spu下拉选项
			spuOptions: [],
			// 按产品分类sku下拉选项
			skuOptions: [],
			// 按产品分类cateid下拉菜单
			cateOptions: []
		}
	},

	computed: {
		dateRange: {
			get () {
      	return [this.params.starttime, this.params.endtime]
    	},
    	set (newValue) {
				if (newValue[0] && newValue[1]) {
					var start = newValue[0].toLocaleDateString().split('/')
					if (start[1].length === 1) {
						start[1] = '0' + start[1]
					}
					if (start[2].length === 1) {
						start[2] = '0' + start[2]
					}
					this.params.starttime = start.join('-')
					var end = newValue[1].toLocaleDateString().split('/')
					if (end[1].length === 1) {
						end[1] = '0' + end[1]
					}
					if (end[2].length === 1) {
						end[2] = '0' + end[2]
					}
					this.params.endtime = end.join('-')
				} else {
					this.params.starttime = ''
					this.params.endtime = ''
				}
    	}
		},
		profitGridCol () {
			let profitGridCol = [
				{
					title: '期初存货价值',
					key: 'pre_stock_amount'
				},
				{
					title: '当期销售收入',
					key: 'current_sale_amount'
				},
				{
					title: '当期采购支出',
					key: 'current_purchase_amount'
				},
				{
					title: '当期损耗价值',
					key: 'current_loss_amount'
				},
				{
					title: '当期存货价值',
					key: 'current_stock_amount'
				},
				{
					title: '当期毛利金额',
					key: 'current_profit_amount'
				},
				{
					title: '当期毛利占比',
					key: 'profit_proportion',
					render: (createEle, params) => {
						return createEle('span', {}, `${Number(params.row.profit_proportion) * 100}%`)
					}
				},
				{
					title: '毛利率',
					key: 'profit_rate',
					render: (createEle, params) => {
						return createEle('span', {}, `${Number(params.row.profit_rate) * 100}%`)
					}
				}
			]
			if (this.params.group === 'skusn') {
				profitGridCol.unshift({
					title: '产品',
					key: 'skuname'
				})
			} else if (this.params.group === 'catid') {
				profitGridCol.unshift({
					title: '分类',
					key: 'catname'
				})
			}
			return [...profitGridCol]
		}
	},

	methods: {
		// 动态获取表格字段
		getCol () {
			let profitGridCol = [
				{
					title: '期初存货价值',
					key: 'pre_stock_amount'
				},
				{
					title: '当期销售收入',
					key: 'current_sale_amount'
				},
				{
					title: '当期采购支出',
					key: 'current_purchase_amount'
				},
				{
					title: '当期损耗价值',
					key: 'current_loss_amount'
				},
				{
					title: '当期存货价值',
					key: 'current_stock_amount'
				},
				{
					title: '当期毛利金额',
					key: 'current_profit_amount'
				},
				{
					title: '当期毛利占比',
					key: 'profit_proportion',
					render: (createEle, params) => {
						return createEle('span', {}, Number(params.row.pre_profit_balance) + Number(params.row.current_profit_amount))
					}
				},
				{
					title: '毛利率',
					key: 'profit_rate'
				}
			]
			if (this.params.group === 'skusn') {
				profitGridCol.unshift({
					title: '产品',
					key: 'skuname'
				})
			} else if (this.params.group === 'catid') {
				profitGridCol.unshift({
					title: '产品',
					key: 'skuname'
				})
			}
			return [...profitGridCol]
		},
		// 统计维度方式改变函数
		groupChange (val) {
			if (val === 'skusn') {
				this.params.catid = ''
			} else if (val === 'catid') {
				this.params.skusn = ''
			}
		},
		// 筛选条件日期改变
		dateChange (val) {
			// debugger
		},
		// 获取spu，条件筛选用
		getSPU () {
			Util.ajax.post('/goods.goods/lists', {relations: ['skus']}).then((resp) => {
				let spus = []
				// let skus = []
				resp.forEach(elem => {
					spus.push({
						value: elem.id,
						label: elem.name
					})
				})
				this.spuOptions = [...spus]
			})
		},
		// 获取sku，条件筛选用
		getSKU (val) {
			Util.ajax.post('/goods.goods_sku/lists', {goods_id: val}).then((resp) => {
				let skus = []
				resp.forEach(elem => {
					skus.push({
						value: elem.sn,
						label: elem.skuname
					})
				})
				this.skuOptions = [...skus]
			})
		},
		// 获取经营品类
		getCategory () {
			Util.ajax.post('/custom.category/lists', {status: 1}).then(resp => {
				let cates = []
				resp.forEach(elem => {
					cates.push({
						value: elem.categoryInfo.id,
						label: elem.categoryInfo.name
					})
				})
				this.cateOptions = [...cates]
			})
		},
		// 导出表格
		exportTable () {
			this.$refs.profitGrid.$refs.selection.exportCsv({
				filename: '财务-收益分析统计报表',
				quoted: true
			})
		}
	},

	mounted () {
		this.getSPU()
		this.getCategory()
	}
}
</script>

<style lang="less" scoped>
.profit {
	.searchBox {
		margin-bottom: 10px;
		.searchBar {
			margin-right: 10px;
			display: inline-block;
		}
		.positionRight {
			float: right;
		}
	}
}
</style>