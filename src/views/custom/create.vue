<style lang="less">
    @import '../../styles/common.less';
    @import './create.less';
</style>

<template>
    <Content :style="{padding: '50px 100px', minHeight: '280px'}">
        <Card>
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                创建企业
            </p>
            <!--<a href="#" slot="extra" @click.prevent="changeLimit">-->
                <!--<Icon type="ios-loop-strong"></Icon>-->
                <!--加入企业-->
            <!--</a>-->

            <p slot="extra" v-if = "currentStep < 4">
                <Dropdown placement="bottom-end" @on-click="handleLoginDemo">
                    <a href="javascript:void(0)">
                        <Icon type="arrow-down-b"></Icon> 一键登录体验账户
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="caigou1">采购商用户</DropdownItem>
                        <DropdownItem name="peisong1">配送商用户</DropdownItem>
                        <DropdownItem name="gongying1">供应商用户</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </p>

            <Steps :current="currentStep" :status="currentStatus" style="margin: 20px auto;">
                <Step v-for="item in createStep" :title="item.title" :content="item.describe + '审核并通过'"
                      :key="item.title"></Step>
            </Steps>

            <Form :model="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
                <Row v-if="currentStep == 0">
                    <FormItem label="企业简称" prop="name">
                        <Input v-model="formItem.name" placeholder="请输入企业简称"></Input>
                    </FormItem>

                    <FormItem label="企业全称" prop="fullname">
                        <Input v-model="formItem.fullname" placeholder="请输入企业法定名称"></Input>
                    </FormItem>

                    <FormItem label="社会信用代码" prop="cust_license">
                        <Input v-model="formItem.cust_license" placeholder="请输入社会信用代码"></Input>
                    </FormItem>

                    <!-- <FormItem label="公司法人名称" prop="cust_represent">
                        <Input v-model="formItem.cust_represent" placeholder="请输入公司法人名称"></Input>
                    </FormItem> -->

                    <FormItem label="法定代表人名称" prop="cust_represent">
                        <Input v-model="formItem.cust_represent" placeholder="请输入法定代表人名称"></Input>
                    </FormItem>

                    <FormItem label="推广主页" prop="promotion">
                        <Input v-model="formItem.promotion" placeholder="请输入推广主页"></Input>
                    </FormItem>

                    <FormItem label="企业经营范围" prop="cust_scope">
                        <Input v-model="formItem.cust_scope" type="textarea" :rows="6" placeholder="请输入企业经营范围"></Input>
                    </FormItem>

                    <FormItem label="是否永久有效" prop="cust_forever">
                        <RadioGroup v-model="formItem.cust_forever">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="经营有效期至" prop="cust_deadline">
                        <DatePicker :disabled = "isDatePickAble" v-model="formItem.cust_deadline" type="date" placeholder="请选择有效期至" @on-change="dateChange"></DatePicker>
                    </FormItem>

                    <FormItem label="营业时间" prop="group_time">
                        <TimePicker type = "timerange" v-model="formItem.group_time" placeholder="请选择营业起止时间" @on-change="dateChange"></TimePicker>
                    </FormItem>

                    <FormItem label="常用经营场所" prop="cust_addr">
                        <Input v-model="formItem.cust_addr" placeholder="请输入经营场所"></Input>
                    </FormItem>

                    <FormItem label="经常联系人" prop="cust_linkname">
                        <Input v-model="formItem.cust_linkname" placeholder="请输入经常联系人"></Input>
                    </FormItem>

                    <FormItem label="联系手机" prop="cust_phone">
                        <Input v-model="formItem.cust_phone" placeholder="请输入联系手机号码"></Input>
                    </FormItem>

                    <FormItem label="申请经营类型" prop="type">
                        <RadioGroup v-model="formItem.type" type="button">
                            <Radio label="1">采购商</Radio>
                            <Radio label="2">配送商</Radio>
                            <Radio label="3">供应商</Radio>
                            <Radio label="4">物流商</Radio>
                            <!-- <Radio label="5" disabled>平台运营商</Radio>
                            <Radio label="6" disabled>仓储服务商</Radio>
                            <Radio label="7" disabled>产地供应商</Radio> -->
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="企业经营品类" prop = "catid">
                        <Tag type="dot" color="blue" v-for="item in categorys" :key="item.id" closable :name = "item.id" @on-close="handleClose2">{{ item.name }}</Tag>
                        <Button icon="ios-plus-empty" type="dashed" @click="handleCategorys">选择品类</Button>
                    </FormItem>
                </Row>
                <Row v-else-if="currentStep == 1" :gutter="16">
                    <Col span="24">
                    <Upload
                            ref="upload"
                            :default-file-list="defaultBusiness_licenseList"
                            :on-success="handleBusiness_licenseSuccess"
                            :on-error = "handleError"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            :on-remove = "clearBusiness_licenseList"
                            type="drag"
                            action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                            style="display: inline-block;width: 100%;">
                        <div style="padding: 20px 0;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>上传营业执照</p>
                        </div>
                    </Upload>
                    </Col>

                    <Col span="12">
                    <Upload
                            ref="upload"
                            :default-file-list="defaultId_card_positiveList"
                            :on-success="handleId_card_positiveSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            :on-remove = "clearId_card_positiveList"
                            type="drag"
                            action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                            style="display: inline-block;width: 100%; height: 80%;">
                        <div style="padding: 20px 0;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>身份证正面</p>
                        </div>
                    </Upload>
                    </Col>
                    <Col span="12">
                    <Upload
                            ref="upload"
                            :default-file-list="defaultId_card_reverseList"
                            :on-success="handleId_card_reverseSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            :on-remove = "clearId_card_reverseList"
                            type="drag"
                            action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                            style="display: inline-block;width: 100%">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>身份证背面</p>
                        </div>
                    </Upload>
                    </Col>
                </Row>
                <Row v-else-if="currentStep == 2" :gutter="16">
                    <Col span="24">
                    <Upload
                            ref="upload"
                            :default-file-list="defaultSpecial_business_licenseList"
                            :on-success="handleSpecial_business_licenseSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            :on-remove = "clearSpecial_business_licenseList"
                            type="drag"
                            action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                            style="display: inline-block;width: 100%;">
                        <div style="padding: 20px 0;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>其他经营证件上传（可添加多个）</p>
                        </div>
                    </Upload>
                    </Col>
                    <Col span="24">
                    <Upload
                            ref="upload"
                            :default-file-list="defaultLogList"
                            :on-success="handleLogSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            :on-remove = "clearLogList"
                            type="drag"
                            action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                            style="display: inline-block;width: 100%;">
                        <div style="padding: 20px 0;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>上传公司logo</p>
                        </div>
                    </Upload>
                    </Col>
                </Row>

                <Row v-else-if="currentStep == 3" :gutter="16">
                    <template>
                        <div style="width:100%;padding:20px 0;margin-bottom:20px;">
                            <div style="text-align:center">
                                <h1>尊敬的用户，平台将在3个工作日内对您所提交的材料进行审核!</h1>
                            </div>
                            <Row style="padding:20px">
                                <Col span="11">
                                    <div :bordered="false" style="margin-left:100px;width:100%;">
                                        <p slot="title">您可以从以下途径获得审核的结果：</p>
                                        <ul>
                                          <Form :model="formItem" label-position="left" :label-width="120" :rules="ruleValidate">
                                          <li>
                                            <FormItem label="邮箱：" prop = "cust_email">
                                                <Input v-model="formItem.cust_email" placeholder="经办人注册时的邮箱"></Input>
                                            </FormItem>
                                          </li>
                                          <li>
                                            <FormItem label="手机号码：" prop = "cust_phone">
                                                <Input v-model="formItem.cust_phone" placeholder="经办人注册时的手机号"></Input>
                                            </FormItem>
                                          </li>
                                          <li>
                                            您也可以登录本系统，在首页点击<a href="#">注册查询</a>，查询审核进度情况。
                                          </li>
                                          <li>
                                            您还可以关注右侧微信公众号，在公众号内查询。
                                          </li>
                                          </Form>
                                        </ul>
                                    </div>
                                </Col>
                                <Col span="11" offset="2">
                                    <div :bordered="false" style="margin-top:20px;">
                                        <div style="text-align:center">
                                            <img src="../../images/u26.png">
                                            <h3>(三果云官方微信公众号)</h3>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </template>
                </Row>
                <Row v-else-if="currentStep == 4" :gutter="16">
                    <div style="width:100%;padding:20px 0;margin-bottom:20px;">
                            <!-- <div style="text-align:center">
                                <h1>您的材料已提交审核......</h1>
                            </div> -->
                            <Row style="padding:20px">
                                <Col span="16">
                                    <div :bordered="false" style="margin-left:100px;width:100%;">
                                        <!-- <p slot="title">您可以从以下途径获得审核的结果：</p>
                                        <ul>
                                          <Form :model="formItem" label-position="left" :label-width="120" :rules="ruleValidate">
                                          <li>
                                            <FormItem label="邮箱：" prop = "cust_email">
                                                <Input v-model="formItem.cust_email" placeholder="经办人注册时的邮箱"></Input>
                                            </FormItem>
                                          </li>
                                          <li>
                                            <FormItem label="手机号码：" prop = "cust_phone">
                                                <Input v-model="formItem.cust_phone" placeholder="经办人注册时的手机号"></Input>
                                            </FormItem>
                                          </li>
                                          <li>
                                            您也可以登录本系统，在首页点击<a href="#">注册查询</a>，查询审核进度情况。
                                          </li>
                                          <li>
                                            您还可以关注右侧微信公众号，在公众号内查询。
                                          </li>
                                          </Form>
                                        </ul> -->
                                        <div style="text-align:center">
                                <h1>您的材料已提交审核......</h1>
                            </div>
                                        <p style = "text-align: center;margin-top: 18px; font-size: 18px;color: #999">请密切留意 邮箱 或 手机信息，或登录系统查询审核进度!</p>
                                        <div style = "text-align: center;margin-top: 35px;">
                                            <Dropdown placement="bottom-end" @on-click="handleLoginDemo">
                                            <a href="javascript:void(0)">
                                                <Icon type="arrow-down-b"></Icon> 立即登录（体验账户）
                                            </a>
                                            <DropdownMenu slot="list">
                                                <DropdownItem name="caigou1">采购商用户</DropdownItem>
                                                <DropdownItem name="peisong1">配送商用户</DropdownItem>
                                                <DropdownItem name="gongying1">供应商用户</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <Button type = "text" style = "margin-left: 10px;" @click = "logOut">退出</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col span="4" offset="">
                                    <div :bordered="false" style="margin-top:20px;">
                                        <div style="text-align:center">
                                            <img src="../../images/u26.png">
                                            <h3>(三果云官方微信公众号)</h3>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                </Row>
                <Row>
                    <Col span="24">
                    <Affix :offset-bottom="50">
                        <Button @click="handlePreSubmit" v-if="currentStep > 0 && currentStep < 4">上一步</Button>
                        <Button @click="handleNextSubmit" v-if="currentStep < 3" type="primary">下一步</Button>
                        <Button @click="handleFormSubmit" v-if="currentStep == 3" type="primary">提交审核</Button>
                    </Affix>
                    </Col>
                </Row>
            </Form>
        </Card>
    </Content>
