<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Modal v-model = "pwdModStatus" title ="修改密码">
            <Form :model = "pwdFormData" label-position="right" :label-width="100" :rules="pwdRule" ref = "pwdForm">
                <FormItem label = "旧密码" prop = "oldpassword">
                    <Input v-model="pwdFormData.oldpassword" placeholder="请输入旧密码" type = "password"></Input>
                </FormItem>
                <FormItem label = "新密码" prop = "password">
                    <Input v-model="pwdFormData.password" placeholder="请输入新密码" type = "password"></Input>
                </FormItem>
                <FormItem label = "确认新密码" prop = "repassword">
                    <Input v-model="pwdFormData.repassword" placeholder="请再次输入密码" type = "password"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelPwd">取消</Button>
                <Button type="primary" @click="savePwd">确认</Button>
            </div>
        </Modal>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <Button slot="extra" type = "primary" size = "small" @click = "pwdMod">
                修改密码
            </Button>
            <div>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="120" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <!-- <Row>
                        <Col span = "10">
                        
                        </Col>
                        <Col span = "10" offset = "2">
                        
                        </Col>
                    </Row> -->
                    <Row>
                        <Col span = "10">
                            <FormItem label="用户帐号：" prop="name">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userForm.name" :disabled = "true"></Input>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span = "10" offset = "2">
                            <FormItem label="联系人：" prop="cust_linkname">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userForm.cust_linkname" ></Input>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span = "10">
                            <FormItem label="联系人电话：" prop="cust_phone">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userForm.cust_phone" ></Input>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span = "10" offset = "2">
                            <FormItem label="常用经营场所：" prop="cust_addr">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userForm.cust_addr" ></Input>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span = "10">
                            <FormItem label="经营范围：" prop="cust_scope">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userForm.cust_scope" type = "textarea" :rows="5"></Input>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span = "10" offset = "2">
                        <div class = "flexboxs">
                            <span class = "imgLabel">企业logo：</span>
                            <div class = "logoUpload">
                              <!-- <span><input type="file" ref = "logoInput"></span> -->
                              <div class = "loadArea">
                                <div class = "oldImg">
                                  <img :src="logOldImgUrl" alt="">
                                </div>
                                <div class = "newImg">
                                  <Upload
                                      ref="upload"
                                      :show-upload-list = "false"
                                      :on-success="handleLogSuccess"
                                      :format="['jpg','jpeg','png']"
                                      :max-size="2048"
                                      type="drag"
                                      action="http://api.3gys.cn/index.php/api/v1/attachment/attachment/upload"
                                      style="display: inline-block;width: 100%;height: 140px">
                                    <div style = "padding: 13px 0">
                                      <Icon type="ios-cloud-upload" size="50" style="color: #3399ff"></Icon>
                                      <p class = "imgUploadWord">点击上传logo</p>
                                    </div>
                                  </Upload>
                                </div>
                              </div>
                              <!-- <p>上传系统LOGO</p> -->
                            </div>
                        </div>
                        </Col>
                    </Row>
                    <!-- <FormItem label="企业logo：" prop="logo">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.logo" ></Input>
                        </div>
                    </FormItem> -->
                    <!-- <FormItem label="公司：">
                        <span>{{ userForm.company }}</span>
                    </FormItem>
                    <FormItem label="部门：">
                        <span>{{ userForm.department }}</span>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem> -->
                </Form>
                <Form :model = "userInfo" :label-width="120" label-position="right">
                    <Row>
                        <Col span = "10">
                            <FormItem label="企业简称：" prop="name">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userInfo.name" placeholder="请输入企业简称" :disabled = "true"></Input>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span = "10" offset = "2">
                            <FormItem label="企业全称：" prop="fullname">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userInfo.fullname" placeholder="请输入企业法定名称" :disabled = "true"></Input>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span = "10">
                            <FormItem label="社会信用代码：" prop="cust_license">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userInfo.cust_license" placeholder="请输入社会信用代码" :disabled = "true"></Input>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span = "10" offset = "2">
                            <FormItem label="法定代表人：" prop="cust_represent">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userInfo.cust_represent" placeholder="请输入法定代表人名称" :disabled = "true"></Input>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span = "10">
                            <FormItem label="推广主页：" prop="promotion">
                                <div style="display:inline-block;width:300px;">
                                    <Input v-model="userInfo.promotion" placeholder="请输入推广主页" :disabled = "true"></Input>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span = "10" offset = "2">
                            <FormItem label="经营有效期至：" prop="cust_deadline">
                                <div style="display:inline-block;width:300px;">
                                    <DatePicker :disabled = "true" v-model="userInfo.cust_deadline" type="date" placeholder="请选择有效期至"></DatePicker>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <div>
                        <Button type="text" @click="cancelEdit">取消</Button>
                        <Button type="primary" style="width: 100px;" @click="saveEdit">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <!-- <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal> -->
    </div>
