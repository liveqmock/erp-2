<template>
    <Card>
    	<div class="" style="margin-bottom: 10px;">
    		<div style="display: inline-block;">
    			<Density v-model="groupDefaultValue" :columns="tags"></Density>
    		</div>
    		<div style="display: inline-block; margin-left: 30px;">
    			<span>日期时间：</span>
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
                    title: '采购笔数',
                    key: 'buyer_order_number'
                },
                {
                    title: '采购金额',
                    key: 'total_buyer_amount'
                },
                {
                    title: '销售笔数',
                    key: 'seller_order_number'
                },
                {
                    title: '销售金额',
                    key: 'total_seller_amount'
                },
                {
                    title: '总订单数量',
                    key: 'total_number'
                },
                {
                    title: '总订单金额',
                    key: 'total_amount'
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
    		Util.ajax.post('/statistics/statistics_order/count_order', params).then(resp => {
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
    		/*Util.ajax.post('/statistics/statistics_order/export', {
    			access_token: this.token,
    			current_custom_id: this.customId,
    			data: this.datas,
    			title_arr: [1,2,3,4,5,6],
    			file_name: '订单统计',
    		}).then(resp => {
	            //console.log(resp)
	        })*/
	       	this.$refs.table.exportCsv({
				filename: '订单统计报表',
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