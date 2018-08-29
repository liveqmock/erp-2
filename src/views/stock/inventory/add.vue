<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content class="margin-top-20">
        <Card>
        <Form :model="formItem" ref="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
            <Row style="margin-top:20px">
                <Button type="primary" @click="modalBatchSelect = true">选择批次</Button>
                <Table :columns="columns1" :data="batches"></Table>
                <Modal
                    v-model="modalBatchSelect"
                    title="选择批次"
                    width="85%"
                    :loading="loading"
                    @on-ok="ok"
                >
                 <batch-select
                        :multiple="true"
                        :checked="checked"
                        @on-callback="handleBatchSelectCallback"
                ></batch-select>
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
    import batchSelect from '@/views/components/thrgo/stock/batch-select.vue';
    import Util from '@/libs/util';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';

    export default {
        components: {
            batchSelect,
            submitAffix
        },
        data () {
            return {
                checked : [],
                //批次数据
                batches: [],
                formItem : {
                    infos: [],
                    is_handle: 1
                },
                ruleValidate: {},
                modalBatchSelect: false,
                BatchSelectItems: [],
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
                        key: 'batch_code'
                    },
                    {
                        title: '仓库名称',
                        key: 'warehouse'
                    },
                    {
                        title: '系统库存',
                        key: 'number',
                        render: (h, params) => {
                            return params.row.number + '（' + params.row.sku.unit_text + '）';
                        }
                    },
                    {
                        title: '实盘库存',
                        key: 'inventory_number',
                        render: (h, params) => {
                            return h('InputNumber', {
                                props: {
                                    step: 1,
                                    min: 0,
                                },
                                on: {
                                    input: (val) => {
                                        this.formItem.infos[params.index].inventory_number = val;
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
                this.BatchSelectItems = callback;
            },

            ok() {
                this.$nextTick(() => {
                    this.modalBatchSelect = false;
                    this.batches = [];
                    this.formItem.infos = [];
                    this.BatchSelectItems.forEach((item,index) => {
                        //前台页面渲染数据
                        item.skusn = item.sku.sn;
                        item.skuname = item.sku.skuname;
                        item.spec = item.sku.spec;
                        item.batch_code = item.batch_code;
                        item.warehouse = item.warehouse.name;
                        item.number = item.number;
                        item.inventory_number = 1;

                        this.batches.push(item);
                        // 提交到后台的表单数据
                        this.formItem.infos.push({
                            skusn: item.sku.sn,
                            batch_code: item.batch_code,
                            inventory_number: 1
                        })
                    });
                });
            },
            init() {
                
            },
            handleSubmit() {
                Util.ajax.post('/stock.stock_inventory/inventory', this.formItem).then(resp => {
                    this.status = true
                    this.$Message.success({
                        content: `盘点成功`,
                        duration: 3
                    });
                    setTimeout(() => {
                        this.$router.push({path: `/stock/inventory`})
                    }, 1000);
                })
            },
            handleCancel () {
                this.$store.commit('removeTag', 'stock_inventory_add');
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