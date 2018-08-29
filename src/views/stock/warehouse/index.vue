<style lang="less" scoped>
@import '../../../styles/common.less';
</style>

<template>
    <Content>
        <Row class="margin-bottom-10">
            <Col span="24">
            <Button type="primary" @click="add">添加库房</Button>
            <Modal
                    title='添加库房'
                    width='40%'
                    v-model='modalWarehouseForm'
                    :loading='loading'
                    @on-ok="doSubmit"
            >
                <warehouse-form ref="formModal" :item="formItem"/>
            </Modal>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <thrgo-table
                    ref = "warehouseTable"
                    :border="false"
                    path="/stock.stock_warehouse/lists"
                    :params="params"
                    :pagination="false"
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
    import warehouseForm from './form.vue';

    export default {
        name: 'stock_warehouse_index',
        components: {
            thrgoTable,
            warehouseForm
        },
        data () {
            return {
                isAdd: false,
                modalWarehouseForm: false,
                formItem: {},

                loading: true,
                params: {
                    relations: ['area'],
                    order:'create_time DESC'
                },
                columns: [
                    {
                        title: '仓库名称',
                        key: 'name'
                    },
                    {
                        title: '联系人',
                        key: 'contact'
                    },
                    {
                        title: '联系电话',
                        key: 'telephone'
                    },
                    {
                        title: '所在地区',
                        key: 'area.merger_name',
                        render: (h, params) => {
                            return params.row.area ? params.row.area.merger_name : '-';
                        }
                    },
                    {
                        title: '详细地址',
                        key: 'address'
                    },
                    {
                        title: '是否默认',
                        key: 'default',
                        render: (h, params) => {
                            const default_text = params.row.default == 1 ? '是' : '否';
                            const color = params.row.default === 1 ? 'blue' : '';
                            return h('div', {
                                style: {
                                    color: color
                                }
                            }, default_text);
                        }
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
                        className: 'operate',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'edit'
                                    },
                                    on: {
                                            click: () => {
                                                this.edit(params);
                                            }
                                        }
                                }, '编辑'),
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'trash-a'
                                    },
                                    on: {
                                            click: () => {
                                                this.doDelete(params);
                                            }
                                        }
                                }, '删除'),
                            ]);
                        }
                    }
                ]
            };
        },
        methods:{
            add() {
                this.formItem = {
                    default:0
                };
                this.modalWarehouseForm = true;
                this.isAdd = true;
            },

            edit(params) {
                this.formItem = params.row;
                this.modalWarehouseForm = true;
                this.isAdd = false;
            },

            doDelete(params) {
                this.$Modal.confirm({
                    title: '是否确认继续执行',
                    content: '<p>是否确认删除？</p>',
                    onOk: () => {
                        Util.ajax.post('stock.stock_warehouse/delete', {
                            id: params.row.id
                        }).then(resp => {
                            this.$Message.success({
                                content: `删除成功`,
                                duration: 3
                            });
                            this.modalWarehouseForm = false;
                            this.$refs.warehouseTable.init();
                        })
                    },
                    onCancel: () => {}
                });
            },

            doSubmit() {
                this.$refs.formModal.$refs.form.validate((valis => {
                })).then((res) => {
                    if (res === false) {
                        this.loading = false;
                        this.$nextTick(() => {
                            this.loading = true;
                        });
                        return;
                    } else {
                       
                        let params = this.$refs.formModal.$refs.form.model;
                        if (this.isAdd === true){
                            Util.ajax.post('stock.stock_warehouse/create', params)
                            .then((res) => {
                                this.$Message.success({
                                    content: '仓库添加成功',
                                    duration: 3
                                });
                                this.modalWarehouseForm = false;
                                this.$refs.warehouseTable.init();
                            });
                        }else{
                            delete params.create_time
                            delete params.update_time
                            delete params.delete_time
                            Util.ajax.post('stock.stock_warehouse/save', params)
                            .then((res) => {
                                this.$Message.success({
                                    content: '仓库编辑成功',
                                    duration: 3
                                });
                                this.modalWarehouseForm = false;
                                this.$refs.warehouseTable.init();
                            });
                        }
                    }
                })
            }
        },
        created () {

        }
    };
</script>

<style scoped>

</style>