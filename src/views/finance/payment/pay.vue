<template>
    <Content>
        <Tabs value="payment">
            <TabPane label="立即支付" name="payment">
                <Row class="margin-top-20">
                    <Card>
                        <Form :model="formItem" ref="formItem" label-position="right" :label-width="120" :rules="ruleValidate">
                            <Row style="margin-top:20px">
                                <FormItem label="待付金额">
                                    <div>
                                        <font style="font-weight:bold;font-size:18px;color:red">{{this.bill.surplus_price}}</font>
                                    </div>
                                </FormItem>

                                <FormItem label="支付金额" prop="money">
                                    <InputNumber :min="0" :step="0.01" v-model="formItem.money"></InputNumber>
                                </FormItem>

                                <FormItem label="支付类型" prop="type">
                                    <RadioGroup v-model="formItem.type" type="button">
                                     <Radio label="online">线上</Radio>
                                     <Radio label="offline">线下</Radio>
                                    </RadioGroup>
                                </FormItem>

                                <FormItem label="支付方式" prop="method" v-if="formItem.type == 'online'">
                                    <RadioGroup v-model="formItem.method" type="button">
                                     <Radio label="alipay" :disabled="disabled_alipay">支付宝支付</Radio>
                                     <Radio label="wechat" :disabled="disabled_wepay">微信支付</Radio>
                                    </RadioGroup>
                                </FormItem>

                                <FormItem label="支付方式" prop="method" v-if="formItem.type == 'offline'">
                                    <RadioGroup v-model="formItem.method" type="button">
                                     <Radio label="cash">现金支付</Radio>
                                     <Radio label="transfer">转账支付</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Row>
                        </Form>
                    </Card>
                </Row>
            </TabPane>
        </Tabs>

        <Modal v-model="qrcodemodel" title="微信 - 扫一扫支付">
            <div id="qrcode" ref="qrcode" style="margin-left:90px;"></div>
        </Modal>
        <submitAffix
                okValue="立即支付"
                cancelValue="取消"
                @onOk="handleSubmit"
                @onCancel="handleCancel"
        />
    </Content>
</template>

<script>
    import Util from '@/libs/util';
    import QRCode from 'qrcodejs2';
    import submitAffix from '@/views/components/thrgo/custom/submit-affix.vue';

    export default {
        components: {
            submitAffix
        },
        data () {
            return {
                disabled_wepay: true,
                disabled_alipay: true,
                loading: true,
                qr_code: '',
                qrcodemodel: false,
                bill_id: this.$route.query.bill_id,
                bill: {},
                formItem: {
                    money: 0,
                    type:'',                    
                    method: ''
                },
                ruleValidate: {
                    'money': [
                        {required: true, message: '支付金额错误', trigger: 'blur', pattern: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/}
                    ],
                    'type': [
                        {required: true, message: '支付类型不能为空', trigger: 'blur'}
                    ],
                    'method': [
                        {required: true, message: '支付方式不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            init () {
                if (this.bill_id){
                    Util.ajax.post('/finance.finance_bill/info', {
                        id : this.bill_id
                    }).then(resp => {
                        this.bill = resp;
                    })
                }
            },
            qrcode () {
                document.getElementById("qrcode").innerHTML = '';
                let qrcode = new QRCode(document.getElementById("qrcode"), {  
                        width : 300,//设置宽高  
                        height : 300
                    });
                qrcode.makeCode(this.qr_code);
            },
            handleSubmit() {
                this.$refs.formItem.validate((valis => {
                })).then((res) => {
                    if (res === true) {
                        let data = {};
                        data.bill_id = this.bill_id;
                        data.amount = this.formItem.money;
                        data.type  = this.formItem.type;
                        data.method = this.formItem.method;
                        Util.ajax.post('/finance.finance_bill/payment', data).then(resp => {
                            //在线支付
                            if (data.type == 'online'){
                                if (data.method == 'wechat'){
                                    this.qr_code = resp.code_url;
                                    this.qrcode();
                                    this.qrcodemodel = true;
                                    let interval = setInterval(() => {
                                        Util.ajax.post('/finance.finance_bill/pay_status', 
                                                {out_trade_no : resp.out_trade_no}
                                            ).then(_resp => {
                                            if (_resp.pay_time > 0){
                                                this.$Message.success({
                                                    content: `支付成功，正在跳转`,
                                                    duration: 3
                                                });
                                                setTimeout(() => {
                                                    this.$router.push({path: `/finance/payment`})
                                                }, 1000);
                                                clearInterval(interval);
                                                this.qrcodemodel = false;
                                                this.handleCancel();
                                            }
                                        })
                                    },3000);
                                }else if(data.method == 'alipay'){
                                    const div = document.createElement('div');
                                    div.innerHTML = resp.form;
                                    document.body.appendChild(div);
                                    document.forms.alipaysubmit.submit();
                                }
                            }else{
                                this.$Message.success({
                                    content: `支付成功，正在跳转`,
                                    duration: 3
                                });
                                setTimeout(() => {
                                    this.$router.push({path: `/finance/payment`})
                                }, 1000);
                            }
                        })
                    } else {
                        this.$Message.error({
                            content: `表单验证错误！请重新填写！`,
                            duration: 3
                        });
                    }
                })
            },
            handleCancel () {
                this.$store.commit('removeTag', 'finance_payment_pay');
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
            }
        },
        mounted () {
            this.bill_id = this.$route.query.bill_id,
            this.init();
        },
        watch: {
            "formItem.type": {
                handler(cur, old) {
                    if (this.bill.account){
                        if (this.bill.account.alipay.status == 1){
                            this.disabled_alipay = false
                        }
                        if (this.bill.account.wechat.status == 1){
                            this.disabled_wepay = false
                        }
                    }
                    this.formItem.method = '';
                }                
            }
        }
    };
</script>