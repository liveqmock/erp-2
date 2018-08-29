<template>
    <Content>
        <Row>
            <Col span="24">
	            
				<!-- 品类选择 -->
				<Button type="primary" @click="showCascadeModal = true">选择品类</Button>
				<Modal
					v-model="showCascadeModal"
					title="商品分类选择"
					width="924"
					@on-ok="closeCascadeModal"
				>
					<classifyCascade
						:multiselect="true"
						:defaultData="categoryDefaultDatas"
						path="/goods.goods_category/lists"
						:customParams="{pid: 0, custom_id: -1}"
						@onclose="cascadeClose"
					/>
				</Modal>
				
				<!-- 原选择产品 -->
	            <Button type="primary" @click="modalSkuSelect = true">原选择产品</Button>
	            <Modal
                    v-model="modalSkuSelect"
                    title="选择细分产品"
                    width="960"
                    :loading="loading"
                    @on-ok="ok"
	            >
	            	<sku-select
                    	:multiple="true"
	                    @on-callback="handleSkuSelectCallback"
	                ></sku-select>
	            </Modal>
	            
	            <Button type="primary" @click="showGoodsModal = true">新选择产品</Button>
	            <Modal
                    v-model="showGoodsModal"
                    title="选择产品"
                    width="960"
                    @on-ok="handleChooseGoodsNew"
	            >
	            	<GoodsSelect
	            		v-model="goodsSelect"
	            		:extraColumns="[{title: '编号', key: 'sn'}]"
	            		:multiple="true"
	            		:get-all="true"
	            	>
	            	</GoodsSelect>
	            </Modal>
				<!---->
                
                
				<!-- 选择用户（按角色） -->
	            <Button type="primary" @click="modalCustomRoleUserSelect = true">选择用户（按角色）</Button>
	            <Modal
                    v-model="modalCustomRoleUserSelect"
                    title="选择用户"
                    width="85%"
                    :loading="loading"
                    @on-ok="okCustomUserCallback"
	            >
	                <user-role-select
	                        :multiple="true"
	                        @on-callback="handleCustomUserCallback"
	                ></user-role-select>
	            </Modal>
				
				<!-- 选择客户 -->
	            <Button type="primary" @click="modalCustomerSelect = true">选择客户</Button>
				<Modal
	                v-model="modalCustomerSelect"
	                title="选择客户"
	                width="980"
	                :loading="loading"
	                @on-ok="okCustomerCallback"
	            >
	                <customerSelect
	                    :multiple="true"
	                    @on-callback="handleCustomerCallback"
	                />
	            </Modal>
				
				<!-- 可控制关闭、显示的弹窗，点击确定需要手动关闭弹窗，loading状态在确定回调里设置true/false状态 -->
		        <Button type="primary" @click="showModalForm = true">可控表单弹窗</Button>
		        <ModalForm
		        	title="测试弹窗"
		        	v-model="showModalForm"
		        	:loading="modalFormLading"
		        	@on-ok="handleModalFormOk"
		        	@on-cancel="handleModalFormCancel"
		        >
		        	<Form :model="formTestData" :label-width="138" ref="modalForm" :rules="formTestRules">
				        <FormItem label="What's your name?" prop="name">
				            <Input v-model="formTestData.name" />
				        </FormItem>
				    </Form>
				    <p>此demo加上了loading效果，验证通过后，弹窗会在两秒后关闭</p>
		        </ModalForm>
		        
		        <!-- 数据筛选栏 -->
		        <div>
		        	<TableFilter
						style="margin-top: 10px;"
						:filters="filters"
						@on-submit="handleSubmitFilter"
					></TableFilter>
		        </div>
		        
		        <!-- 图片上传，参数请看组件里props的注释 -->
		        <div>
		        	<p style="margin: 10px 0 5px;">多图片上传：</p>
		        	<ImageUpload
		        		v-model="imageUploads"
		        		:format="['jpg','jpeg','png', 'gif', 'bmp']"
						:max-size="2048"
						:limit="5"
						:multiple="false"
		        	>	
		        	</ImageUpload>
		        </div>
		        
		        <!-- 头像上传，参数请看组件里props的注释 -->
		        <div>
		        	<p style="margin: 10px 0 5px;">单图片上传：</p>
		        	<AvatarUpload
		        		v-model="avatar"
		        		:width="80"
		        		:format="['jpg','jpeg','png', 'gif', 'bmp']"
						:max-size="2048"
		        	>	
		        	</AvatarUpload>
		        </div>
        		
            </Col>
        </Row>
        
        <!-- 提交图钉 -->
        <submitAffix
        	okValue="提交"
        	cancelValue="取消"
        	@onOk="handleAffixSubmit"
        	@onCancel="handleAffixCancel"
        />
        
    </Content>
</template>

