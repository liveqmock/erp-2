<template>
	<div>
		
		<Card>
		


			<div class = "trade">
				<Row>
          <div class = "seachBox">
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
							<DatePicker :options = "timeOptions" type="daterange"
							  placeholder="请选择日期和时间" style="width: 300px"  @on-change="dateChange"></DatePicker>
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
          	  path="/statistics/statistics_sku/count_sku"
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
		    // 参数
			params: {
				starttime:'',
				endtime:'',
				group: '', // 统计粒度
				
				limit: 12,
        page: 1
			},
			// 客户交易表格字段
			tradeGridCol: [
				{
					title: '统计周期',
					sortable: true,
					key: 'time',

				},
				{
					title: '产品数量',
					key: 'spu_number'
				},
				{
					title: '品种数量',
					key: 'sku_number'
				},
				{
					title: '新增产品',
					key: 'sum_add_sku'
				},
				{
					title: '下线品种',
					key: 'sum_down_sku'
				},
				{
					title: '在售数量',
					key: 'max_sale'
				},
			]
		}
	},

	methods: {
		// 筛选条件日期改变
		dateChange (val) {
			
			this.params.starttime=val[0];
			this.params.endtime=val[1];
			
		},
		// 导出表格
		exportTable () {
			
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