<template>
    <Content>
        <Row>
            <Col span="24" style="margin-bottom: 10px"></Col>

            <Col span="24">
            <thrgo-table
                    ref = "taskTable"
                    :border="false"
                    path="/purchase/purchase_task/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                    :loading="true"
            ></thrgo-table>
            </Col>
        </Row>
           <Modal v-model="planmodel" title="计划详情"
       > 
        <p>创建时间：{{create_time}}</p>
        <p>计划名称：{{name}}</p>
        <p>工单号:{{task_sn}}</p>
        <p>支付方式：{{pay_type_text}}</p>
        <p>状态：{{status_text}}</p>
    </Modal>
    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import Util from '@/libs/util';
    export default {
        name: 'index',
        components: {
            thrgoTable
        },
        data () {
            return {
                planmodel:false,
                task_sn:'',
                pay_type_text:'',
                create_time:'',
                name:'',
                status_text:'',
                columns: [
                    {
                        title: '任务名称',
                        key: 'name',
                        fixed: 'left',
                        width: 300
                    },
                    {
                        title: '采购方式',
                        key: 'buy_type_text',
                        width: 160
                    },
                    {
                        title: '支付方式',
                        key: 'pay_type_text',
                        width: 160
                    },
                    {
                        title: '开始时间',
                        sortable: true,
                        key: 'startline',
                        width: 180,
                        render: (h, params) => {
                            return params.row.startline || '';
                        }
                    },
                    {
                        title: '截止时间',
                        sortable: true,
                        key: 'deadline',
                        width: 180,
                        render: (h, params) => {
                            return params.row.deadline || '';
                        }
                    },
                    {
                        title: '确认时间',
                        sortable: true,
                        key: 'confirm_time',
                        width: 180,
                        render: (h, params) => {
                            return params.row.confirm_time || '';
                        }
                    },
                    {
                        title: '完成时间',
                        sortable: true,
                        key: 'finish_time',
                        width: 180,
                        render: (h, params) => {
                            return params.row.finish_time || '';
                        }
                    },
                    {
                        title: '状态',
                        width: 100,
                      
                        key: 'status',
                        filters: [
                            {
                                label: '待确认',
                                value: 0
                            },
                            {
                                label: '采购中',
                                value: 1
                            },
                            {
                                label: '已完成',
                                value: 2
                            },
                            {
                                label: '已拒绝',
                                value: -1
                            },
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
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
                        width: 280,
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
                                          this.task_sn = params.row.task_sn  
                                        //   this.gddetail();
                                        //   this.planmodel= true;
                                          this.$router.push({
                                              name: 'purchase_order_detail',
                                              query: {
                                                  task_sn: params.row.task_sn,
                                                  status: params.row.status
                                              }
                                          })
                                        }
                                    }

                                }, '详情'),
                            ];
                            switch(params.row.status) {
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
                                                this.confirm(params)
                                        }
                                    }
                                    }, '确认'),
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
                    extra: ['user_info']
                }
            };
        },

        created () {
        },

        methods: {
             gddetail(){
                Util.ajax.post('/purchase/purchase_task/detail', {
                    task_sn:this.task_sn
                }).then((res) =>{
                    this.pay_type_text= res.pay_type_text; 
                    this.status_text= res.status_text; 
                    this.create_time= res.create_time; 
                    this.name= res.name; 
                }, function(err) {

                })
             },
              //同意
            confirm(params){
                this.$Modal.confirm({
                    title: '是否确认执行',
                    content: '<p>是否确认同意执行该采购工单？</p>',
                    onOk: () => {
                        Util.ajax.post('/purchase.purchase_task/confirm', {
                            task_sn:params.row.task_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `采购工单已确认！`,
                                duration: 3
                            });
                            this.$refs.taskTable.init();
                        })
                    },
                    onCancel: () => {}
                });
            },
            //拒绝
            refuse(params){
                this.$Modal.confirm({
                    title: '是否确认拒绝',
                    content: '<p>是否确认拒绝执行该采购工单？</p>',
                    onOk: () => {
                        Util.ajax.post('/purchase.purchase_task/refuse', {
                            task_sn:params.row.task_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `采购工单已拒绝！`,
                                duration: 3
                            });
                            this.$refs.taskTable.init();
                        })
                    },
                    onCancel: () => {}
                });
            },
            add () {
                this.params.limit = 24;
            }
        },

        watch: {
        }


    };
</script>

<style scoped>

</style>
