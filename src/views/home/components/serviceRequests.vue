<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'serviceRequests',
    props: {
    	datas: {
    		type: Object,
    		default: function() {
    			return {};
    		}
    	}
    },
    mounted () {
    	if(this.datas.buyer_order || this.datas.seller_order){
    		this.init();
    	}
    },
    watch: {
    	datas() {
    		if(this.datas.buyer_order || this.datas.seller_order){
	    		this.init();
	    	}
    	}
    },
    methods: {
    	init () {
    		let names = this.datas.buyer_order.map(item => {
            	return item.time;
            });
    		
	        const option = {
	            tooltip: {
	                trigger: 'axis',
	                axisPointer: {
	                    type: 'cross',
	                    label: {
	                        backgroundColor: '#6a7985'
	                    }
	                }
	            },
	            grid: {
	                top: '3%',
	                left: '1.2%',
	                right: '1%',
	                bottom: '3%',
	                containLabel: true
	            },
	            xAxis: [
	                {
	                    type: 'category',
	                    boundaryGap: false,
	                    data: names
	                }
	            ],
	            yAxis: [
	                {
	                    type: 'value'
	                }
	            ],
	            series: [
	                {
	                    name: '采购订单',
	                    type: 'line',
	                    stack: '总量',
	                    areaStyle: {normal: {
	                        color: '#10A6FF'
	                    }},
	                    data: this.datas.buyer_order.map(item => {
	                    	return item.amount;
	                    })
	                },
	                {
	                    name: '销售订单',
	                    type: 'line',
	                    stack: '总量',
	                    areaStyle: {normal: {
	                        color: '#0C17A6'
	                    }},
	                    data: this.datas.seller_order.map(item => {
	                    	return item.amount;
	                    })
	                }
	            ]
	        };
	        const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
	        serviceRequestCharts.setOption(option);
	
	        window.addEventListener('resize', function () {
	            serviceRequestCharts.resize();
	        });
	    }
    }
};
</script>