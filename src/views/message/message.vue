<style lang="less">
    @import './message.less';
</style>

<template>
    <div class="message-main-con">
        <div class="message-mainlist-con">
            <div>
                <Button @click="setCurrentMesType('unread')" size="large" long type="text">
                    <transition name="mes-current-type-btn">
                        <Icon v-show="currentMessageType === 'unread'" type="checkmark"></Icon>
                    </transition>
                    <span class="mes-type-btn-text">未读消息</span>
                    <Badge class="message-count-badge-outer" class-name="message-count-badge"
                           :count="unreadCount"></Badge>
                </Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('hasread')" size="large" long type="text">
                    <transition name="mes-current-type-btn">
                        <Icon v-show="currentMessageType === 'hasread'" type="checkmark"></Icon>
                    </transition>
                    <span class="mes-type-btn-text">已读消息</span>
                    <Badge class="message-count-badge-outer" class-name="message-count-badge"
                           :count="hasreadCount"></Badge>
                </Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('recyclebin')" size="large" long type="text">
                    <transition name="mes-current-type-btn">
                        <Icon v-show="currentMessageType === 'recyclebin'" type="checkmark"></Icon>
                    </transition>
                    <span class="mes-type-btn-text">回收站</span>
                    <Badge class="message-count-badge-outer" class-name="message-count-badge"
                           :count="recyclebinCount"></Badge>
                </Button>
            </div>
        </div>
        <div class="message-content-con">
            <transition name="view-message">
                <div v-if="showMesTitleList" class="message-title-list-con">
                    <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList"
                           :no-data-text="noDataText"></Table>
                    <Page :total="currentMesList.length" :current="currentPage" @page-size="12" @on-change="onPageChange" v-show="currentMesList.length > 0"></Page>
                </div>
            </transition>
            <transition name="back-message-list">
                <div v-if="!showMesTitleList" class="message-view-content-con">
                    <div class="message-content-top-bar">
                        <span class="mes-back-btn-con"><Button type="text" @click="backMesTitleList"><Icon
                                type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button></span>
                        <h3 class="mes-title">{{ mes.title }}</h3>
                    </div>
                    <p class="mes-time-con">
                        <Icon type="android-time"></Icon>&nbsp;&nbsp;{{ mes.create_time }}
                    </p>
                    <div class="message-content-body">
                        <!-- <div>
                            <p class="message-content" style = "display: inline-block">{{ mes.content }}</p>
                            <Button v-if = "isAddMe" type = "primary" size = "small" style = "float: right;margin: 10px 20px 0 0">查看详情</Button>
                        </div> -->
                        <p class="message-content" style = "display: inline-block">{{ mes.content }}</p>
                        <div class = "adderDetail" v-if = "isAddMe">
                            <div>
                                <p>待添加好友详情</p>
                                <Row>
                                    <Col span = "8">
                                        <LabelItem label="好友全称" :value="mes.params.custom_info.fullname"></LabelItem>
                                    </Col>
                                    <Col span = "8">
                                        <LabelItem label="好友简称" :value="mes.params.custom_info.name"></LabelItem>
                                    </Col>
                                    <Col span = "8">
                                        <LabelItem label="联系人" :value="mes.params.custom_info.cust_linkname"></LabelItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span = "8">
                                        <LabelItem label="联系电话" :value="mes.params.custom_info.cust_phone"></LabelItem>
                                    </Col>
                                    <Col span = "8">
                                        <LabelItem label="社会信用代码" :value="mes.params.custom_info.cust_license"></LabelItem>
                                    </Col>
                                    <Col span = "8">
                                        <LabelItem label="法定代表人" :value="mes.params.custom_info.cust_represent"></LabelItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span = "8">
                                        <LabelItem label="常用经营场所" :value="mes.params.custom_info.cust_addr"></LabelItem>
                                    </Col>
                                    <Col span = "8">
                                        <LabelItem label="邮箱" :value="mes.params.custom_info.cust_email"></LabelItem>
                                    </Col>
                                    <Col span = "8">
                                        <LabelItem label="主页" :value="mes.params.custom_info.promotion"></LabelItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <!-- <Col span = "24">
                                        <LabelItem label="经营范围" :value="mes.params.custom_info.cust_scope"></LabelItem>
                                    </Col> -->
                                    <Col span = "24">
                                        <div class = "flexboxs">
                                            <span class = "labels">经营范围：</span>
                                            <span class = "contents">
                                                {{mes.params.custom_info.cust_scope}}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span = "8">
                                        <LabelItem label="经营有效期至" :value="mes.params.custom_info.cust_deadline"></LabelItem>
                                    </Col>
                                    <Col span = "8">
                                        <div class = "flexboxs">
                                            <span class = "label">企业logo：</span>
                                            <span class = "imgBox">
                                                <img :src="mes.params.custom_info.logo" alt="">
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                        </div>
                        <p class="message-operate" style="text-align: center;" v-if="mes.type == 'soCustomCorrelationAfter'">
                            <div v-if="mesCheckAStatus == 0 && (mes.type == 'soCustomCorrelationAfter')" style="text-align: center;">
                                <Button @click="handleCustomCorrelation(mes.params.custom_info.id, mes.id, -1)">拒绝</Button>
                                <Button @click="handleCustomCorrelation(mes.params.custom_info.id, mes.id, 1)" type="primary">同意</Button>
                            </div>
                            <div v-else-if="mesCheckAStatus == 2 && (mes.type == 'soCustomCorrelationAfter')" style="text-align: center;">
                                <span>已拒绝</span>
                            </div>
                            <div v-else-if="mesCheckAStatus == 3 && (mes.type == 'soCustomCorrelationAfter')" style="text-align: center;">
                                <span>已同意</span>
                            </div>
                        </p>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import Util from '@/libs/util';
    import LabelItem from '@/views/components/thrgo/LabelItem.vue';

    export default {
        name: 'message_index',
        components: {LabelItem},
        data() {
            const markAsreadBtn = (h, params) => {
                return h('Button', {
                    props: {
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            Util.ajax.post('/setting/private_message/update', {
                                id: params.row.id
                            }).then(res => {
                                this.hasreadMesList.unshift(this.currentMesList.splice(params.index, 1)[0]);
                                this.$store.commit('setMessageCount', this.unreadMesList.length);
                            });
                        }
                    }
                }, '标为已读');
            };

            const deleteMesBtn = (h, params) => {
                return h('Button', {
                    props: {
                        size: 'small',
                        type: 'error'
                    },
                    on: {
                        click: () => {
                            let ids = [];
                            Util.ajax.post('/setting/private_message/delete', {
                                ids: params.row.id
                            }).then(res => {
                                this.recyclebinList.unshift(this.hasreadMesList.splice(params.index, 1)[0]);
                            });
                        }
                    }
                }, '删除');
            };
            const restoreBtn = (h, params) => {
                return h('Button', {
                    props: {
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            Util.ajax.post('/setting/private_message/restore', {
                                ids: params.row.id
                            }).then(res => {
                                this.hasreadMesList.unshift(this.recyclebinList.splice(params.index, 1)[0]);
                            });
                        }
                    }
                }, '还原');
            };

            return {
                currentPage : 1,
                ajaxParams: {},

                mesCheckAStatus: 0,
                currentMesList: [],
                unreadMesList: [],
                hasreadMesList: [],
                recyclebinList: [],
                currentMessageType: 'unread',
                showMesTitleList: true,
                unreadCount: 0,
                hasreadCount: 0,
                recyclebinCount: 0,
                noDataText: '暂无未读消息',
                mes: {
                    title: '',
                    time: '',
                    content: '',
                    type: ''
                },
                mesTitleColumns: [
                    {
                        title: ' ',
                        key: 'title',
                        align: 'left',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.showMesTitleList = false;
                                        this.mesCheckAStatus = params.row.deal
                                        this.mes = params.row;
                                        this.mes.params.custom_info.cust_deadline = this.formatDate(Number(this.mes.params.custom_info.cust_deadline))
                                    }
                                }
                            }, params.row.title);
                        }
                    },
                    {
                        title: ' ',
                        key: 'create_time',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'android-time',
                                        size: 12
                                    },
                                    style: {
                                        margin: '0 5px'
                                    }
                                }),
                                h('span', {
                                    props: {
                                        type: 'android-time',
                                        size: 12
                                    }
                                }, params.row.create_time)
                            ]);
                        }
                    },
                    {
                        title: ' ',
                        key: 'asread',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if (this.currentMessageType === 'unread') {
                                return h('div', [
                                    markAsreadBtn(h, params)
                                ]);
                            } else if (this.currentMessageType === 'hasread') {
                                return h('div', [
                                    deleteMesBtn(h, params)
                                ]);
                            } else {
                                return h('div', [
                                    restoreBtn(h, params)
                                ]);
                            }
                        }
                    }
                ]
            };
        },
        computed: {
            isAddMe () {
                return this.mes.type === 'soCustomCorrelationAfter' ? true : false
            }
        },
        methods: {
            formatDate(time) {
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + second;
            },
            backMesTitleList() {
                this.getMessageList();
                this.showMesTitleList = true;
            },
            setCurrentMesType(type) {
                if (this.currentMessageType !== type) {
                    this.showMesTitleList = true;
                }
                this.currentMessageType = type;
                if (type === 'unread') {
                    this.noDataText = '暂无未读消息';
                    this.currentMesList = this.unreadMesList;
                } else if (type === 'hasread') {
                    this.noDataText = '暂无已读消息';
                    this.currentMesList = this.hasreadMesList;
                } else {
                    this.noDataText = '回收站无消息';
                    this.currentMesList = this.recyclebinList;
                }
            },

            handleCustomCorrelation(custom_id, mesId, status) {
                Util.ajax.post("/custom.custom/check_by_tocustomid", {
                    custom_id: custom_id,
                    status: status
                }).then(res => {
                    Util.ajax.post('/setting/private_message/deal', {
                        id: mesId,
                        deal: res.status == -1 ? 2 : (res.status == 1 ? 3 : 0)
                    }).then(resp => {
                        this.$Message.success('操作成功');
                        this.mesCheckAStatus = res.status == -1 ? 2 : (res.status == 1 ? 3 : 0)
                    })
                });
            },


            getMessageList () {
                let uri = '/setting/private_message/lists';
                let params = {
                    page: this.currentPage
                };

                if (this.currentMessageType === 'recyclebin') {
                    uri = '/setting/private_message/rec_lists';
                } else {
                    params.status = this.ajaxParams.status;
                }

                Util.ajax.post(uri, params).then(res => {
                    this.unreadMesList = [];
                    this.hasreadMesList = [];
                    this.recyclebinList = [];

                    // res.data.forEach((val) => {
                    //     if(val.delete_time !== null) {
                    //         this.recyclebinList.push(val);
                    //     } else {
                    //         if(val.status === 0) {
                    //             this.unreadMesList.push(val);
                    //         } else {
                    //             this.hasreadMesList.push(val);
                    //         }
                    //     }
                    // });
                    this.currentMesList = res.data;
                });
                // this.unreadCount = this.unreadMesList.length;
                // this.hasreadCount = this.hasreadMesList.length;
                // this.recyclebinCount = this.recyclebinList.length;
            },

            onPageChange(currentPage) {
                this.currentPage = currentPage;
            }

        },
        mounted() {
            this.getMessageList();
        },
        watch: {
            currentPage(val) {
                this.getMessageList();
            },
            currentMessageType(type) {
                switch(type)
                {
                    case 'unread':
                        this.ajaxParams.status = 0;
                        break;
                    case 'hasread' :
                        this.ajaxParams.status = 1;
                        break;
                    case 'recyclebin' :
                        break;
                    default :
                        break;
                }
                this.currentPage = 1;
                this.getMessageList();
            }
            // unreadMesList(arr) {
            //     this.unreadCount = arr.length;
            // },
            // hasreadMesList(arr) {
            //     this.hasreadCount = arr.length;
            // },
            // recyclebinList(arr) {
            //     this.recyclebinCount = arr.length;
            // }
        }
    };
</script>

