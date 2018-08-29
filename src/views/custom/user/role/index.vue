<template>
    <Content>
        <!-- 添加角色弹窗 -->
        <Modal v-model="addOrModModel" :closable="false" :mask-closable="false"
               :title="addOrModModelStatus === 1 ? '添加角色' : '修改角色'" width='600'>
            <div class="departmentForm">
                <Form :model="addRoleFormData" :rules="deviceRule"
                      :label-width="80">
                    <FormItem prop="name" label="名称">
                        <Input v-model="addRoleFormData.name" placeholder="请输入角色名称"></Input>
                    </FormItem>

                    <FormItem prop="rules" label="权限">
                        <Tree :data="data1" ref="rules" show-checkbox></Tree>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="doCancelDep">取消</Button>
                <Button type="primary" @click="doSaveDep">保存</Button>
            </div>
        </Modal>

        <Row>
            <Col span="24">
                <Button type="primary" @click="addOrModModel = true">添加角色</Button>
            </Col>

            <Col span="24" style="margin-bottom: 10px"></Col>

            <Col span="24">
                <thrgo-table
                    :border="false"
                    path="/custom/user_role/lists"
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
        name: 'index',
        components: {
            thrgoTable
        },
        data() {
            return {
                addOrModModel: false,
                addOrModModelStatus: 1,
                addRoleFormData: {
                    name: '',
                    rules:''
                },
                modRoleFormData: {
                    name: '',
                    rules:''
                },
                depFormData: {
                    name: '',
                    rules:''
                },
                deviceRule: {
                    name: [
                        { required: true, message: '角色名称不能为空', trigger: 'blur' }
                    ]
                },
                data1: [],
                no_data: [],
                role_id:'',
                columns: [
                    {
                        title: '角色名称',
                        key: 'name'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 220,
                        fixed: 'right',
                        render: (h, params) => {
                            if(params.row.type == '' || params.row.type == null){
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
                                                Util.ajax.post('/custom.user_role/detail', {
                                                id: params.row.id,
                                                achieves:['all_router_info'],
                                                is_tree:1
                                              }).then((resp) => {
                                                this.addOrModModelStatus = 0;
                                                this.data1 = resp.all_router_info;
                                                this.addRoleFormData.name = resp.name
                                                this.role_id = resp.id;
                                                this.addOrModModel = true;
                                              })

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
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                this.$Modal.confirm({
                                                    title: '提示:',
                                                    content: '<p>您确定要删除这条数据吗?</p>',
                                                    onOk: () => {
                                                        this.delRole(params)
                                                    },
                                                    onCancel: () => {
                                                        this.$Message.info('取消成功');
                                                    }
                                                });
                                            }
                                        }
                                    }, '删除')

                                ];

                                return h('div', buttons);
                            }
                        }
                    }
                ],
                params: {
                    limit: 12,
                    page: 1
                }
            };
        },
        mounted(){
            var currentCustomInfo=JSON.parse(localStorage.currentCustomInfo);
            Util.ajax.post('/custom.user_role/detail', {
                id: currentCustomInfo.role_id,
                achieves:['router_info'],
                is_tree:1
              }).then((resp) => {
                this.data1 = resp.router_info;
                this.no_data = this.data1;
              })
        },
        methods: {
            // 表格单行删除角色
            delRole (params) {
              Util.ajax.post('/custom.user_role/destroy', {
                ids: `${params.row.id}`
              }).then((resp) => {
                this.$Message.success({
                  content: `删除成功`,
                  duration: 3
                })
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
              })
            },

            // 保存角色新增或更改
                doSaveDep() {
                  var me = this;
                  var rules_info = this.$refs.rules.getCheckedNodes();
                  var rules = '';
                  rules_info.forEach(function(item){
                        rules += item.id+',';
                  });

                  rules = rules.substr(0, rules.length - 1);

                  if (this.addOrModModelStatus === 1) {
                    Util.ajax
                      .post("/custom.user_role/create", {
                        name: this.addRoleFormData.name,
                        rules: rules
                      })
                      .then(resp => {
                        me.addOrModModel = false;
                        this.addRoleFormData.name = "";
                        this.$Message.success({
                          content: `新增成功`,
                          duration: 3
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                      });
                  } else if (this.addOrModModelStatus === 0) {
                    Util.ajax
                      .post("/custom.user_role/save", {
                        id: this.role_id,
                        name: this.addRoleFormData.name,
                        rules: rules
                      })
                      .then(resp => {
                        me.addOrModModel = false;
                        this.depFormData.name = "";
                        this.$Message.success({
                          content: `修改成功`,
                          duration: 3
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                      });
                  }
                },

            // 取消保存角色新增或更改
            doCancelDep() {
              this.addOrModModel = false;
              this.addRoleFormData = {};
              this.data1 = this.no_data;
              this.role_id = '';
            },

        },

        watch: {}


    };
</script>

<style scoped>

</style>