</template>


<script>
import selectCategory from './../goods/components/select-category/select-category.vue';
import classifyCascade from '@/views/components/thrgo/custom/classify-cascade.vue';
import Util from '../../libs/util';
import Cookies from 'js-cookie';
export default {
    name: 'create',
    components: {
        selectCategory
    },

    data () {
        return {
            createStep: [],
            currentStep: 0,
            currentStatus: 'process',
            // 企业经营品类
            categorys: [
                /* {
                    'id': 5,
                    'name': '苹果'
                },
                {
                    'id': 6,
                    'name': '蔬菜'
                },
                {
                    'id': 7,
                    'name': '蔬菜1'
                },
                {
                    'id': 8,
                    'name': '蔬菜2'
                },
                {
                    'id': 9,
                    'name': '蔬菜3'
                } */
            ],
            categorysBuffer: [],

            defaultList: [
                /* {
                    'name': 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                },
                {
                    'name': 'bc7521e033abdd1e92222d733590f104',
                    'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                } */
            ],
            defaultBusiness_licenseList: [],
            defaultId_card_positiveList: [],
            defaultId_card_reverseList: [],
            defaultSpecial_business_licenseList: [],
            defaultLogList: [],
            imgName: '',
            visible: false,
            uploadList: [],

            formItem: {
                /* input: '',
                select: '',
                radio: 'male',
                checkbox: [],
                switch: true,
                date: '',
                time: '',
                slider: [20, 50],
                textarea: '' */
                name: '',
                fullname: '',
                logo: '',
                type: '',
                cust_scope: '',
                cust_represent: '',
                cust_linkname: '',
                cust_phone: '',
                cust_deadline: '',
                cust_forever: 0,
                cust_license: '',
                business_license: '',
                id_card_positive: '',
                id_card_reverse: '',
                special_business_license: '',
                user_id: window.localStorage['user_id'],
                cust_addr: '',
                catid: '',
                cust_email: '',
                // represent: '',
                promotion: '',
                open_time: '',
                group_time: ['', ''],
                end_time: ''
            },
            ruleValidate: {
                name: [
                    {required: true, message: '企业简称不能为空', trigger: 'blur'}
                ],
                fullname: [
                    {required: true, message: '企业全称不能为空', trigger: 'blur'}
                ],
                cust_license: [
                    {required: true, message: '社会信用代码不能为空或格式错误', trigger: 'blur',  pattern: /^\w\w\d{6}\w{9}\w$/}
                ],
                /* cust_represent: [
                    {required: true, message: '法定代表人名称不能为空', trigger: 'blur'}
                ], */
                cust_represent: [
                    {required: true, message: '公司法人名称不能为空', trigger: 'blur'}
                ],
                promotion: [
                    {required: true, message: '推广主业不能为空', trigger: 'blur'}
                ],
                cust_scope: [
                    {required: true, message: '企业经营范围不能为空', trigger: 'blur'}
                ],
                cust_deadline: [
                    {required: true, message: '经营有效期不能为空', trigger: 'blur'}
                ],
                cust_addr: [
                    {required: true, message: '常用经营场所不能为空', trigger: 'blur'}
                ],
                cust_linkname: [
                    {required: true, message: '经常联系人不能为空', trigger: 'blur'}
                ],
                cust_phone: [
                    {required: true, message: '联系电话不能为空或手机格式有误', trigger: 'blur', pattern: /^1[3|4|5|7|8|9][0-9]\d{4,8}$/}
                ],
                type: [
                    {required: true}
                ],
                catid: [
                    {required: true}
                ],
                cust_forever: [
                    {required: true}
                ],
                group_time: [
                    {required: true, message: '营业时间不能为空', trigger: 'blur'}
                ]
            }
        };
    },
    computed: {
        isDatePickAble () {
            return this.formItem.cust_forever === 1 ? true : false
        }
    },
    methods: {
        logOut () {
            localStorage['currentCustomStatus'] && localStorage.removeItem('currentCustomStatus')
            this.$store.commit('logout', this);
            this.$store.commit('clearOpenedSubmenu');
            this.$router.push({
                name: 'login'
            });
        },
        //  经营有效期至时间改变事件
        dateChange () {
            console.log(arguments)
        },
        // 弹窗选择产品分类
        handleCategorys () {
            /* this.$Modal.confirm({
                render: (h) => {
                    return h(selectCategory, {
                        props: {
                            muti: false,
                            title: '显示标题',
                            currentCategorys: this.categorys
                        },
                        on: {
                            input: (val) => {
                                this.value = val;
                            }
                        }
                    });
                }
            }); */
            this.$Modal.confirm({
                width: '1000px',
                onOk: () => {
                    this.categorysConfirm()
                },
                render: (h) => {
                    return h(classifyCascade, {
                        props: {
                            multiselect: true,
                            path: '/goods.goods_category/lists',
                            defaultData: this.categorys,
                            customParams: {pid: 0, custom_id: -1}
                        },
                        on: {
                            /* input: (val) => {
                                this.value = val;
                            } */
                            onclose: (categorys) => {
                                this.cascadeClose(categorys)
                            }
                        }
                    });
                }
            });
        },

        categorysConfirm () {
            this.categorys = JSON.parse(JSON.stringify(this.categorysBuffer))
        },

        cascadeClose (categorys) {
            var categorysBuffer = []
            categorys.forEach(elem => {
                categorysBuffer.push({
                    id: elem.id,
                    name: elem.name
                })
            });
            this.categorysBuffer = categorysBuffer
        },

        handleClose2 (e, name) {
            for (var i = 0; i < this.categorys.length; i++) {
                if(this.categorys[i].id === name) {
                    this.categorys.splice(i, 1)
                }
            }
        },

        handlePreSubmit () {
            this.currentStep--;
        },
        handleNextSubmit () {
            this.currentStep++;
        },
        clearBusiness_licenseList (file, fileList) {
            this.defaultBusiness_licenseList = []
            this.formItem.business_license = ''
        },
        clearId_card_positiveList (file, fileList) {
            this.defaultId_card_positiveList = []
            this.formItem.id_card_positive = ''
        },
        clearId_card_reverseList (file, fileList) {
            this.defaultId_card_reverseList = []
            this.formItem.id_card_reverse = ''
        },
        clearSpecial_business_licenseList (file, fileList) {
            for (var j = 0; j < this.defaultSpecial_business_licenseList.length; j++) {
                if (this.defaultSpecial_business_licenseList[j].name === file.name) {
                    this.defaultSpecial_business_licenseList.splice(j, 1)
                }
            }
            var i = this.formItem.special_business_license.indexOf(file.url)
            this.formItem.special_business_license.split('').splice(i, file.url.length + 1)
        },
        clearLogList (file, fileList) {
            this.defaultLogList = []
            this.formItem.logo = ''
        },
        handleFormSubmit () {
            if (this.formItem.cust_forever === 1) {
                this.formItem.cust_deadline = 0
            } else if (this.formItem.cust_forever === 0) {
                if (typeof this.formItem.cust_deadline !== 'number') {
                    this.formItem.cust_deadline = this.formItem.cust_deadline ? this.formItem.cust_deadline.getTime() : ''
                }
            }
            /* if (typeof this.formItem.open_time !== 'number') {
                this.formItem.open_time = this.formItem.open_time ? this.formItem.open_time.getTime() : ''
            }
            if (typeof this.formItem.end_time !== 'number') {
                this.formItem.end_time = this.formItem.end_time ? this.formItem.end_time.getTime() : ''
            }
            if ((this.formItem.end_time && this.formItem.open_time) && (this.formItem.end_time < this.formItem.open_time)) {
                this.$Notice.warning({
                    title: '出错啦！',
                    desc: '营业起止时间错误！'
                });
                return
            } */
            this.formItem.open_time = this.formItem.group_time[0]
            this.formItem.end_time = this.formItem.group_time[1]
            var catid = []
            for (var i = 0; i < this.categorys.length; i++) {
                // catid += `${String(this.categorys[i].id)},`
                catid.push(this.categorys[i].id)
            }
            catid = catid.join(',')
            this.formItem.catid = catid
            // this.formItem.special_business_license = this.formItem.special_business_license ? this.formItem.special_business_license.substr(0, this.formItem.special_business_license.length - 1) : ''
            var isPass = true
            for (var key in this.formItem) {
                if (key === 'cust_phone' && !(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(this.formItem[key]))) {
                    isPass = false
                    break
                }
                if (key === 'cust_license' && !(/^\w\w\d{6}\w{9}\w$/.test(this.formItem[key]))) {
                    isPass = false
                    break
                }
                if(this.formItem[key] === '' && key !== 'cust_email') {
                    isPass = false
                    break
                }
            }
            if (isPass) {
                Util.ajax.post('/custom.custom/create', this.formItem).then(resp => {
                    this.currentStep++;
                    localStorage.removeItem('isRecreate')
                })
            } else {
                /* this.$Message.error({
                    content: `表单填写有误，请返回重新填写！`,
                    duration: 3
                }); */
                this.$Notice.warning({
                    title: '出错啦！',
                    desc: '表单填写不完整或填写错误，请返回重新填写！'
                });
            }
        },

        handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        // 营业执照上传成功
        handleBusiness_licenseSuccess (res, file, fileList) {
            this.defaultBusiness_licenseList = [{
                name: res.result.name,
                url: res.result.url
            }]
            this.formItem.business_license = res.result.url;
            this.$Message.success({
                content: `营业执照上传成功`,
                duration: 3
            });
            // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        // 身份证正面
        handleId_card_positiveSuccess (res, file, fileList) {
            this.defaultId_card_positiveList = [{
                name: res.result.name,
                url: res.result.url
            }]
            this.formItem.id_card_positive = res.result.url;
            this.$Message.success({
                content: `身份证正面上传成功`,
                duration: 3
            });
        },
        // 身份证背面
        handleId_card_reverseSuccess (res, file, fileList) {
            this.defaultId_card_reverseList = [{
                name: res.result.name,
                url: res.result.url
            }]
            this.formItem.id_card_reverse = res.result.url;
            this.$Message.success({
                content: `身份证背面上传成功`,
                duration: 3
            });
        },
        // 其他经营证件上传
        handleSpecial_business_licenseSuccess (res, file, fileList) {
            this.defaultSpecial_business_licenseList.push({
                name: res.result.name,
                url: res.result.url
            })
            // this.formItem.special_business_license += `${res.result.url},`
            var urls = []
            for (var val of this.defaultSpecial_business_licenseList) {
                urls.push(val.url)
            }
            this.formItem.special_business_license = urls.join(',')
            // this.formItem.special_business_license = this.formItem.special_business_license.substr(0, this.formItem.special_business_license.length - 1)
            console.log(this.formItem.special_business_license)
            this.$Message.success({
                content: `其他经营证件上传成功`,
                duration: 3
            });
        },
        // 公司log上传
        handleLogSuccess (res, file, fileList) {
            this.defaultLogList = [{
                name: res.result.name,
                url: res.result.url
            }]
            this.formItem.logo = res.result.url;
            this.$Message.success({
                content: `公司logo上传成功`,
                duration: 3
            });
        },
        handleError (e, file, fileList) {
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式错误',
                desc: '文件【' + file.name + '】格式错误，请上传图片文件！'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件太大',
                desc: '文件【' + file.name + '】大小超过 2M.'
            });
        },
        handleBeforeUpload (file) {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to five pictures can be uploaded.'
                });
            }
            return check;
        },

        // 登录体验账户
        handleLoginDemo(val) {
            Util.ajax.post('/custom.user/access_token_login', {
                access_token_login: val
            }).then(res => {
                Cookies.set('user', res.username);
                window.localStorage['user_id'] = res.id
                this.$store.commit('setUser', res);
                this.$router.push({
                    name: 'home_index'
                });
            });
        },
        getIsCreatedCom () {
            Util.ajax.post('/custom.custom/check_detail_by_access', {}).then(resp => {
                if (resp) {
                    if (resp.cust_auditstate != 1) {
                        localStorage.currentCustomId = resp.user_id;
                        localStorage.currentCustomStatus = resp.cust_auditstate
                        this.$router.push({name: 'login'})
                    } else {
                        localStorage.currentCustomId = resp.user_id;
                        localStorage.currentCustomStatus = resp.cust_auditstate
                        this.$router.push({name: 'checkPage'})
                    }
                    
                }
            })
        }
    },

    beforeMount () {
        if (localStorage.isRecreate === '1') {
            return
        } else {
            this.getIsCreatedCom()
        }
    },

    mounted () {
        this.createStep = [
            {
                title: '基本信息',
                describe: '企业（个人从业者）基本信息'
            },
            {
                title: '资质文件',
                describe: '上传资质审核/审批文件'
            },
            {
                title: '经营信息',
                describe: '设定经营范围及补充信息'
            },
            {
                title: '系统审核',
                describe: '系统会在 3 个工作日内审核'
            }
        ];
    }
};
</script>
