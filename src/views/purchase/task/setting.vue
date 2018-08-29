<template>
    <Content>
        <Row>
            <Col span="24">
            </Col>

            <Col span="24" style="margin-bottom: 10px"></Col>

            <Col span="24">
            <thrgo-table
                    :border="false"
                    path="/purchase/purchase_buyer/lists"
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

    export default {
        name: 'index',
        components: {
            thrgoTable
        },
        data () {
            return {
                columns: [
                    {
                        title: '采购品类',
                        key: 'category_info.name',
                        width: 700,
                        render: (h, params) => {
                            return params.row.category_info.name;
                        }
                    },
                    {
                        title: '分工负责人',
                        key: 'user_info.username',
                        width: 700,
                        render: (h, params) => {
                            return params.row.user_info.username;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 300,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('ButtonGroup', [
                             
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
                                            console.log(params);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                params: {
                    limit: 12,
                    page: 1,
                    extra: []
                }
            };
        },

        created () {
        },

        methods: {
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
