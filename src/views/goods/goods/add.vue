<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content>
        <Card>
            <p solt="title">创建产品</p>
            <Form  ref="formItem"  :model="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
                <FormItem label="产品名称" prop="name">
                    <Input v-model="formItem.name" placeholder="请输入产品名称"></Input>
                </FormItem>

                <FormItem label="产品别名" prop="goods.alias">
                    <Input v-model="formItem.goods.alias" placeholder="请输入产品别名"></Input>
                </FormItem>

              <FormItem label="所属品类" prop="catid">
                    <Select @on-change="getcatid(formItem.catid)" v-model="formItem.catid">
                        <Option v-for="item in categorys" :value="item.id" :key="item.id"> {{ item.name }}
                        </Option>
                    </Select>
                </FormItem> 

               <!--  <FormItem label="所属品类" >
                    <div class="bixuan">*</div>
                    <selecatery  ref="categeru"  ></selecatery>
                    <div v-if="showcate" class="ivu-form-item-error-tip">品类不能为空</div>
                </FormItem>
 -->
                <FormItem label="所属品牌" prop="goods.brand_id">
                    <Select @on-change="getbrandid(formItem.brand_id)" v-model="formItem.brand_id">
                        <Option v-for="item in category" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>

                 <FormItem label="源产地" prop="goods.district">
                    <Input v-model="formItem.goods.district" placeholder="请输入产品别名"></Input>
                </FormItem>
               

                <FormItem label="经营类型" prop="type" >
                    <RadioGroup v-model="formItem.type" type="button">
                        <Radio label="0">自营</Radio>
                        <Radio label="1">代理</Radio>
                        <Radio label="2" disabled>代销</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="产品标签" prop="tags">
                    <RadioGroup v-model="formItem.tags">
                        <Radio label="1">新品上架</Radio>
                        <Radio label="2">热卖推荐</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="产品图片">
                    <div class="demo-upload-list" v-for="item in uploadList">
                            
                       
                        <template v-if="item.status === 'finished'">

                             <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            type="drag"
                            action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                            style="display: inline-block;width: 100px;">
                        <div style="padding: 20px 0;width: 100px; height: 100px; line-height: 100px;">
                            <Icon type="camera" size="52" style="color: #3399ff"></Icon>
                            <p>上传产品图片</p>
                        </div>
                    </Upload>
                      <Modal class="viewimg" title="图片预览" v-model="visible">
                        <img :src="imgName" v-if="visible" style="width: 100%">
                     </Modal>
                </FormItem>

                <Row :gutter="24">
                     <!-- 编辑品种的弹窗 -->
                      <Modal
                                    v-model="modalSkuedit"
                                    title="编辑品种"
                                    width="85%"
                                   >
                                <skuedit ref="refSkuedit" :formItem="currentSkuItem"/>
                               </skuedit>
                                <p slot="footer">
                                  <Button type="primary" @click="handleSkueditSubmit">确定</Button>
                                  <Button type="text" @click="handleSkueitCancel">取消 </Button>

                                </p>
                            </Modal>
                    <Col span="24">
                        <Button type="info" @click="modalSkuAddshow">添加品种
                            <Modal
                                    v-model="modalSkuAdd"
                                    title="添加品种"
                                    width="85%"
                                    :loading="loadingSkuAdd"
                                   
                                   
                            >
                                <skuAdd ref="refSkuAdd" :formItem="currentSkuItem"/>
                                <p slot="footer">
                                 <Button type="primary" @click="handleSkuAddSubmit">确定</Button>
                                 <Button type="text" @click="handleSkuAddCancel">取消 </Button>


                                 </p>
                               </skuAdd>
                            </Modal>
                        </Button>
                   <Button type="success" @click="addefault">导入供应商品种</Button>
                       
                    </Col>
                    <Col span="24" class="margin-top-10">
                    <Table
                            :columns="tables.columns"
                            :data="formItem.skus"
                            :v-show="false"
                            ref="selection"
                    ></Table>
                    </Col>
                </Row>
            </Form>
            <Modal
                        v-model="modalSkuSelect"
                        title="导入供应商品种"
                        width="85%"
                      
                        @on-ok="oksku"
                >
                  <sellersku ref="sellersku"></sellersku>  
            </Modal>

            <submitAffix
                    okValue="确认"
                    cancelValue="取消"
                    @onOk="handleSubmit"
                    @onCancel="handleCancel"
            />

        </Card>

    </Content>
</template>

<script>

