<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content class="margin-top-20">
        <Card>
        <Form :model="formItem" ref="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
            <Row style="margin-top:20px">
                <FormItem label="入库类型" prop="stock.type" :disabled="store_code ? true : false">
                    <RadioGroup v-model="formItem.stock.type" type="button">
                     <Radio label="1">采购</Radio>
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
                
                <Button type="primary" @click="modalSkuSelect = true" v-if="!store_code">选择产品</Button>
                <Table :columns="table" :data="skus"></Table>
                <Modal
                    v-model="modalSkuSelect"
                    title="创建入库单"
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
                        store_type: 'in'
                    },
                    product: [],
                    is_handle: 1
                },
                confirmData: {
                    handle: {},
                    batch_data: [],
                    store_code: this.$route.query.store_code
                },
                ruleValidate: {
                        'stock.type': [
                            {required: true, message: '入库类型不能为空', trigger: 'blur'}
                        ]
                },
                modalSkuSelect: false,
                SkuSelectItems: [],
                loading: true,
                columns1: [
                    {
                        title: '商品编码',
                        key: 'skusn'
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
                        title: '批次编号',
                        key: 'batch_code',
                        width: '250',
                        render: (h, params) => {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    placeholder: '请输入批次编号',
                                    maxlength:3
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.product[params.index].batch_code = val;
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '入库仓库',
                        key: 'warehouse',
                        render: (h, params) => {
                            let opts = [];
                            this.warehouseData.forEach((item, index) => {
                                opts.push(
                                    h('Option', {
                                        props : {
                                            label: item.name,
                                            value: item.id
                                        }
                                    })
                                )
                            });
                            return h('Select', {
                                props : {
                                    clearable: true
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.product[params.index].warehouse_id = val;
                                    }
                                }
                            }, opts);
                        }
                    },
                    {
                        title: '入库数量',
                        key: 'surplus_number',
                        render: (h, params) => {
                            return h('InputNumber', {
                                props: {
                                    step: 1,
                                    min: 0,
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.product[params.index].number = val;
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '库存类型',
                        key: 'type_status',
                        render: (h, params) => {
                            let opts = [];
                            opts.push(
                                h('Option', {
                                    props : {
                                        label:'虚拟库存',
                                        value: 'virtual_stock'
                                    }
                                }),
                                h('Option', {
                                    props : {
                                        label:'可用库存',
                                        value: 'available_stock'
                                    }
                                }),
                                h('Option', {
                                    props : {
                                        label:'在途库存',
                                        value: 'transport_stock'
                                    }
                                }),
                                h('Option', {
                                    props : {
                                        label:'订单库存',
                                        value: 'order_stock'
                                    }
                                }),
                                h('Option', {
                                    props : {
                                        label:'锁定库存',
                                        value: 'lock_stock'
                                    }
                                }),
                                h('Option', {
                                    props : {
                                        label:'安全库存',
                                        value: 'safe_stock'
                                    }
                                }),
                                h('Option', {
                                    props : {
                                        label:'预售库存',
                                        value: 'presell_stock'
                                    }
                                })
                            );
                            return h('Select', {
                                props : {
                                    clearable: true
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.product[params.index].type = val;
                                    }
                                }
                            }, opts);
                        }
                    }
                ],
                columns2: [
                    {
                        title: '应入库数量',
                        key: 'should_number'
                    },
                    {
                        title: '已入库数量',
                        key: 'real_number'
                    },
                    {
                        title: '剩余入库数量',
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
                    {
                        title: '商品编码',
                        key: 'skusn'
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
                        title: '批次编号',
                        key: 'batch_code',
                        width: '250',
                        render: (h, params) => {
                            let row_disabled = false;
                            if (this.store_code){
                                row_disabled = params.row.surplus > 0 ? false : true;
                            }
                            return h('Input', {
                                props: {
                                    disabled: row_disabled,
                                    type: 'text',
                                    placeholder: '请输入批次编号',
                                    maxlength:3
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.product[params.index].batch_code = val;
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '入库仓库',
                        key: 'warehouse',
                        render: (h, params) => {
                            let row_disabled = false;
                            if (this.store_code){
                                row_disabled = params.row.surplus > 0 ? false : true;
                            }
                            let opts = [];
                            this.warehouseData.forEach((item, index) => {
                                opts.push(
                                    h('Option', {
                                        props : {
                                            label: item.name,
                                            value: item.id
                                        }
                                    })
                                )
                            });
                            return h('Select', {
                                props : {
                                    disabled: row_disabled,
                                    clearable: true
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.product[params.index].warehouse_id = val;
                                    }
                                }
                            }, opts);
                        }
                    },
                    {
                        title: '入库数量',
                        key: 'surplus_number',
                        render: (h, params) => {
                            let row_disabled = false;
                            if (this.store_code){
                                row_disabled = params.row.surplus > 0 ? false : true;
                            }
                            return h('InputNumber', {
                                props: {
                                    disabled: row_disabled,
                                    step: 1,
                                    min: 0,
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.product[params.index].number = val;
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '库存类型',
                        key: 'type_text',
                    }
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
                        item.batch_code = '';
                        item.surplus_number = 1;
                        item.type_status = '';
                        item.skusn = item.sn;

                        this.skus.push(item);
                        // 提交到后台的表单数据
                        this.formItem.product.push({
                            batch_code: '',
                            warehouse_id: '',
                            skusn: item.sn,
                            number: 1,
                            type: ''
                        })
                    });
                });

            },
            init() {
                //获取客户仓库列表
                Util.ajax.post('/stock.stock_warehouse/lists', {
                }).then(resp => {
                    this.warehouseData = resp;
                })
                this.table = this.columns1;

                if(this.store_code) {
                    Util.ajax.post('/stock.stock/info', {
                            store_code: this.store_code,
                            relations: ['skus']
                    }).then(resp => {
                        resp.skus.forEach((item,index) => {
                            let _item = item.sku;
                            _item.warehouse = '-';
                            _item.type_text = item.type_text;
                            _item.should_number = item.should_number;
                            _item.real_number = item.real_number;
                            _item.surplus = item.surplus_number;
                            _item.skusn = item.skusn;

                            this.skus.push(_item);
                            // 提交到后台的表单数据
                            this.formItem.product.push({
                                batch_code: '',
                                skusn: item.skusn,
                                number: 1,
                                warehouse_id: 0,
                                type: '',
                            })
                        });
                        this.formItem.stock.type = resp.type;
                        this.formItem.stock.order_sn = resp.order_sn;
                        this.formItem.stock.remark = resp.remark;
                    })
                    this.table = this.columns2;
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
                            content: `入库成功`,
                            duration: 3
                        });
                        setTimeout(() => {
                            this.$router.push({path: `/stock/instore`})
                        }, 1000);
                    })
                }else{
                    this.$refs.formItem.validate((valis => {
                    })).then((res) => {
                        if (res === true) {
                            Util.ajax.post('/stock.stock/create', this.formItem).then(resp => {
                                this.status = true
                                this.$Message.success({
                                    content: `入库成功`,
                                    duration: 3
                                });
                                setTimeout(() => {
                                    this.$router.push({path: `/stock/instore`})
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
                this.$store.commit('removeTag', 'stock_instore_add');
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