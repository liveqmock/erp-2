<template>
    <Content>
        <!-- 添加部门弹窗 -->
        <Modal v-model="addOrModModel" :closable="false" :mask-closable="false"
               :title="addOrModModelStatus === 1 ? '添加部门' : '修改部门'" width='300'>
            <div class="departmentForm">
                <Form :model="addDepFormData" :rules="deviceRule"
                      :label-width="80">
                    <FormItem prop="name" label="部门名称">
                        <!-- <Input v-model="addOrModModelStatus === 1 ? addDepFormData.name : modDepFormData.name" placeholder="请输入部门名称" @on-change = "change"></Input> -->
                        <Input v-model="addDepFormData.name" placeholder="请输入部门名称" @on-change="change"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="doCancelDep">取消</Button>
                <Button type="primary" @click="doSaveDep">保存</Button>
                <!-- <span class = "btnMy" @click = "cancelNewFarm">取消</span><span class = "btnMy" @click = "saveNewFarm">保存</span> -->
            </div>
        </Modal>
        <Card class="depCard">
            <Row class="depTree">
                <Col span="23">
                <Tree :data="departmentTree" :render="renderContent" show-checkbox
                      @on-check-change="nodeSelected"></Tree>
                </Col>
            </Row>
            <Row>
                <Col span="6" offset="1">
                <Button type="primary" :disabled="nodeSelectedData.length === 0" @click="depBatchDel">删除勾选所有部门</Button>
                </Col>
            </Row>
        </Card>
    </Content>
</template>
<script>
import Util from "@/libs/util";

