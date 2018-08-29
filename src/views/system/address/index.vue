<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="location"></Icon>
                地址管理
            </p>
            <div>
                <Row>
                    <Col span="24" style="margin-bottom: 10px"><Button type = "primary" @click = "addrNew">新增地址</Button></Col>
                    <Col span="24">
                    <thrgo-table
                            ref = "addrGrid"
                            :border="false"
                            path="/setting.address/lists"
                            :params="params"
                            :pagination="true"
                            :columns="addrGridCol"
                            :loading="true"
                    ></thrgo-table>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue'
    import addOrNew from './addOrNew.vue'
    import Util from '@/libs/util'
    export default {
        name: 'index',
        components: {thrgoTable, addOrNew},
        data () {
            return {
                // 表格字段数据
                addrGridCol: [
                    {
                        title: '收货人',
                        key: 'name'
                    },
                    {
                        title: '所在地区',
                        key: 'merger_name',
                        render: (createEle, params) => {
                            return params.row.area_info.merger_name
                        }
                    },
                    {
                        title: '详细地址',
                        key: 'address'
                    },
                    {
                        title: '邮编',
                        key: 'zipcode'
                    },
                    {
                        title: '电话/手机',
                        key: 'mobile'
                    },
                    {
                        title: '操作',
                        width: 260,
                        key: 'action',
                        render: (createEle, params) => {
                            var buttons = [];
                            buttons.push(
                                createEle('Button', {
                                    style: {
                                        // margin: '0 5px'
                                    },
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        icon: 'edit'
                                    },
                                    on: {
                                        click: () => {
                                            this.addrEdit(params)
                                        }
                                    }
                                }, '修改'),
                            )
                            buttons.push(
                                createEle('span', {
                                    style: {
                                        margin: '0 5px'
                                    }
                                }, '|'),
                            )
                            buttons.push(
                                createEle('Button', {
                                    style: {
                                        // margin: '0 5px'
                                    },
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        icon: 'trash-a'
                                    },
                                    on: {
                                        click: () => {
                                            this.addrDel(params)
                                        }
                                    }
                                }, '删除'),
                            )
                            if (params.row.isdefault === 0) {
                                buttons.push(
                                    createEle('Button', {
                                        style: {
                                            marginLeft: '5px'
                                        },
                                        props: {
                                            type: 'warning',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                this.setDefault(params)
                                            }
                                        }
                                    }, '设为默认'),
                                )
                            } else {
                                buttons.push(
                                    createEle('span', {
                                        style: {
                                            marginLeft: '5px'
                                        },
                                        /* props: {
                                            type: 'warning',
                                            size: 'small',
                                            icon: 'edit'
                                        }, */
                                        /* on: {
                                            click: () => {
                                                this.setDefault(params)
                                            }
                                        } */
                                    }, '默认地址'),
                                )
                            }
                            return createEle('div', {}, buttons)
                        }
                    }
                ],
                // 表格数据
                addrGridData: [],
                // 参数
                params: {
                    limit: 12,
                    page: 1
                },
                // 新增或修改状态（1：修改，0：新增）
                newOrModStatus: 0,
                // 新增地址缓存数据
                newAddrBufferData: {},
                // 修改地址缓存数据
                modAddrBufferData: {},
                // 新增或编辑地址表单对象
                formRef: {
                    form: Object
                }
            }
        },

        methods: {
            // 新增地址
            addrNew () {
                // debugger
                var me = this
                this.newOrModStatus = 0
                this.$Modal.confirm({
                  title: '新增地址',
                  width: '60%',
                  // closable: true,
                  onOk: this.submitForm,
                  onCancel: this.cancelForm,
                  isForm: true,
                  render: (createEle) => {
                    return createEle(addOrNew, {
                      props: {
                        actionStatus: 0,
                        addrData: me.newAddrBufferData,
                        formRef: me.formRef,
                      }
                    })
                  }
                })
            },
            // 编辑地址
            addrEdit (params) {
                // debugger
                // var kk = Object.getOwnPropertyNames(params.row)
                var paramsBuffer = JSON.parse(JSON.stringify(params))
                paramsBuffer.row.district_id = paramsBuffer.row.district_id.split('/')// [Number(this.params.district_id)]
                for (var i = 0; i < paramsBuffer.row.district_id.length; i++) {
                    paramsBuffer.row.district_id[i] = Number(paramsBuffer.row.district_id[i])
                }
                // debugger
                var me = this
                this.newOrModStatus = 1
                this.modAddrBufferData = paramsBuffer.row
                this.$Modal.confirm({
                  title: '编辑地址',
                  width: '60%',
                  // closable: true,
                  onOk: this.submitForm,
                  onCancel: this.cancelForm,
                  // isForm: true,
                  render: (createEle) => {
                    return createEle(addOrNew, {
                      props: {
                        actionStatus: 1,
                        addrData: paramsBuffer.row,
                        formRef: me.formRef,
                        addrParams: paramsBuffer
                      }
                    })
                  }
                })
            },
            // 删除地址
            addrDel (params) {
                if (params.row.isdefault === 1) {
                    this.$Message.error({
                        content: '默认地址不能删除！',
                        duration: 3
                    })
                    return
                }
                Util.ajax.post('/setting.address/destroy', {
                    id: params.row.id
                }).then(resp => {
                    this.$Message.success({
                        content: '删除成功！',
                        duration: 3
                    })
                    this.$refs.addrGrid.init()
                })
            },
            // 设置默认地址
            setDefault (params) {
                // debugger
                Util.ajax.post('/setting.address/set_default', {
                    id: params.row.id
                }).then(resp => {
                    this.$refs.addrGrid.init()
                    this.$Message.success({
                        content: '设置成功！',
                        duration: 3
                    })
                })
            },
            // 提交表单
            submitForm () {
                var me = this
                debugger
                console.log(arguments)
                var form = me.formRef.form
                form.validate(valid => {
                  debugger
                  if (valid) {
                    if (me.newOrModStatus === 1) {
                      Util.ajax.post('/setting.address/save', {
                        id: me.modAddrBufferData.id,
                        name: me.modAddrBufferData.name,
                        mobile: me.modAddrBufferData.mobile,
                        district_id: me.modAddrBufferData.district_id[me.modAddrBufferData.district_id.length - 1],
                        address: me.modAddrBufferData.address,
                        zipcode: me.modAddrBufferData.zipcode,
                        status: me.modAddrBufferData.status,
                        isdefault: me.modAddrBufferData.isdefault
                      }).then((resp) => {
                        //debugger
                        this.$Message.success({
                          content: `修改成功！`,
                          duration: 3
                        })
                        this.$refs.addrGrid.init()
                        this.modAddrBufferData = {}
                        /* for (var key in this.modAddrBufferData) {
                            delete this.modAddrBufferData[key]
                        } */
                        // this.$Modal.remove()
                      })
                    } else if (this.newOrModStatus === 0) {
                      Util.ajax.post('/setting.address/create', {
                        // id: this.newUserBufferData.id, //m
                        name: me.newAddrBufferData.name,
                        mobile: me.newAddrBufferData.mobile,
                        district_id: me.newAddrBufferData.district_id[me.newAddrBufferData.district_id.length - 1],
                        address: me.newAddrBufferData.address,
                        zipcode: me.newAddrBufferData.zipcode,
                        status: 1,
                        isdefault: 0
                      }).then((resp) => {
                        //debugger
                        this.$Message.success({
                          content: `新增成功！`,
                          duration: 3
                        })
                        this.$refs.addrGrid.init()
                        this.newAddrBufferData = {}
                        // this.$Modal.remove()
                      })
                    }
                  } else {
                    this.$Message.error({
                      content: `表单填写错误！请重新填写！`,
                      duration: 3
                    })
                  }
                })
                console.log(this.newUserBufferData)
            },
            // 取消提交表单
            cancelForm () {
                // debugger
            } 
        },

        mounted () {
            
        }
    }
</script>

<style scoped>

</style>