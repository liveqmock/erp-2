<template>
	<div style="position: relative; width: 892px;">
		<div style="min-height: 140px;">
			<div class="sgy-category-cascade" v-for="(cate, level) in categoryShow" :key="level">
				<div v-for="(item, key) in cate" :class="[{selected: item.selected}, 'sgy-checkbox-box']" @click.stop="selectedItem(item, level)" :key="item.id">
					<span :class="['sgy-checkbox', {'sgy-checkbox-checked': item.checked, 'sgy-checkbox-uncertain': item.uncertain}]" @click.stop="checkChange(item, level)">
						<span class="sgy-checkbox-inner"></span>
					</span>
					<span>{{item.name}}</span>
				</div>
			</div>
		</div>
		<div v-show="categoryResult.length > 0" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee">
			<div style="margin-bottom: 5px;">已选品类：</div>
			<Tag v-for="(item, index) in categoryResult" :key="index" closable @on-close="handleRemove(item)">{{item.name}}</Tag>
		</div>
		<Spin fix v-if="loading">
            <Icon type="load-c" size=18 class="sgy-spin-icon-load"></Icon>
            <div>加载中...</div>
        </Spin>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Util from '@/libs/util';
	export default {
		name: 'goodscategoryShow',
		props: {
			multiselect: {				// 支持单选、多选，false时为单选，默认true
				type: Boolean,
				default: true
			},
			customParams: {				// 自定义参数，pid为必选
				type: Object,
				default: {
					pid: 0
				}
			},
			defaultData: {				// 默认选中，暂不支持
				type: Array,
				default: []
			},
			path: {
				type: String,
				default: '/'
			}
		},
		data() {
			return {
				topPid: 0,				// 默认顶级ID
				loading: true,			// 加载状态
				categoryShow: [],		// 显示的数据
				categoryResult: [],		// 选中结果
				categoryData: []		// 所有分类数据
			}
		},
		mounted() {
			this.topPid = this.customParams.pid;
			this.getData(0);
		},
		watch: {
			defaultData() {
				if(this.categoryData.length == 0){
					this.categoryData = this.defaultData;
				}else{
					this.mergeData(this.defaultData, true);
				}
				this.getResult();
			}
		},
		methods: {
			getData(lvl, item) {
				this.loading = true;
				Util.ajax.post(this.path, this.customParams).then(res => {
	                if(res && res.length > 0){
	                	if(item && item.checked){
	                		res = res.map(v => {
	                			Vue.set(v, 'checked', true);
	                			return v;
	                		})
	                	}
	                	this.mergeData(res);
	                	this.categoryShow[lvl] = res;
	                	// this.getResult();
	                }
	                this.loading = false;
	            }).catch(e => {
	            	this.loading = false;
	            	console.log(e);
	            })
			},
			mergeData(arr, swap) {
				let result = [];
				let filter = [];
				this.categoryData.forEach(item => {
					let flog = true;
					arr.forEach(v => {
						if(v.id == item.id){
							flog = false;
							if(swap){
								if(v.checked){
									this.vueSetAttr(item, 'checked', true);
								}
								if(v.uncertain){
									this.vueSetAttr(item, 'uncertain', true);
								}
								result.push(item);
							}else{
								if(item.checked){
									this.vueSetAttr(v, 'checked', true);
								}
								if(item.uncertain){
									this.vueSetAttr(v, 'uncertain', true);
								}
								result.push(v);
							}
							filter.push(v.id);
						}
					})
					if(flog){
						result.push(item);
					}
				})
				arr.forEach(item => {
					if(filter.indexOf(item.id) < 0){
						result.push(item);
					}
				})
            	this.categoryData = result;
			},
			vueSetAttr(obj, key, value) {
				if(obj[key] == undefined){
					Vue.set(obj, key, value);
				}else{
					obj[key] = value;
				}
			},
			selectedItem(item, lvl) {
				
				if(item.selected) return;
				
				// 注释解释：selected - 选中，checked - 勾选
				
				// 清空自己后面所有分类
				this.categoryShow = this.categoryShow.slice(0, lvl + 1);
				
				// 加载选中分类的下一级分类
				let nextCatetory = [];
				if(item.selected != undefined){
					nextCatetory = this.categoryData.filter(v => {
						if(v.pid == item.id){
							// 清除下一级分类原有的选中状态
							if(v.selected){
								v.selected = false;
							}
							// 如果此分类为勾选状态，此分类下面的所有分类均默认勾选
							if(item.checked){
								this.vueSetAttr(v, 'checked', true);
							}else if(!item.checked && !item.uncertain){
								if(v.checked){
									v.checked = false;
								}
							}
							return v;
						}
					})
				}else{
					this.customParams.pid = item.id;
					this.getData(lvl + 1, item);
				}
				
				// 修改显示的categoryShow中的选中状态
				this.categoryShow[lvl] = this.categoryShow[lvl].map(v => {
					if(v.id != item.id && v.selected){
						v.selected = false;
					}else if(v.id == item.id){
						this.vueSetAttr(v, 'selected', true);
					}
					return v;
				})
				
				if(nextCatetory && nextCatetory.length > 0){
					this.categoryShow[lvl + 1] = nextCatetory;
				}
				
			},
			checkChange(item, lvl) {
				// checked的多种状态，true - 选中、false | undefined - 未选中
				// uncertain = true 不确定状态（子分类部分选中）
				
				// 单选模式
				if(!this.multiselect){
					// 取消其他选项的勾选和不确定勾选状态
					this.categoryData = this.categoryData.map(v => {
						if(v.checked){
							v.checked = false;
						}
						if(v.uncertain){
							v.uncertain = false;
						}
						return v;
					})
					// 设置勾选状态
					this.vueSetAttr(item, 'checked', true);
					// 存储勾选值
					this.categoryResult = [item];
					// 设置父级不确定勾选状态
					if(lvl > 0){
						this.unmultiSelectUncertain(item.pid, lvl);
					}
					return;
				}
				
				// 多选模式
				if(!item.checked){
					
					// 勾选
					this.vueSetAttr(item, 'checked', true);
					// 如果有不确定勾选状态，去掉不确定勾选状态
					if(item.uncertain){
						item.uncertain = false;
					}
					
					// 设置勾选状态，如果是顶级不执行此操作
					if(lvl != 0){
						this.setCheckedState(lvl);
					}
					
					// 当前分类选中状态，勾选此分类，显示的所有子分类，没有显示的在选中时会自动勾选
					if(item.selected){
						for(let i = lvl + 1; i < this.categoryShow.length; i++){
							this.categoryShow[i].forEach(v => {
								this.vueSetAttr(v, 'checked', true);
								if(v.uncertain){
									v.uncertain = false;
								}
								return v;
							})
						}
					}
					
				}else{
					// 取消勾选
					item.checked = false;
					// 设置勾选状态
					this.setCheckedState(lvl);
					// 选中状态，取消其子级所有分类勾选
					if(item.selected){
						for(let i = lvl + 1; i < this.categoryShow.length; i++){
							this.categoryShow[i].forEach(v => {
								if(v.checked){
									v.checked = false;
								}
								return v;
							})
						}
					}
				}
				
				this.getResult();
				
			},
			// 设置勾选状态
			setCheckedState(lvl) {
				let id, uncheckeds = 0, uncertains = 0;
				let arr = this.categoryShow;
				
				arr[lvl].forEach(item => {
					if(!id) id = item.pid;
					// 没有选中的个数
					if(!item.checked) uncheckeds++;
					// 不确定的个数
					if(item.uncertain) uncertains++;
				})
				
				if(lvl - 1 >= 0){
					arr[lvl - 1] = arr[lvl - 1].map(item => {
						if(item.id == id){
							if(uncheckeds == 0){
								// 全部勾选
								if(item.uncertain) item.uncertain = false;
								this.vueSetAttr(item, 'checked', true);
							}else if(uncheckeds == arr[lvl].length){
								// 全部没有勾选
								if(item.checked) item.checked = false;
								// 没有勾选但是有不确定的
								if(uncertains > 0){
									this.vueSetAttr(item, 'uncertain', true);
								}else{
									if(item.uncertain) item.uncertain = false;
								}
							}else{
								// 不确定勾选
								if(item.checked) item.checked = false;
								this.vueSetAttr(item, 'uncertain', true);
							}
						}
						return item;
					})
				}
				// 递归
				if(lvl > 0){
					this.setCheckedState(lvl - 1);
				}
			},
			// 设置单选模式下父级半勾选状态
			unmultiSelectUncertain(pid, lvl) {
				let nextPid;
				this.categoryShow[lvl - 1] = this.categoryShow[lvl - 1].map(item => {
					if(item.id == pid){
						nextPid = item.pid;
						this.vueSetAttr(item, 'uncertain', true);
					}
					return item;
				})
				if(lvl - 1 > 0){
					this.unmultiSelectUncertain(nextPid, lvl - 1);
				}
			},
			// 获取结果
			getResult() {
				if(this.multiselect){
					let result = [];
					let arr = this.categoryData;
					arr.forEach(item => {
						if(item.pid == this.topPid && item.checked){
							// 顶级直接读取
							result.push(item);
						}else{
							// 自查，如果上级为勾选状态，不读取
							for(let i = 0; i < arr.length; i++){
								if(arr[i].id == item.pid){
									if(arr[i].uncertain && item.checked){
										result.push(item);
									}
									break;
								}
							}
						}
					})
					this.categoryResult = result;
				}
				// 这里可以对结果进行回传
				this.$emit('onclose', this.categoryResult);
			},
			// 删除选中的
			handleRemove(item) {
				let lvl;
				this.categoryResult = this.categoryResult.filter(v => {
					if(v.id != item.id){
						return v;
					}
				})
				this.categoryData = this.categoryData.map(v => {
					if(v.id == item.id){
						v.checked = false;
						lvl = v.level - 1;
					}
					return v;
				})
				
				if(lvl){
					// 设置勾选状态
					this.setCheckedState(lvl);
					
					// 选中状态，取消其子级所有分类勾选
					if(item.selected){
						for(let i = lvl + 1; i < this.categoryShow.length; i++){
							this.categoryShow[i].forEach(v => {
								if(v.checked){
									v.checked = false;
								}
								return v;
							})
						}
					}
				}
			}
		}
	}