export default {
  name: "branch",
  data() {
    return {
      // tree数据源
      departmentTree: [
        {
          title: JSON.parse(localStorage.currentCustomInfo).custom_info.name,
          expand: true,
          custom_id: window.localStorage['currentCustomId'],
          id: 0,
          render: (createEle, { root, node, data }) => {
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
                  createEle("Icon", {
                    props: {
                      type: "ios-folder-outline"
                    },
                    style: {
                      marginRight: "8px",
                      // fontSize: '18px',
                      color: "#2d8cf0"
                    }
                  }),
                  createEle(
                    "span",
                    {
                      style: {
                        // fontSize: '16px'
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
                    createEle("Button", {
                      props: Object.assign({}, this.buttonProps, {
                        icon: "ios-plus-empty",
                        type: "primary"
                      }),
                      style: {
                        width: "52px"
                      },
                      on: {
                        click: () => {
                          this.addDep(data);
                        }
                      }
                    })
                  ]
                )
              ]
            );
          },
          children: []
        }
      ],
      // node已选择数据
      nodeSelectedData: [],
      // 添加或修改部门弹窗显示切换
      addOrModModel: false,
      // 添加或修改部门状态, 1添加，0修改
      addOrModModelStatus: 1,
      // 新增部门数据绑定集
      addDepFormData: {
        name: ""
      },
      deviceRule: {
          name: [
              { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ]
      },
      // 当前操作节点信息
      currentNodeInfo: {}
    };
  },
  /* computed: {
    value () {
      debugger
      return this.addOrModModelStatus === 1 ? this.addDepFormData.name : this.modDepFormData.name
    }
  }, */
  methods: {
    change(e) {
      /* debugger
      console.log(this.addDepFormData)
      console.log(this.modDepFormData) */
    },
    // 获取视口高度，设置树高度
    getGridHeight() {
      return window.innerHeight - 210;
    },
    // 子节点自定义渲染函数
    renderContent(createEle, { root, node, data }) {
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
            createEle("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px",

                color: "#2d8cf0"
              }
            }),
            createEle(
              "span",
              {
                style: {}
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
              createEle("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-plus-empty"
                }),
                style: {
                  marginRight: "8px",
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.addDep(data);
                  }
                }
              }),
              createEle("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "compose"
                }),
                style: {
                  marginRight: "8px",
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.modDep(data);
                  }
                }
              }),
              createEle("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-minus-empty"
                }),
                style: {
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.removeDep(data.id);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    // 请求树形结构数据格式化
    treeDataFormat(data) {
      for (var i = 0; i < data.length; i++) {
        data[i].title = data[i].name;
        if (data[i]._children && data[i]._children.length !== 0) {
          data[i].children = data[i]._children;
          delete data[i]._children;
          data[i].expand = true;
          this.treeDataFormat(data[i].children);
        } else {
          data[i].expand = false;
        }
      }
    },
    // 挂载时自动加载部门信息函数
    getDepTree() {
      var me = this;
      Util.ajax
        .post("/custom.branch/lists", {
          name: "",
          is_tree: 1,
          order: "",
          limit: "",
          page: ""
        }).then((resp) => {
          if(!resp){
            
          }else{
              var treeData = JSON.parse(JSON.stringify(resp));
              this.treeDataFormat(treeData);
              me.departmentTree[0].children = treeData;
          }
        });
    },
    // 添加部门函数
    addDep(data) {
      console.log(data.name);
      this.currentNodeInfo = data;
      this.addOrModModelStatus = 1;
      this.addOrModModel = true;
      this.addDepFormData.name = '';
    },
    // 修改部门函数
    modDep(data) {
      this.currentNodeInfo = data;
      this.addOrModModelStatus = 0;
      this.addDepFormData.name = data.name;
      this.addOrModModel = true;
    },
    // 保存部门新增或更改
    doSaveDep() {
      var me = this;
      if (this.addOrModModelStatus === 1) {
        Util.ajax
          .post("/custom.branch/create", {
            name: this.addDepFormData.name,
            pid: this.currentNodeInfo.id
          })
          .then(resp => {
            me.addOrModModel = false;
            this.addDepFormData.name = "";
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
          .post("/custom.branch/save", {
            id: this.currentNodeInfo.id,
            name: this.addDepFormData.name,
            pid: this.currentNodeInfo.pid
          })
          .then(resp => {
            me.addOrModModel = false;
            this.addDepFormData.name = "";
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
    // 取消保存部门新增或更改
    doCancelDep() {
      this.addOrModModel = false;
      this.currentNodeInfo = {};
      this.addDepFormData.name = "";
    },
    // 删除部门
    removeDep(data) {
      if (typeof data === "object") {

      } else {
        var ids = data;
      }
      this.$Modal.confirm({
          title: '提示:',
          content: '<p>您确定要删除这条数据吗?</p>',
          onOk: () => {
              Util.ajax
                .post("/custom.branch/destroy", {
                  ids
                })
                .then(resp => {
                  this.getDepTree();
                  this.$Message.success({
                    content: `删除成功`,
                    duration: 3
                  });
                  setTimeout(() => {
                      window.location.reload();
                  }, 2000);
                });
          },
          onCancel: () => {
              this.$Message.info('取消成功');
          }
      });
      
    },
    // node节点多选事件
    nodeSelected(selData) {
      this.nodeSelectedData = selData;
    },
    // 批量删除部门
    depBatchDel() {
      var ids = "";
      for (var i = 0; i < this.nodeSelectedData.length; i++) {
        if (i === this.nodeSelectedData.length - 1) {
          ids += `${String(this.nodeSelectedData[i].id)}`;
        } else {
          ids += `${String(this.nodeSelectedData[i].id)},`;
        }
      }

      this.$Modal.confirm({
          title: '提示:',
          content: '<p>您确定要删除这些数据吗?</p>',
          onOk: () => {
              Util.ajax
                .post("/custom.branch/destroy", {
                  ids
                })
                .then(resp => {
                  this.nodeSelectedData = [];
                  this.getDepTree();
                  this.$Message.success({
                    content: `删除成功`,
                    duration: 3
                  });
                  setTimeout(() => {
                      window.location.reload();
                  }, 2000);
                });
          },
          onCancel: () => {
              this.$Message.info('取消成功');
          }
      });

      
    }
  },
  mounted() {
    this.getDepTree();
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>


