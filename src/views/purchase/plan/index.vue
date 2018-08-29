<template>
    <Content>
        <Row>
            <Col span="24">
            <Button type="primary" @click="add">创建采购计划</Button>
            </Col>

            <Col span="24" style="margin-bottom: 10px"></Col>

            <Col span="24">
            <thrgo-table
                    ref = "planTable"
                    :border="false"
                    path="/purchase/purchase_plan/lists"
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
        name: 'index',
        components: {
            thrgoTable,
            add
        },
        data() {
            return {
                columns: [
                    {
                        title: '采购名称',
                        key: 'name',
                        width: 200,
                        isFrozen: true
                    },
                    {
                        title: '预算',
                        key: 'amount'
                    },
                    {
                        title: '采购方式',
                        key: 'buy_type_text',
                        width: 120
                    },
                    {
                        title: '付款方式',
                        key: 'pay_type_text',
                        width: 120
                    },
                    {
                        title: '提交人',
                        key: 'operate_info.username',
                        width: 120,
                        render: (h, params) => {
                            return params.row.operate_info.realname || params.row.operate_info.username;
                        }
                    },
                    {
                        title: '提交时间',
                        sortable: true,
                        key: 'create_time',
                        width: 150
                    },
                    {
                        title: '状态',
                        width: 100,
                        isFrozen: true,
                        key: 'status',
                        filters: [
                            {
                                label: '未提交',
                                value: -99
                            },
                            {
                                label: '待审核',
                                value: 0
                            },
                            {
                                label: '待执行',
                                value: 1
                            },
                            {
                                label: '已挂起',
                                value: 2
                            },
                            {
                                label: '执行中',
                                value: 50
                            },
                            {
                                label: '已完成',
                                value: 99
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            return row.status === value;
                        },
                        render: (h, params) => {
                            return params.row.status_text;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 220,
                        fixed: 'right',
                        render: (h, params) => {
                            let buttons = [
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
                                }, '编辑'),
                            ];
                            switch(params.row.status) {
                                case -99:
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
                                                this.planSubmit(params)
                                            }
                                        }
                                    }, '提交'),
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'warning',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                           click: () => {
                                                this.planHang(params)
                                            }
                                        }
                                    }, '挂起'),
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                           click: () => {
                                                this.planDelete(params)
                                            }
                                        }
                                    }, '删除')
                                );
                                break;
                                case -1:
                                buttons.push(
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                           click: () => {
                                                this.planDelete(params)
                                            }
                                        }
                                    }, '删除')
                                );
                                break;
                                case 2:
                                    buttons.push(
                                        h('Button', {
                                            style: {
                                                margin: '0 5px'
                                            },
                                            props: {
                                                type: 'warning',
                                                size: 'small',
                                                icon: 'edit'
                                            },
                                            on: {
                                               click: () => {
                                                    this.planExecute(params)
                                                }
                                            }
                                        }, '继续'),
                                        h('Button', {
                                            style: {
                                                margin: '0 5px'
                                            },
                                            props: {
                                                type: 'error',
                                                size: 'small',
                                                icon: 'edit'
                                            },
                                            on: {
                                               click: () => {
                                                    this.planDelete(params)
                                                }
                                            }
                                        }, '删除')
                                    );
                                    break;
                                    case 0:
                                    buttons.push(
                                        h('Button', {
                                            style: {
                                                margin: '0 5px'
                                            },
                                            props: {
                                                type: 'warning',
                                                size: 'small',
                                                icon: 'edit'
                                            },
                                            on: {
                                               click: () => {
                                                    this.planReview(params)
                                                }
                                            }
                                        }, '审核'),
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
                    extra: ['operate_info','custom_info']
                }
            };
        },

        created() {

        },
        mounted (){
            
        },
        methods: {
            viewDetail (params) {
                this.$router.push({path: `/purchase/plan/add`, query: {plan_sn: params.row.plan_sn}})
            },
            // 采购计划提交
            planSubmit(params){
                this.$Modal.confirm({
                    title: '是否确认提交',
                    content: '<p>是否确认提交该采购计划？</p>',
                    onOk: () => {
                        Util.ajax.post('/purchase.purchase_plan/submit', {
                            plan_sn:params.row.plan_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `提交成功！`,
                                duration: 3
                            });
                            this.$refs.planTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            //采购计划挂起
            planHang(params){
                this.$Modal.confirm({
                    title: '是否确认挂起',
                    content: '<p>是否确认暂时挂起该采购计划？</p>',
                    onOk: () => {
                        Util.ajax.post('/purchase.purchase_plan/hang', {
                            plan_sn:params.row.plan_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `挂起成功！`,
                                duration: 3
                            });
                            this.$refs.planTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            //采购计划删除
            planDelete(params){
                this.$Modal.confirm({
                    title: '是否确认删除',
                    content: '<p>是否确认删除该采购计划，删除后无法恢复记录？</p>',
                    onOk: () => {
                        Util.ajax.post('/purchase.purchase_plan/delete', {
                            plan_sn:params.row.plan_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `删除成功！`,
                                duration: 3
                            });
                            this.$refs.planTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            //采购计划继续
            planExecute(params){
                this.$Modal.confirm({
                    title: '是否确认继续执行',
                    content: '<p>是否确认继续执行该采购计划？</p>',
                    onOk: () => {
                        Util.ajax.post('/purchase.purchase_plan/execute', {
                            plan_sn:params.row.plan_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `采购计划已继续执行！`,
                                duration: 3
                            });
                            this.$refs.planTable.init()
                        })
                    },
                    onCancel: () => {}
                });
            },
            //采购计划审核
            planReview(params){
                this.$Modal.confirm({
                    closable: true,
                    okText: '同意',
                    cancelText: '拒绝',
                    title: '采购计划审核',
                    content: '<p>是否确认该操作？</p>',
                    onOk: () => {
                        Util.ajax.post('/purchase.purchase_plan/review', {
                            plan_sn:params.row.plan_sn,
                            status:1
                        }).then(resp => {
                            this.$Message.success({
                                content: `采购计划已通过审核！`,
                                duration: 3
                            });
                            this.$refs.planTable.init()
                        })
                    },
                    onCancel: () => {
                        Util.ajax.post('/purchase.purchase_plan/review', {
                            plan_sn:params.row.plan_sn,
                            status:-1
                        }).then(resp => {
                            this.$Message.success({
                                content: `采购计划已拒绝！`,
                                duration: 3
                            });
                            this.$refs.planTable.init()
                        })
                    }
                });
            },
            // 采购计划弹窗
            add() {
                this.$router.push('/purchase/plan/add');
            }
        },

        watch: {}


    };
</script>

<style scoped>

</style>
