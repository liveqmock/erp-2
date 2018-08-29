<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content class="margin-top-20">
        <Card>
        <Form :model="formItem" ref="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
            <Row style="margin-top:20px">
                <FormItem label="采购计划名称" prop="name">
                    <Input v-model="formItem.name" placeholder="采购计划名称"></Input>
                </FormItem>
                <FormItem label="采购方式" prop="buy_type">
                    <RadioGroup v-model="formItem.buy_type" type="button">
                        <Radio label="1">一键下单</Radio>
                        <Radio label="2">采购大厅交易</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="付款方式" prop="pay_type">
                    <RadioGroup v-model="formItem.pay_type" type="button">
                     <Radio label="1">现付</Radio>
                     <Radio label="2">到付</Radio>
                     <Radio label="3">账期</Radio>
                     <Radio label="4">分期</Radio>
                    </RadioGroup>
                </FormItem>
              
                <FormItem label="验收标准" prop="accept_criteria">
                    <Input v-model="formItem.accept_criteria" placeholder="请输入验收标准"></Input>
                </FormItem>
                 <FormItem label="采购原因" prop="reason">
                    <Input v-model="formItem.reason" placeholder="请输入采购原因"></Input>
                </FormItem>
                <FormItem label="开始时间" prop="start">
                  <DatePicker    :value="formItem.startline"  @on-change="handleChange"  type="date" placeholder="Select date" style="width: 200px"></DatePicker>

                </FormItem>
                <FormItem label="结束时间" prop="address">
                    <DatePicker    :value="formItem.deadline"  @on-change="handleChangend"  type="date" placeholder="Select date" style="width: 200px"></DatePicker>

                </FormItem>
                <Button type="primary" @click="modalSkuSelect = true">选择产品</Button>
                <Table :columns="columns1" :data="data1"></Table>
                <Modal
                    v-model="modalSkuSelect"
                    title="创建采购计划"
                    width="85%"
                    :loading="loading"
                    @on-ok="ok"
                >
                 <sku-select
                        :params="goodsParams"
                        :multiple="true"
                        :checked="checked"
                        @on-callback="handleSkuSelectCallback"
                ></sku-select>
            </Modal>
            </Row>
        </Form>
        <submitAffix
                    okValue="确认"
                    cancelValue="取消"
                    @onOk="handleSubmit"
                    @onCancel="handleCancel"
            />
    </Card>
    </Content>
</template>

