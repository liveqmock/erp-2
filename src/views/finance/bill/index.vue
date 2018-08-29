<template>
    <Content>
        <Tabs value="accReceivable">
            <TabPane label="应收账款" name="accReceivable">
                <Row>
                    <Col span="24">
                        <thrgo-table
                            ref = "accReceivableTable"
                            :border="false"
                            path="/finance.finance_bill/should_lists"
                            :params="paramsAccReceivable"
                            :pagination="false"
                            :columns="colAccReceivable"
                            :loading="true"
                        ></thrgo-table>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="应付账款" name="accPayable">
                <Row>
                    <Col span="24">
                        <thrgo-table
                            ref = "accPayableTable"
                            :border="false"
                            path="/finance.finance_bill/should_lists"
                            :params="paramsAccPayable"
                            :pagination="false"
                            :columns="colAccPayable"
                            :loading="true"
                        ></thrgo-table>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue'
    // import addOrMod from './addOrMod.vue'
    import Util from '@/libs/util'

    export default {
        name: 'index',
        components: {thrgoTable},
        data () {
            return {
                // 表格列表获取参数
                paramsAccReceivable: {
                    should_type: 1
                },
                paramsAccPayable: {
                    should_type: -1
                },
                // 表格字段数据
                colAccReceivable: [
                    {
                        title: '客户名称',
                        key: 'custom_name'
                    },
                    {
                        title: '总计账款',
                        key: 'total_price'
                    },
                    {
                        title: '待收账款',
                        key: 'loadpay_price'
                    },
                    {
                        title: '已收账款',
                        key: 'pay_price'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (createEle, params) => {
                            // debugger
                            if (params.row.loadpay_price == 0) {
                                return createEle('div', {}, [
                                    createEle('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            disabled: true,
                                            type: 'error',
                                            size: 'small',
                                            icon: 'speakerphone'
                                        }
                                    }, '催款'),
                                    createEle('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'ios-search-strong'
                                        },
                                        on: {
                                            click: () => {
                                                this.viewDetail(params, 'accReceivable')
                                            }
                                        }
                                    }, '查看详情')
                                ])
                            } else {
                                return createEle('div', {}, [
                                    createEle('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'speakerphone'
                                        },
                                        on: {
                                            click: () => {
                                                this.doDunning(params)
                                            }
                                        }
                                    }, '催款'),
                                    createEle('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'ios-search-strong'
                                        },
                                        on: {
                                            click: () => {
                                                this.viewDetail(params, 'accReceivable')
                                            }
                                        }
                                    }, '查看详情')
                                ])
                            }
                        }
                    }
                ],
                colAccPayable: [
                    {
                        title: '客户名称',
                        key: 'seller_name'
                    },
                    {
                        title: '总计账款',
                        key: 'total_price'
                    },
                    {
                        title: '待付账款',
                        key: 'loadpay_price'
                    },
                    {
                        title: '已付账款',
                        key: 'pay_price'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (createEle, params) => {
                            // debugger
                            return createEle('Button', {
                                style: {
                                    margin: '0 5px'
                                },
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-search-strong'
                                },
                                on: {
                                    click: () => {
                                        this.viewDetail(params, 'accPayable')
                                    }
                                }
                            }, '查看详情')
                        }
                    }
                ]
            }
        },
        methods: {
            // 催款方法
            doDunning (params) {
                // debugger
                Util.ajax.post('/finance.finance_bill/urge', {
                    id: params.row.custom_id
                }).then(resp => {
                    // debugger
                    this.$Message.success({
                        content: `催款成功！`,
                        duration: 3
                    });
                })
            },
            // 查看账单详情
            viewDetail (params, category) {
                // debugger
                /* if (category === 'accReceivable') {
                    this.$router.push({name: 'finance_receive', params: params.row.custom_id})
                } else if (category === 'accPayable') {
                    this.$router.push({name: 'finance_payment', params: params.row.seller_id})
                } */
                switch (category) {
                    case 'accReceivable':
                        this.$router.push({name: 'finance_receive', params: {custom_id: params.row.custom_id}})
                        break
                    case 'accPayable': 
                        this.$router.push({name: 'finance_payment', params:{seller_id: params.row.seller_id}})
                        break
                }
            }
        }
    };
</script>

<style scoped>

</style>