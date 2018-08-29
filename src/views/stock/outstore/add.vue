<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content class="margin-top-20">
        <Card>
        <Form :model="formItem" ref="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
            <Row style="margin-top:20px">
                <FormItem label="出库类型" prop="stock.type" :disabled="store_code ? true : false">
                    <RadioGroup v-model="formItem.stock.type" type="button">
                     <Radio label="2">销售</Radio>
                     <Radio label="3">调仓</Radio>
                     <Radio label="4">退货</Radio>
                     <Radio label="5">换货</Radio>
                     <Radio label="6">报损</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="来源单号" prop="order_sn">
                    <Input v-model="formItem.stock.order_sn" :disabled="store_code ? true : false" placeholder="请输入来源单号"></Input>
                </FormItem>

                <FormItem label="备注信息" prop="remark">
                    <Input v-model="formItem.stock.remark" :disabled="store_code ? true : false" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
                </FormItem>

                <FormItem label="是否立即处理" prop="is_handle" v-if="!store_code">
                    <i-switch v-model="formItem.is_handle" size="large" true-value='1' false-value='2'>
                        <span slot="open">是</span>
                    </i-switch>
                </FormItem>
                
                <Button type="primary" @click="modalSkuSelect = true" v-if="!store_code">选择产品</Button>
                <Table :columns="table" :data="skus"></Table>
                <Modal
                    v-model="modalSkuSelect"
                    title="创建出库单"
                    width="85%"
                    :loading="loading"
                    @on-ok="ok"
                >
                 <sku-select
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
        components: {
            skuSelect,
            submitAffix
        },
        data () {
            return {
                store_code: this.$route.query.store_code,
                checked : [],
                table : [],
                //仓库数据
                warehouseData: {},
                //商品数据
                skus: [],
                formItem : {
                    stock: {
                        store_type: 'out'
                    },
                    product: [],
                    is_handle: 2
                },
                confirmData: {
                    handle: {},
                    batch_data: [],
                    store_code: this.$route.query.store_code
                },
                ruleValidate: {
                        'stock.type': [
                            {required: true, message: '出库类型不能为空', trigger: 'blur'}
                        ]
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
                        title: '商品规格',
                        key: 'spec'
                    },
                    {
                        title: '出库批次',
                        key: 'batch_code',
                        width: '400',
                        render: (h, params) => {
                            let row_disabled = false;
                            if (this.store_code){
                                row_disabled = params.row.surplus > 0 ? false : true;
                            }
                            let opts = [];
                            params.row.batches.forEach((item, index) => {
                                let _disabled = item.number == 0 ? true : false;
                                opts.push(
                                    h('Option', {
                                        props : {
                                            label: item.batch_code + "("+ item.warehouse.name +"，" + item.type_text + item.number +")",
                                            value: index,
                                            disabled:_disabled
                                        },
                                    })
                                )
                            });
                            return h('Select', {
                                props: {
                                    clearable: true,
                                    disabled: row_disabled
                                },
                                on: {
                                    input: (val) => {
                                        val = parseInt(val);
                                        let currentBatch = params.row.batches[val];
                                        params.row.warehouse = currentBatch.warehouse.name;
                                        params.row.surplus_number = currentBatch.number;
                                        params.row.type_text = currentBatch.type_text;
                                        // // 下面开始组装 product 提交的数据
                                        this.formItem.product[params.index].batch_code = currentBatch.batch_code;
                                    }
                                }
                            },opts);
                        }
                    },
                    {
                        title: '所在仓库',
                        key: 'warehouse'
                    },
                    {
                        title: '库存类型',
                        key: 'type_text'
                    },
                    {
                        title: '可用数量',
                        key: 'surplus_number'
                    },
                    {
                        title: '出库数量',
                        key: 'number',
                        render: (h, params) => {
                            let row_disabled = false;
                            if (this.store_code){
                                row_disabled = params.row.surplus > 0 ? false : true;
                            }
                            let surplus_number = params.row.surplus_number;
                            return h('InputNumber', {
                                props: {
                                    disabled: row_disabled,
                                    step: 1,
                                    min: 0,
                                    //precision: 2
                                },
                                on: {
                                    input: (val) => {
                                        let index = params.index;

                                        this.formItem.product[index].number = val;
                                    }
                                }
                            })
                        }
                    }
                ],
                columns2: [
                    {
                        title: '应出库数量',
                        key: 'should_number'
                    },
                    {
                        title: '已出库数量',
                        key: 'real_number'
                    },
                    {
                        title: '剩余出库数量',
                        key: 'surplus',
                        render: (h, params) => {
                            const color = 'red';
                            return h('div', {
                                style: {
                                    color: color
                                }
                            }, params.row.surplus);
                        }
                    },
                ]
            };
        },
        methods: {
            handleSkuSelectCallback (callback) {
                this.SkuSelectItems = callback;
            },

            ok() {
                this.$nextTick(() => {
                    this.modalSkuSelect = false;
                    this.skus = [];
                    this.formItem.product = [];
                    this.SkuSelectItems.forEach((item,index) => {
                        Util.ajax.post('/stock.stock/batch_list', {
                            skusn: item.sn,
                            relations:['warehouse'],
                            attrs:['type_text']
                        }).then(resp => {
                            item.batches = resp;
                            item.surplus_number = '-';
                            item.type_text = '-';
                            item.warehouse = '-';

                            this.skus.push(item);
                            // 提交到后台的表单数据
                            this.formItem.product.push({
                                batch_code: '',
                                skusn: item.sn,
                                number: 1
                            })
                        });
                    });
                });
            },
            init() {
                if(this.store_code) {
                    Util.ajax.post('/stock.stock/info', {
                            store_code: this.store_code,
                            relations: ['skus']
                    }).then(resp => {
                        resp.skus.forEach((item,index) => {
                            Util.ajax.post('/stock.stock/batch_list', {
                                limit:1000,
                                skusn: item.skusn,
                                relations:['warehouse'],
                                attrs:['type_text']
                            }).then(resp => {
                                let _item = item.sku;
                                _item.batches = resp;
                                _item.surplus_number = '-';
                                _item.type_text = '-';
                                _item.warehouse = '-';
                                _item.should_number = item.should_number;
                                _item.real_number = item.real_number;
                                _item.surplus = item.surplus_number;

                                this.skus.push(_item);
                                // 提交到后台的表单数据
                                this.formItem.product.push({
                                    batch_code: '',
                                    skusn: item.skusn,
                                    number: 1
                                })
                            });
                        });
                        this.formItem.stock.type = resp.type;
                        this.formItem.stock.order_sn = resp.order_sn;
                        this.formItem.stock.remark = resp.remark;
                    })
                    this.table = this.columns2.concat(this.columns1);
                }else{
                    this.table = this.columns1;
                }
            },
            handleSubmit() {
                if (this.store_code){
                    this.confirmData.handle = {};
                    this.confirmData.batch_data = [];
                    this.formItem.product.forEach((item,index) => {
                        if (item.batch_code){
                            this.confirmData.batch_data.push(item);
                        }
                    });
                    Util.ajax.post('/stock.stock/confirm', this.confirmData).then(resp => {
                        this.status = true
                        this.$Message.success({
                            content: `出库成功`,
                            duration: 3
                        });
                        setTimeout(() => {
                            this.$router.push({path: `/stock/outstore`})
                        }, 1000);
                    })
                }else{
                    this.$refs.formItem.validate((valis => {
                    })).then((res) => {
                        if (res === true) {
                            Util.ajax.post('/stock.stock/create', this.formItem).then(resp => {
                                this.status = true
                                this.$Message.success({
                                    content: `出库成功`,
                                    duration: 3
                                });
                                setTimeout(() => {
                                    this.$router.push({path: `/stock/outstore`})
                                }, 1000);
                            })
                        } else {
                            this.$Message.error({
                                content: `表单验证错误！请重新填写！`,
                                duration: 3
                            });
                        }
                    })
                }
            },
            handleCancel () {
                this.$store.commit('removeTag', 'stock_outstore_add');
                localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
                let lastPageName = '';
                if (this.$store.state.app.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.app.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.app.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            }
        },
        mounted (){
            this.init();
        }
    };
</script>