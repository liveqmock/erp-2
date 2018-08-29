<template>
    <Content>
      <!-- 取消订单弹窗 -->
      <!-- <Modal></Modal> -->
      <Card>
          <Steps :current="orderStatus">
            <Step v-for = "(item, index) in orderStep" :key="index" :title="item.title" :content = "item.content"></Step>
            <!-- <Step title="提交" content="这里是该步骤的描述信息"></Step>
            <Step title="付款" content="这里是该步骤的描述信息"></Step>
            <Step title="发货" content="这里是该步骤的描述信息"></Step>
            <Step title="收货" content="这里是该步骤的描述信息"></Step>
            <Step title="完成" content="这里是该步骤的描述信息"></Step> -->
          </Steps>
      </Card>
      <Card>
          <p slot="title">
              <Icon type="document-text"></Icon>
              订单信息
          </p>
          <!-- <a href="#" slot="extra" @click.prevent="changeLimit">
              <Icon type="ios-loop-strong"></Icon>
              Change
          </a> -->
          <div class="orderBox">
            <Row>
              <Col span = "6">
                <p>订单信息</p>
              </Col>

              <Col span = "18" v-if="orderRealStatus == 0 || orderRealStatus == 2"  class = "btnGroup">
                <Button type = "info" size = "small" @click = "orderEdit">编辑</Button>
              </Col>

            </Row>
            <Row>
            	<Col span="8">
            		<LabelItem label="订单号" :value="orderDetail.order_sn"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="下单时间" :value="orderDetail.submit_time"></LabelItem>
            	</Col>
            	<Col span="8">&nbsp;</Col>
            </Row>
            <!-- <LabelItem label="订单类型" :value="orderDetail.type === 1 ? '采购订单' : orderDetail.type === 2 ? '销售订单' : '代客下单'"></LabelItem> -->
            <LabelItem label="订单类型" :value="'采购订单'"></LabelItem>
            <LabelItem label="供应商名称" :value="orderDetail.sellerName"></LabelItem>
            <LabelItem label="付款方式" :value="payTypeText"></LabelItem>
            <!-- 账期支付 -->
            <LabelItem v-if="orderDetail.pay_type == 3" label="支付日期" :value="orderDetail.pay_date"></LabelItem>
            <!-- 分期支付 -->
            <div style="padding-left: 110px; margin-top: 10px;" v-if="orderDetail.pay_type == 4">
            	<Timeline>
			        <TimelineItem v-for="(ism,index) in orderDetail.instalments" :key="index">第 {{index+1}} 期，支付日期：{{ism.date}}，支付金额：{{toFixedFilter(ism.money)}}。</TimelineItem>
			    </Timeline>
            </div>
            
            <div class="sgy-cut-line"></div>
            
            <p>收货人信息</p>
            <Row>
            	<Col span="8">
            		<LabelItem label="收货人名称" :value="orderDetail.address_name"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="收货人手机号" :value="orderDetail.address_mobile"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="收货人地址" :value="orderDetail.address_detail"></LabelItem>
            	</Col>
            </Row>
            
            <div class="sgy-cut-line"></div>
            
            <p>订单金额</p>
            <Row>
            	<Col span="8">
            		<LabelItem label="订单金额" :value="toFixedFilter(orderDetail.real_amount)"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="商品总额" :value="toFixedFilter(orderDetail.goods_amount)"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="物流费用" :value="orderDetail.delivery_type_text"></LabelItem>
            	</Col>
              <Col span="8">
                <LabelItem label="物流费用金额" :value="toFixedFilter(orderDetail.delivery_amount)"></LabelItem>
              </Col>
            </Row>
          </div>
      </Card>
      <Card>
        <Row style="margin-bottom: 10px;">
        	<Col span="18">
	        	<Icon type="android-cart"></Icon>&nbsp;商品信息
	        </Col>
	      </Row>
        <Table stripe border :columns = "orderGoodsCol" :data="orderGoodsData"></Table>
      </Card>
      <div class = "btnGroup">
          <Button type="text" v-if="orderRealStatus == 0" @click = "orderSubmit">提交订单</Button>
          <Button type="text" v-if="orderRealStatus == 0 || orderRealStatus == 1 || orderRealStatus == 2"  @click = "orderCancel">取消订单</Button>
          <Button type="text" v-if="orderRealStatus == 2"  @click = "orderConfirm">确认订单</Button>
          <Button type="text" v-if="orderRealStatus == 7"  @click = "orderReceipt">确认收货</Button>
          <Button type="text" v-if="orderRealStatus == 0 || orderRealStatus == 2"  @click = "handleOrderEdit">确认编辑</Button>
          <Button type="primary" @click = "goThere">返回</Button>
      </div>
      <Modal
      	v-model="isOrderEdit"
      	title="编辑订单"
      	width="600"
      >
      	<Form :model="orderModalData" :label-width="108" ref="orderForm" :rules="orderRules">
      		<FormItem label="支付方式：" prop="pay_type">
	            <Select v-model="orderModalData.pay_type" placeholder="请选支付类型">
	            	<Option v-for="(option, index) in payTypeOption" :value="option.value" :key="index">{{option.label}}</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="支付日期：" prop="pay_date" v-if="orderModalData.pay_type == 3">
	            <DatePicker type="date" v-model="orderModalData.pay_date" format="yyyy-MM-dd" placeholder="请选择支付日期" style="width: 200px"></DatePicker>
	        </FormItem>
	        <div v-if="orderModalData.pay_type == 4">
	        	<FormItem label="">
		            <div style="margin-bottom: 10px;" v-for="(ism,index) in orderModalData.instalments" :key="index">
		            	<span style="display: inline-block; width: 60px; text-align: right;">第 {{index+1}} 期：</span>
		            	<DatePicker type="date" v-model="ism.date" format="yyyy-MM-dd" placeholder="请选择支付日期" style="width: 160px"></DatePicker>
		            	<span style="margin-left: 10px;">还款金额：</span>
		            	<InputNumber v-model="ism.money" :min="0.00" :precision="2" style="width: 120px;"></InputNumber>
		            	<span style="margin-left: 10px; font-size: 16px; cursor: pointer; color: #999;" @click="deletePayDate(index)"><Icon type="trash-a"></Icon></span>
		            </div>
		            <Button type="dashed" long @click="handleAddPayDate" icon="plus-round">添加账期</Button>
		        </FormItem>
	        </div>
          <FormItem label="物流费用：" prop="delivery_type">
              <RadioGroup v-model="orderModalData.delivery_type" type="button">
                  <Radio label="1">卖方承担</Radio>
                  <Radio label="2">买方承担</Radio>
              </RadioGroup>
          </FormItem>
          <FormItem label="物流费用金额：" prop="delivery_amount">
              <Input v-model="orderModalData.delivery_amount" placeholder="请填写物流费用金额"></Input>
          </FormItem>
	        <FormItem label="收货人姓名：" prop="address_name">
	            <Input v-model="orderModalData.address_name" placeholder="请填写收货人姓名"></Input>
	        </FormItem>
	        <FormItem label="收货人手机号：" prop="address_mobile">
	            <Input v-model="orderModalData.address_mobile" placeholder="请填写收货人手机号"></Input>
	        </FormItem>
          <FormItem label="收货人姓名：" prop="address_name">
              <Input v-model="orderModalData.address_name" placeholder="请填写收货人姓名"></Input>
          </FormItem>
	        <FormItem label="收货人地址：" prop="address_detail">
	            <Input v-model="orderModalData.address_detail" placeholder="请填写收货人地址"></Input>
	        </FormItem>
	    </Form>
	    <div slot="footer">
	    	<Button type="text" @click="isOrderEdit=false">取消</Button>
	    	<Button type="primary" @click="handleModifyOrder">确定</Button>
        </div>
      </Modal>
     
      <Modal
      	v-model="showModalModifyGoods"
      	title="编辑商品信息"
      	width="420"
      	@on-ok="handleModifyGoods"
      >
      	<div style="padding: 0 40px;">
      		<Form :model="modifyGoods" :label-width="80" ref="goodsForm">
	      		<FormItem label="商品名称：">
		            <p>{{modifyGoods.skuname}}</p>
		        </FormItem>
		        <FormItem label="商品规格：">
		            <p>{{modifyGoods.spec}}</p>
		        </FormItem>
		        <FormItem label="单位：">
		            <p>{{modifyGoods.unit}}</p>
		        </FormItem>
		        <FormItem label="单价：">
		        	<InputNumber v-model="modifyGoods.price" :min="0.00" :precision="2" style="width: 200px;" @on-change = "priceChange"></InputNumber>
		        </FormItem>
		        <FormItem label="购买数量：">
		            <InputNumber v-model="modifyGoods.number" :min="1" style="width: 200px;" @on-change = "numberChange"></InputNumber>
		        </FormItem>
		        <FormItem label="合计：">
		            <InputNumber v-model="modifyGoods.total_fee" :min="0.00" :precision="2" style="width: 200px;" @on-change = "totalChange"></InputNumber>
		        </FormItem>
		    </Form>
      	</div>
      </Modal>
    </Content>
