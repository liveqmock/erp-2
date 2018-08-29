<template>
    <Card>
    	<div class="" style="margin-bottom: 10px;">
    		<div style="display: inline-block;">
    			<Density v-model="groupDefaultValue" :columns="tags"></Density>
    		</div>
    		<div style="display: inline-block; margin-left: 30px;">
    			<span>统计时间：</span>
    			<DatePicker @on-change="handleChangeDate" :options="dateOptions" type="daterange" placeholder="选择日期" format="yyyy-MM-dd" style="width: 228px"></DatePicker>
    		</div>
    		<div style="float: right;">
    			<Button type="primary" icon="ios-cloud-download" @click="handleExport">导出报表</Button>
    		</div>
    	</div>
    	<Table ref="table" stripe :columns="columns" :data="datas"></Table>
    	<div style="text-align: right; margin-top: 10px;">
    		<Page :total="page.total" :current="page.current" :page-size="page.pageSize" @on-change="handleChangePage"></Page>
    	</div>
    </Card>
</template>

<script>
import Util from '@/libs/util';
import Density from '../density.vue';
export default {
	components: {
		Density
	},
    data() {
    	return {
    		groupDefaultValue: 'days',
    		tags: [{
    			title: '天',
    			value: 'days'
    		},{
    			title: '周',
    			value: 'weeks'
    		},{
    			title: '月',
    			value: 'months'
    		},{
    			title: '季度',
    			value: 'quarter'
    		},{
    			title: '年',
    			value: 'years'
    		}],
    		page: {
    			current: 1,
    			total: 0,
    			pageSize: 10
    		},
    		dates: [],
    		datas: [],
    		columns: [
                {
                    title: '时间',
                    key: 'time'
                },
                {
                    title: '期初毛利余额',
                    key: 'pre_profit_balance'
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
                    title: '当期毛利金额',
                    key: 'current_profit_amount'
                },
                {
                    title: '期末毛利余额',
                    key: 'after_profit_balance'
                },
                {
                    title: '当期存货价值',
                    key: 'current_stock_amount'
                },
                {
                    title: '当期毛利增长率',
                    key: 'profit_growth_rate',
                    render: (h, params) => {
                        return (parseFloat(params.row.profit_growth_rate) * 100) + '%';
                    }
                },
            ],
            dateOptions: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            }
    	}
    },
    methods: {
    	getStatisticData() {
    		let page = this.page;
    		let params = {
    			starttime: '',
    			endtime: '',
    			group: this.groupDefaultValue,
    			page: page.current,
    			limit: page.pageSize
    		}
    		if(this.dates.length > 0){
    			params.starttime = this.dates[0];
    			params.endtime = this.dates[1];
    		}
    		Util.ajax.post('/statistics/statistics_business/count_business', params).then(resp => {
	            this.datas = resp.data;
	            page.current = resp.current_page;
	            page.total = resp.total;
	        }).catch(() => {
	        	
	        })
    	},
    	handleChangeDate(d) {
    		this.dates = d;
    		this.page.current = 1;
    		this.getStatisticData();
    	},
    	handleChangePage(p) {
    		this.page.current = p;
    		this.getStatisticData();
    	},
    	handleExport() {
	       	this.$refs.table.exportCsv({
				filename: '财务分析-经营分析报表',
				quoted: true
			})
    	}
    },
    mounted() {
    	this.getStatisticData();
    },
    watch: {
    	groupDefaultValue(newVal, oldVal){
    		this.page.current = 1;
    		this.getStatisticData();
    	}
    }
}
</script>

<style scoped>

</style>