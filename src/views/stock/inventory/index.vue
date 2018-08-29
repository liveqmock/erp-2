<style lang="less" scoped>
@import '../../../styles/common.less';
</style>

<template>
    <Content>
        <Row class="margin-bottom-10">
            <Col span="24">
            <Button type="primary" @click="add">库存盘点</Button>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <thrgo-table
                    :border="false"
                    path="/stock.stock_inventory/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                    :loading="true"
                ></thrgo-table>
            </Col>
        </Row>

    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import add from './add.vue';
    import Util from '@/libs/util';

    export default {
        name: 'stock_inventory_index',
        components: {
            thrgoTable
        },
        data () {
            return {
                loading: true,
                items: [],
                params: {
                    relations:['warehouse','sku','operatorInfo','supervisorInfo'],
                    limit: 12,
                    page: 1,
                    order:'create_time DESC'
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '产品名称',
                        key: 'sku.goods.name',
                        render: (h, params) => {
                            return params.row.sku.goods.name;
                        }
                    },
                    {
                        title: '产品编号',
                        key: 'sku.localsn',
                        render: (h, params) => {
                            return params.row.sku.localsn;
                        }
                    },
                    {
                        title: '产品品类',
                        key: 'sku.goods.category.name',
                        render: (h, params) => {
                            return params.row.sku.goods.category.name;
                        }
                    },
                    {
                        title: '产品规格',
                        key: 'sku.spec',
                        render: (h, params) => {
                            return params.row.sku.spec;
                        }
                    },
                    {
                        title: '所属库房',
                        key: 'warehouse.name',
                        render: (h, params) => {
                            return params.row.warehouse.name;
                        }
                    },
                    {
                        title: '批次编号',
                        key: 'batch_code'
                    },
                    {
                        title: '系统库存',
                        key: 'sys_number',
                        render: (h, params) => {
                            return params.row.sys_number + '（' + params.row.sku.unit_text + '）';
                        }
                    },
                    {
                        title: '实盘库存',
                        key: 'inventory_number',
                        render: (h, params) => {
                            return params.row.inventory_number + '（' + params.row.sku.unit_text + '）';
                        }
                    },
                    {
                        title: '实盘盈亏',
                        key: 'difference_number',
                        render: (h, params) => {
                            return params.row.difference_number + '（' + params.row.inventory_result + '）';
                        }
                    },
                    {
                        title: '审核状态',
                        key: 'status',
                        filters: [
                            {
                                label: '未通过',
                                value: -1
                            },
                            {
                                label: '待审核',
                                value: 0
                            },
                            {
                                label: '已通过',
                                value: 1
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            return row.status === value;
                        },
                        render: (h, params) => {
                            const color = params.row.status === 0 ? 'blue' : params.row.status === 1 ? 'green' : 'red';
                            return h('div', {
                                style: {
                                    color: color
                                }
                            }, params.row.status_text);
                        }
                    },
                    {
                        title: '盘点人',
                        key: 'operatorInfo.username',
                        render: (h, params) => {
                            return params.row.operatorInfo.username;
                        }
                    },
                    {
                        title: '监督人',
                        key: 'supervisorInfo.username',
                        render: (h, params) => {
                            return params.row.supervisorInfo.username;
                        }
                    },
                    {
                        title: '盘点时间',
                        sortable: true,
                        key: 'create_time'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        fixed: 'right',
                        width: 150,
                        className: 'operate',
                        render: (h, params) => {
                            const disable = params.row.status != 0 ? true : false;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: disable
                                    },
                                    on: {
                                            click: () => {
                                                this.checkInventory(params);
                                            }
                                        }
                                }, '审核')
                            ]);
                        }
                    }
                ]
            };
        },
        methods:{
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            // 创建盘存弹窗
            add() {
                this.$router.push('/stock/inventory/add');
            },
            // 审核盘存弹窗
            checkInventory(params) {
                //TODO::审核
                //this.$router.push({path: '/stock/inventory/add', query: {id: params.row.id}});
            }
        },
        created () {

        }
    };
</script>

<style scoped>

</style>
