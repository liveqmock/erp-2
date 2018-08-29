<template>
    <Content>
        <Row>
            

            <Col span="24" style="margin-bottom: 10px"></Col>

            <Col span="24">
            <thrgo-table
                    ref = "orderBuyTable"
                    :border="false"
                    path="/order/order/buyer_lists"
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
    import orderEdit from './orderEdit.vue'
    import Util from '@/libs/util'

    export default {
        name: 'index',
        components: {
            thrgoTable,
            orderEdit
        },
        data () {
            return {
                // 订单取消原因
                orderCancelReason: '',
                columns: [
                    {
                        title: '订单号',
                        key: 'order_sn',
                        width: 200,
                        isFrozen: true
                    },
                    {
                        title: '订单类型',
                        key: 'type_text',
                        render: (createEle, params) => {
                            return createEle('span', {}, '采购订单')
                        }
                    },
                    {
                        title: '供应商',
                        key: 'seller_info.name',
                        width: 120,
                        render: (h, params) => {
                            return params.row.seller_info.name;
                        }
                    },
                    {
                        title: '提交人',
                        key: 'user_info.username',
                        width: 120,
                        render: (h, params) => {
                            return params.row.user_info.realname || params.row.user_info.username;
                        }
                    },
                    {
                        title: '订单总额',
                        sortable: true,
                        key: 'real_amount',
                        width: 150
                    },
                    {
                        title: '支付方式',
                        sortable: true,
                        key: 'pay_type_text',
                        width: 150
                    },
                    {
                        title: '状态',
                        width: 100,
                        isFrozen: true,
                        key: 'real_status',
                        filters: [
                            {
                                label: '待提交',
                                value: 12
                            },
                            {
                                label: '待卖家确认',
                                value: 1
                            },
                            {
                                label: '待买家确认',
                                value: 2
                            },
                            {
                                label: '待支付',
                                value: 3
                            },
                            {
                                label: '待收款',
                                value: 4
                            },
                            {
                                label: '待发货',
                                value: 5
                            },
                            {
                                label: '出库中',
                                value: 6
                            },
                            {
                                label: '待收货',
                                value: 7
                            },
                            {
                                label: '待完成',
                                value: 8
                            },
                            {
                                label: '已完成',
                                value: 9
                            },
                            {
                                label: '已取消',
                                value: 10
                            },
                            {
                                label: '已回收',
                                value: 11
                            },
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            return row.real_status === value;
                        },
                        render: (h, params) => {
                            return params.row.status_text;
                        }
                    },
                    {
                        title: '操作',
                        align: 'left',
                        key: 'action',
                        width: 200,
                        fixed: 'right',
                        render: (h, params) => {
                            let buttons = [];
                            buttons.push(
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'edit'
                                    },
                                    on: {
                                        click: () => {
                                            this.viewDetail(params)
                                        }
                                    }
                                }, '详情'),
                            );
                            switch(params.row.real_status) {
                                case 0:
                                buttons.push(
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'success',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                this.orderSubmit(params)
                                            }
                                        }
                                    }, '提交'),
                                    h('Button', {
                                        style: {
                                            margin: '5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                this.delOrder(params)
                                            }
                                        }
                                    }, '删除'),
                                );
                                break;
                                case 2:
                                buttons.push(
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'success',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                this.orderConfirm(params)
                                            }
                                        }
                                    }, '确认'),
                                    h('Button', {
                                        style: {
                                            margin: '5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                         on: {
                                            click: () => {
                                                this.orderCancel(params)
                                            }
                                        } 
                                    }, '取消'),
                                );
                                break;
                                case 3:
                                buttons.push(
                                    h('Button', {
                                        style: {
                                            margin: ' 5px'
                                        },
                                        props: {
                                            type: 'warning',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                this.orderCancel(params)
                                            }
                                        } 
                                    }, '取消'),
                                );
                                break;
                                case 7:
                                buttons.push(
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'success',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                this.orderReceipt(params)
                                            }
                                        } 
                                    }, '确认收货'),
                                );
                                break;
                            }
                            return h('div', buttons);
                        }
                    }
                ],
                params: {
                    limit: 12,
                    page: 1,
                    extra: ['user_info','buyer_info','seller_info']
                },
            };
        },

        methods: {
            // 查看订单详情
            viewDetail (params) {
                this.$router.push({path: `detail`, query: {order_sn: params.row.order_sn}})
            },
            // 提交订单
            orderSubmit (params) {
                this.$Modal.confirm({
                    title: '是否确认提交',
                    content: '<p>是否确认向卖家提交订单？</p>',
                    onOk: () => {
                        Util.ajax.post('/order.order/submit', {
                            order_sn: params.row.order_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `提交成功！`,
                                duration: 3
                            });
                        this.$refs.orderBuyTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            //取消订单
            orderCancel (params) {
                this.$Modal.confirm({
                    title: '是否确认取消订单',
                    content: '<p>是否确认取消订单？</p>',
                    onOk: () => {
                        Util.ajax.post('/order.order/cancel', {
                            order_sn: params.row.order_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `操作成功！`,
                                duration: 3
                            });
                        this.$refs.orderBuyTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            // 确认订单
            orderConfirm (params) {
                this.$Modal.confirm({
                    title: '是否确认订单',
                    content: '<p>是否确认订单，确认后订单无法修改或取消？</p>',
                    onOk: () => {
                        Util.ajax.post('/order.order/confirm', {
                            order_sn: params.row.order_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `操作成功！`,
                                duration: 3
                            });
                        this.$refs.orderBuyTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            // 订单收货
            orderReceipt (params) {
                this.$router.push({path: `receipt`, query: {order_sn: params.row.order_sn}})
            },
            // 删除订单
            delOrder (params) {
                this.$Modal.confirm({
                    title: '是否确认删除订单',
                    content: '<p>是否确认删除订单，删除后的订单无法找回？</p>',
                    onOk: () => {
                        Util.ajax.post('/order.order/delete', {
                            order_sn: params.row.order_sn
                        }).then(resp => {
                            this.$Message.success({
                              content: `删除成功！`,
                              duration: 3
                            });
                            this.$refs.orderBuyTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            // 取消提交编辑订单
            cancelForm () {
                this.modOrderBufferData = {}
            }
        },

        watch: {
        }


    };
</script>

<style scoped>

</style>