//数组去重
//方法1
Array.prototype.distynct=function(){
    
    for (var i = 0; i < this.length; i++) {
    for (var j = i+1; j < this.length; j++) {
        if (this[i].pid==this[j].pid) {
            this.splice(j, 1)
            j--
        }
        
    }
}
return this;
};
    import sellersku  from './sellersku.vue';
    import selecatery  from './selecatery.vue';
    import skuAdd from './sku-add.vue';
    import Util from '@/libs/util';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';
    import skuedit from './skuedit.vue';

    export default {
    
        components: { skuAdd,  submitAffix,sellersku,selecatery,skuedit},
        data() {
            return {
                editindex:'',//编辑单行品种的索引值
                modalSkuedit:false,
                showcate:false,
                modalSkuSelect:false,
                category: [],
                categorys: [],
                defaultList: [],
                imgName: '',
                visible: false,
                uploadList: [],
                valuearay:[],
                addsku:[],
                imgs:[],
                modalSkuAdd: false,
                loadingSkuAdd: true,
                currentSkuItem: {
                    imgs:[]
                },
                district:'',
                formItem: {
                    goods: {},
                    skus: [],
                   
                },
                ruleValidate: {
                 
                   
                     name: [
                        {required: true, message: '产品名称不能为空', trigger: 'blur'}
                    ],
                    catid: [
                          { required: true, message: '品类不能为空', trigger: 'change',pattern:/\d*/ },
                    ], 
                    type: [
                        {required: true, message: '经营类型不能为空', trigger: 'change',pattern:/\d*/}
                    ],
                    tags: [
                        {required: true, message: '产品标签不能为空', trigger: 'change',pattern:/\d*/}
                    ]
                },
                tables: {
                    columns: [
                        {
                            title: '名称',
                            key: 'skuname'
                        },
                        {
                            title: '产品编码',
                            key: 'localsn'
                        },
                        {
                            title: '规格',
                            key: 'spec'
                        },
                        {
                            title: '报价',
                            key: 'quote',
                            render:(h, params)=>{
                               return params.row.quote+"元"  
                            }
                        },
                        {
                            title: '操作',
                            className: 'operate',
                            render: (h, params) => {
                                return h('div', [
                                   h('Button', {
                                      style: {
                                        margin: '0 5px'
                                      },
                                        props: {
                                            type: 'info',
                                            size: 'small',
                                            icon: 'edit',

                                        },
                                        on: {
                                            click: () => {
                                               
                                                this.currentSkuItem = params.row;
                                                console.log(params.row,'编辑获取的数据');
                                                 this.currentSkuItem.unit='1';
                                                 this.editindex = params.index ;
                                                
                                                 
                                                 this.modalSkuedit = true;
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'trash-a'
                                        },
                                        on: {
                                            click: () => {
                                                this.$Modal.confirm({
                                                    title: '提示:',
                                                    content: '<p>您确定要删除这条数据吗?</p>',
                                                    onOk: () => {
                                                      this.formItem.skus.splice(params.index, 1);
                                                    },
                                                    onCancel: () => {
                                                        this.$Message.info('取消成功');
                                                    }
                                                });
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ]
                }
            };
        },
        methods: {
            // 导入默认供应商产品
            addefault(){
                this.modalSkuSelect= true;
            },
            // 添加上级细分产品
            oksku(){
                // 重新点击导入的时候情况上次导入的数据
                this.addsku=[];
                this.$refs.sellersku.SkuSelectItems.forEach( (item, index)=>{
                     console.log(item,'上级导入时候的数据')
                   this.addsku.push({type:1,imgs:item.imgs,skuname:item.skuname,spec:item.spec,min_number:item.min_number,quote:item.quote,method:item.method,unit:item.unit,pid:item.skuid,seller_id:item.custom_id})
                });

                  this.formItem.skus=  this.formItem.skus.concat(this.addsku);
                 this.formItem.skus = this.formItem.skus.distynct();

                 
            },
            modalSkuAddshow(){
                 this.modalSkuAdd=true;
                 this.currentSkuItem = {}
                 this.currentSkuItem.unit='1'
            },
            // 提交添加
            handleSubmit() {
                 
                
                
           
                 
                 var vm = this;

                 this.$refs.formItem.validate((valis => {
                        })).then((res) => {

                   if (res=== false) {
                      
                        return
                   }
                   Util.ajax.post('/goods.goods/create', {
                    goods: {
                        id:vm.formItem.goods.id,
                        name:vm.formItem.name,
                        alias:vm.formItem.goods.alias,
                        type:vm.formItem.type,
                        tags:vm.formItem.tags,
                        brand_id:vm.formItem.brand_id,
                        catid:vm.formItem.catid,
                        district:vm.formItem.goods.district,
                        content:vm.formItem.goods.content,
                        imgs:vm.imgs,
                        sort:vm.formItem.goods.sort
                    },
                    skus: this.formItem.skus
                }).then((res) => {

                this.$Message.success({
                                content: '添加成功',
                                duration: 3
                              });
                  // this.$router.push('/goods/index');
                   
                });
                
                });
            },
            handleCancel() {

                this.$store.commit('removeTag', 'goods_goods_add');

                this.$store.commit('closePage', 'goods_goods_add');
                this.$router.push('/goods/index');

            },


            getbrandid(parame) {
                this.formItem.brand_id = parame;
            },


            // 获取品牌列表
            getbrand() {
                var vm = this;
                Util.ajax.post('/goods.goods_brand/lists')
                    .then(function (res) {
                        vm.category = res;
                    }, function (err) {

                    })
            },


            getlist(pid, cityparam) {
                var vm = this;
                Util.ajax.post('/goods.goods_category/lists', {pid: pid})
                    .then(function (res) {
                        vm.categorys = res;
                    }, function (err) {
     
                    })
            },

            getcatid(parame) {
                this.formItem.catid = parame;
            },

            handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
              handleSuccess(res, file) {
                  file.url = res.result.url;
                 
                  file.name = res.result.url
                   this.imgs.push(res.result.url)
               
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload() {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            // sku添加方法
            handleSkuAddSubmit() {
               
             
             if (this.currentSkuItem.supply_scale) {
                console.log(this.currentSkuItem)
                  if(this.currentSkuItem.unit==''){
                        this.$Message.error({
                                content: `请选择供应单位`,
                                duration: 3
                            }); 
                        return

                    }

              }

            
                this.$refs.refSkuAdd.$refs.form.validate((valis => {
                })).then((res) => {
                    var vm =this;
                   
                    this.loadingSkuAdd = false;
                    if (res === false) {
                        this.$nextTick(() => {
                            this.loadingSkuAdd = true;
                        });
                        return
                    } else {
                        console.log(vm.currentSkuItem,'prop参数')
                        vm.formItem.skus.push(vm.currentSkuItem);
                        console.log( vm.formItem.skus,'添加进去的sku');
                        // 清空参数
                       
                        vm.currentSkuItem = {};
                        // 取消之后清空已经上传的图片
                        vm.$refs.refSkuAdd.$refs.upload.fileList = vm.$refs.refSkuAdd.uploadList=[];

                          vm.$Message.success({
                                content: '添加细分产品成功',
                                duration: 3
                              });
                        vm.modalSkuAdd=false;
                        vm.$nextTick(() => {
                            vm.loadingSkuAdd = false;
                        });
                    }
                });
            },
            handleSkuAddCancel() {
                // 取消之后清空已经上传的图片
               this.$refs.refSkuedit.$refs.upload.fileList = this.$refs.refSkuedit.uploadList=[];
                this.currentSkuItem = {};
              
                this.modalSkuAdd=false;
            },
               // 编辑品种确定
             
            handleSkueditSubmit() {
                
                this.$refs.refSkuedit.$refs.form.validate((valis => {
                })).then((res) => {
                    this.loadingSkuAdd = false;
                    if (res === false) {
                        this.$nextTick(() => {
                            this.loadingSkuAdd = true;
                        });
                    } else {
                        

                        let params = this.$refs.refSkuedit.$refs.form.model;
                        this.modalSkuedit = false;

                        this.formItem.skus[this.editindex] = params;
                        console.log(this.formItem.skus);
                        this.currentSkuItem = {};
                        this.$refs.refSkuAdd.$refs.upload.fileList = this.$refs.refSkuAdd.uploadList=[];
                        this.$nextTick(() => {
                            this.loadingSkuAdd = false;
                        });
                    }
                });
            },
               // 取消编辑
            handleSkueitCancel() {
               this.$refs.refSkuAdd.$refs.upload.fileList = this.$refs.refSkuAdd.uploadList=[];
                 this.modalSkuedit = false;
                 this.currentSkuItem = {};
                
            },
        },
        mounted() {
            this.getbrand()
            this.getlist()

            this.uploadList = this.$refs.upload.fileList;

      
        }
    };
</script>

<style scoped>
     .bixuan{
           position: absolute;
    left: -90px;
    top: 9px;
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
     }
    .demo-upload-list {
        display: inline-block;
        width: 102px;
        height: 102px;
        text-align: center;
        line-height: 102px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
       width: 100%;
       height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