</template>
<script>
import Util from '@/libs/util'
import skuSelect from '@/views/components/thrgo/goods/sku-select.vue';
import LabelItem from '@/views/components/thrgo/LabelItem.vue';

export default {
	components: {
		skuSelect,
		LabelItem
	},
    data () {
        return {
            // 订单详情中订单编辑与否状态值
            isOrderEdit: false,
            showGoodsModal: false,			// 选择商品弹窗的显示状态
            selectedGoods: [],				// 重新选择的商品
            modifyGoods: {
            	skuid: '',
            	skuname: '',
            	spec: '',
            	unit: '',
            	price: 0.00,
            	number: 0,
            	total_fee: 0.00
            },
            showModalModifyGoods: false,
            // 支付方式下拉数据
            payTypeOption: [
                {value: 1, label: '现结货款'},
                {value: 2, label: '货到付款'},
                {value: 3, label: '账期支付'},
                {value: 4, label: '分期支付'},
            ],
            // 订单号
            orderSn: '',
            // 订单进度
            orderStatus: 0,
            // 订单进度详情
            orderStep: [
                {title: '提交', content: ''},
                {title: '确认', content: ''},
                {title: '付款', content: ''},
                {title: '发货', content: ''},
                {title: '收货', content: ''},
                {title: '完成', content: ''}
            ],
            // 订单真实状态
            orderRealStatus: '',
            // 订单取消原因
            orderCancelReason: '',
            orderModalData: {
            	  pay_type: 1,
                pay_date: '',
                delivery_type: null,
                instalments: []
            },
            orderRules: {
                address_name: [
                    { required: true, message: '请填写收货人姓名', trigger: 'blur' }
                ],
                address_mobile: [
                    { required: true, message: '请填写收货人联系电话', trigger: 'blur' },
                    { type: 'string', len: 11, message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                address_detail: [
                    { required: true, message: '请填写收货人详细地址', trigger: 'blur' }
                ],
                pay_date: [
                	{ required: true, type: 'date', message: '请选择付款日期', trigger: 'change'}
                ]
            },
            // 订单详情对象
            orderDetail: {
                sellerName: '',
                pay_type: '',
                pay_date: '',
                instalments: [],
                type: '',
                submit_time: '',
                address_name: '',
                address_mobile: '',
                address_detail: '',
                real_amount: 0.00,
                goods_amount: 0.00,
                delivery_amount: 0.00
            },
            // 订单商品列表表格字段
            orderGoodsCol: [
                {title: '商品名称', key: 'skuname'},
                {title: '规格', key: 'spec'},
                {title: '单位', key: 'unit'},
                {
                	title: '单价',
                	key: 'price',
                	render: (h, params) => {
                		return this.toFixedFilter(params.row.price);
                	}
                },
                {title: '购买数量', key: 'number'},
                {
                	title: '合计',
                	key: 'total_fee',
                	render: (h, params) => {
                		return this.toFixedFilter(params.row.total_fee);
                	}
                },
            ],
            // 订单商品列表数据
            orderGoodsData: [],
            orderEditBuffer: {
            	pay_type: undefined
            }
        }
    },
    computed: {
        payTypeText() {
        		let label = '';
        		this.payTypeOption.forEach(item => {
          			if(item.value == this.orderDetail.pay_type){
          				label = item.label;
          			}
        		})
        		return label;
      	}
    },
    watch: {
    	orderDetail: {
    		handler(curVal, oldVal) {
    			this.payTypeOption.forEach(item => {
	    			if(item.value == this.orderDetail.pay_type){
	    				this.paytypeText = item.label;
	    			}
	    		})
    		},
　　　　　　	deep:true
    	}
    },
    methods: {
    	toFixedFilter(num) {
    		return num ? parseFloat(num).toFixed(2) : '0.00';
    	},
    	floatFilter(num) {
    		return parseFloat(num);
    	},
    	formatDate(date) {
    		if(typeof date == 'string') {
    			date = new Date(date);
    		}
    		let m = date.getMonth() + 1;
    		let d = date.getDate();
    		if(m < 10) m = '0' + m;
    		if(d < 10) d = '0' + d;
    		return date.getFullYear() + '-' + m + '-' + d;
    	},
      	// 获取订单详情
        getOrderDetail () {
              Util.ajax.post('/order.order/detail', {
                  order_sn: this.orderSn,
                  attrs:['seller_info']
              }).then(resp => {
                  // 读取订单详情数据
                  this.orderDetail.sellerName = resp.seller_info.fullname;
                  this.orderDetail.pay_type = resp.pay_type;
                  this.orderDetail.pay_type_text = resp.pay_type_text;
                  this.orderDetail.type = resp.type;
                  this.orderDetail.submit_time = resp.create_time;
                  this.orderDetail.address_name = resp.address_name;
                  this.orderDetail.address_mobile = resp.address_mobile;
                  this.orderDetail.address_detail = resp.address_detail;
                  this.orderDetail.real_amount = resp.real_amount;
                  this.orderDetail.goods_amount = resp.goods_amount;
                  this.orderDetail.delivery_amount = resp.delivery_amount;
                  this.orderDetail.order_sn = resp.order_sn;
                  this.orderDetail.address_id = resp.address_id;
                  this.orderDetail.delivery_type = resp.delivery_type;
                  this.orderDetail.delivery_type_text = resp.delivery_type_text;
                  this.getOrderGoods();
                  this.orderRealStatus = resp.real_status;
                  this.orderStatusText = resp.status_text;
                  if(resp.pay_type == 3) {
                    var agree_time = resp.pay_info[0].agree_time;
                    this.orderDetail.pay_date = this.formatDate(new Date(new Date().getTime()+1000*60*60*24*agree_time));
                  }
                  if(resp.pay_type == 4) {
                    this.orderDetail.pay_info = [];
                    resp.pay_info.forEach((item,index) => {
                        var agree_time = item.agree_time;
                        this.orderDetail.instalments[index] = {};
                        this.orderDetail.instalments[index]['date'] = this.formatDate(new Date(new Date().getTime()+1000*60*60*24*agree_time));
                        this.orderDetail.instalments[index]['money'] = item.price;
                        this.orderDetail.pay_info[index] = {};
                        this.orderDetail.pay_info[index]['agree_time'] = item.agree_time;
                        this.orderDetail.pay_info[index]['price'] = item.price;
                    })
                  }
                  if(resp.real_status == 0 || resp.real_status == 2) {
                      this.orderGoodsCol = [
                          {title: '商品名称', key: 'skuname'},
                          {title: '规格', key: 'spec'},
                          {title: '单位', key: 'unit'},
                          {
                            title: '单价',
                            key: 'price',
                            render: (h, params) => {
                              return this.toFixedFilter(params.row.price);
                            }
                          },
                          {title: '购买数量', key: 'number'},
                          {
                              title: '合计',
                              key: 'total_fee',
                              render: (h, params) => {
                                return this.toFixedFilter(params.row.total_fee);
                              }
                          },
                          {
                            title: '操作',
                            key: 'action',
                              width: 120,
                              render: (h, params) => {
                                  return h('div', [
                                      h('Button', {
                                          props: {
                                              type: 'text',
                                              size: 'small'
                                          },
                                          on: {
                                            click: (val) => {
                                              this.handleEditGoods(params)
                                            }
                                          }
                                      }, '编辑'),
                                      h('Button', {
                                          props: {
                                              type: 'text',
                                              size: 'small'
                                          },
                                          on: {
                                            click: (val) => {
                                              this.handleRemoveGoods(params)
                                            }
                                          }
                                      }, '删除')
                                  ]);
                              }
                          }
                      ];
                  }
                  if(resp.real_status == 8 || resp.real_status == 9) {
                      this.orderGoodsCol = [
                          {title: '商品名称', key: 'skuname'},
                          {title: '规格', key: 'spec'},
                          {title: '单位', key: 'unit'},
                          {
                              title: '单价',
                              key: 'price',
                              render: (h, params) => {
                                return this.toFixedFilter(params.row.price);
                              }
                          },
                          {title: '购买数量', key: 'number'},
                          {
                              title: '合计',
                              key: 'total_fee',
                              render: (h, params) => {
                                return this.toFixedFilter(params.row.total_fee);
                              }
                          },
                          {
                            title: '实际发货数量',
                            key: 'delivery_number'
                          },
                          {
                            title: '买家收货数量',
                            key: 'receipt_number'
                          }
                      ];
                  }
                  if(resp.real_status == 10) {
                      this.orderStep = [
                          {title: '提交', content: ''},
                          {title: '取消', content: '订单已取消'},
                      ];
                      this.orderStatus = 1;
                  }else if(resp.pay_type == 1){
                      switch(resp.real_status) {
                          case 1:
                              this.orderStep[0].content = '您已提交订单,等待卖方确认'
                              this.orderStatus = 0
                          break;
                          case 2:
                              this.orderStep[0].content = '卖家修改订单，等待您确认'
                              this.orderStatus = 0
                          break;
                          case 3:
                              this.orderStep[1].content = '双方已确认，等待付款'
                              this.orderStatus = 1
                          break;
                          case 4:
                              this.orderStep[2].content = '您已支付订单，等待卖方确认收款'
                              this.orderStatus = 2
                          break;
                          case 5:
                              this.orderStep[3].content = '卖方已确认收款，等待发货'
                              this.orderStatus = 3
                          break;
                          case 6:
                              this.orderStep[3].content = '订单出库中'
                              this.orderStatus = 3
                          break;
                          case 7:
                              this.orderStep[4].content = '卖家已发货，请等待收货'
                              this.orderStatus = 4
                          break;
                          case 8:
                              this.orderStep[4].content = '您已确认收货，等待卖家完成'
                              this.orderStatus = 4
                          break;
                          case 9:
                              this.orderStep[5].content = '订单已完成'
                              this.orderStatus = 5
                          break;
                          case 12:
                              this.orderStep[0].content = '订单尚未提交给卖方'
                              this.orderStatus = 0
                          break;
                      }
                  }else{
                      this.orderStep = [
                          {title: '提交', content: ''},
                          {title: '确认', content: ''},
                          {title: '发货', content: ''},
                          {title: '收货', content: ''},
                          {title: '完成', content: ''}
                      ];
                      switch(resp.real_status) {
                          case 1:
                              this.orderStep[0].content = '您已提交订单,等待卖方确认'
                              this.orderStatus = 0
                          break;
                          case 2:
                              this.orderStep[0].content = '卖家修改订单，等待您确认'
                              this.orderStatus = 0
                          break;
                          case 5:
                              this.orderStep[1].content = '双方已确认，等待发货'
                              this.orderStatus = 1
                          break;
                          case 6:
                              this.orderStep[2].content = '订单出库中'
                              this.orderStatus = 2
                          break;
                          case 7:
                              this.orderStep[3].content = '卖家已发货，请等待收货'
                              this.orderStatus = 3
                          break;
                          case 8:
                              this.orderStep[3].content = '您已确认收货，等待卖家完成'
                              this.orderStatus = 3
                          break;
                          case 9:
                              this.orderStep[4].content = '订单已完成'
                              this.orderStatus = 4
                          break;
                          case 12:
                              this.orderStep[0].content = '订单尚未提交给卖方'
                              this.orderStatus = 0
                          break;
                      }
                  }
            })
        },
        // 获取订单商品列表
        getOrderGoods () {
            Util.ajax.post('/order/order_sku/detail', {
                order_sn: this.orderSn
            }).then(resp => {
            	  this.orderGoodsData = resp
            })
        },
        
       // 提交订单
        orderSubmit (params) {
            this.$Modal.confirm({
                title: '是否确认提交',
                content: '<p>是否确认向卖家提交订单？</p>',
                onOk: () => {
                    Util.ajax.post('/order.order/submit', {
                        order_sn: this.orderDetail.order_sn
                    }).then(resp => {
                        this.$Message.success({
                            content: `提交成功！`,
                            duration: 3
                        });
                        this.getOrderDetail();
                    })
                },
                onCancel: () => {}
            });
        },
            // 确认订单
            orderConfirm (params) {
                this.$Modal.confirm({
                    title: '是否确认订单',
                    content: '<p>是否确认订单，确认后订单无法修改或取消？</p>',
                    onOk: () => {
                        Util.ajax.post('/order.order/confirm', {
                            order_sn: this.orderDetail.order_sn
                        }).then(resp => {
                            this.$Message.success({
                                content: `操作成功！`,
                                duration: 3
                            });
                            this.getOrderDetail();
                        })
                    },
                    onCancel: () => {}
                });
            },
            // 订单收货
            orderReceipt (params) {
                this.$router.push({path: `receipt`, query: {order_sn: this.orderDetail.order_sn}})
            },
            // 删除订单
            delOrder (params) {
                this.$Modal.confirm({
                    title: '是否确认删除订单',
                    content: '<p>是否确认删除订单，删除后的订单无法找回？</p>',
                    onOk: () => {
                        Util.ajax.post('/order.order/delete', {
                            order_sn: this.orderDetail.order_sn
                        }).then(resp => {
                            this.$Message.success({
                              content: `删除成功！`,
                              duration: 3
                            });
                            this.getOrderDetail();
                        })
                    },
                    onCancel: () => {}
                });
            },
        // 取消订单
        orderCancel () {
            this.$Modal.confirm({
                title: '订单取消',
                width: '50%',
                onOk: () => {
                    Util.ajax.post('/order.order/cancel', {
                        order_sn: this.orderDetail.order_sn,
                        reason: this.orderCancelReason
                    }).then(resp => {
                        this.$Message.success({
                            content: `操作成功！`,
                            duration: 3
                        });
                        this.getOrderDetail();
                    })
                },
                onCancel: () => {},
                render: (createEle) => {
                    return createEle('Input', {
                        props: {
                            placeholder: '请输入取消原因...',
                            value: this.orderCancelReason,
                            type: 'textarea',
                            rows: 3
                        },
                        on: {
                            input: val => {
                                this.orderCancelReason = val
                            }
                        }
                    })
                }
            })
        },
        
        // 编辑订单
        orderEdit () {
            this.isOrderEdit = true;
            // 订单可编辑的值赋值
            this.orderModalData.pay_type = this.orderDetail.pay_type;
            this.orderModalData.address_name = this.orderDetail.address_name;
            this.orderModalData.address_mobile = this.orderDetail.address_mobile;
            this.orderModalData.address_detail = this.orderDetail.address_detail;

            if(this.orderDetail.pay_type == 3){			// 支付类型为账期支付，没有账期时间时预设空值
            	this.orderModalData.instalments = [];
            	this.orderModalData.pay_date = this.orderDetail.pay_date || '';
            }else if(this.orderDetail.pay_type == 4){	// 支付类型为分期支付，没有分期数据时预设空值
            	this.orderModalData.pay_date = '';
            	this.orderModalData.instalments = this.orderDetail.instalments || [];
            }else{
            	this.orderModalData.pay_date = '';
            	this.orderModalData.instalments = [];
            }
            this.orderModalData.delivery_type = this.orderDetail.delivery_type;
            this.orderModalData.real_amount = parseFloat(this.orderDetail.real_amount);
          	this.orderModalData.goods_amount = parseFloat(this.orderDetail.goods_amount);
          	this.orderModalData.delivery_amount = parseFloat(this.orderDetail.delivery_amount);
          	
        },
        // 编辑订单确认回调
        handleModifyOrder() {
        	this.$refs['orderForm'].validate((valid) => {
                if (valid) {
                    this.isOrderEdit = false;
                    this.orderDetail.pay_type = this.orderModalData.pay_type;
                    this.orderDetail.address_name = this.orderModalData.address_name;
                    this.orderDetail.address_mobile = this.orderModalData.address_mobile;
                    this.orderDetail.address_detail = this.orderModalData.address_detail;
                    this.orderDetail.real_amount = this.orderModalData.real_amount;
                    this.orderDetail.goods_amount = this.orderModalData.goods_amount;
                    this.orderDetail.delivery_amount = this.orderModalData.delivery_amount;
                    this.orderDetail.delivery_type = this.orderModalData.delivery_type;
                    var delivery_type = {'1' : '卖方承担','2':'买方承担'};
                    this.orderDetail.delivery_type_text = delivery_type[this.orderModalData.delivery_type];
                    if(this.orderDetail.pay_type == 3) {
                      var date = new Date(this.orderModalData.pay_date).getTime()/1000;
                      var current = parseInt(new Date().getTime()/1000);
                      var day = (date-current)/(60*60*24);
                      day = Math.ceil(day);
                      this.orderDetail.pay_info = [{"agree_time":day,"price":this.orderDetail.real_amount}];
                    	this.orderDetail.pay_date = this.formatDate(this.orderModalData.pay_date);
                    }else if(this.orderDetail.pay_type == 4) {
                    	this.orderDetail.instalments = this.orderModalData.instalments.map(item => {
                          return { date: (item.date ? this.formatDate(item.date) : ''), money: item.money };
                    	})
                      var pay_info = [];
                      this.orderDetail.instalments.forEach((item,index) => {
                          var date = new Date(item.date).getTime()/1000;
                          var current = parseInt(new Date().getTime()/1000);
                          var day = (date-current)/(60*60*24);
                          day = Math.ceil(day);
                          pay_info[index] = {};
                          pay_info[index]['price'] = item.money;
                          pay_info[index]['agree_time'] = day;
                      })
                      this.orderDetail.pay_info = pay_info;
                    }
                } else {
                    // 验证未通过
                }
            })
        },
        // 编辑商品
        handleEditGoods(params) {
        	this.showModalModifyGoods = true;
          this.modifyGoods.id = params.row.id;
        	this.modifyGoods.skuid = params.row.skuid;
        	this.modifyGoods.skuname = params.row.skuname;
        	this.modifyGoods.spec = params.row.spec;
        	this.modifyGoods.unit = params.row.unit;
        	this.modifyGoods.price = parseFloat(params.row.price) || 0;
        	this.modifyGoods.number = parseFloat(params.row.number) || 0;
        	this.modifyGoods.total_fee = parseFloat(params.row.total_fee) || 0;
        },
        // 删除商品
        handleRemoveGoods(params) {
        	this.$Modal.confirm({
    			title: '操作提示',
    			content: '<p>是否确认删除此商品？</p>',
    			className: '.vertical-center-modal',
                onOk: () => {
                    this.orderGoodsData.splice(params.index, 1);
                }
           	})
        },
        // 编辑商品确认回调
        handleModifyGoods() {
        	this.showModalModifyGoods = false;
        	this.orderGoodsData = this.orderGoodsData.map(item => {
        		if(item.skuid == this.modifyGoods.skuid){
        			this.OBJClone(item, this.modifyGoods);
        		}
        		return item;
        	})
        },
        handleOrderEdit() {
            var params = this.orderDetail;
            params.sku_ids = {};
            this.orderGoodsData.forEach((item,index) => {
                params.sku_ids[item.skuid] = {};
                params.sku_ids[item.skuid]['price'] = item.price;
                params.sku_ids[item.skuid]['number'] = item.number;
            })
            this.$Modal.confirm({
                    title: '是否确认编辑订单',
                    content: '<p>是否确认编辑订单，提交后将由卖家审核？</p>',
                    onOk: () => {
                        Util.ajax.post('/order.order/edit', params).then(resp => {
                            this.$Message.success({
                                content: `操作成功！`,
                                duration: 3
                            });
                            this.getOrderDetail();
                        })
                    },
                    onCancel: () => {}
                });
        },
        // 返回采购订单列表
        goThere () {
            this.$router.push({name: 'order_buyer'})
        },
        // 弹窗选择商品返回的数据
        handleSkuSelectCallback(res) {
        	this.selectedGoods = res;
        },
        // 选择商品弹窗确认按钮回调
        reelectGoods() {
        	let filt = [];
        	let arr = this.orderGoodsData.concat(this.selectedGoods);
        	this.orderGoodsData = arr.filter(item => {
        		if(filt.indexOf(item.skuid) < 0){
        			if(!item.number) item.number = 0;
        			filt.push(item.skuid);
        			return item;
        		}
        	})
        },
        // 添加账期
        handleAddPayDate() {
        	this.orderModalData.instalments.push({date: '', money: 0.00});
        },
        // 删除账期
        deletePayDate(i) {
        	this.orderModalData.instalments.splice(i, 1);
        },
        OBJClone(cur, old) {
          	for(let key in old){
      				cur[key] = old[key];
      			}
        },
         // 编辑商品价格改变事件
        priceChange (val) {
          this.modifyGoods.total_fee = this.modifyGoods.number * this.modifyGoods.price
          this.amountCount();
        },
        // 编辑商品总价改变事件
        totalChange (val) {
          this.modifyGoods.price = this.modifyGoods.total_fee / this.modifyGoods.number
          this.amountCount();
        },
        // 编辑商品数量事件
        numberChange (val) {
          this.modifyGoods.total_fee = this.modifyGoods.number * this.modifyGoods.price
          this.amountCount();
        },
        amountCount(val) {
          var amount = 0;
          this.orderGoodsData.forEach((item,index) => {
            if(item.skuid == this.modifyGoods.skuid){
              amount += this.modifyGoods.number * this.modifyGoods.price;
            }else{
              amount += item.number * item.price;
            }
          })
          this.orderDetail.goods_amount = amount;
          this.orderDetail.real_amount = amount;
        }
    },
    mounted () {
        this.orderSn = this.$route.query.order_sn,
        this.getOrderDetail()
    }
}
</script>
<style lang="less" scoped>
  @import "../order.less";

.sgy-cut-line {
	margin: 10px 0;
	border-top: 1px dashed #E9EAEC;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
}
</style>


