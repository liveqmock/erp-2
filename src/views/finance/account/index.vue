<template>
    <Content>
        <Tabs value="offline">
            <TabPane label="线下" name="offline">
                <Row class="margin-bottom-10">
                    <Col span="24">
                        <Button type="primary" @click = "newOrModOffAccount(0)">增加账户</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <thrgo-table
                            ref = "accountTable"
                            :border="false"
                            path="/finance.finance_account/lists"
                            :params="params"
                            :pagination="true"
                            :columns="columns"
                            :loading="true"
                        ></thrgo-table>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="线上" name="online">
                <Row>
                    <div class = "flexboxs">
                        <Card class = "accountCard">
                            <p slot="title">
                                <!-- <Icon type="ios-film-outline"></Icon> -->
                                微信支付
                            </p>
                            <a slot="extra" @click.prevent="weChatStatus === 1 ? newWeChatAccount(1) : newWeChatAccount(0)">
                                <Icon type="gear-b"></Icon>
                                {{weChatTxt}}
                            </a>
                            <div class="tips">
                                需您开通微信服务号，并与腾讯公司签约收款服务；交易手续费由腾讯公司向收款方收取，本平台不收取任何相关费用。
                            </div>
                            <div class = "foot">
                                <a @click.prevent="delOnlineAccount('wechat')" v-if = "weChatStatus === 1">
                                <Icon type="ios-trash-outline"></Icon>
                                    已开通，点击删除账户
                                </a>
                                <!-- <a @click.prevent="changeLimit" v-if = "weChatStatus === 0">
                                <Icon type="ios-color-wand"></Icon>
                                    未开通，点击开通
                                </a> -->
                            </div>
                        </Card>
                        <Card class = "accountCard">
                            <p slot="title">
                                <!-- <Icon type="ios-film-outline"></Icon> -->
                                支付宝支付
                            </p>
                            <a slot="extra" @click.prevent="aliPayStatus === 1 ? newAlipayAccount(1) : newAlipayAccount(0)">
                                <Icon type="gear-b"></Icon>
                                {{aliPayTxt}}
                            </a>
                            <div class="tips">
                                需开通企业支付宝账号，仅支持以企业对公账户作为收款账户。交易手续费由支付宝公司向收款方收取，本平台不收取任何相关费用。
                            </div>
                            <div class = "foot">
                                <a @click.prevent="delOnlineAccount('alipay')" v-if = "aliPayStatus === 1">
                                <Icon type="ios-trash-outline"></Icon>
                                    已开通，点击删除账户
                                </a>
                                <!-- <a @click.prevent="changeLimit" v-if = "aliPayStatus === 0">
                                <Icon type="ios-color-wand"></Icon>
                                    未开通，点击开通
                                </a> -->
                            </div>
                        </Card>
                    </div>
                </Row>
            </TabPane>
        </Tabs>
    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import addOrMod from './addOrMod.vue'
    import Util from '@/libs/util'

    export default {
        name: 'finance_index',
        components: {
            thrgoTable
        },
        data () {
            return {
                loading: true,
                // 账户新增或编辑状态，0新增，1修改编辑
                newOrModStatus: 0,
                // 线上线下状态 0线下， 1线上
                offOrOnStatus: 0,
                // 微信账户状态 0未开通，1开通
                weChatStatus: 0,
                // 支付宝账户状态 0未开通，1开通
                aliPayStatus: 0,
                // 微信配置对象
                weChatOb: {},
                // 支付宝配置对象
                aliPayOb: {},
                // 线上数据id
                onlineId: '',
                // 新增账户数据缓存
                newAccountBufferData: {
                    type: 0,
                    general_taxpayer: 0,
                    default: 0,
                    status: 1,
                    online_config: {}
                },
                columns: [
                    {
                        title: '账户名称',
                        key: 'name',
                        width: 200,
                        fixed: 'left',
                        sortable: true,
                    },
                    {
                        title: '开户行',
                        key: 'open_bank',
                        align: 'left',
                    },
                    {
                        title: '银行账号',
                        key: 'card_num',
                        sortable: true,
                        width: 200,
                    },
                    {
                        title: '纳税人识别号',
                        width: 200,
                        key: 'ident_num',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '是否一般纳税人',
                        width: 160,
                        key: 'general_taxpayer',
                        sortable: true,
                        filters: [
                            {
                                label: '是',
                                value: 1
                            },
                            {
                                label: '否',
                                value: 0
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            return row.general_taxpayer === value;
                        },
                        render: (h, params) => {
                            return params.row.general_taxpayer_text;
                        }
                    },
                    {
                        title: '地址(银行开户预留)',
                        width: 300,
                        key: 'address',
                        ellipsis: true,
                    },
                    {
                        title: '座机(银行开户预留)',
                        width: 160,
                        key: 'phone',
                        sortable: true,
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        fixed: 'right',
                        width:200,
                        className: 'operate',
                        render: (h, params) => {
                            let buttons = [];
                            var me = this
                            // console.log(params.row)
                            switch(params.row.default) {
                                case 1:
                                buttons.push(
                                    h('Button', {
                                        style: {
                                            margin: '5px 5px'
                                        },
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                me.newOrModOffAccount(1, params)
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        style: {
                                            margin: '5px 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'trash-a'
                                        },
                                        on: {
                                            click: () => {
                                                me.delOfflineAccount(params)
                                            }
                                        }
                                    }, '删除')
                                );
                                break;
                                case 0:
                                buttons.push(
                                    h('Button', {
                                        style: {
                                            margin: '5px 5px'
                                        },
                                        props: {
                                            type: 'info',
                                            size: 'small',
                                            icon: 'ios-color-wand'
                                        },
                                        on: {
                                            click: () => {
                                                me.setDefault(params)
                                            }
                                        }
                                    }, '设为默认'),
                                    h('Button', {
                                        style: {
                                            margin: '5px 5px'
                                        },
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        on: {
                                            click: () => {
                                                me.newOrModOffAccount(1, params)
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        style: {
                                            margin: '5px 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'trash-a'
                                        },
                                        on: {
                                            click: () => {
                                                me.delOfflineAccount(params)
                                            }
                                        }
                                    }, '删除')
                                );
                                break;
                            }
                            return h('div', buttons);
                        }
                    }
                ],
                params: {
                    type: 0,
                    // relations: ['seller','category','brand'],
                    // attrs: ['skusCount'],
                    limit: 13,
                    page: 1
                }
            };
        },
        computed: {
            weChatTxt () {
                return this.weChatStatus === 0 ? '设置收款帐号(未开通)' : '设置收款帐号(已开通)'
            },
            aliPayTxt () {
                return this.aliPayStatus === 0 ? '设置收款帐号(未开通)' : '设置收款帐号(已开通)'
            }
        },
        methods: {
            // 取消提交表单
            cancelForm () {

            },
            // 提交表单数据
            submitForm () {
                // debugger
                // console.log(this.newAccountBufferData)
                // if (!this.newAccountBufferData.to_custom_id || !this.newLogisticsBufferData.category_ids) return
                if (this.offOrOnStatus === 0) {
                    if (this.newOrModStatus === 0) {
                        Util.ajax.post('/finance/finance_account/add', this.newAccountBufferData).then(resp => {
                            // debugger
                            this.$refs.accountTable.init()
                            this.$Message.success({
                                content: `账户添加成功！`,
                                duration: 3
                            });
                        })
                    } else if (this.newOrModStatus === 1) {// this.newAccountBufferData
                        Util.ajax.post('/finance/finance_account/edit', this.newAccountBufferData).then(resp => {
                            // debugger
                            this.$refs.accountTable.init()
                            this.$Message.success({
                                content: `账户修改成功！`,
                                duration: 3
                            });
                        })
                    }
                    
                } else {
                    if (this.newOrModStatus === 0) {
                        Util.ajax.post('/finance/finance_account/add', this.newAccountBufferData).then(resp => {
                            // debugger
                            this.getOnlineAccount()
                            this.$Message.success({
                                content: `账户添加成功！`,
                                duration: 3
                            });
                        })
                    } else if (this.newOrModStatus === 1) {
                        Util.ajax.post('/finance/finance_account/edit', this.newAccountBufferData).then(resp => {
                            // debugger
                            this.$Message.success({
                                content: `账户修改成功！`,
                                duration: 3
                            });
                        })
                    }
                }
            },
            // 添加或编辑线下账户
            newOrModOffAccount (status, params) {
                // debugger
                var me = this
                if (status === 0) {
                    me.newAccountBufferData = {
                        type: 0,
                        general_taxpayer: 0,
                        default: 0,
                        status: 1,
                        online_config: {}
                    }
                } else if (status === 1) {
                    // debugger
                    var rowObj = params.row
                    delete rowObj.create_time
                    delete rowObj.update_time
                    delete rowObj.delete_time
                    me.newAccountBufferData = JSON.parse(JSON.stringify(rowObj))
                }
                this.offOrOnStatus = 0
                this.newOrModStatus = status
                this.newAccountBufferData.type = 0
                this.$Modal.confirm({
                    title: '新增线下账户',
                    width: '40%',
                    onOk: this.submitForm,
                    onCancel: this.cancelForm,
                    render: (createEle) => {
                        return createEle(addOrMod, {
                            props: {
                                actionStatus: 1,
                                accountFormData: me.newAccountBufferData
                            }
                        })
                    }
                })
            },
            // 添加或编辑微信账户
            newWeChatAccount (status) {
                // debugger
                var me = this
                me.newAccountBufferData = {
                    type: 0,
                    general_taxpayer: 0,
                    default: 0,
                    status: 1,
                    online_config: me.weChatOb
                }
                if (status == 1) {
                    me.newAccountBufferData.id = me.onlineId
                }
                this.offOrOnStatus = 1
                this.newOrModStatus = status
                this.newAccountBufferData.type = 1
                this.newAccountBufferData.online_code = 'wechat',
                this.$Modal.confirm({
                    title: status === 0 ? '新增微信账户' : '编辑微信账户',
                    width: '40%',
                    onOk: this.submitForm,
                    onCancel: this.cancelForm,
                    render: (createEle => {
                        return createEle(addOrMod, {
                            props: {
                                actionStatus: 1,
                                accountFormData: me.newAccountBufferData
                            }
                        })
                    })
                })
            },
            // 添加或编辑支付宝账户
            newAlipayAccount (status) {
                var me = this
                me.newAccountBufferData = {
                    type: 0,
                    general_taxpayer: 0,
                    default: 0,
                    status: 1,
                    online_config: me.aliPayOb
                }
                if (status == 1) {
                    me.newAccountBufferData.id = me.onlineId
                }
                this.offOrOnStatus = 1
                this.newOrModStatus = status
                this.newAccountBufferData.type = 1
                this.newAccountBufferData.online_code = 'alipay',
                this.$Modal.confirm({
                    title: status === 0 ? '新增支付宝账户' : '编辑支付宝账户',
                    width: '40%',
                    onOk: this.submitForm,
                    onCancel: this.cancelForm,
                    render: (createEle => {
                        return createEle(addOrMod, {
                            props: {
                                actionStatus: 1,
                                accountFormData: me.newAccountBufferData
                            }
                        })
                    })
                })
            },
            // 获取线上账户信息
            getOnlineAccount () {
                var me = this
                Util.ajax.post('/finance/finance_account/lists', {
                    type: 1,
                    limit: 13,
                    page: 1
                }).then(resp => {
                    // debugger
                    if (resp.data.length === 0) {
                        me.weChatStatus = 0
                        me.aliPayStatus = 0
                    } else {
                        me.onlineId = resp.data[0].id
                        if (resp.data[0].online_config.alipay.app_id === '') {
                            me.aliPayStatus = 0
                        } else {
                            me.aliPayStatus = 1
                            me.aliPayOb = resp.data[0].online_config.alipay
                        }
                        if (resp.data[0].online_config.wechat.mch_id === '') {
                            me.weChatStatus = 0
                        } else {
                            me.weChatStatus = 1
                            me.weChatOb = resp.data[0].online_config.wechat
                        }
                    }
                })
            },
            // 删除线上账户
            delOnlineAccount (category) {
                // debugger
                var me = this
                Util.ajax.post('/finance/finance_account/delete', {
                    id: me.onlineId,
                    online_code: category
                }).then(resp => {
                    // debugger
                    var onlineAccountStatus = resp.online_config
                    if (onlineAccountStatus.alipay.app_id === '') {
                        me.aliPayStatus = 0
                    } else {
                        me.aliPayStatus = 1
                    }
                    if (onlineAccountStatus.wechat.mch_id === '') {
                        me.weChatStatus = 0
                    } else {
                        me.weChatStatus = 1
                    }
                    this.$Message.success({
                        content: `账户删除成功！`,
                        duration: 3
                    });
                })
            },
            // 删除线下账户
            delOfflineAccount (params) {
                // debugger
                Util.ajax.post('/finance/finance_account/delete', {
                    id: params.row.id
                }).then(resp => {
                    // debugger
                    this.$refs.accountTable.init()
                    this.$Message.success({
                        content: `账户删除成功！`,
                        duration: 3
                    });
                })
            },
            // 设置线下账户设置默认
            setDefault (params) {
                // debugger
                Util.ajax.post('/finance/finance_account/edit', {
                    id: params.row.id,
                    default: 1,
                    type: 0
                }).then(resp => {
                    // debugger
                    this.$refs.accountTable.init()
                    this.$Message.success({
                        content: `默认账户设置成功！`,
                        duration: 3
                    });
                })
            }
        },
        mounted () {
            this.getOnlineAccount()
        }
    };
</script>

<style scoped>

    @import "./index.less";
</style>