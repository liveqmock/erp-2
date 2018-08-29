<template>
    <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'visiteVolume',
    props: {
    	datas: {
    		type: Array,
    		default: function() {
    			return [];
    		}
    	}
    },
    data () {
        return {
            //
        };
    },
    mounted () {
    	if(this.datas.length > 0){
    		this.init();
    	}
    },
    watch: {
    	datas() {
    		if(this.datas.length > 0){
    			this.init();
    		}
    	}
    },
    methods: {
    	init() {
    		let names = [];
    		let datas = [];
    		this.datas.forEach((item, index) => {
    			names.push(item.buyer_name);
    			datas.push({
    				value: item.real_amount,
    				name: item.buyer_name,
    				itemStyle: {
    					normal: {
    						color: '#2d8cf0'
    					}
    				}
    			})
    		})
    		this.$nextTick(() => {
	            let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
	            let xAxisData = [];
	            let data1 = [];
	            let data2 = [];
	            for (let i = 0; i < 20; i++) {
	                xAxisData.push('类目' + i);
	                data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
	                data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
	            }
	
	            const option = {
	                tooltip: {
	                    trigger: 'axis',
	                    axisPointer: {
	                        type: 'shadow'
	                    }
	                },
	                grid: {
	                    top: 0,
	                    left: '2%',
	                    right: '4%',
	                    bottom: '3%',
	                    containLabel: true
	                },
	                xAxis: {
	                    type: 'value',
	                    boundaryGap: [0, 0.01]
	                },
	                yAxis: {
	                    type: 'category',
	                    data: names,
	                    nameTextStyle: {
	                        color: '#c3c3c3'
	                    }
	                },
	                series: [
	                    {
	                        name: '交易量',
	                        type: 'bar',
	                        data: datas
	                    }
	                ]
	            };
	
	            visiteVolume.setOption(option);
	
	            window.addEventListener('resize', function () {
	                visiteVolume.resize();
	            });
	        });
    	}
    }
};
</script>
