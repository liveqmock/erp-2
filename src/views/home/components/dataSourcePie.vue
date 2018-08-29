<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
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
            colors: ['#9bd598', '#ffd58f', '#abd5f2', '#ab8df2', '#e14f60']
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
    			names.push(item.catname);
    			datas.push({
    				value: item.amount,
    				name: item.catname,
    				itemStyle: {
    					normal: {
    						color: this.colors[index]
    					}
    				}
    			})
    		})
    		this.$nextTick(() => {
	            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
	            const option = {
	                tooltip: {
	                    trigger: 'item',
	                    formatter: '{a} <br/>{b} : ¥{c} (占比:{d}%)'
	                },
	                legend: {
	                    orient: 'vertical',
	                    left: 'right',
	                    data: names
	                },
	                series: [
	                    {
	                        name: '热销品类数据',
	                        type: 'pie',
	                        radius: '66%',
	                        center: ['50%', '60%'],
	                        data: datas,
	                        itemStyle: {
	                            emphasis: {
	                                shadowBlur: 10,
	                                shadowOffsetX: 0,
	                                shadowColor: 'rgba(0, 0, 0, 0.5)'
	                            }
	                        }
	                    }
	                ]
	            };
	            dataSourcePie.setOption(option);
	            window.addEventListener('resize', function () {
	                dataSourcePie.resize();
	            });
	        });
    	}
    }
};
</script>
