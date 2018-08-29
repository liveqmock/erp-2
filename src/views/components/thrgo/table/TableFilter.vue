<template>
	<div style="border: 1px solid #dddee1; border-radius: 4px; background-color: #fff;">
		<div style="padding: 10px 20px; border-bottom: 1px solid #dddee1;">
			<p>筛选</p>
		</div>
		<div style="padding: 15px 20px 10px;">
			<Form ref="modalForm" inline :label-width="75">
		        <FormItem v-for="(item, index) in datas" :label="item.label+':'" :key="index" style="margin-bottom: 5px;">
		        	
		        	<div v-if="item.type == 'input'">
		        		<Input
			        		v-model="item.value"
			        		:placeholder="item.placeholder || '请输入您要搜索的内容'"
			        	/>
		        	</div>
		        	
		        	<div v-if="item.type == 'select'"  style="width:180px">
			        	<Select v-model="item.value">
					        <Option

					        	v-for="(option, oi) in item.options"
					        	:label="option.label"
					        	:value="option.value"
					        	:key="oi"
					        ></Option>
					    </Select>
				    </div>
				    
				    <div v-if="item.type == 'DatePicker'">
			        	<DatePicker
			        		v-model="item.value"
			        		:type="item.model"
			        		:format="item.format"
			        		:placeholder="item.placeholder"
			        		:options="item.options"
			        	></DatePicker>
		        	</div>
		        	
		        	<div v-if="item.type == 'radio'">
			        	<RadioGroup v-model="item.value">
					        <Radio v-for="(option, oi) in item.options" :label="option.value" :key="oi">{{option.label}}</Radio>
					    </RadioGroup>
				    </div>
	    			
	    			<div v-if="item.type == 'checkbox'">
		    			<CheckboxGroup v-model="item.value">
					        <Checkbox v-for="(option, oi) in item.options" :label="option.value" :key="oi">{{option.label}}</Checkbox>
					    </CheckboxGroup>
				    </div>
	    
		        </FormItem>
		        <Button type="primary" @click="handleSubmit">提交</Button>
		        <Button @click="handleReset">重置</Button>
		   </Form>
		</div>
	</div>
</template>

<script>
/*
 * 支持类型input、select、radio、checkbox、DatePicker
 * 
 * 通用参数：type	--- 类型 string
 * 			label	--- 类型 string
 * 			name	--- 类型 string
 * 			value	--- 类型 string，checkbox模式下为 array 类型
 * 
 * select、radio、checkbox特有参数： options --- 类型 array，示例[{label: '类型一', value: '1'},{label: '类型二', value: '2'}]
 * 
 * DatePicker特有参数： format --- 类型 string（格式化，参考iview的DatePicker组件格式化）
 * 					   model  --- 类型 string 参考DatePicker组件的type
 * 
 * on-submit返回数据：第一个参数为组装后的json格式数据，第二个参数为未组装的原始数据
 */
import Vue from 'vue';
export default {
	props: {
		filters: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},
	data() {
		return {
			datas: [],
			examples: [
				{
					type: 'input',
					name: 'test1',
					label: 'Input',
					value: '这里是测试数据'
				},
				{
					type: 'select',
					name: 'test2',
					label: 'Select',
					value: '2',
					options: [{label: '类型一', value: '1'},{label: '类型二', value: '2'},{label: '类型三', value: '3'}]
				},
				{
					type: 'radio',
					name: 'test3',
					label: 'Radio',
					value: '2',
					options: [{label: '类型一', value: '1'},{label: '类型二', value: '2'},{label: '类型三', value: '3'}]
				},
				{
					type: 'checkbox',
					name: 'test4',
					label: 'Checkbox',
					value: ['1', '2'],
					options: [{label: '类型一', value: '1'},{label: '类型二', value: '2'},{label: '类型三', value: '3'}]
				},
				{
					type: 'DatePicker',
					name: 'test5',
					label: 'DatePicker',
					format: 'yyyy-MM-dd HH:mm:ss',
					model: 'datetimerange'
				}
			]
		}
	},
	methods: {
		formatDate(fmt, data) {
			if(!data) return '';
			let date = new Date(data);
			var o = { 
		        "M+" : date.getMonth()+1,                 //月份 
		        "d+" : date.getDate(),                    //日 
		        "H+" : date.getHours(),                   //小时 
		        "m+" : date.getMinutes(),                 //分 
		        "s+" : date.getSeconds(),                 //秒 
		        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
		        "S"  : date.getMilliseconds()             //毫秒 
		    }; 
		    if(/(y+)/.test(fmt)) {
		        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		    }
		 	for(var k in o) {
		    	if(new RegExp("("+ k +")").test(fmt)){
		 			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		     	}
		 	}
			return fmt;
		},
		formatKey(params, name, value, index) {
			if(!name){
				params[index] = value;
			}else{
				params[name] = value;
			}
			return params;
		},
        handleSubmit() {
        	let params = {};
        	this.datas.forEach((item, index) => {
        		let value = item.value;
        		if(item.type == 'DatePicker'){
        			let fmt = item.format;
        			if(!fmt){
        				switch (item.model){
        					case 'date':
        						fmt = 'yyyy-MM-dd'
        						break;
        					case 'daterange':
        						fmt = 'yyyy-MM-dd'
        						break;
        					case 'datetime':
        						fmt = 'yyyy-MM-dd HH:mm:ss'
        						break;
        					case 'datetimerange':
        						fmt = 'yyyy-MM-dd HH:mm:ss'
        						break;
        					case 'year':
        						fmt = 'yyyy'
        						break;
        					case 'month':
        						fmt = 'yyyy-MM'
        						break;
        					default:
        						break;
        				}
        			}
        			if(Array.isArray(item.value)){
        				value = value.map(item => {
        					return this.formatDate(fmt, item);
        				})
        			}else if(typeof item.value == 'object'){
        				value = this.formatDate(fmt, value);
        			}
        		}
        		params = this.formatKey(params, item.name, value, index);
        	})
        	this.$emit('on-submit', params, this.datas);
        },
        // 重置
        handleReset() {
			let params = {};
        	this.datas = this.datas.map((item, index) => {
        		let val = '';
        		if(typeof item.value == 'object'){
        			if(Array.isArray(item.value)){
        				val = [];
        			}else{
        				val = {};
        			}
        		}
        		if(!item.name){
					params[index] = val;
				}else{
					params[item.name] = val;
				}
				item.value = val;
				return item;
        	})
        	this.$emit('on-submit', params, this.filters);
        }
	},
	mounted() {
		this.datas = this.filters;
	}
}
</script>

<style>
</style>