<template>
	<div>
		<Card>
			<div class = "finance">
				<Row>
					<div class = "searchBox">
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
					<Col span = "24">
						<thrgo-table
          	  ref = "financeGrid"
							:isSearch="false"
          	  :border="false"
          	  path="/statistics/statistics_finance/count_finance"
          	  :params="params"
          	  :pagination="true"
          	  :columns="financeGridCol"
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
	name: 'financeIndex',
	components: {
		thrgoTable
	},
	data() {
		return {
			timeOptions: {
				disabledDate (date) {
					return date && date.valueOf() - Date.now() >= 0
				}
			},
			// 表格数据请求参数
			params: {
				starttime: '',// this.getLastDays(),
				endtime: '',// this.getCurrentDate(),
				limit: 12,
        page: 1,
				group: 'days'
			},
			// 财务分析表格字段
			financeGridCol: [
				{
					title: '统计周期',
					key: 'time'
				},
				{
					title: '期初现金余额',
					key: 'pre_cash_balance'
				},
				{
					title: '期初应收余额',
					key: 'pre_receive_money'
				},
				{
					title: '期初应付余额',
					key: 'pre_payable_money'
				},
				{
					title: '本期应收金额',
					key: 'current_receive_money'
				},
				{
					title: '本期应付金额',
					key: 'current_payable_money'
				},
				{
					title: '本期已收金额',
					key: 'current_received_money'
				},
				{
					title: '本期已付金额',
					key: 'current_paid_money'
				},
				{
					title: '期末应收余额',
					key: 'after_receive_money'
				},
				{
					title: '期末应付余额',
					key: 'after_payable_money'
				},
				{
					title: '期末现金余额',
					key: 'after_cash_balance'
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
		// 导出表格
		exportTable () {
			this.$refs.financeGrid.$refs.selection.exportCsv({
				filename: '财务-财务分析统计报表',
				quoted: true
			})
		},
		// 筛选条件日期改变
		dateChange (val) {
			// debugger
		}
	}
}
</script>

<style lang="less" scoped>
.finance {
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