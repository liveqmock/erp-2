<template>
    <Content class="margin-top-20">
        <Form ref="form" :model="formdata"  label-position="right" :label-width="120" :rules="ruleValidate">
            <FormItem label="名称" prop="name" >
                
                <Input v-model="formdata.name" placeholder="请输入品牌的名称"></Input>
            </FormItem>
            <FormItem label="描述">
                <Input v-model="formdata.descript" type="textarea" placeholder="请输入品牌的描述（选填）"></Input>
            </FormItem> 
            
            <FormItem label="LOGO">
                <img class="imglogo" :src="logourl" alt="">
                <Upload
                         ref="upload"
                         :show-upload-list=false
                         :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                       
                        action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                        style="display: inline-block;width: 100%;">
                  
                         <Button type="ghost" icon="ios-cloud-upload-outline">
                              上传品牌图标
                       </Button>
                       
                    
                </Upload>
            </FormItem>
            <FormItem label="行政批文">
                <img class="imglogo" :src="LicenseListurl" alt="">
                <Upload
                        ref="upload"
                       
                        :show-upload-list=false
                        :on-success="handleSuccessa"
                        :format="['jpg','jpeg','png','doc','docx','xls','xlsx','ppt','pptx','pdf']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        
                        
                        action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                        style="display: inline-block;width: 100%;">
                   
                        <Button type="ghost" icon="ios-cloud-upload-outline">
                            上传行政批文扫描件
                        </Button>     
                    
                </Upload>
            </FormItem>
        </Form>
    </Content>
</template>

<script>
    export default {
        name: 'add',
      
        data () {
            return {
             ruleValidate: {
                    name: [
                        {required: true, message: '品牌名称不能为空', trigger: 'blur'}
                    ]
                },
              formdata:{
                  name:'',
                  descript:'',
                  sort:'',
                  logo:'',
                  licence:''

                },
                logourl:'',
                LicenseListurl:'',
              
              imgName: '',
              visible: false,
              uploadList: [],
            };
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
              this.formdata.logo = res.result.url;
              this.logourl = res.result.url;
            },
            handleSuccessa (res, file) {
               // console.log(res)
               this.formdata.licence = res.result.url;
                this.LicenseListurl=res.result.url;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '上传文件类型有误',
                    desc: file.name + ' 文件格式不正确，请选择jpg、png、doc、xls、ppt、pdf。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            }
        },
        mounted () {
          
        }
    };
</script>


<style>
     .imglogo{
        max-width: 40%;
        margin: 0 auto;
        height: 40px;
     }
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>