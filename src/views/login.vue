<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    {{title}}
                </p>
                <div v-show="status === true" class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rulesLog">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">没有帐号？立即 <a @click="loginStatusToggle">注册</a></p>
                </div>

                <div v-show="status === false" class="form-com">
                    <Form ref="registerForm" :model="registerForm" :rules="rulesRegister">
                        <FormItem prop="username">
                            <Input v-model="registerForm.username" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="mobile" style="text-align: right">
                            <Input v-model="registerForm.mobile" placeholder="请输入手机号码">
                            <span slot="prepend">
                                    <Icon :size="16" type="android-phone-portrait"></Icon>
                                </span>
                            </Input>
                            <Button type="dashed" size="small" @click="getMobileCode" :disabled="!getCodeStatus">
                                {{codeStatus}}
                            </Button>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="registerForm.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>

                        <FormItem prop="repassword">
                            <Input type="password" v-model="registerForm.repassword" placeholder="请再次输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="code">
                            <Input v-model="registerForm.code" placeholder="请输入验证码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>


                        <FormItem>
                            <Button @click="registerSubmit" type="primary" long>注册</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">返回 <a @click="loginStatusToggle">登录</a></p>
                </div>

            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import Util from '@/libs/util';

    export default {
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                },
                rulesLog: {
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                },
                rulesRegister: {
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "密码长度为6~16位字母数字混合", trigger: "blur", pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/}
                    ],
                    repassword: [
                        {required: true, message: "密码长度为6~16位字母数字混合", trigger: "blur", pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/}
                    ],
                    code: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                },
                registerForm: {
                    username: '',
                    mobile: '',
                    password: '',
                    repassword: '',
                    code: ''
                },
                status: true,
                // 获取短信验证码状态 true可获取，false等待
                getCodeStatus: true,
                // 短信验证码获取间隔
                codeTime: 60
            };
        },
        computed: {
            title() {
                return this.status === true ? '欢迎登录' : '欢迎注册'
            },
            codeStatus() {
                return this.getCodeStatus === true ? '获取验证码' : `验证码已发送(${this.codeTime}s后可再次发送)`
            }
        },
        methods: {
            // 获取手机验证码
            getMobileCode() {
                //调取api
                if (this.registerForm.mobile) {
                    Util.ajax.post('/notification/sendsms', {
                        mobile: this.registerForm.mobile,
                        tpl_id: 'register'
                        // tpl_vars: null
                    }).then(resp => {
                        if (resp) {
                            this.getCodeStatus = false
                            var codeTimer = setInterval(() => {
                                this.codeTime--
                                if (this.codeTime === 0) {
                                    clearInterval(codeTimer)
                                    this.getCodeStatus = true
                                    this.codeTime = 60
                                }
                            }, 1000)
                        }
                    })
                }
            },
            // 登录注册状态切换
            loginStatusToggle() {
                this.status = !this.status
            },
            handleSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    let that = this;
                    if (valid) {
                        Util.ajax.post('/custom/user/login', this.form)
                            .then(function (res) {
                                Cookies.set('user', that.form.username);
                                window.localStorage['user_id'] = res.id
                                that.$store.commit('setUser', res);
                                var status = 0
                                for (var i = 0; i < res.permission.length; i++) {
                                    if (res.permission[i].custom_info && (res.permission[i].custom_info.cust_auditstate == 1)) {
                                        that.$router.push({
                                            name: 'home_index'
                                        });
                                        return
                                    }
                                }
                                res.permission.length != 0 && res.permission[0].custom_info && (localStorage['currentCustomStatus'] = res.permission[0].custom_info.cust_auditstate)
                                that.$router.push({
                                    name: 'checkPage'
                                });
                            }, function (err) {

                            });
                    }
                });
            },
            registerSubmit() {
                this.$refs.registerForm.validate((valis => {
                })).then((res) => {
                    if (res === true) {
                        Util.ajax.post('/custom.user/register', {
                            username: this.registerForm.username,
                            mobile: this.registerForm.mobile,
                            password: this.registerForm.password,
                            repassword: this.registerForm.repassword,
                            code: this.registerForm.code
                        }).then(resp => {

                            this.status = true
                            this.$Message.success({
                                content: `注册成功，请登录！`,
                                duration: 3
                            });
                        })
                    } else {
                        this.$Message.error({
                            content: `表单验证错误！请重新填写！`,
                            duration: 3
                        });
                    }
                })

            }
        }
    };
</script>

<style>

</style>
