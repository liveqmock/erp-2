<template>
    <Content style="margin: 20px auto;">
        <Form :model="formItem" ref="form" label-position="right" :label-width="120" :rules="ruleValidate">
            <FormItem label="名称" prop="skuname">
                <Input v-model="formItem.skuname" placeholder=""></Input>
            </FormItem>

            <FormItem label="产品编码" prop="localsn">
                <Input v-model="formItem.localsn" placeholder=""></Input>
            </FormItem>

            <FormItem label="图册">
               <div class="demo-upload-list" v-for="item in uploadList">
                        
                        <template  v-if="item.status === 'finished'">
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
                        <p>上传SKU图册</p>
                    </div>
                </Upload>
                 <Modal class="viewimg" title="图片预览" v-model="visible">
                    <img :src="imgName" v-if="visible" style="width: 100%">
                </Modal>

            </FormItem>

            <FormItem label="规格特性" prop="spec">
                <Input v-model="formItem.spec" placeholder="例：50斤/箱"></Input>
            </FormItem>

            <FormItem label="供应规模" inline>
            
                <Input v-model="formItem.supply_scale"  style="width:200px">
                
                <Select v-model="formItem.unit" slot="append" style="width:90px">
                    <Option v-for="item in unitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                </Input>
            </FormItem>

            <FormItem label="最少起订量" prop="min_number">
                <Input v-model="formItem.min_number" placeholder="最少起订量"></Input>
            </FormItem>

            <FormItem label="默认报价(元)" prop="quote">
                <Input :max="100000" :min="0" v-model="formItem.quote"></Input>
            </FormItem>

            <FormItem label="结算方式" prop="method">

                <RadioGroup on-change ='set(formItem.method)'    v-model="formItem.method" type="button">
                    <Radio label="0">现付</Radio>
                    <Radio label="1">到付</Radio>
                    <Radio label="2">账期</Radio>
                    <Radio label="3">分期</Radio>
                  
                </RadioGroup>
            </FormItem>

            <FormItem label="产品描述" prop="desc">
                <Input v-model="formItem.desc" type="textarea" :autosize="{minRows: 2,maxRows: 8}"
                       placeholder="输入产品描述信息"></Input>
            </FormItem>
        </Form>
    </Content>     
</template>

<script>
    import Util from '@/libs/util';
    import tinymce from 'tinymce';

    export default {
        name: 'sku-add',
        props: {
            formItem: Object
        },

        data() {
            return {
                unitList: [],
                ruleValidate: {
                    skuname: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    spec: [
                        {required: true, message: '规则不能为空', trigger: 'blur'}
                    ],
                    // min_number: [
                    //     {required: true, message: '最小起订量不能为空', trigger: 'blur',pattern:/\d*/}
                    // ],
                    quote:[
                        {required: true, message: '默认报价不能为空', trigger: 'blur'}
                    ] ,
                    // method:[
                    //     {required: true, message: '结算方式不能为空', trigger: 'change',pattern:/\d*/}
                    // ]
                },
                defaultList: [],
                brands: [],
                districts: [],
                uploadList: [],
                visible: false,
                imgName:'',


            };
        },
        mounted() {
           
            this.getlist();
          
            this.$refs['form'].resetFields();
        },
        methods: {
             set(parame){
                this.formItem.method = parame;
            },
            handleSearch1(value, option) {
                return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file) {

                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                  this.formItem.imgs=[];
                  file.url = res.result.url;
                  file.name = res.result.url;
                  this.formItem.imgs.push(file.url)
               
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
                const check = this.uploadList.length < 4;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            // 获取品牌列表
            getlist() {
                var vm = this;
                Util.ajax.post('/goods.goods_brand/lists', {})
                    .then(function (res) {
                        res.forEach((item, index) => {
                            vm.brands.push(item.name)
                        });
                    }, function (err) {

                    })
            },  
             // 获取单位列表
            getunit() {
                var vm = this;
                Util.ajax.post('/setting/unit/lists', {})
                    .then(function (res) {
                         res.forEach((item, index) => {
                            vm.unitList.push({value:item.id,label:item.value})
                        });
                    }, function (err) {

                    })
            },
        }, 
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
            this.getunit()
        }
    };
</script>

<style scoped>
.viewimg{
    z-index: 1000000!important;
    position: relative;
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
    .demo-upload-list img {
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
