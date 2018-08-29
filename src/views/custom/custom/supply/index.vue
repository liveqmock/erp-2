<template>
  <div class = "supplyManage">
    <Content>
      <!-- 添加供应商分组弹窗 -->
      <Modal v-model="addOrModModel" :closable="false" :mask-closable="false"
             :title="addOrModSupGroupStatus === 1 ? '添加供应商分组' : '修改供应商分组'" width='300'>
          <div class="supplierGroupForm">
              <Form :model="addOrModSupGroupStatus === 1 ? addSupGroupFormData : modSupGroupData" :rules="deviceRule"
                    :label-width="80">
                  <FormItem prop="name" label="分组名称">
                      <!-- <Input v-model="addOrModModelStatus === 1 ? addDepFormData.name : modDepFormData.name" placeholder="请输入部门名称" @on-change = "change"></Input> -->
                      <Input v-model="supGroupFormData.name" placeholder="请输入分组名称" ></Input>
                  </FormItem>
              </Form>
          </div>
          <div slot="footer">
              <Button type="text" @click="doCancelGroup">取消</Button>
              <Button type="primary" @click="doSaveGroup">保存</Button>
              <!-- <span class = "btnMy" @click = "cancelNewFarm">取消</span><span class = "btnMy" @click = "saveNewFarm">保存</span> -->
          </div>
      </Modal>
      <Card>
        <Row :gutter = "4">
          <Col span="4">
            <Tree :data="supplierGroups" @on-select-change = "treeNodeClick" :render="renderContent"></Tree>
          </Col>
          <Col span = "20">
            <Row class = "marginBottom">
              <Col span = "18">
                <Row>
                  <Col span = "6"><Input v-model = "supQueryName" placeholder="输入名字查询"></Input></Col>
                  <Col span = "2" offset = "0.1"><Button type = "primary"  @click = "querySupplier">查询</Button></Col>
                  <Col span = "3" offset = "0.1"><Button type = "primary"  @click = "cleanQuerySupplier">清空</Button></Col>
                </Row>
              </Col>
              <Col span = "6" class = "colRight">
                <Dropdown  trigger = "click" @on-click = "changeGroup">
                  <Button type="primary" :disabled = "gridSelected.length === 0 || gridSelected.length > 1">
                      移动至分组
                      <Icon type="arrow-down-b"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                      <DropdownItem v-for = "(item, index) in supplierDropMenu" :key="index" :disabled = "item.id === selectedNodeId" :name = "item.id">{{item.name}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown >
                <Button type = "primary" @click = "newSupplier">添加供应商</Button>
              </Col>
            </Row>
            <Row>
              <Col span = "24">
                <Table stripe border :columns = "supplierListCol" :data="supplierListData" :height = "getGridHeight()" @on-selection-change = "gridSelect"></Table>
              </Col>
              <Col span = "24" style = "text-align: right; margin-top: 10px;">
                <Page :total="pagination.total" :current="pagination.current" :page-size = "pagination.perPage" @on-change="changePage" show-elevator show-total></Page>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Content>
  </div>
</template>
<script>
import Util from '@/libs/util'
import supplierAdd from './add.vue'

export default {
  name: 'index',
  data () {
    return {
      // 分页数据
      pagination: {
        total: 0,
        current: 1,
        last: 0,
        perPage: 12
      },
      // 供应商分组弹窗状态
      addOrModModel: false,
      // 添加或修改供应商分组状态 0新增 1修改
      addOrModSupGroupStatus: 1,
      supGroupFormData: {
        name: ""
      },
      // 新增供应商分组数据绑定集
      addSupGroupFormData: {
        name: ""
      },
      // 修改供应商分组数据绑定集
      modSupGroupData: {
        name: ""
      },
      // 供应商查询名绑定
      supQueryName: '',
      // 当前点击选中节点id
      selectedNodeId: '',
      // 当前节点数据对象
      currentNodeInfo: {},
      // 新增或修改供应商状态 0新增,1修改
      newOrModStatus: 0,
      // 表格已选择行
      gridSelected: [],
      // 条件查询btn状态, false未输入查询，true已输入
      queryBtnStatus: false,
      // 移动分组下拉菜单数据
      supplierDropMenu: [],
      // 当前选中行数据id集合
      gridSelectedId: [],
      deviceRule:{},
      // 新增供应商表格缓存数据
      newSupplierBufferData: {
        // custom_id: Number(window.localStorage['currentCustomId'])
        is_push: 1,
        is_detail: 1,
        type: 3
      },
      // 供应商分组数据(查询用)
      supplierGroupsSearch:[],
      // 供应商分组数据
      supplierGroups: [
        {
          title: '供应商分组',
          expand: true,
          custom_id: window.localStorage['currentCustomId'],
          id: 0,
          render: (createEle, {root, node, data}) => {
            return createEle('span', {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            }, [
              createEle('span', {
                style: {
                  display: 'inline-block',
                  padding: '3px 5px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  backgroundColor: this.selectedNodeId === data.id ? '#D5E8FC' : '#fff'
                },
                on: {
                  click: () => {
                    this.treeNodeClick(data)
                  }
                }
              }, data.title),
              createEle('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '32px'
                }
              }, [
                createEle('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-plus-empty',
                    type: 'primary'
                  }),
                  style: {
                    width: '52px'
                  },
                  on: {
                    click: () => {
                      this.newSupplierGroup(data);
                    }
                  }
                })
              ])
            ])
          },
          children: []
        }
      ],
      // 供应商表格字段数据
      supplierListCol: [
        {
          type: 'selection',
          width: 55,
          className: 'slelection',
          align: 'center',
          fixed: "left"
        },
        /* {
          title: '编号',
          key: 'id',
          width: 120,
          fixed: 'left'
        }, */
        {
          title: '名称',
          key: 'name',
          width: 200,
          fixed: 'left'
        },
        {
          title: '信用等级',
          key: 'grade_id'
        },
        {
          title: '所在分组',
          key: 'group_info.name',
          render: (createEle, params) => {
            for (var item of this.supplierGroupsSearch) {
              if (params.row.group_id === item.id) {
                return createEle('span', {}, item.name)
              }
            }
            return createEle('span', {}, '未分组')
          }
        },
        {
          title: '经营状态',
          key: 'status_text'
        },
        {
          title: '供应品类',
          key: 'goods'// 'goods_category_info'
        }, 
        {
          title: '营业时间',
          key: 'cust_deadline',
          render: (createEle, params) => {
            return createEle('span', {}, `${params.open_time ? params.open_time : ''}--${params.end_time ? params.end_time : ''}`)
          }
        }, 
        /* {
          title: '供应范围',
          key: 'cust_scope'
        }, */
        {
          title: '业务联系人',
          key: 'cust_linkname'
        },
        {
          title: '联系电话',
          key: 'cust_phone',
          width: 120
        },
        /* {
          title: '默认',
          width: 100,
          key: 'status_name',
          filters: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            return row.status === value
          }
        }, */
        {
          title: '操作',
          align: 'center',
          key: 'action',
          fixed: 'right',
          width: 150,
          className: 'operate',
          render: (createEle, params) => {
            return createEle('div', [
              // createEle('Button', {
              //   props: {
              //     type: 'primary',
              //     size: 'small',
              //     icon: 'edit'
              //   },
              //   style: {
              //     marginRight: '20px'
              //   },
              // }, '编辑'),
              createEle('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'trash-a'
                },
                on: {
                  click: () => {
                    this.delSupplier(params)
                  }
                }
              }, '解除')
            ])
          }
        }
      ],
      // 供应商表格实例数据
      supplierListData: []
    }
  },
  computed: {
    queryBtnTxt () {
      // //debugger
      return this.queryBtnStatus ? '清空' : '查询'
    }
  },
  render (createEle) {
    // //debugger
  },
  methods: {
    // 根据视口高度定义表格高度
    getGridHeight () {
      return window.innerHeight - 255
    },
    // 子节点自定义渲染函数
    renderContent(createEle, { root, node, data }) {
      var me = this
      // //debugger;
      return createEle(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          createEle("span", [
            createEle(
              "span",
              {
                style: {
                  display: 'inline-block',
                  padding: '3px 5px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  backgroundColor: this.selectedNodeId === data.id ? '#D5E8FC' : '#fff'
                },
                on: {
                  click: () => {
                    this.treeNodeClick(data)
                  }
                }
              },
              data.title
            )
          ]),
          createEle(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              /* createEle("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-plus-empty",
                  size: "small"
                }),
                style: {
                  marginRight: "8px",
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.newSupplierGroup(data);
                  }
                }
              }), */
              createEle("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "compose",
                  size: "small"
                }),
                style: {
                  marginRight: "8px",
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.modSupplierGroup(data);
                  }
                }
              }),
              createEle("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-minus-empty",
                  size: "small"
                }),
                style: {
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.removeSupplierGroup(data.id);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    // 请求树形结构数据格式化
    treeDataFormat (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].title = data[i].name
        if (data[i]._children && data[i]._children.length !== 0) {
          data[i].children = data[i]._children
          delete data[i]._children
          data[i].expand = false
          this.treeDataFormat(data[i].children)
        } else {
          data[i].expand = false
        }
      }
    },
    // 获取供应商分组
    getSupplierGroup () {
      //debugger
      Util.ajax.post('/custom.cluster/lists', {
        is_tree: 1,
        type_name: 'seller'
      }).then((resp) => {
        //debugger
        if (!resp)resp = []
        var supplierGroups = [...resp]// JSON.parse(JSON.stringify(resp))
        this.supplierGroupsSearch = [...resp]// JSON.parse(JSON.stringify(resp))
        this.treeDataFormat(supplierGroups)
        this.supplierGroups[0].children = supplierGroups
        var nodeArr = []
        this.getLastNode(supplierGroups, nodeArr)
        this.supplierDropMenu = nodeArr
      })
    },
    // 获取分组终极子节点
    getLastNode (treeData, dataArr) {
      for (var i = 0; i < treeData.length; i++) {
        if (treeData[i].children && treeData[i].children.length !== 0) {
          this.getLastNode(treeData[i].children, dataArr)
        } else {
          dataArr.push({
            id: treeData[i].id,
            name: treeData[i].name
          })
        }
      }
    },
    // 获取非树形结构分组
    /* getSupplierGroupNotTree () {
      Util.ajax.post('/custom.cluster/lists', {
        // is_tree: 1
      }).then((resp) => {
        // //debugger
        var supplierGroups = JSON.parse(JSON.stringify(resp))
        // this.treeDataFormat(supplierGroups)
        this.supplierDropMenu = supplierGroups
      })
    }, */
    // 表格多行选择事件
    gridSelect (selectedArr) {
      // //debugger
      console.log(arguments)
      this.gridSelected = selectedArr
      this.gridSelectedId = []
      selectedArr.forEach(elem => {
        this.gridSelectedId.push(elem.id)
      });
    },
    // 改变分组
    changeGroup (groupId) {
      // //debugger
      if (groupId == this.selectedNodeId) return
      var ids = this.gridSelectedId.join(',')
      Util.ajax.post('/custom.cluster/group_custom', {
        to_custom_id: ids,
        group_id: groupId
      }).then(resp => {
        this.getSupplierList()
        this.$Message.success({
          content: `移动成功`,
          duration: 3
        });
      })
    },
    // 新增供应商分组
    newSupplierGroup (data) {
      // //debugger;
      this.currentNodeInfo = data;
      this.addOrModSupGroupStatus = 1;
      this.addOrModModel = true;
    },
    // 修改供应商分组函数
    modSupplierGroup(data) {
      // //debugger;
      this.currentNodeInfo = data;
      this.addOrModSupGroupStatus = 0;
      this.supGroupFormData.name = data.name;
      this.addOrModModel = true;
    },
    // 按条件查询供应商
    querySupplier () {
      // //debugger
      /* if (this.queryBtnStatus) {
        this.supQueryName = ''
      } */
      this.queryBtnStatus = !this.queryBtnStatus
      this.getSupplierList()
    },
    cleanQuerySupplier () {
      this.supQueryName = ''
      this.queryBtnStatus = !this.queryBtnStatus
      this.getSupplierList()
    },
    // 保存分组新增或更改
    doSaveGroup() {
      var me = this;
      if (this.addOrModSupGroupStatus === 1) {
        // //debugger;
        Util.ajax
          .post("/custom.cluster/create", {
            type: 3,
            name: this.supGroupFormData.name,
            pid: this.currentNodeInfo.id
          })
          .then(resp => {
            // //debugger;
            me.addOrModModel = false;
            this.supGroupFormData.name = "";
            this.$Message.success({
              content: `新增成功`,
              duration: 3
            });
            me.getSupplierGroup();
          });
      } else if (this.addOrModSupGroupStatus === 0) {
        // //debugger;
        Util.ajax
          .post("/custom.cluster/save", {
            id: this.currentNodeInfo.id,
            name: this.supGroupFormData.name
          })
          .then(resp => {
            // //debugger;
            me.addOrModModel = false;
            this.supGroupFormData.name = "";
            this.$Message.success({
              content: `修改成功`,
              duration: 3
            });
            me.getSupplierGroup();
          });
      }
    },
    // 删除分组函数
    removeSupplierGroup (data) {
      // //debugger;
      if (typeof data === "object") {
        // //debugger;
      } else {
        var ids = data;
      }
      Util.ajax
        .post("/custom.cluster/destroy", {
          ids
        })
        .then(resp => {
          // //debugger;
          this.getSupplierGroup();
          this.$Message.success({
            content: `删除成功`,
            duration: 3
          });
        });
    },
    // 取消保存分组新增或更改
    doCancelGroup() {
      this.addOrModModel = false;
      this.currentNodeInfo = {};
      this.supGroupFormData.name = "";
    },
    // 供应商分组树节点点击事件
    treeNodeClick (data) {
      //debugger
      this.selectedNodeId = data.id
      this.newSupplierBufferData.group_id = data.id
      this.getSupplierList()
      console.log(arguments)
    },
    // 获取现有供应商列表（未分组）
    getSupplierList () {
      //debugger
      Util.ajax.post('/custom.cluster/custom', {
        type_name: 'seller',
        name: this.supQueryName,
        /* name: '',
        cust_auditstate: 0,
        // relations: '',
        order: '', */
        group_id: this.selectedNodeId,
        // relations:['group_info'],
        status:1,
        // attrs:['goods_category_info'],
        limit: 12,
        page: this.pagination.current
      }).then((resp) => {
        // //debugger
        var supplierList = JSON.parse(JSON.stringify(resp.data))
        this.supplierListData = supplierList
        this.pagination.total = resp.total
        this.pagination.current = resp.current_page
        this.pagination.last = resp.last_page
        this.pagination.perPage = resp.per_page
      }).catch((e) => {
        // //debugger
        console.log(e)
      })
    },
    // 提交表单数据
    submitForm () {
      //debugger
      console.log(this.newSupplierBufferData)
      if (!this.newSupplierBufferData.to_custom_id || !this.newSupplierBufferData.category_ids) {
        this.newSupplierBufferData = {
          // custom_id: Number(window.localStorage['currentCustomId'])
          is_push: 1,
          is_detail: 1
        }
        return
      }
      Util.ajax.post('/custom.custom/relation', this.newSupplierBufferData).then(resp => {
         //debugger
        this.$Message.success({
          content: `添加请求已发出！`,
          duration: 3
        });
        this.getSupplierList()
      })
      this.newSupplierBufferData = {
        // custom_id: Number(window.localStorage['currentCustomId'])
        is_push: 1,
        is_detail: 1
      }
    },
    // 取消表单
    cancelForm () {
      // //debugger
      this.newSupplierBufferData = {
        // custom_id: Number(window.localStorage['currentCustomId'])
        is_push: 1,
        is_detail: 1
      }
    },
    // 添加供应商
    newSupplier () {
      // //debugger
      var me = this
      this.newOrModStatus = 0
      this.$Modal.confirm({
        title: '新增供应商',
        width: '40%',
        onOk: this.submitForm,
        onCancel: this.cancelForm,
        render: (createEle) => {
          return createEle(supplierAdd, {
            props: {
              actionStatus: 1,
              supplierFormData: me.newSupplierBufferData
            }
          })
        }
      })
    },
    // 删除供应商
    delSupplier (params) {
      //debugger
      this.$Modal.confirm({
        // title: '删除确认',
        // content: `确认删除【${params.row.name}】?`,
        render: (createEle) => {
          return createEle('p', {
            style: {
              'font-size': '20px',
              'font-weight': 'bold',
              'text-align': 'center',
              marginTop: '30px'
            }
          }, [createEle('Icon', {
            props: {
              type: 'help-circled'
            },
            style: {
              color: '#e4393c',
              fontSize: '30px',
              marginRight: '15px'
            }
          }, ''), `确认解除关系【${params.row.name}】?`])
        },
        onCancel: () => {},
        onOk: () => {
          Util.ajax.post('/custom.custom/cancelrelation', {
            ids: params.row.ccr_id
          }).then(resp => {
            //debugger
            this.$Message.success({
              content: `解除关系成功！`,
              duration: 3
            });
            this.getSupplierList()
          })
        }
      })
      /* Util.ajax.post('/custom.custom/cancelrelation', {
        ids: ''// params.row.id
      }).then(resp => {
        //debugger
        this.$Message.success({
          content: `删除成功！`,
          duration: 3
        });
        this.getSupplierList()
      }) */
    },
    // 分页跳转
    changePage (page) {
      this.pagination.current = page
      this.getSupplierList()
    }
  },
  mounted () {
    this.getSupplierList()
    this.getSupplierGroup()
    // this.getSupplierGroupNotTree()
  }
}
</script>
<style lang="less">
  @import "./index.less";
</style>