<script>
	import Util from '@/libs/util';
    import skuSelect from '@/views/components/thrgo/goods/sku-select.vue';
    import GoodsSelect from '@/views/components/thrgo/goods/GoodsSelect.vue';
    import userRoleSelect from '@/views/components/thrgo/custom/user-role-select.vue';
    import classifyCascade from '@/views/components/thrgo/custom/classify-cascade.vue';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';
    import customerSelect from '@/views/components/thrgo/custom/customer-select.vue';
    import ModalForm from '@/views/components/thrgo/ModalForm.vue';
    import TableFilter from '@/views/components/thrgo/table/TableFilter.vue';
    import ImageUpload from '@/views/components/thrgo/ImageUpload.vue';
    import AvatarUpload from '@/views/components/thrgo/AvatarUpload.vue';
    export default {
        name: 'demo',
        components: {
            skuSelect,
            GoodsSelect,
            userRoleSelect,
            classifyCascade,
            submitAffix,
            customerSelect,
            ModalForm,
            TableFilter,
            ImageUpload,
            AvatarUpload
        },
        data() {
            return {
            	showGoodsModal: false,			// 显示新的商品选择
            	goodsSelect: [],				// 新的商品选择的数据存储
                modalSkuSelect: false,
                showCascadeModal: false,		// 显示商品分类选择弹出
                SkuSelectItems: [],
                modalCustomRoleUserSelect: false,
                loading: true,
                categoryDefaultDatas: [],		// 品类默认选中数据
                categoryTemporaryDatas: [],		// 用于储存品类选择的临时数据
                modalCustomerSelect: false,
                customerTemporaryDatas: [],		// 客户临时数据
                showModalForm: false,			// 显示表单对话框
                modalFormLading: false,			// loading状态
                formTestData: {					// 表单对话框测试数据
                	name: ''
                },
                formTestRules: {				// 表单对话框验证测试数据
                	name: [
	                    { required: true, message: '请填写您的姓名', trigger: 'blur' }
	                ]
                },
                filters: [						// 数据筛选
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
                ],
                imageUploads: [{'id': 1, 'name': 'bc7521e033abdd1e92222d733590f104','url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'}],
                avatar: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
            };
        },
        mounted() {
        	// 获取品类已有值的所有上级包括自身, 如果数据直接就是包括自身和自身父级的数据可以直接使用不需要再递归去获取
        	this.getCategoryDefaultData([5, 8, 25]);
        },
        methods: {
            handleSkuSelectCallback (callback) {
                this.SkuSelectItems = callback;
            },


            handleCustomUserCallback (callback) {
                //this.SkuSelectItems = callback;
            },


            ok() {
                console.log(this.SkuSelectItems)
                this.$nextTick(() => {
                    this.modalSkuSelect = false;
                });
            },
			handleChooseGoodsNew() {
				console.log(this.goodsSelect);
				this.showGoodsModal = false;
			},

            okCustomUserCallback() {
                console.log(2222);
            },

			// 获取品类上级数据
			getCategoryDefaultData(arr, result) {
				if(!result) result = [];
				Util.ajax.post("/goods.goods_category/get_parents", {id: arr[0]}).then(res => {
					let index = 1;
					let datas = [];
					for(let pid in res){
						let item = res[pid];
						if(typeof item != 'object'){
							datas.push({id: parseInt(pid), pid: 0, name: item, level: index});
						}else{
							for(let id in item){
								item[id].level = index;
								if(pid == arr[0]){
									item[pid].checked = true;
								}else{
									item[pid].uncertain = true;
								}
								datas.push(item[id]);
							}
						}
						index++;
					}
					if(datas.length == 0){
						datas[0].checked = true;
					}else{
						datas[0].uncertain = true;
					}
					result = result.concat(datas);
					arr.shift();
	        		if(arr.length > 0){
	        			this.getCategoryDefaultData(arr, result);
	        		}else{
	        			let temporaryData = [], repeats = [];
	        			result = result.filter(item => {
	        				if(repeats.indexOf(item.id) < 0){
	        					repeats.push(item.id);
	        					return item;
	        				}
	        			})
	        			this.categoryDefaultDatas = result;
	        		}
	           	})
			},
            // 接收品类选择的数据
			cascadeClose(vals) {
				this.categoryTemporaryDatas = vals;
			},
			closeCascadeModal() {
				console.log(this.categoryTemporaryDatas);
				// this.showCascadeModal = false;
			},
			
			// 提交图钉
			handleAffixSubmit() {
				console.log("提交");
			},
			handleAffixCancel() {
				console.log("取消");
			},
			
			// 客户选择
			okCustomerCallback() {
				console.log(this.customerTemporaryDatas);
				this.modalCustomerSelect = false;
			},
			handleCustomerCallback(vals) {
				this.customerTemporaryDatas = vals;
			},
			
			// 弹窗
			handleModalFormOk() {
				this.modalFormLading = true;
				this.$refs['modalForm'].validate((valid) => {
	                if (valid) {
	                	// 为了更好的演示，这里设置两秒后自动关闭
	                    setTimeout(() => {
	                    	this.showModalForm = false;
	                    	this.modalFormLading = false;
	                    }, 2000)
	                } else {
	                    // 验证未通过
	                    // 如果有loading状态，设置loading状态为false
	                    this.modalFormLading = false;
	                }
	            })
			},
			handleModalFormCancel() {
				console.log("这玩意儿已经关闭了~");
			},
			
			
			// 筛选
			handleSubmitFilter(params, filters) {
				// params 组装后的数据
				// filter 未组装的数据
				console.log(params, filters)
			}
       	}
    }
</script>

<style scoped>

</style>
