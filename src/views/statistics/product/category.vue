<template>
	
	<div>
		 <Card>
			<div class = "trade">
				<Row>
          <div class = "seachBox">
					<div class = "searchBar">
					<span>统计粒度：</span>
							<RadioGroup v-model="params.group" type="button">
    					    <Radio label="months">月</Radio>
    					  <Radio label="quarter">季度</Radio>
    					  <Radio label="years">年</Radio>
    					</RadioGroup>
						</div>
						<div class = "searchBar">
							<DatePicker  :options = "timeOptions" type="daterange" placeholder="请选择日期和时间" style="width: 300px" @on-change="dateChange"></DatePicker>
						</div>
						<div class = "searchBar positionRight">
							<Button type="primary" @click = "exportTable"><Icon type="ios-download-outline" style="font-size: 16px;"></Icon> 导出报表</Button>
						</div>
					</div>
          <Col span="24">
			 <RadioGroup v-model="vertical" vertical style="margin-bottom: 20px;">
			 	<div style="margin-bottom: 10px;" >
			 	<div class="lediv">
    				<Radio label="1"  >
            			<span>按产品</span>
            		</Radio>
            	</div>
        		<Select style="width:200px" v-model = "params.goods_id" placeholder="请选择产品名称" @on-change="getSKU">
						<Option v-for = "item in spuOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
				</Select>
				<Select style="width:200px" v-model = "params.skuid" placeholder="请选择品类名称">
						
					<Option v-for = "item in skuOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
				</Select>

			</div>
		<div>
			<!-- 按品类单选开始 -->
			<!-- 	 
	     		<div class="lediv">
    				<Radio label="2"  >
            			<span>按品类</span>
            		</Radio>
           	</div> 
        		 <Select style="width:200px" v-model = "params.categoryid" placeholder="请选择品类名称">
						
					<Option v-for = "item in categoryOptions" :value = "item.value" :key = "item.value">{{item.label}}</Option>
			</Select>
			
	 		-->
	 		<!-- 按品类单选结束 -->
		  </div>
         </RadioGroup>
         <div style="marigin-top:10px" v-if="vertical==1">
          	<thrgo-table
          	  ref = "tradeGrid"
							:isSearch = "false"
          	  :border="false"
          	  path="/statistics/statistics_goods/count_sku"
          	  :params="params"
          	  :pagination="true"
          	  :columns="tradeGridCol"
          	  :loading="true"
          	></thrgo-table>
          </div>

          <div style="margin-top: 10px;" v-show="vertical==2">
          	<thrgo-table
          	  path="/statistics/statistics_goods/count_cat"

          	  ref="tradeCat"
			  :isSearch = "false"
          	  :border="false"
          	  :params="params1"
          	  :pagination="true"
          	  :columns="catTable"
          	  :loading="true"
          	></thrgo-table>
          </div>
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
			// 产品名称下拉列表
			spuOptions: [],
			// 品种名称下拉列表
			skuOptions: [],
			categoryOptions:[],
			vertical:'1',
			// 时间筛选选项
			timeOptions: {
				 disabledDate (date) {
					
					return date && date.valueOf() - Date.now() >= 0
				} 
			},
			// 客户类型下拉数据
			customerCategoryOptions: [
				{
					value: '1',
					label: '采购客户'
				},
				{
					value: '2',
					label: '供应客户'
				}
			],
			// 参数
			params: {
				starttime:'',
				endtime:'',
				group: '', // 统计粒度
				customerCategory: '',
				limit: 12,
				skuid:'',
               
			},
			// 按照品类的参数参数
			params1: {
				starttime:'',
				endtime:'',
				group: '', // 统计粒度
				customerCategory: '',
				limit: 12,
				skuid:'',
               
			},
			// 客户交易表格字段
			tradeGridCol: [
				{
					title: '时间',
					sortable: true,
					key: 'time'
				},{
					title: '期初库存量',
					
					key: 'pre_number'
				},
				{
					title: '期初存量价值',
					key: 'pre_amount'
				},
				{
					title: '当期销售数量',
					key: 'total_number'
				},
				{
					title: '当期销售金额',
					key: 'total_amount'
				},
				{
					title: '期末库存数量',
					key: 'after_number'
				},
				{
					title: '期末库存价值',
					key: 'after_amount'
				},
				{
					title: '销量比',
					key: 'sale_prop'
				},
				{
					title: '库存增量比',
					key: 'stock_prop'
				}
			],
			// 按照品类统计应该填写的字段
			catTable:[
			{  title: ' 分类名称'+
				 		"销售占比"+
				 		'统计时间',
				 	width:108,
				 	render: (h, params1) => {
                       
                       return params1.row.time;
                       
                    }
				 	
				 }
	]
		}
	},

	methods: {
		// 获取spu，条件筛选用
		getSPU () {
			Util.ajax.post('/goods.goods/lists', {relations: ['skus']}).then((resp) => {
				let spus = []
				
				resp.forEach(elem => {
					spus.push({
						value: elem.id,
						label: elem.name
					})
				})
				this.spuOptions = [...spus];
				
				this.params.goods_id= this.spuOptions[0].value
			})
		},
	
		// 获取sku，条件筛选用
		getSKU (val) {
			Util.ajax.post('/goods.goods_sku/lists', {goods_id: val}).then((resp) => {

				let skus = []
				resp.forEach(elem => {
					
					skus.push({
						value: elem.skuid,
						label: elem.spec
					})
				})
				this.skuOptions = [...skus];
				this.params.skuid= this.skuOptions[0].value
			})
		},
		// 获取品类的数据
		getcatlist (val) {
			Util.ajax.post('/statistics/statistics_goods/count_cat', this.params1).then((res) => {
			 

                for (var i = 0; i < res.data.length; i++) {
                	 res.data[i].info.forEach( (item, index) =>{
			     	 this.catTable.push(
				     {  
				   	  title: item.catid,
				      // key:item.bi_amount
				 	   render: (h, params1) => {
                       
                        return item.bi_amount
                      }
				 	
				 })
			     });
                };
			    
			     

			})
		},
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
	},

	mounted () {
		this.getSPU();
		
		this.getcatlist()
	},
	watch:{
		vertical:function (argument) {
		  console.log(this.vertical)
		},

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
.lediv{
	float: left;
}
</style>