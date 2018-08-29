<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Card>
                    <Row type="flex" class="user-infor" style="height: 121px;">
                        <Col span="8">
                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                <img class="avator-img" :src="avatorPath" />
                            </Row>
                        </Col>
                        <Col span="16" style="padding-left:6px;">
                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                <div>
                                    <b class="card-user-infor-name">{{ user.username }}</b>
                                    <p>super admin</p>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <div class="line-gray"></div>
                    <Row class="margin-top-8">
                        <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                        <Col span="16" class="padding-left-8">{{ user.logintime }}</Col>
                    </Row>
                    <Row class="margin-top-8">
                        <Col span="8"><p class="notwrap">上次登录地点:</p></Col>
                        <Col span="16" class="padding-left-8">{{ user.loginip }}</Col>
                    </Row>
                </Card>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="8">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.new_custom"
                            iconType="android-person-add"
                            color="#f8e16f"
                            intro-text="新增客户"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="8" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.seller_amount"
                            iconType="ios-browsers"
                            color="#bbd479"
                            intro-text="今日销售"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="8" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.buyer_amount"
                            iconType="shuffle"
                            color="#ffa869"
                            :iconSize="50"
                            intro-text="今日采购"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="8" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.payable_money"
                            iconType="ios-color-filter"
                            color="#25b0b7"
                            intro-text="今日应付"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="8">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.received_money"
                            iconType="cube"
                            color="#a76b9f"
                            intro-text="今日应收"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="8">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.profit_amount"
                            iconType="social-buffer"
                            color="#4774ad"
                            intro-text="今日利润"
                        ></infor-card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
						客户交易排行
                    </p>
                    <div class="data-source-row">
                        <visite-volume :datas="customerData"></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
						热销品类环比
                    </p>
                    <div class="data-source-row">
                        <data-source-pie :datas="cats"></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
						订单交易总金额
                    </p>
                    <div class="data-source-row">
                        <user-flow :datas="orderQuota"></user-flow>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
					订单交易日线分析
                </p>
                <div class="line-chart-con">
                    <service-requests :datas="orderData"></service-requests>
                </div>
            </Card>
        </Row>
    </div>
</template>

<script>
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';

import Util from '@/libs/util';

export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard,
        mapDataTable
    },
    data () {
        return {
            count: {
            	new_custom: '0',
                payable_money: '0.00',
                received_money: '0.00',
                profit_amount: '0.00',
                seller_amount: '0.00',
                buyer_amount: '0.00',
            },
            user: {},
            cityData: cityData,
            cats: [],
            customerData: [],
            orderData: {},
            orderQuota: {
            	purchase: 0,
            	sale: 0
            }
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        
    },
    created () {
        this.user = JSON.parse(localStorage.user_info);
    },
    mounted() {
    	Util.ajax.post('/statistics/statistics/today_count', {}).then(resp => {
    		// 
    		for(let key in this.count){
    			if(key === 'new_custom'){
    				this.count[key] = resp[key] || 0;
    			}else{
    				this.count[key] = resp[key] || '0.00';
    			}
    		}
    		// 品类环比
    		this.cats = resp.cat;
    		// 客户交易排行
    		this.customerData = resp['seller_custom'];
    		// 订单日线
    		this.orderData = {
    			buyer_order: resp['buyer_order'],
    			seller_order: resp['seller_order']
    		}
    		// 订单交易总额
    		this.orderQuota = {
            	purchase: resp['buyer_amount'] || 0,
            	sale: resp['seller_amount'] || 0
            }
        }).catch(() => {
        	
        })
    }
};
</script>
