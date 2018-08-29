<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content class="margin-top-20">
        <Card>
        <Form :model="formItem" ref="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
            <Row style="margin-top:20px">
                <Card>
                    <p slot="title">
                        <Icon type="android-menu"></Icon>
                        批次信息
                    </p>
                    <Button type="primary" @click="modalBatchSelect = true">选择批次</Button>
                    <Table :columns="columns_batch" :data="batches"></Table>
                    <Modal
                        v-model="modalBatchSelect"
                        title="选择批次"
                        width="85%"
                        :loading="loading"
                        @on-ok="ok_batch"
                    >
                     <batch-select
                            :multiple="false"
                            :checked="checked"
                            @on-callback="handleBatchSelectCallback"
                    ></batch-select>
                    </Modal>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="android-share-alt"></Icon>
                        分拣信息
                    </p>
                    <Button type="primary" @click="modalSkuSelect = true">选择产品</Button>
                    <Table :columns="columns_sku" :data="skus"></Table>
                    <Modal
                        v-model="modalSkuSelect"
                        title="选择产品"
                        width="85%"
                        :loading="loading"
                        @on-ok="ok_sku"
                    >
                     <sku-select
                            :multiple="true"
                            :checked="checked"
                            @on-callback="handleSkuSelectCallback"
                    ></sku-select>
                    </Modal>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="document-text"></Icon>
                        备注信息
                    </p>
                    <FormItem label="备注信息" prop="remark">
                        <Input v-model="formItem.batch.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
                    </FormItem>
                </Card>
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
    import batchSelect from '@/views/components/thrgo/stock/batch-select.vue';
    import skuSelect from '@/views/components/thrgo/goods/sku-select.vue';
    import Util from '@/libs/util';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';

    export default {
        components: {
            batchSelect,
            skuSelect,
            submitAffix
        },
        data () {
            return {
                checked : [],
                //批次数据
                batches: [],
                //分拣数据
                skus: [],
                formItem : {
                    batch: {},
                    product: [],
                },
                ruleValidate: {},
                modalBatchSelect: false,
                BatchSelectItem: {},
                modalSkuSelect: false,
                SkuSelectItems: [],
                loading: true,
                columns_batch: [
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
                        key: 'batch_code'
                    },
                    {
                        title: '仓库名称',
                        key: 'warehouse'
                    },
                    {
                        title: '可分拣数量',
                        key: '_number',
                        render: (h, params) => {
                            return params.row.number + '（' + params.row.sku.unit_text + '）';
                        }
                    },
                    {
                        title: '分拣数量',
                        key: 'number',
                        render: (h, params) => {
                            return h('InputNumber', {
                                props: {
                                    step: 1,
                                    min: 0,
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.batch.number = val;
                                    }
                                }
                            })
                        }
                    }
                ],
                columns_sku: [
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
                        title: '目标分拣数量',
                        key: 'number',
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
                    }
                ]
            };
        },
        methods: {
            handleBatchSelectCallback (callback) {
                this.BatchSelectItem = callback;
            },

            handleSkuSelectCallback (callback) {
                this.SkuSelectItems = callback;
            },

            ok_batch() {
                this.$nextTick(() => {
                    this.modalBatchSelect = false;
                    if (this.BatchSelectItem.batch_code == undefined){
                        this.$Message.error({
                            content: `请选择批次`,
                            duration: 3
                        });
                        return;
                    }
                    this.batches = [];
                    this.formItem.batch = {};
                    //前台页面渲染数据
                    let item = {};
                    item.skusn = this.BatchSelectItem.sku.sn;
                    item.skuname = this.BatchSelectItem.sku.skuname;
                    item.spec = this.BatchSelectItem.sku.spec;
                    item.batch_code = this.BatchSelectItem.batch_code;
                    item.warehouse = this.BatchSelectItem.warehouse.name;
                    item.number = this.BatchSelectItem.number;
                    item.sku = this.BatchSelectItem.sku;
                    this.batches.push(item);
                    // 提交到后台的表单数据
                    this.formItem.batch.batch_code = this.BatchSelectItem.batch_code;
                    this.formItem.batch.skusn = this.BatchSelectItem.sku.sn;
                    this.formItem.batch.number = 1;
                });
            },
            ok_sku() {
                this.$nextTick(() => {
                    this.modalSkuSelect = false;
                    this.skus = [];
                    this.formItem.product = [];
                    this.SkuSelectItems.forEach((item,index) => {
                        //前台页面渲染数据
                        item.skusn = item.sn;
                        item.skuname = item.skuname;
                        item.spec = item.spec;
                        item.batch_code = '';
                        item.number = 1;
                        this.skus.push(item);
                        // 提交到后台的表单数据
                        this.formItem.product.push({
                            skusn: item.sn,
                            batch_code: '',
                            number: 1,
                        })
                    });
                });
            },
            init() {
                
            },
            handleSubmit() {
                Util.ajax.post('/stock.stock/sorting', this.formItem).then(resp => {
                    this.status = true
                    this.$Message.success({
                        content: `分拣成功`,
                        duration: 3
                    });
                    setTimeout(() => {
                        this.$router.push({path: `/stock/product`});
                    }, 1000);
                })
            },
            handleCancel () {
                this.$store.commit('removeTag', 'stock_product_sorting');
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