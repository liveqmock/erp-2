<template>
    <Content class="margin-top-20">
        <Form :model="formItem" label-position="right" :label-width="200" :rules="ruleValidate">
            <Row style="margin-top:20px">
               
                <FormItem label="账户类型" prop="type">
                    <RadioGroup v-model="formItem.type"   type="button">
                        <Radio label="0">线1下账户</Radio>
                        <Radio label="1">在线账户</Radio>
                    </RadioGroup>
                </FormItem>
                  <FormItem label="银行卡号" prop="card_num">
                    <Input v-model="formItem.card_num" placeholder="银行卡号"></Input>
                </FormItem>   
                <FormItem label="账户名称" prop="name">
                    <Input v-model="formItem.name" placeholder="账户名称"></Input>
                </FormItem>   
                 <FormItem label="开户行" prop="open_bank">
                    <Input v-model="formItem.open_bank" placeholder="开户行"></Input>
                </FormItem> 
                <FormItem label="纳税人识别号" prop="ident_num">
                    <Input v-model="formItem.ident_num" placeholder="纳税人识别号"></Input>
                </FormItem> 
                <FormItem label="银行预留手机号" prop="mobile">
                    <Input v-model="formItem.mobile" placeholder="银行预留手机号"></Input>
                </FormItem> 
                <FormItem label="是否一般纳税人" prop="general_taxpayer">
                    <RadioGroup v-model="formItem.pay_type"   type="button">
                     <Radio label="0">否</Radio>
                     <Radio label="1">是</Radio>
                    </RadioGroup>
                </FormItem>
              
                <FormItem label="地址" prop="address">
                    <Input v-model="formItem.address" placeholder="地址"></Input>
                </FormItem>
                <FormItem label="座机" prop="phone">
                    <Input v-model="formItem.phone" placeholder="座机"></Input>
                </FormItem>
                 <FormItem label="默认" prop="default">
                     <i-switch  v-model="formItem.default" size="large">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </FormItem> 
                <FormItem label="禁用" prop="status">
                     <i-switch  v-model="formItem.status" size="large">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </FormItem>
                
            </Row>
        </Form>
    </Content>
</template>

<script>
    export default {
        name: 'creatadd',
        props:{
            type:Object,
            formItem:Object

        },
        data () {
            return {
                value2:'',
                value3: '',
                ruleValidate: {
                    type: [
                        {required: true, message: '账户类型不能为空', trigger: 'blur'}
                    ],
                    card_num: [
                        {required: true, message: '银行卡号不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '账户名称不能为空', trigger: 'blur'}
                    ],
                    open_bank: [
                        {required: true, message: '开户行不能为空', trigger: 'blur'}
                    ],
                    ident_num: [
                        {required: true, message: '纳税人识别号不能为空', trigger: 'blur'}
                    ],
                     mobile: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ]
                },
                buy_type:'',
               
                checkAllGroup:[],
                area: [{
                    value: 'beijing',
                    label: '北京',
                    code: 100000,
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫',
                            code: 100001
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                            code: 100002
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                            code: 100003
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    code: 200000,
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            code: 200100,
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                    code: 200101
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            code: 200200,
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                    code: 200201
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                    code: 200202
                                }
                            ]
                        }
                    ],
                }],
                area_id: []
            };
        },
        methods: {

            
        }
    };
</script>

<style scoped>

</style>