</template>

<script>
import Util from '@/libs/util'

export default {
    name: 'ownspace_index',
    data () {
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            pwdModStatus: false,
            pwdFormData: {
                oldpassword: '',
                password: '',
                repassword: ''
            },
            logOldImgUrl: '',
            userForm: {
                name: '',
                cust_scope: '',
                cust_linkname: '',
                cust_phone: '',
                cust_addr: '',
                logo: ''
            },
            userInfo: {
                name: '',
                fullname: '',
                cust_license: '',
                cust_represent: '',
                promotion: '',
                cust_deadline: ''
            },
            uid: '', // 登录用户的userId
            securityCode: '', // 验证码
            phoneHasChanged: false, // 是否编辑了手机
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            identifyCodeRight: false, // 验证码是否正确
            hasGetIdentifyCode: false, // 是否点了获取验证码
            canGetIdentifyCode: false, // 是否可点获取验证码
            checkIdentifyCodeLoading: false,
            inforValidate: {
                cust_linkname: [
                    {required: true, message: '经常联系人不能为空', trigger: 'blur'}
                ],
                cust_phone: [
                    {required: true, message: '联系电话不能为空或手机格式有误', trigger: 'blur', pattern: /^1[3|4|5|7|8][0-9]\d{4,8}$/}
                ],
                cust_addr: [
                    {required: true, message: '常用经营场所不能为空', trigger: 'blur'}
                ],
                cust_scope: [
                    {required: true, message: '企业经营范围不能为空', trigger: 'blur'}
                ],
            },
            pwdRule: {
                password: [{required: true, message: "密码长度为6~16位字母数字混合", trigger: "blur", pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/}],
                repassword: [{required: true, message: "确认密码不能为空", trigger: "blur" }],
                oldpassword: [{required: true, message: "旧密码不能为空", trigger: "blur" }]
            },
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
            inputCodeVisible: false, // 显示填写验证码box
            initPhone: '',
            gettingIdentifyCodeBtnContent: '获取验证码' // “获取验证码”按钮的文字
        };
    },
    methods: {
        getIdentifyCode () {
            this.hasGetIdentifyCode = true;
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    this.canGetIdentifyCode = true;
                    let timeLast = 60;
                    let timer = setInterval(() => {
                        if (timeLast >= 0) {
                            this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试';
                            timeLast -= 1;
                        } else {
                            clearInterval(timer);
                            this.gettingIdentifyCodeBtnContent = '获取验证码';
                            this.canGetIdentifyCode = false;
                        }
                    }, 1000);
                    this.inputCodeVisible = true;
                    // you can write ajax request here
                }
            });
        },
        showEditPassword () {
            this.editPasswordModal = true;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        cancelEdit () {
            this.getCompanyInfo()
        },
        saveEdit () {
            /* this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    if (this.phoneHasChanged && this.userForm.cellphone !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
                        if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                            if (this.identifyCodeRight) { // 判断验证码是否正确
                                this.saveInfoAjax();
                            } else {
                                this.$Message.error('验证码错误，请重新输入');
                            }
                        } else {
                            this.$Message.warning('请先点击获取验证码');
                        }
                    } else {
                        this.saveInfoAjax();
                    }
                }
            }); */
            for (var key in this.userForm) {
                if (this.userForm[key] === '') {
                    this.$Message.error({
                        content: '表单填写不完整！',
                        duration: 3
                    })
                    return
                }
            }
            var data = JSON.parse(JSON.stringify(this.userForm))
            delete data.name
            Util.ajax.post('/custom.custom/save', data).then(resp => {
                debugger
                this.getCompanyInfo()
                this.$Message.success({
                    content: '修改成功！',
                    duration: 3
                })
            })
        },
        cancelEditPass () {
            this.editPasswordModal = false;
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;
                    // you can write ajax request here
                }
            });
        },
        init () {
            this.userForm.name = 'Lison';
            this.userForm.cellphone = '17712345678';
            this.initPhone = '17712345678';
            this.userForm.company = 'TalkingData';
            this.userForm.department = '可视化部门';
        },
        cancelInputCodeBox () {
            this.inputCodeVisible = false;
            this.userForm.cellphone = this.initPhone;
        },
        submitCode () {
            let vm = this;
            vm.checkIdentifyCodeLoading = true;
            if (this.securityCode.length === 0) {
                this.$Message.error('请填写短信验证码');
            } else {
                setTimeout(() => {
                    this.$Message.success('验证码正确');
                    this.inputCodeVisible = false;
                    this.checkIdentifyCodeLoading = false;
                }, 1000);
            }
        },
        hasChangePhone () {
            this.phoneHasChanged = true;
            this.hasGetIdentifyCode = false;
            this.identifyCodeRight = false;
        },
        saveInfoAjax () {
            this.save_loading = true;
            setTimeout(() => {
                this.$Message.success('保存成功');
                this.save_loading = false;
            }, 1000);
        },
        // 获取当前用户企业信息
        getCompanyInfo () {
            var me = this
            Util.ajax.post('/custom.custom/detail', {
                id: localStorage.currentCustomId,
                relations: ['user']
            }).then(resp => {
                debugger
                this.userForm.cust_scope = resp.cust_scope
                this.userForm.cust_linkname = resp.cust_linkname
                this.userForm.cust_phone = resp.cust_phone
                this.userForm.cust_addr = resp.cust_addr
                this.userForm.logo = resp.logo
                this.userForm.name = resp.user.username
                this.logOldImgUrl = resp.logo
                this.userInfo.name = resp.name
                this.userInfo.fullname = resp.fullname
                this.userInfo.cust_license = resp.cust_license
                this.userInfo.cust_represent = resp.cust_represent
                this.userInfo.promotion = resp.promotion
                this.userInfo.cust_deadline = new Date(Number(resp.cust_deadline) * 1000)
            })
        },
        // logo上传成功事件
        handleLogSuccess (res, file, fileList) {
            /* this.defaultLogList = [{
                name: res.result.name,
                url: res.result.url
            }] */
            this.logOldImgUrl = res.result.url
            this.userForm.logo = res.result.url;
            this.$Message.success({
                content: `公司logo上传成功`,
                duration: 3
            });
        },
        // 修改密码
        pwdMod () {
            this.pwdModStatus = true
        },
        cancelPwd () {
            debugger
            for (var key in this.pwdFormData) {
                this.pwdFormData[key] = ''
            }
            this.pwdModStatus = false
        },
        savePwd () {
            debugger
            this.$refs.pwdForm.validate(valid => {
                debugger
                if (valid) {
                    if (this.pwdFormData.password !== this.pwdFormData.repassword) {
                        this.$Message.error({
                            content: '两次输入新密码不一致！',
                            duration: 3
                        })
                        return
                    } 
                    Util.ajax.post('/custom.user/edit_password', this.pwdFormData).then(resp => {
                        debugger
                        this.$Message.success({
                            content: '修改成功！请重新登录！',
                            duration: 3
                        })
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                    })
                } else {
                    this.$Message.error({
                        content: '表单填写不完整！',
                        duration: 3
                    })
                }
            })
        }
    },
    mounted () {
        this.init();
        this.getCompanyInfo()
    }
};
</script>
<style lang="less" scoped>
.logoUpload {
    display: inline-block;
    .loadArea {
      width: 100%;
      height: 100px;
      // padding: 0 10px;

      position: relative;
      .oldImg {
        margin:auto;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        border: 1px solid #dddee1;
        // background: url("../../../assets/img/sceImgBuffer.png") no-repeat center;
        background-size: cover;
        > img {
          height: 100px;
          width: 100px;
        }
      }
      .newImg {
        position: absolute;
        top: 0;
        @diff: 50px;
        left: calc(~"50% - @{diff}");
        width: 100px;
        height: 100px;
        border-radius: 20px;
        opacity: 0;
        &:hover {
          opacity: 0.8
        }
        .imgUploadWord {
          text-align: center;
          font-size: 12px;
          color: #3399ff;
          height: 16px;
        }
      }
    }
    text-align: center;
    /* input[type="file"] {
      display: inline-block;
      opacity: 0;
      height: 140px;
      width: 140px;
      border-radius: 50%;
      cursor: pointer;
    } */
    span {
      display: inline-block;
      height: 150px;
      width: 150px;
      border: 1px solid #dddee1;
      border-radius: 50%;
      background-color: #fff; 
      // background: url("../../assets/img/logobig.png") no-repeat center;
      background-size: 100px 100px;
      outline: none;
    }
    p {
      margin-top: 6px;
      font-size: 14px;
      color: #58b33e;
    }
  }
  .imgLabel {
      display: inline-block;
      width: 120px;
      text-align: right;
      font-size: 12px;
      padding: 10px 12px 10px 0;
  }
  .flexboxs {
    display: flex;
    justify-content: flex-start;
    align-items: top;
    flex-wrap: wrap;
  }
</style>

