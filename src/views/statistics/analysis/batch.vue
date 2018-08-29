<template>
	<div>
		<Card>
			<div class = "batch">
				<Row>
					<div class = "seachBox">
						<div class = "searchBar">
							<Select style="width:200px" clearable v-model = "params.goods_id" placeholder="请选择产品名称" @on-change="getSKU">
								<Option v-for = "item in spuOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
							</Select>
						</div>
						<div class = "searchBar">
							<Select style="width:200px" clearable v-model = "params.skusn" placeholder="请选择品种名称">
								<Option v-for = "item in skuOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
							</Select>
						</div>
						<div class = "searchBar">
							<DatePicker v-model = "dateRange" :options = "timeOptions" type="daterange" placeholder="请选择日期" style="width: 300px" @on-change="dateChange"></DatePicker>
						</div>
						<div class = "searchBar positionRight">
							<Button type="primary" @click = "exportTable"><Icon type="ios-download-outline" style="font-size: 16px;"></Icon> 导出报表</Button>
						</div>
					</div>
					<Col span="24">
          	<thrgo-table
          	  ref = "batchGrid"
							:isSearch="false"
          	  :border="false"
          	  path="/statistics/statistics_stock/count_batch"
          	  :params="params"
          	  :pagination="true"
          	  :columns="batchGridCol"
          	  :loading="true"
          	></thrgo-table>
          </Col>
				</Row>
			</div>
		</Card>
	</div>
</template>

<script>
import thrgoTable from '@/views/components/thrgo/table/table.vue'
import Util from '@/libs/util'

export default {
	name: 'batchIndex',
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
			// 参数
			params: {
				skusn: '',
				goods_id: 0,
				starttime: '',// this.getLastDays(),
				endtime: '',//this.getCurrentDate(),
				limit: 12,
        page: 1
			},
			// 产品名称下拉列表
			spuOptions: [],
			// 品种名称下拉列表
			skuOptions: [],
			// 批次分析表格字段
			batchGridCol: [
				{
					title: '批次',
					key: 'batch_code'
				},
				{
					title: '采购量',
					key: 'purchase_number'
				},
				{
					title: '采购金额',
					key: 'purchase_amount',
					render: (createEle, params) => {
						return createEle('span', {}, `￥${params.row.purchase_amount}`)
					}
				},
				{
					title: '库存量',
					key: 'stock_number'
				},
				{
					title: '存量价值',
					key: 'stock_amount',
					render: (createEle, params) => {
						return createEle('span', {}, `￥${params.row.stock_amount}`)
					}
				},
				{
					title: '损耗量',
					key: 'loss_number'
				},
				{
					title: '损耗价值',
					key: 'loss_amount',
					render: (createEle, params) => {
						return createEle('span', {}, `￥${params.row.loss_amount}`)
					}
				},
				{
					title: '销售金额',
					key: 'sale_amount',
					render: (createEle, params) => {
						return createEle('span', {}, `￥${params.row.sale_amount}`)
					}
				},
				{
					title: '毛利',
					key: 'profit',
					render: (createEle, params) => {
						return createEle('span', {}, `￥${params.row.profit}`)
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
		}
	},

	methods: {
		// 获取当前日期
		getCurrentDate () {
			var date = new Date()
			var formateDate = date.toLocaleDateString().split('/')
			if (formateDate[1].length === 1) {
				formateDate[1] = '0' + formateDate[1]
			}
			if (formateDate[2].length === 1) {
				formateDate[2] = '0' + formateDate[2]
			}
			return formateDate.join('-')
		},
		// 获取最近30天时间
		getLastDays () {
			var date = new Date()
			var lastDate = date.getTime() - 2592000000
			lastDate = new Date(lastDate).toLocaleDateString().split('/')
			if (lastDate[1].length === 1) {
				lastDate[1] = '0' + lastDate[1]
			}
			if (lastDate[2].length === 1) {
				lastDate[2] = '0' + lastDate[2]
			}
			return lastDate.join('-')
		},
		// 筛选条件日期改变
		dateChange (val) {
			// debugger
		},
		// 导出表格
		exportTable () {
			this.$refs.batchGrid.$refs.selection.exportCsv({
				filename: '财务-批次分析统计报表',
				quoted: true
			})
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
						label: elem.spec
					})
				})
				this.skuOptions = [...skus]
			})
		}
	},

	mounted () {
		this.getSPU()
	}
}
</script>

<style lang="less" scoped>
.batch {
	.seachBox {
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