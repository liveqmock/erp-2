<template>
    <Content>
        <Row>
            <Col span="24">
         
                <classifyCascade
                    :multiselect="true"
                    :defaultData="categoryDefaultDatas"
                    path="/goods.goods_category/lists"
                    :customParams="{pid: 0, custom_id: -1}"
                    @onclose="cascadeClose"
                />
           
            
        

            </Col>
        </Row>
        
       
        
    </Content>
</template>

<script>
    import Util from '@/libs/util';
    import skuSelect from '@/views/components/thrgo/goods/sku-select.vue';
    import userRoleSelect from '@/views/components/thrgo/custom/user-role-select.vue';
    import classifyCascade from '@/views/components/thrgo/custom/classify-cascade.vue';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';
    import customerSelect from '@/views/components/thrgo/custom/customer-select.vue';
    export default {
        name: 'demo',
        components: {
            skuSelect,
            userRoleSelect,
            classifyCascade,
            submitAffix,
            customerSelect
        },
        data() {
            return {
                modalSkuSelect: false,
                showCascadeModal: true,        // 显示商品分类选择弹出
                SkuSelectItems: [],
                modalCustomRoleUserSelect: false,
                loading: true,
                categoryDefaultDatas: [],       // 品类默认选中数据
                categoryTemporaryDatas: [],     // 用于储存品类选择的临时数据
                modalCustomerSelect: false,
                customerTemporaryDatas: [],     // 客户临时数据
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
            }
        }
    }
</script>

<style scoped>

</style>
