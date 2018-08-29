<template>
    <Content>
        <Row>
            <Col span="3">
            <Card :bordered="false" dis-hover>
                <h4>角色列表</h4>
                <ul>
                    <li v-for="role in roles" @click="loadUsers">{{role.name}}</li>
                </ul>
            </Card>
            </Col>
            <Col span="21">
            <thrgo-table
                    :border="false"
                    size="small"
                    :loading="loading"
                    path="/custom.user/lists"
                    :params="userParams"
                    :pagination="true"
                    :columns="userColumns"
                    :multiple="multiple"

                    @on-selection-callback="handleSelectionCallback"
            ></thrgo-table>
            </Col>
        </Row>
    </Content>
</template>

<script>
    import Util from '@/libs/util';
    import thrgoTable from '@/views/components/thrgo/table/table.vue';

    export default {
        name: "userRoleSelect",
        components: {
            thrgoTable
        },
        props: {
            // 多选
            multiple: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                loading: true,
                roles: [],
                userParams: {
                    limit: 10,
                    page: 1
                },
                userColumns: [
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '编码',
                        key: 'localsn'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    }
                ]
            };
        },

        mounted() {
            this.loadRoles();

            if(this.multiple === true) {
                this.userColumns.unshift({
                    type: 'selection',
                    width: 60,
                    align: 'center'
                });
            }


        },

        methods: {
            loadRoles() {
                Util.ajax.post('/custom.user_role/lists', {
                    custom_id: 1
                }).then((res) => {
                    this.roles = res;
                });
            },

            loadUsers() {
                Util.ajax.post('/custom.user_role/lists', {
                    custom_id: 1
                }).then((res) => {
                    this.roles = res;
                });
            },

            handleSelectionCallback(selection) {
                this.$emit('on-callback', selection);
            }
        }

    }
</script>

<style scoped>

</style>
