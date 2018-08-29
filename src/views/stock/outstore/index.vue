<style lang="less" scoped>
@import '../../../styles/common.less';
</style>

<template>
    <Content>
        <Row class="margin-bottom-10">
            <Col span="24">
            <Button type="primary" @click="add">创建出库单</Button>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <thrgo-table
                    :border="false"
                    path="/stock.stock/lists"
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
    import Util from '@/libs/util';

    export default {
        name: 'stock_outstore_index',
        components: {
            thrgoTable
        },
        data () {
            return {
                loading: true,
                items: [],
                params: {
                    relations: ['skus'],
                    store_type: 'out',
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
                        title: '出入库编号',
                        key: 'store_code'
                    },
                    {
                        title: '来源编号',
                        key: 'order_sn',
                        render: (h, params) => {
                            return params.row.order_sn ? params.row.order_sn : '-';
                        }
                    },
                    {
                        title: '出库类型',
                        key: 'type',
                        filters: [
                            {
                                label: '销售',
                                value: 2
                            },
                            {
                                label: '调仓',
                                value: 3
                            },
                            {
                                label: '退货',
                                value: 4
                            },
                            {
                                label: '换货',
                                value: 5
                            },
                            {
                                label: '报损',
                                value: 6
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            return row.type === value;
                        },
                        render: (h, params) => {
                            return params.row.type_text;
                        }
                    },
                    {
                        title: '出库状态',
                        key: 'status',
                        filters: [
                            {
                                label: '待处理',
                                value: 0
                            },
                            {
                                label: '进行中',
                                value: 1
                            },
                            {
                                label: '已完成',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            return row.status === value;
                        },
                        render: (h, params) => {
                            const color = params.row.status === 1 ? 'blue' : params.row.status === 2 ? 'green' : 'red';
                            return h('div', {
                                style: {
                                    color: color
                                }
                            }, params.row.status_text);
                        }
                    },
                    {
                        title: '备注信息',
                        key: 'remark',
                    },
                    {
                        title: '创建时间',
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
                            const disable = params.row.status == 2 ? true : false;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: disable
                                    },
                                    on: {
                                            click: () => {
                                                this.confirmStock(params);
                                            }
                                        }
                                }, params.row.store_type_text)
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
            // 创建出库单弹窗
            add() {
                this.$router.push('/stock/outstore/add');
            },
            // 确认出库单弹窗
            confirmStock(params) {
                this.$router.push({path: '/stock/outstore/add', query: {store_code: params.row.store_code}});
            },
        },
        created () {

        }
    };
</script>

<style scoped>

</style>
