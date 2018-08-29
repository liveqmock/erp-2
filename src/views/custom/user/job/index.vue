<template>
  <Content>
    <Card>
      <Row>
        <Col span = "24">
          <Button type = "primary" @click = "addEditRow" style = "margin-bottom: 10px">添加岗位</Button>
        </Col>
      </Row>
      <Row class-name = "myGrid">
        <Col span = "24">
          <Table stripe border :columns = "jobListCol" :data="jobListData" :height = "getGridHeight()" @on-selection-change = "jobGridSelected"></Table>
        </Col>
      </Row>
      <Row>
        <Col span = "6">
          <Button type = "primary" :disabled = "jobSelectedData.length === 0" @click = "jobBatchDel">删除勾选所有岗位</Button>
        </Col>
        <Col span = "18" style = "text-align: right">
          <Page :total="pagination.total" :current="pagination.current" :page-size = "pagination.perPage" @on-change="changePage" show-elevator show-total></Page>
        </Col>
      </Row>
    </Card>
  </Content>
</template>
<script>
import Util from '@/libs/util'

export default {
  name: 'job',
  data () {
    return {
      // 分页数据
      pagination: {
        total: 0,
        current: 0,
        last: 0,
        perPage: 0
      },
      // 空编辑行

      // 表格行编辑临时数据存数
      jobRowBuffer: {},
      // 岗位表格多选数据存储
      jobSelectedData: [],
      // 岗位列表字段
      jobListCol: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '岗位名称',
          key: 'name',
          sortable: true,
          render: (createEle, params) => {
            if (params.row.isEdit) {
              return createEle('Input', {
                attrs: {value: params.row.name},
                on: {
                  'on-blur': (e) => {
                    this.jobRowEdited(e, params, 'name')
                  }
                }
              })
            } else {
              return params.row.name
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (createEle, params) => {
            //debugger
            var me = this
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
                      this.jobAdd(params)
                    }
                  }
                })
              ])
            } else {
              //debugger
              if (params.row.isEdit) {
                return createEle('div', {
                  style: {
                      color: '#2d8cf0',
                      fontSize: '25px'
                  }
                }, [
                  createEle('Icon', {
                    style: {
                      marginRight: '30px',
                      cursor: 'pointer'
                    },
                    props: {
                      type: 'checkmark'
                    },
                    nativeOn: {
                      click: () => {
                        this.saveJobEdit(params)
                      }
                    }
                  }),
                  createEle('Icon', {
                    style: {
                      marginRight: '15px',
                      cursor: 'pointer'
                    },
                    props: {
                      type: 'close'
                    },
                    nativeOn: {
                      click: () => {
                        this.cancelJobEdit(params)
                      }
                    }
                  })
                ])
              } else {
                return createEle('div', {
                  style: {
                      color: '#2d8cf0',
                      fontSize: '25px'
                  }
                }, [
                  /* createEle('Icon', {
                    style: {
                      marginRight: '30px',
                      cursor: 'pointer'
                    },
                    props: {
                      type: 'ios-compose-outline'
                    },
                    nativeOn: {
                      click: () => {
                        this.jobEdit(params)
                      }
                    }
                  }),
                  createEle('Icon', {
                    style: {
                      marginRight: '15px',
                      cursor: 'pointer'
                    },
                    props: {
                      type: 'ios-trash-outline'
                    },
                    nativeOn: {
                      click: () => {
                        this.jobRowRemove(params)
                      }
                    }
                  }) */
                  createEle('Button', {
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
                        this.jobEdit(params)
                      }
                    }
                  }, '编辑'),
                  createEle('Button', {
                    props: {
                      type: "error",
                      size: "small",
                      icon: "trash-a"
                    },
                    nativeOn: {
                      click: () => {
                        this.jobRowRemove(params)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          }
        }
      ],
      // 岗位列表数据
      jobListData: []
    }
  },
  methods: {
    // 获取表格高度
    getGridHeight () {
      return window.innerHeight - 252
    },
    // 获取岗位列表
    getJobList (page) {
      Util.ajax.post('/custom.post/lists', {
        custom_id: 124,
        name: '',
        achieves: '',
        order: '',
        limit: 12,
        page: page ? page : 1
      }).then((resp) => {
        //debugger
        var jobList = JSON.parse(JSON.stringify(resp.data))
        jobList.forEach(elem => {
          elem.isEdit = false
          elem.modelRow = false
        })
        /* jobList.push({
          custom_id: 124,
          name: '',
          isEdit: false,
          modelRow: true
        }) */
        this.jobListData = jobList
        this.pagination.total = resp.total
        this.pagination.current = resp.current_page
        this.pagination.last = resp.last_page
        this.pagination.perPage = resp.per_page
      })
    },
    // 新增岗位
    jobAdd (params) {
      //debugger
      this.jobListData[params.index].isEdit = !this.jobListData[params.index].isEdit
    },
    // 岗位表格行编辑失去焦点
    jobRowEdited (e, params, feild) {
      if (e.target.value !== '' && params.row.modelRow) {
        this.jobListData[params.index].name = e.target.value
        this.jobListData[params.index].modelRow = false
        this.jobRowBuffer[`jobRow${params.index}name`] = e.target.value
        this.jobListData.push({
          custom_id: 124,
          name: '',
          isEdit: false,
          modelRow: true
        })
      } else {
        this.jobRowBuffer[`jobRow${params.index}name`] = e.target.value
      }
    },
    // 岗位表格行开启编辑
    jobEdit (params) {
      //debugger
      if (!this.jobListData[params.index].isEdit) {
        this.jobRowBuffer[`jobRow${params.index}name`] = this.jobListData[params.index].name
      }
      this.jobListData[params.index].isEdit = !this.jobListData[params.index].isEdit
    },
    // 岗位表格行编辑保存
    saveJobEdit (params) {
      //debugger
      var me= this
      var jobName = this.jobRowBuffer[`jobRow${params.index}name`]
      if (params.row.id) {
        Util.ajax.post('/custom.post/save', {
          id: params.row.id,
          custom_id: params.row.custom_id,
          name: jobName
        }).then((resp) => {
          //debugger
          this.getJobList()
          var jobRowBuffer = me.jobRowBuffer
          delete jobRowBuffer[`jobRow${params.index}name`]
          this.$Message.success({
            content: `修改成功`,
            duration: 3
          })
        })
      } else {
        //debugger
        Util.ajax.post('/custom.post/create', {
          custom_id: params.row.custom_id,
          name: jobName
        }).then((resp) => {
          //debugger
          this.getJobList()
          var jobRowBuffer = me.jobRowBuffer
          delete jobRowBuffer[`jobRow${params.index}name`]
          this.$Message.success({
            content: `新增成功`,
            duration: 3
          })
        })
      }
    },
    // 新增表格行
    addEditRow () {
      this.jobListData.push({
        custom_id: 124,
        name: '',
        isEdit: true,
        modelRow: false
      })
    },
    // 岗位表格行编辑取消
    cancelJobEdit (params) {
      //debugger
      var jobRowBuffer = this.jobRowBuffer
      if (!params.row.id) {
        this.jobListData.splice(params.index, 1)
        delete jobRowBuffer[`jobRow${params.index}name`]
        return ;
      }
      delete jobRowBuffer[`jobRow${params.index}name`]
      this.jobListData[params.index].isEdit = !this.jobListData[params.index].isEdit
    },
    // 岗位表格行删除
    jobRowRemove (params) {
     
      Util.ajax.post('/custom.post/destroy', {
        ids: params.row.id
      }).then((resp) => {
        //debugger
        this.$Message.success({
          content: `删除成功`,
          duration: 3
        })
        this.getJobList()
      })
    },
    // 岗位表格行多选事件
    jobGridSelected (selectedAll, selectedLast) {
      //debugger
      this.jobSelectedData = selectedAll
    },
    // 岗位表格多行删除
    jobBatchDel () {
      var ids = ''
      for (var i = 0; i < this.jobSelectedData.length; i++) {
        if (this.jobSelectedData[i].id) {
          if (i === this.jobSelectedData.length - 1) {
            ids += `${String(this.jobSelectedData[i].id)}`
          } else {
            ids += `${String(this.jobSelectedData[i].id)},`
          }
        }
      }
      //debugger
      if (ids === '') {
        return
      }
      Util.ajax.post('/custom.post/destroy', {
        ids
      }).then((resp) => {
        //debugger
        this.getJobList()
        this.$Message.success({
          content: `删除成功`,
          duration: 3
        })
      })
    },
    // 分页查看函数
    changePage (page) {
      this.getJobList(page)
    }
  },
  mounted () {
    this.getJobList()
    /* Util.ajax.post('/custom.post/detail', {
      custom_id: 124,
      id: 1
    }).then((resp) => {
      //debugger
    }) */
  }
}
</script>
<style lang="less" scoped>
  @import './index.less';
</style>


