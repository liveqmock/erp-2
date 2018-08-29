<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content>
        <Card>
            <p solt="title">编辑产品</p>
            <Form  ref="formItem" :model="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
                <FormItem label="产品名称" prop="name">
                    <Input v-model="formItem.name" placeholder="请输入产品名称"></Input>
                </FormItem>

                <FormItem label="产品别名" prop="goods.alias">
                    <Input v-model="formItem.alias" placeholder="请输入产品别名"></Input>
                </FormItem>

               <FormItem label="所属品类" prop="catid">
                       
                    <Select 
                     label-in-value
                      @on-change="getcatid(formItem.catid)" v-model="formItem.catid">

                        <Option v-for="item in categorys" :value="item.id" :key="item.id"> {{ item.name }}
                        </Option>
                    </Select>
                </FormItem> 
             <FormItem label="所属品牌" prop="goods.brand_id">

                    <Select @on-change="getbrandid(formItem.brand_id)" v-model="formItem.brand_id">
                        <Option v-for="item in category" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>


                <FormItem label="源产地" prop="district">
                    <Input v-model="formItem.district" placeholder="源产地"></Input>
                </FormItem>

                <FormItem label="经营类型" prop="type">
                    <RadioGroup  @on-change="changetype" v-model="formItem.type" type="button">
                        <Radio label="0">自营</Radio>
                        <Radio label="1">代理</Radio>
                        <Radio label="2" disabled>代销</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem  @on-change="changetags" label="产品标签" prop="tags">
                    <RadioGroup v-model="formItem.tags">
                        <Radio label="1">新品上架</Radio>
                        <Radio label="2">热卖推荐</Radio>
                    </RadioGroup>
                </FormItem>

                 <FormItem label="产品图片">
                         <div class="demo-upload-list" v-for="item in imgs">
                             <img :src="item">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                       
                       
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
                     <Row :gutter="24">
                    <Col span="24">
                        <Button type="info" @click="modalSkuAddshow">添加品种 </Button>
                            <Modal
                                    v-model="modalSkuAdd"
                                    title="添加品种"
                                    width="85%"
                                   
                            >
                                <sku-add ref="refSkuAdd" :formItem="currentSkuItem"/>
                              </sku-add>
                                <p slot="footer">
                                  <Button type="primary" @click="handleSkuAddSubmitnewsku">确定</Button>
                                  <Button type="text" @click="Cancel">取消 </Button>

                                </p>
                            </Modal> 
                            <Modal
                                    v-model="modalSkuedit"
                                    title="编辑品种"
                                    width="85%"
                                   >
                                <skuedit ref="refSkuedit" :formItem="currentSkuItem"/>
                               </skuedit>
                                <p slot="footer">
                                  <Button type="primary" @click="handleSkuAddSubmit">确定</Button>
                                  <Button type="text" @click="handleSkuAddCancel">取消 </Button>

                                </p>
                            </Modal>
                       
                   <Button type="success" @click="addefault">导入默认供应商品种</Button>
                       
                    </Col>
                 
                </Row>
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
                        title="选择供应商品种"
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
    import skuedit from './skuedit.vue';
    import Util from '@/libs/util';
    import Area from '@/views/components/thrgo/area.vue';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';

    export default {
        components: { skuAdd, Area, submitAffix,sellersku,skuedit,selecatery },
        data() {
            return {
                showcate:false,
                categorysid:[],
                 data4: [],
                imgName: '',
                 visible: false,
                 modalSkuSelect:false,
                 modalSkuAdd: false,
                 loadingSkuAdd: true,
                modalSkuedit:false,
                editindex:'',
                category: [],
                modeltitle:'添加细分产品',
                categorys: [],
                defaultList: [],
                imgName: '',
                 valuearay:[],
                visible: false,
                uploadList: [],
                district:'',
                currentSkuItem: {},
                imgs:[],
                auu:[],
                 visible: false,
                imgName:'',
                addsku:[],
                formItem: {
                    goods: {},
                    skus: [],
                    
                    type:'',
                    tags:''  },
                ruleValidate: {
                   name: [
                        {required: true, message: '产品名称不能为空', trigger: 'blur'}
                    ],
                    catid: [
                       
                       { required: true, message: '品类必选', trigger: 'change',pattern:/\d*/ },
                    ], 
                    type: [
                        {required: true, message: '经营类型不能为空', trigger: 'change',pattern:/\d*/ }
                    ],
                    tags: [
                        {required: true, message: '产品标签不能为空', trigger: 'change',pattern:/\d*/ }
                    ],
                     city: [
                        {required: true, message: '产品标签不能为空', trigger: 'change'}
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
                            align: 'center',
                            width:200,
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
                                                if (params.row.imgs==null) {
                                                    params.row.imgs=[];
                                                }
                                                this.currentSkuItem = params.row;
                                                console.log(params.row,'编辑获取的数据');
                                                 this.currentSkuItem.unit='1';
                                                this.editindex = params.index ;
                                                
                                                 
                                                this.modalSkuedit = true;
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
            // 取消添加细分产品
            Cancel(){
                   // 取消添加细分产品的时候清除已经上传的图片
                this.$refs.refSkuAdd.$refs.upload.fileList = this.$refs.refSkuAdd.uploadList=[];
                 this.currentSkuItem = {};
                 this.modalSkuAdd= false;
            },
            // 新添加细分产品的sku
            handleSkuAddSubmitnewsku(){
                
                 this.$refs.refSkuAdd.$refs.form.validate((valis => {
                })).then((res) => {
                    if (res === false) {
                       
                       return
                    } else {
                        // 判断供应量是否存在，存在则单位必选
                          if (this.$refs.refSkuAdd.formItem.supply_scale) {
                             if(this.$refs.refSkuAdd.formItem.unit==undefined){
                                 this.$Message.error({
                                content: `请选择供应单位`,
                                duration: 3
                                    }); 
                            return

                         }

                     }


                      console.log(this.currentSkuItem)
                       this.formItem.skus.push(this.currentSkuItem)
                       // 添加成功之后清除已经上传的图片
                         this.$refs.refSkuAdd.$refs.upload.fileList = this.$refs.refSkuAdd.uploadList=[];
                        this.currentSkuItem = {};
                     }
                });

            },
            // 确定导入上级的产品
            oksku(){
                 // 重新点击导入的时候情况上次导入的数据
                 this.addsku=[];

                 this.$refs.sellersku.SkuSelectItems.forEach( (item, index)=>{
                   
                   this.addsku.push({type:1,skuname:item.skuname,spec:item.spec,min_number:item.min_number,quote:item.quote,method:item.method,unit:item.unit,pid:item.skuid,seller_id:item.custom_id})
                });
                 this.formItem.skus=  this.formItem.skus.concat(this.addsku);
                 this.formItem.skus = this.formItem.skus.distynct();

                 
            },
            // 导入上级的弹窗显示
            addefault(){
                this.modalSkuSelect= true;
            },
            // 显示添加细分产品的弹窗 
             modalSkuAddshow(){
                this.modalSkuAdd=true;
                 this.currentSkuItem = {}
            },
            changetype(param){
                console.log(param)
              this.formItem.type= param;

            },
            changetags(param){
                 this.formItem.tags= param;
            },
            // 提交添加
            handleSubmit() {
            
            
                 
                
             
                   
                var vm = this;


                var paramarray = [];

                vm.formItem.skus.forEach( function(item, index) {
                            paramarray.push({imgs:item.imgs,skuid:item.skuid,skuname:item.skuname,spec:item.spec,min_number:item.min_number,quote:item.quote,method:item.method,unit:item.unit,localsn:item.localsn,supply_scale:item.supply_scale,desc:item.desc})
                    });
                console.log(paramarray)
               

                this.$refs.formItem.validate((valis => {
                })).then((res) => {
                  if (res=== false) {

                        return
                   }
                   Util.ajax.post('/goods.goods/save', {
                    goods: {
                        id:vm.formItem.id,
                        name:vm.formItem.name,
                        alias:vm.formItem.alias,
                        type:vm.formItem.type,
                        tags:vm.formItem.tags,
                        district:vm.formItem.district,
                        brand_id:vm.formItem.brand_id,
                        catid:vm.formItem.catid,
                        imgs:vm.imgs,
                       
                    },
                    skus: paramarray
                }).then((res) => {
                     this.$Message.success({
                                content: '编辑成功',
                                duration: 3
                              });
                    
                       this.$router.push('/goods/index');

                });
                
                });
            },
            handleCancel() {
                 this.$store.commit('removeTag', 'goods_goods_edit');

                this.$store.commit('closePage', 'goods_goods_edit');
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
             // 获取产品详情
            getgoooddetail() {
                var vm = this;
                Util.ajax.post('/goods.goods/detail',{id:this.formItem.id,relations:['skus']})
                    .then( (res) =>{
                       
                        console.log(res)
                       vm.formItem.name = res.name;
                       vm.formItem.alias = res.alias;
                       vm.formItem.catid = res.catid;
                       vm.formItem.brand_id = res.brand_id;
                       vm.formItem.type = res.type+'';
                       vm.formItem.tags = res.tags+'';
                       vm.formItem.skus = res.skus;
                       vm.formItem.district = res.district;
                       vm.imgs = res.imgs;
                     }, function (err) {

                    })
            },

            // 获取品类第一级的列表
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
                console.log(parame)

            },

            handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file) {
                const fileList = this.imgs;
                this.imgs.splice(fileList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                file.url = res.result.url;
                this.imgs.push(res.result.url)
                file.name = res.result.url
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
            // 编辑之后确定
             
            handleSkuAddSubmit() {

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
                       
                        this.currentSkuItem = {};
                        this.$refs.refSkuAdd.$refs.upload.fileList = this.$refs.refSkuAdd.uploadList=[];
                        this.$nextTick(() => {
                            this.loadingSkuAdd = false;
                        });
                    }
                });
            },
            // 取消编辑
            handleSkuAddCancel() {
               this.$refs.refSkuAdd.$refs.upload.fileList = this.$refs.refSkuAdd.uploadList=[];
                 this.modalSkuedit = false;
                 this.currentSkuItem = {};
                
            },
            // 价值经营品类
            loadData (item, callback) {
                 Util.ajax.post('/goods.goods_category/lists', {pid: item.value,custom_id: -1})
                    .then(function (res) {
                         console.log(res)
                        
                            res.forEach((it,value)=>{
                               item.children.push({value: it.id,children: [],label: it.keywords,loading: false})
                            
                           })   
                        }, function (err) {

                    })
            }
        },
        mounted() {
            this.uploadList = this.$refs.upload.fileList;
            this.getbrand();
            this.getlist();
            var jsobj = this.$route.query;
                this.formItem.id= this.$route.query.id;
                this.getgoooddetail()
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
