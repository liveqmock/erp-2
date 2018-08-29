<template>
    <Content>
        <Row>
            <Col span="24">
                <thrgo-table
                    ref="paymentTable"
                    :border="false"
                    path="/finance.finance_bill/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                    :loading="true"
                ></thrgo-table>
            </Col>
        </Row>
        <Modal v-model="batchmodel" title="支付流水" width="1000"> 
            <Table stripe border :columns = "piListCol" :height="500" :data="piListData"></Table>
       </Modal>
    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import Util from '@/libs/util'
    export default {
        name: 'index',
        components: {
            thrgoTable,
        },
        data () {
            return {
                /* 支付流水弹窗开始 */
                batchmodel:false,
                current_bill_id: 0,
                piListCol:[
                    {
                      title: "流水号",
                      key: "batch_code",
                    },
                    {
                      title: "供应商",
                      key: "seller.name",
                      render: (h, params) => {
                            return params.row.seller.name;
                        }
                    },
                    {
                      title: "支付类型",
                      key: "type_text",
                    },
                    {
                      title: "支付方式",
                      key: "method_text",
                    },
                    {
                      title: "状态",
                      key: "status_text",
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
                      title: "金额",
                      key: "money",
                    },
                    {
                      title: "支付时间",
                      key: "pay_time",
                      width: 150,
                      render: (h, params) => {
                            return params.row.pay_time > 0 ? this.getTime(params.row.pay_time) : '-';
                        }
                    },
                    {
                      title: "确认时间",
                      key: "confirm_time",
                      width: 150,
                      render: (h, params) => {
                            return params.row.confirm_time > 0 ? this.getTime(params.row.confirm_time) : '-';
                        }
                    }
                ],
                // 表格行数据
                piListData: [],
                /* 支付流水弹窗结束 */

                // 表格获取数据参数
                params: {
                    should_type: 0,
                    limit: 12,
                    page: 1,
                    order:'create_time DESC',
                    relations: ['custom', 'seller', 'order'],
                    attrs: ['status_text','method_text']
                },
                // 表格多选数据
                paySelectedData: [],
                // 表格字段
                columns: [
                    {
                        title: '订单号',
                        key: 'order_sn',
                        align:'center',
                        sortable: true,
                    },
                    {
                        title: '类型',
                        key: 'type',
                        align: 'center',
                        render: (createEle,params) => {
                            switch (params.row.type) {
                                case 0: 
                                    return createEle('span', {}, '销售订单')
                                case 1: 
                                    return createEle('span', {}, '采购退货')
                            }
                        }
                    },
                    {
                        title: '供应商名称',
                        key: 'seller_name'
                    },
                    {
                        title: '结算方式',
                        key: 'method_text'
                    },
                    {
                        title: '应付金额',
                        key: 'price',
                        render: (createEle, params) => {
                            return '￥' + params.row.price;
                        }
                    },
                    {
                        title: '已付金额',
                        key: 'already_price',
                        render: (createEle, params) => {
                            return '￥' + params.row.already_price;
                        }
                    },
                    {
                        title: '待付金额',
                        key: 'surplus_price',
                        render: (createEle, params) => {
                            return '￥' + params.row.surplus_price;
                        }
                    },
                    {
                        title: '预定支付时间',
                        key: 'agree_time',
                        align: 'center',
                        render: (createEle, params) => {
                            if (params.row.agree_time == 0) {
                                return createEle('span', {}, '-')
                            } else {
                                return createEle('span', {}, this.getTime(params.row.agree_time))
                            }
                        }
                    },
                    {
                        title: '最后支付时间',
                        key: 'last_pay_time',
                        render: (createEle, params) => {
                            if (params.row.last_pay_time == 0) {
                                return createEle('span', {}, '-')
                            } else {
                                return createEle('span', {}, this.getTime(params.row.last_pay_time))
                            }
                        }
                    },
                    {
                        title: '完成时间',
                        key: 'finish_time',
                        render: (createEle, params) => {
                            if (params.row.finish_time == 0) {
                                return createEle('span', {}, '-')
                            } else {
                                return createEle('span', {}, this.getTime(params.row.finish_time))
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'status_text'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        className: 'operate',
                        render: (h, params) => {
                            const disable = params.row.status === 2 ? true : false;
                            const button_text = params.row.status === 2 ? '付款完成' : '立即支付';
                            return h('div', [
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        disabled: disable,
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'android-checkmark-circle'
                                    },
                                    on: {
                                            click: () => {
                                                this.paymentConfirm(params);
                                            }
                                        }
                                }, button_text),
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'eye'
                                    },
                                    on: {
                                            click: () => {
                                                this.current_bill_id = params.row.id;
                                                this.getPiList(params);
                                                this.batchmodel = true;
                                            }
                                        }
                                }, '支付流水')
                            ]);
                        }
                    }
                ]
            }
        },

        created () {
        },

        methods: {
            // 时间戳转时间字符串
            getTime (time) {
                if (time) {
                    var dateObj = new Date(time * 1000)
                    var Y = dateObj.getFullYear() + '-';
                    var M = (dateObj.getMonth()+1 < 10 ? '0'+(dateObj.getMonth()+1) : dateObj.getMonth()+1) + '-';
                    var D = dateObj.getDate() + ' ';
                    var h = dateObj.getHours() + ':';
                    var m = dateObj.getMinutes() + ':';
                    var s = dateObj.getSeconds();
                    return Y+M+D+h+m+s;
                } else {
                    return '';
                }
            },
            // 立即支付
            paymentConfirm (params) {
                this.$router.push({path: '/finance/payment/pay', query: {bill_id: params.row.id}})
            },
            // 获取支付流水列表
            getPiList () {
              Util.ajax.post('/finance.finance_bill/batch_lists', {
                bill_id: this.current_bill_id,
                role_type: 1,
                limit:false,
                page:0,
                attrs:['type_text','method_text','status_text'],
                relations:['seller'],
                order: 'create_time DESC'
              }).then((resp) => {
                this.piListData = resp.data;
              })
            }
        },

        watch: {
        }
    };
</script>

<style scoped>

</style>