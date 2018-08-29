<template>
	<div>
		<Card>
			<div class = "trade">
				<Row>
          <div class = "seachBox">
						<div class = "searchBar">
							<Select style="width:200px" v-model = "params.custom_type" placeholder="请选择客户类型">
								<Option v-for = "item in customTypeOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
							</Select>
						</div>
						<div class = "searchBar">
							<span>统计粒度：</span>
							<RadioGroup v-model="params.group" type="button">
    					  <Radio label="days">天</Radio>
    					  <Radio label="weeks">周</Radio>
    					  <Radio label="months">月</Radio>
    					  <Radio label="quarter">季度</Radio>
    					  <Radio label="years">年</Radio>
    					</RadioGroup>
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
          	  ref = "tradeGrid"
							:isSearch = "false"
          	  :border="false"
          	  path="/statistics/statistics_order/complete_order_count"
          	  :params="params"
          	  :pagination="true"
          	  :columns="tradeGridCol"
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
	name: 'stat_customer',
	components: {thrgoTable},
	data() {
		return {
			// 时间筛选选项
			timeOptions: {
				disabledDate (date) {
					return date && date.valueOf() - Date.now() >= 0
				}
			},
			// 客户类型下拉数据
			customTypeOptions: [
				{
					value: 1,
					label: '采购客户'
				},
				{
					value: 2,
					label: '供应客户'
				}
			],
			// 参数
			params: {
				custom_type: 1,
				starttime: '',// this.getLastDays(),
				endtime: '',// this.getCurrentDate(),
				group: 'days',
				limit: 12,
        page: 1
			},
			// 客户交易表格字段
			tradeGridCol: [
				{
					title: '周期',
					key: 'show_time'
				},
				{
					title: '客户名称',
					key: 'custom_name'
				},
				{
					title: '订单数量',
					key: 'count'
				},
				{
					title: '交易金额',
					key: 'paid_amount'
				},
				{
					title: '客单价',
					key: 'average'
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
			debugger
			this.params.starttime = val[0]
			this.params.endtime = val[1]
		},
		// 导出表格
		exportTable () {
			debugger
			this.$refs.tradeGrid.$refs.selection.exportCsv({
				filename: '客户交易统计报表'
			})
		}
	}
}
</script>

<style lang="less" scoped>
.trade {
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