<script>
    import skuSelect from '@/views/components/thrgo/goods/sku-select.vue';
    import Util from '@/libs/util';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';

    export default {
        name: 'add',
        components: {
            skuSelect,
            submitAffix
        },
        data () {
            return {
                checked : [],
                plan_sn : this.$route.query.plan_sn,
                goodsParams: {
                    is_self : 0,
                    limit: 12,
                    page: 1
                },
                //商品数据
                goodsRowBuffer: [],
                formItem : {
                    buy_type: '1',
                    pay_type: '1',
                },
                startline : '',
                deadline : '',
                ruleValidate: {
                    name: [
                        {required: true, message: '采购计划名称', trigger: 'blur'}
                    ],
                    buy_type: [
                        {required: true, message: '采购方式不能为空', trigger: 'blur'}
                    ],
                    pay_type: [
                        {required: true, message: '付款方式不能为空', trigger: 'blur'}
                    ],
                    accept_criteria: [
                        {required: true, message: '验收标准不能为空', trigger: 'blur'}
                    ],
                    reason: [
                        {required: true, message: '采购原因不能为空', trigger: 'blur'}
                    ], 
                },
                modalSkuSelect: false,
                SkuSelectItems: [],
                loading: true,
                columns1: [
                    {
                        title: '商品编码',
                        key: 'sn'
                    },
                    {
                        title: '商品名称',
                        key: 'skuname'
                    },
                    {
                        title: '商品价格',
                        key: 'price',
                        render: (createEle, params) => {
                            return createEle('Input', {
                                attrs: {value: params.row.price},
                                on: {
                                    'on-change': (e) => {
                                        this.GoodsRowEdit(e,params,'price')
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '商品数量',
                        key: 'number',
                        render: (createEle, params) => {
                            return createEle('Input', {
                                attrs: {value: params.row.number},
                                on: {
                                    'on-change': (e) => {
                                        this.GoodsRowEdit(e,params,'number')
                                    }
                                }
                            })
                        }
                    }
                ],
                data1 : [],
            };
        },
        methods: {
             handleChange(date){
                
                this.formItem.startline =  ((new Date(date)).getTime())/1000;
               
            },
            handleChangend(date){
                this.formItem.deadline =  ((new Date(date)).getTime())/1000;
               
            },
            
            GoodsRowEdit (e,params,field) {
                this.goodsRowBuffer[params.row.skuid][field] = e.target.value;
                this.data1.forEach((item,index) => {
                    if(params.row.skuid == item.skuid){
                        this.data1[index][field] = e.target.value;
                    }
                })
            },

            handleSkuSelectCallback (callback) {
                this.SkuSelectItems = callback;
            },

            ok() {
                this.$nextTick(() => {
                    this.modalSkuSelect = false;
                    var skus1 = [];
                    this.data1.forEach((item,index) => {
                        skus1[index] = item.skuid;
                    })
                    var skus2 = [];
                    this.SkuSelectItems.forEach((item,index) => {
                        if(!this.goodsRowBuffer[item.skuid]){
                            this.goodsRowBuffer[item.skuid] = {};
                            this.goodsRowBuffer[item.skuid]['price'] = item.quote;
                        }
                        item.price = item.quote;
                        if(skus1.indexOf(item.skuid) == -1){
                            this.data1.push(item);
                        }
                        skus2[index] = item.skuid;
                    })
                    
                    var chaji = this.arrayMis(skus1,skus2);
                    
                    chaji.forEach((item,index) => {
                        this.data1.forEach((val,i) => {
                            if(chaji.indexOf(val.skuid) > -1) {
                                this.data1.splice(i,1);
                            }
                        })
                        this.goodsRowBuffer.forEach((val,i) => {
                            if(chaji.indexOf(i) > -1) {
                                delete this.goodsRowBuffer[i];
                            }
                        })
                    })
                });
            },
            arrayMis: function (a, b) {
                let arrA = []
                let arrB = [];
                a.forEach(function (val) {
                    if (b.indexOf(val) >= 0) {
                        arrA.push(val)
                    } else {
                        arrB.push(val)
                    }

                });
                return arrB;
            },
            init() {
                if(this.plan_sn) {
                    var attrs = ['sku_info'];
                    Util.ajax.post('/purchase.purchase_plan/detail', {
                            plan_sn: this.plan_sn,
                            attrs: attrs
                    }).then(resp => {
                        this.formItem.name = resp.name;
                        this.formItem.pay_type = resp.pay_type.toString();
                        this.formItem.buy_type = resp.buy_type.toString();
                        this.formItem.reason = resp.reason;
                        this.formItem.accept_criteria = resp.accept_criteria;
                        this.formItem.startline = resp.startline;
                        this.formItem.deadline = resp.deadline;
                        this.data1 = resp.sku_info;
                        for (var val of resp.sku_info) {
                            this.checked.push(val.skuid);
                            this.goodsRowBuffer[val.skuid] = {};
                            this.goodsRowBuffer[val.skuid]['number'] = val.number;
                            this.goodsRowBuffer[val.skuid]['price'] = val.price;
                        }
                    })
                }
            },
            handleCancel() {
                this.$router.push({name: 'purchase_plan'})
            },
            handleSubmit() {
                this.$refs.formItem.validate((valis) => {
                    if(valis){
                        var skuinfo = {};
                        this.goodsRowBuffer.forEach((item,index) => {
                            if(item != null){
                                skuinfo[index] = item;
                            }
                        })
                        var params = {
                            name: this.formItem.name,
                            pay_type: this.formItem.pay_type,
                            buy_type: this.formItem.buy_type,
                            reason: this.formItem.reason,
                            accept_criteria: this.formItem.accept_criteria,
                            startline: this.formItem.startline,
                            deadline: this.formItem.deadline,
                            skuinfo : skuinfo
                        };
                        if(this.plan_sn){
                            params.plan_sn = this.plan_sn;
                            Util.ajax.post('/purchase.purchase_plan/edit', params).then(resp => {
                                this.status = true
                                this.$Message.success({
                                    content: `编辑成功`,
                                    duration: 3
                                });
                                setTimeout(() => {
                                    this.$router.push({path: `/purchase/plan`})
                                }, 1000);
                            })
                        }else{
                            Util.ajax.post('/purchase.purchase_plan/create', params).then(resp => {
                                this.status = true
                                this.$Message.success({
                                    content: `添加成功`,
                                    duration: 3
                                });
                                setTimeout(() => {
                                    this.$router.push({path: `/purchase/plan`})
                                }, 1000);
                            })
                        }
                    }else{
                        this.$Message.error({
                            content: `表单验证错误！请重新填写！`,
                            duration: 3
                        });
                    }
                })
            },
        },
        mounted (){
            this.init();
        }
    };
</script>