<style lang="less">
@import "../../../styles/common.less";
</style>
<template>
    <Content>
       <Row class="margin-bottom-10">
            <Col span="24">
            <Button type="primary" @click="addbrand">添加品牌</Button>
            </Col>
        </Row>
        
        <Row>
            <Col span="24">
                <thrgo-table 
                     :searchkey="searchkey"
                     ref="child"
                    :border="false"
                    path="/goods.goods_brand/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                    :loading="true"></thrgo-table>
            </Col>
        </Row>
        <Modal  v-model="modalAdd"
                 :title="modeltitle"
                 :loading="loadingSkuAdd"
                 width="40%"
                
                >
          <brandModelAdd ref="brandModelAdd" :defaultLogoList = "defaultLogoList" :defaultLicenseList = "defaultLicenseList"/>
            <p slot="footer">
                <Button type="primary" @click="handleSkuAddSubmit">确定</Button>
                <Button type="text" @click="handleSkuAddCancel">取消 </Button>

             </p>
       </Modal>


    </Content>
</template>
<script>
import brandModelAdd from "./add.vue";
import thrgoTable from "@/views/components/thrgo/table/table.vue";
import Util from "@/libs/util";

export default {
  name: "brand",
  components: {
    brandModelAdd,
    thrgoTable
  },
  data() {
    return {
      // 添加品牌log上传列表数组
      searchkey:'输入品牌名',
      defaultLogoList: [],
      defaultLicenseList: [],
      dataarray: [],
      loading: true,
      modal1: false,
      items: [],
      branid: [],
      modalAdd: false,
      edit: false,
      modeltitle: "添加品牌",
      loadingSkuAdd: true,
      columns: [
        {
          title: "名称",
          key: "name",
          render: (h, params) => {
            if (params.row.canedit == true) {
              return h("input");
            } else {
              return params.row.name;
            }
          }
        },
        {
          title: "LOGO",
          key: "logo",
          width: 200,
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.logo
              },
              style: {
                width: "20px",
                height: "20px"
              }
            });
          }
        },
        {
          title: "证照",
          key: "licence",
          width: 200,
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.licence
              },
              style: {
                width: "20px",
                height: "20px"
              }
            });
          }
        },
        
        {
          title: "审核状态",
          key: "status_text",
          align: "center",
          width: 120
        },
       
        {
          title: "最后更新",
          key: "update_time",
          width: 180,
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          width: 200,
          className: "operate",
          render: (h, params) => {
            return h("ButtonGroup", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    icon: "edit"
                  },
                  on: {
                    click: () => {
                      console.log(params)
                     
                      this.editbrandid = params.row.id;

                      this.$refs.brandModelAdd.formdata.name = params.row.name;
                      this.$refs.brandModelAdd.formdata.descript =
                        params.row.descript;
                      this.$refs.brandModelAdd.formdata.sort = params.row.sort;
                      this.$refs.brandModelAdd.formdata.catid =
                        params.row.catid;
                      this.$refs.brandModelAdd.logourl= params.row.logo;
                     this.$refs.brandModelAdd.LicenseListurl =params.row.licence;
                      this.editbrand();
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    icon: "trash-a"
                  },
                  on: {
                    click: () => {
                      this.branid.push(params.row.id);
                      this.$Modal.confirm({
                              title: '提示:',
                              content: '<p>您确定要删除这条数据吗?</p>',
                              onOk: () => {
                                    this.deletbrand();
                                          },
                              onCancel: () => {
                                          this.$Message.info('取消成功');
                                             }
                           });
                     
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      params: {
        relations: ["category"],
        limit: 10,
        page: 1
      }
    };
  },

  methods: {
    handleSkuAddSubmit() {
      this.$refs.brandModelAdd.$refs.form.validate(valis => {}).then(res => {
        if (res === false) {
          this.loadingSkuAdd = true;
          this.$nextTick(() => {
            this.loadingSkuAdd = true;
          });
          return;
        } else {
          if (this.edit == true) {
            this.editbrandmethod();
          } else {
            this.addbrandmethod();
          }
          

          // this.defaultLogoList.splice(0);
          // this.defaultLicenseList.splice(0);
        }
      });
    },
    handleSkuAddCancel() {
      this.modalAdd=false;
      // this.defaultLogoList.splice(0);
      // this.defaultLicenseList.splice(0);
    },
    // 添加品牌弹窗
    addbrand() {
      this.modalAdd = true;
       this.$refs.brandModelAdd.logourl = '';
           this.$refs.brandModelAdd.LicenseListurl = '';
      this.$refs.brandModelAdd.formdata = {};
      this.$refs.brandModelAdd.$refs.upload.clearFiles();
    },
    // 编辑弹窗
    editbrand() {
      this.modalAdd = true;
      this.edit = true;
    },

    cancel() {},

    //编辑品牌
    editbrandmethod() {
      var vm = this;
      Util.ajax
        .post("/goods.goods_brand/save", {
          id: this.editbrandid,
          brand: this.$refs.brandModelAdd.formdata
        })
        .then(
          res => {
          this.$Message.success({
                                content: '编辑成功',
                                duration: 3
                              });
            this.modalAdd = false;
            this.$refs.child.init();
          },
          function(err) {}
        );
    },
    //添加品牌
    addbrandmethod() {
      var vm = this;

      console.log(this.$refs.brandModelAdd.formdata.defaultList);
      Util.ajax
        .post("/goods.goods_brand/create", {
          brand: this.$refs.brandModelAdd.formdata
        })
        .then(
          res => {
            this.$Message.success({
                                content: '添加成功',
                                duration: 3
                              });
            this.modalAdd = false;
            this.modalAdd = false;

            this.$refs.child.init();
          },
          function(err) {}
        );
    },
    //删除品牌
    deletbrand() {
      Util.ajax
        .post("/goods.goods_brand/destroy", {
          ids: this.branid
        })
        .then(
          res => {
            this.$refs.child.init();
            this.branid = [];
          },
          function(err) {}
        );
    }
  },
  mounted() {
    // console.log(this.columns,'参数')
  }
};
</script>
