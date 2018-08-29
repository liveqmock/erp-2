<template>
<div class = "userList">
  <Content>
    <Card>
      <Row>
        <Col span = "24">
          <Button type="primary" class = "newBtn" @click = "newUser">新增用户</Button>
        </Col>
      </Row>
      <Row class = "newBtn">
        <Col span = "24">
          <Table stripe border :columns = "userListCol" :data="userListData" :height = "getGridHeight()" @on-selection-change = "userGridSelected"></Table>
        </Col>
      </Row>
      <Row>
        <Col span = "6">
          <Button type = "primary" :disabled = "userSelectedData.length === 0" @click = "userBatchDel">删除勾选所有岗位</Button>
        </Col>
        <Col span = "18" style = "text-align: right;">
          <Page :total="pagination.total" :current="pagination.current" :page-size = "pagination.perPage" @on-change="changePage" show-elevator show-total></Page>
        </Col>
      </Row>
    </Card>
  </Content>
</div>
</template>
<script>
import userAdd from "./add.vue"
import Util from "@/libs/util"

export default {
  name: "custom_user_index",
  data () {
    return {
      // 分页数据
      pagination: {
        total: 0,
        current: 1,
        last: 0,
        perPage: 12
      },
      formRef: {
        form: Object
      },
      // 新增用户表单验证状态
      addFormValidateStatus: true,
      // modal实例
      newUserModal: '',
      // 用户表格多选数据
      userSelectedData: [],
      // 用户信息新增或编辑状态,0:新增，1:修改
      newOrModStatus: 1,
      // 新增用户信息临时存储
      newUserBufferData: {},
      // 修改用户信息临时存储数据
      modUserBufferData: {},
      // 用户表格列字段数据
      userListCol: [
        {
          type: 'selection',
          width: 50,
          className: 'slelection',
          align: 'center',
          fixed: "left"
        },
        {
          title: "用户名",
          key: "username",
          width: 115,
          fixed: "left"
        },
        {
          title: "昵称",
          key: "nickname"
        },
        {
          title: "部门",
          key: "branch_name"
        },
        {
          title: "岗位",
          key: "post_name"
        },
        {
          title: "姓名",
          key: "realname"
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "角色",
          key: "role_name"
        },
        {
          title: "状态",
          key: "status",
          filters: [
            {
              label: "启用",
              value: 1
            },
            {
              label: "禁用",
              value: 0
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            return row.status === value
          },
          render: (createEle, params) => {
            //debugger
            return createEle('span', {}, params.row.status === 1 ? '启用' : '禁用')
          }
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          fixed: "right",
          width: 150,
          // className: "operate",
          render: (createEle, params) => {
            if (params.row.modelRow) {
              return createEle('div', {
                style: {
                    color: '#2d8cf0',
                    fontSize: '25px'
                  },
              }, [
                createEle('Icon', {
                  style: {
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'plus'
                  },
                  nativeOn: {
                    click: () => {
                      this.newUser(params)
                    }
                  }
                })
              ])
            } else {
              if(params.row.role_info.type != 'admin'){
                  return createEle("div", [
                  createEle(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small",
                        icon: "edit"
                      },
                      style: {
                        marginRight: '20px'
                      },
                      nativeOn: {
                        click: () => {
                          this.modUser(params)
                        }
                      }
                    },
                    "编辑"
                  ),
                  createEle(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small",
                        icon: "trash-a"
                      },
                      nativeOn: {
                        click: () => {
                          this.delUser(params)
                        }
                      }
                    },
                    "删除"
                  )
                ])
              } else {
                return createEle("div", [
                  createEle(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small",
                        icon: "edit"
                      },
                      style: {
                        marginRight: '20px'
                      },
                      nativeOn: {
                        click: () => {
                          this.modUser(params)
                        }
                      }
                    },
                    "编辑"
                  )
                ])
              }
            }
          }
        }
      ],
      // 用户表格行数据
      userListData: []
    }
  },
  /* computed: {
    isCurrentUser () {
      if (this.)
    }
  }, */
  methods: {
    // 获取表格高度
    getGridHeight () {
      return window.innerHeight - 255
    },
    // 用户表格多选事件
    userGridSelected (selectedAll, selectedLast) {
      //debugger
      this.userSelectedData = selectedAll
    },
    // 用户表格批量删除
    userBatchDel () {
      var ids = ''
      for (var i = 0; i < this.userSelectedData.length; i++) {
        if (this.userSelectedData[i].id) {
          if (i === this.userSelectedData.length - 1) {
            ids += `${String(this.userSelectedData[i].id)}`
          } else {
            ids += `${String(this.userSelectedData[i].id)},`
          }
        }
      }
      //debugger
      if (ids === '') {
        return
      }
      Util.ajax.post('/custom.user/destroy', {
        ids
      }).then((resp) => {
        //debugger
        this.getUserList()
        this.$Message.success({
          content: `删除成功`,
          duration: 3
        })
      })
    },
    // 用户表格单行删除
    delUser (params) {
      //debugger
      Util.ajax.post('/custom.user/destroy', {
        ids: `${params.row.id}`
      }).then((resp) => {
        //debugger
        this.$Message.success({
          content: `删除成功`,
          duration: 3
        })
        this.getUserList()
      })
    },
    // 获取用户列表
    getUserList () {
      //debugger
      Util.ajax.post('/custom.user/lists', {
        custom_id: 124,
        username: '',
        status: 0,
        relations: ['post_info', 'branch_info', 'role_info'],
        limit: 12,
        page: this.pagination.current
      }).then((resp) => {
        //debugger
        resp.data.forEach(elem => {
          elem.post_name = elem.post_info ? elem.post_info.name : ''
          elem.branch_name = elem.branch_info ? elem.branch_info.name : ''
          elem.role_name = elem.role_info ? elem.role_info.name : ''
        })
        var userList = JSON.parse(JSON.stringify(resp.data))
        userList.forEach(elem => {
          elem.isEdit = false
          elem.modelRow = false
        })
        /* userList.push({
          isEdit: false,
          modelRow: true
        }) */
        this.userListData = userList
        this.pagination.total = resp.total
        this.pagination.current = resp.current_page
        this.pagination.last = resp.last_page
      })
    },
    // 取消提交表单
    cancelForm () {
      this.newUserBufferData = {}
    },
    // 提交表单数据数据
    submitForm () {
      var me = this
      debugger
      console.log(arguments)
      var form = this.formRef.form
      console.log(this.modUserBufferData)
      form.validate(valid => {
        debugger
        if (valid) {
          if (this.newOrModStatus === 1) {
            Util.ajax.post('/custom.user/save', {
              id: this.modUserBufferData.id, //m
              // username: this.modUserBufferData.username,  // m
              // password: this.modUserBufferData.password,  // m
              mobile: this.modUserBufferData.mobile,       // m
              custom_id: this.modUserBufferData.custom_id,// m
              branch_id: this.modUserBufferData.branch_id, // m
              post_id: this.modUserBufferData.post_id,     // m
              role_id: this.modUserBufferData.role_id,      // m
              nickname: this.modUserBufferData.nickname,
              email: this.modUserBufferData.email,
              avatar: this.modUserBufferData.avatar,
              realname: this.modUserBufferData.realname,
              status: this.modUserBufferData.status
            }).then((resp) => {
              //debugger
              this.getUserList()
              this.$Modal.remove()
            })
          } else if (this.newOrModStatus === 0) {
            Util.ajax.post('/custom.user/add', {
              // id: this.newUserBufferData.id, //m
              username: this.newUserBufferData.username,  // m
              password: this.newUserBufferData.password,  // m
              mobile: this.newUserBufferData.mobile,       // m
              custom_id: window.localStorage['currentCustomId'],// this.newUserBufferData.custom_id,// m
              branch_id: this.newUserBufferData.branch_id, // m
              post_id: this.newUserBufferData.post_id,     // m
              role_id: this.newUserBufferData.role_id,      // m
              nickname: this.newUserBufferData.nickname,
              email: this.newUserBufferData.email,
              avatar: this.newUserBufferData.avatar,
              realname: this.newUserBufferData.realname,
              status: this.newUserBufferData.status
            }).then((resp) => {
              //debugger
              this.getUserList()
              this.newUserBufferData = {}
              this.$Modal.remove()
            })
          }
        } else {
          this.$Message.error({
            content: `表单填写错误！请重新填写！`,
            duration: 3
          })
        }
      })
      debugger
      if (this.newOrModStatus === 1) {
        this.modUserBufferData = {}
      } else {
        this.newUserBufferData = {}
      }
    },
    // 修改用户
    modUser (params) {
      //debugger
      var me = this
      this.newOrModStatus = 1
      this.modUserBufferData = JSON.parse(JSON.stringify(params.row))
      if (this.modUserBufferData.id === Number(localStorage['user_id'])) {
        this.modUserBufferData.isCurrentUser = true
      } else {
        this.modUserBufferData.isCurrentUser = false
      }
      this.$Modal.confirm({
        title: '修改用户',
        width: '60%',
        // closable: true,
        // loading: true,
        onOk: this.submitForm,
        render: (createEle) => {
          //debugger
          return createEle(userAdd, {
            props: {
              actionStatus: 1,
              formRef: me.formRef,
              userFormData: this.modUserBufferData,
              userFormParams: params
            }
          })
        }
      })
    },
    // 新增用户
    newUser () {
      //debugger
      var me = this
      this.newOrModStatus = 0
      this.newUserBufferData.isCurrentUser = false
      this.$Modal.confirm({
        title: '新增用户',
        width: '60%',
        // closable: true,
        onOk: this.submitForm,
        onCancel: this.cancelForm,
        isForm: true,
        render: (createEle) => {
          return createEle(userAdd, {
            props: {
              formRef: me.formRef,
              actionStatus: 0,
              userFormData: me.newUserBufferData,
              // userFormParams: params
            }
            /* on: {
              input: (val) => {
                this.value = val
              }
            } */
          })
        }
      })
    },
    // 分页跳转
    changePage (page) {
      this.pagination.current = page
      this.getUserList()
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>
<style lang="less">
  @import "./index.less";
  .ivu-modal {
    top: 70px;
  }
</style>


