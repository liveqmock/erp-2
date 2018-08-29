<template>
    <Content>
        <Row>
            <Col span="24">
                <tablecomponent :is = 'tableLoad'
                    ref = "accReceivableTable"
                    :border="false"
                    path="/finance.finance_bill/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                    :loading="true"
                ></tablecomponent>
            </Col>
        </Row>
        <Modal v-model="batchmodel" title="收款历史" width="1000"> 
            <Table stripe border :columns = "piListCol" :height="500" :data="piListData"></Table>
        </Modal>
        <Modal v-model="receivemodel" title="确认收款" width="1000"> 
            <Table stripe border :columns = "reListCol" :height="500" :data="reListData"></Table>
        </Modal>
    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue'
    import Util from '@/libs/util'
    export default {
        name: 'index',
        components: {thrgoTable},
        data () {
            return {
                /* 确认收款开始 */
                receivemodel:false,
                current_receive_bill_id: 0,
                reListCol:[
                    {
                      title: "流水号",
                      key: "batch_code",
                    },
                    {
                      title: "付款方",
                      key: "custom.name",
                      render: (h, params) => {
                            return params.row.custom.name;
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
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        className: 'operate',
                        width: 135,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'android-checkmark-circle'
                                    },
                                    on: {
                                            click: () => {
                                                this.receiveConfirm(params);
                                            }
                                        }
                                }, '确认收款')
                            ]);
                        }
                    }
                ],
                // 表格行数据
                reListData: [],
                /* 确认收款结束 */

                /* 收款历史开始 */
                batchmodel:false,
                current_bill_id: 0,
                piListCol:[
                    {
                      title: "流水号",
                      key: "batch_code",
                    },
                    {
                      title: "付款方",
                      key: "custom.name",
                      render: (h, params) => {
                            return params.row.custom.name;
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
                /* 收款历史结束 */

                // 表格获取数据参数
                params: {
                    should_type: 1,
                    limit: 12,
                    page: 1,
                    order:'create_time DESC',
                    relations: ['custom', 'seller', 'order'],
                    attrs: ['status_text','method_text']
                },
                // 表格组件异步加载
                tableLoad: '',
                // 表格字段
                columns: [
                    {
                        title: '订单号',
                        key: 'order_sn',
                        align: 'center',
                        sortable: true
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
                        title: '客户名称',
                        key: 'custom_name',
                    },
                    {
                        title: '结算方式',
                        key: 'method_text'
                    },
                    {
                        title: '应收金额',
                        key: 'price',
                        render: (createEle, params) => {
                            return '￥' + params.row.price;
                        }
                    },
                    {
                        title: '已收金额',
                        key: 'already_price',
                        render: (createEle, params) => {
                            return '￥' + params.row.already_price;
                        }
                    },
                    {
                        title: '待收金额',
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
                            const disable = params.row.status === 1 && params.row._confirm_count > 0 ? false : true;
                            const button_text = params.row.status === 2 ? '收款完成' : (params.row.status === 1 && params.row._confirm_count > 0 ? '确认收款' : '等待支付');
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
                                                this.current_receive_bill_id = params.row.id;
                                                this.getReList(params);
                                                this.receivemodel = true;
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
                                }, '收款历史')
                            ]);
                        }
                    }
                ]
            }
        },
        methods: {
            // 时间戳转时间字符串
            getTime (times) {
                if (times) {
                    var dateObj = new Date(times * 1000)
                    var Y = dateObj.getFullYear() + '-';
                    var M = (dateObj.getMonth()+1 < 10 ? '0'+(dateObj.getMonth()+1) : dateObj.getMonth()+1) + '-';
                    var D = dateObj.getDate() + ' ';
                    var h = dateObj.getHours() + ':';
                    var m = dateObj.getMinutes() + ':';
                    var s = dateObj.getSeconds();
                    return Y+M+D+h+m+s;
                } else {
                    return ''
                }
            },
            // 确认收款
            receiveConfirm (params) {
                this.$Modal.confirm({
                    title: '是否确认继续执行',
                    content: '<p>是否确认收款？</p>',
                    onOk: () => {
                        Util.ajax.post('/finance.finance_bill/confirm', {
                            batch_code:params.row.batch_code,
                            bill_id:params.row.bill_id
                        }).then(resp => {
                            this.$Message.success({
                                content: `收款成功！`,
                                duration: 3
                            });
                            this.reListData.splice(params.index, 1);
                            if (this.reListData.length == 0){
                                this.receivemodel = false;
                                this.$router.push({path: '/finance/receive'});
                                this.$refs.accReceivableTable.init();
                            }
                        })
                    },
                    onCancel: () => {}
                });
            },
            // 获取待确认列表
            getReList () {
              Util.ajax.post('/finance.finance_bill/batch_lists', {
                bill_id: this.current_receive_bill_id,
                role_type: 2,
                status: 1,
                limit:false,
                page:0,
                attrs:['type_text','method_text','status_text'],
                relations:['custom'],
                order: 'create_time DESC'
              }).then((resp) => {
                this.reListData = resp.data;
              })
            },
            // 获取收款历史列表
            getPiList () {
              Util.ajax.post('/finance.finance_bill/batch_lists', {
                bill_id: this.current_bill_id,
                role_type: 2,
                status: 2,
                limit:false,
                page:0,
                attrs:['type_text','method_text','status_text'],
                relations:['custom'],
                order: 'confirm_time DESC'
              }).then((resp) => {
                this.piListData = resp.data;
              })
            }
        },
        mounted () {
            if (this.$router.history.current.params.custom_id) {
                this.params = {
                    should_type: 1,
                    limit: 12,
                    page: 1,
                    order:'create_time DESC',
                    relations: ['custom', 'seller', 'order'],
                    custom_id: this.$router.history.current.params.custom_id
                }
            }
            this.tableLoad = thrgoTable
        }
    };
</script>

<style scoped>

</style>