</script>

<style>
.sgy-category-cascade {
	display: inline-block;
	margin-right: 20px;
	padding: 8px;
	width: 208px;
	max-height: 380px;
	vertical-align: top;
	border: 1px solid #ddd;
	background-color: #fff;
	overflow: hidden;
	overflow-y: auto;
}
.sgy-category-cascade:last-child {
	margin-right: 0;
}
.sgy-checkbox-box {
	position: relative;
	margin-bottom: 2px;
	padding: 5px;
	cursor: pointer;
}
.sgy-checkbox-box:after {
	content: "";
	position: absolute;
	right: 10px;
	top: 50%;
	margin-top: -3px;
	border: 1px solid #ccc;
	border-top: 0;
	border-left: 0;
	width: 5px;
	height: 5px;
	-webkit-transform: rotate(-45deg) scale(1);
    transform: rotate(-45deg) scale(1);
}
.sgy-checkbox-box:hover, .sgy-checkbox-box.selected {
	background-color: #ebf2f9;
}
.sgy-checkbox {
	display: inline-block;
	margin-right: 3px;
    vertical-align: middle;
    white-space: nowrap;
    cursor: pointer;
    outline: 0;
    line-height: 1;
    position: relative;
}
.sgy-checkbox-inner {
	display: inline-block;
    width: 14px;
    height: 14px;
    position: relative;
    top: 0;
    left: 0;
    border: 1px solid #dddee1;
    border-radius: 2px;
    background-color: #fff;
    transition: border-color .2s ease-in-out,background-color .2s ease-in-out;
}
.sgy-checkbox-checked .sgy-checkbox-inner {
    border-color: #2d8cf0;
    background-color: #2d8cf0;
}
.sgy-checkbox-uncertain .sgy-checkbox-inner {
    border-color: #a1caf5;
    background-color: #a1caf5;
}
.sgy-checkbox-checked .sgy-checkbox-inner:after{
    content: "";
    display: table;
    width: 4px;
    height: 8px;
    position: absolute;
    top: 1px;
    left: 4px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg) scale(1);
    transform: rotate(45deg) scale(1);
    transition: all .2s ease-in-out;
}
.sgy-checkbox-inner:after {
    content: "";
    display: table;
    width: 4px;
    height: 8px;
    position: absolute;
    top: 1px;
    left: 4px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg) scale(0);
    transform: rotate(45deg) scale(0);
    transition: all .2s ease-in-out;
}
.sgy-checkbox-uncertain .sgy-checkbox-inner:after {
    content: "";
    width: 8px;
    height: 1px;
    transform: scale(1);
    position: absolute;
    left: 2px;
    top: 5px;
}
.sgy-spin-icon-load{
    animation: ani-spin 1s linear infinite;
}
@keyframes ani-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>