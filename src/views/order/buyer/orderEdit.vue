<template>
  <div class = "accountAction">
    <Form :model = "orderFormData" label-position = "right" :label-width = "120">
      <FormItem label="支付类型" prop="pay_type">
        <Select v-model="orderFormData.pay_type" label-in-value placeholder="请选支付类型">
          <Option v-for="(option, index) in payTypeOption" :value="option.value" :key="index">{{option.label}}</Option>
        </Select>
      </FormItem>
      <FormItem prop = "agree_time" label = "账期时间(天)" v-if = "orderFormData.pay_type === 3">
        <InputNumber v-model="orderFormData.pay_info.agree_time" :min = "1" :step = "1" placeholder="请输入账户名称"></InputNumber>
      </FormItem>
      <FormItem prop = "address_detail" label = "收货地址">
        <Select v-model="orderFormData.address_id" label-in-value placeholder="请选收货地址">
          <Option v-for="(option, index) in addressOption" :value="option.value" :key="index">{{option.label}}</Option>
        </Select>
      </FormItem>
      <Button type = "primary" size = "small" style = "margin-bottom: 10px;" @click = "newOrderGoods">新增商品</Button>
      <Table stripe border :columns = "orderGoodsCol" :data="orderGoodsData"></Table>
    </Form>
  </div>
</template>
<script>
/* 
* 实例对象弹窗，使用对象为引用类型的特性和props传值
* 商品表格数据与订详情为分离状态，删除、编辑表格都会实时更新至orderFormData
*/
import Util from '@/libs/util'
export default {
  name: 'orderEdit',
  props: {
    orderFormData: Object,
    orderFormParams: Object,
    actionStatus: Number
  },
  data () {
    return {
      // 行编辑临时数据缓存
      goodsRowBuffer: {},
      // 支付方式下拉数据
      payTypeOption: [
        {
          value: 1,
          label: '在线支付'
        },
        {
          value: 2,
          label: '货到付款'
        },
         {
           value: 3,
           label: '账期支付'
         }
      ],
      // 收货地址下拉数据
      addressOption: [],
      // 渲染函数
      createEle: Function,
      // 当前买家客户可购sku列表
      currentOrderSkuList: [],
      // 订单商品列表表格字段
      orderGoodsCol: [
        {
          title: '商品名称',
          key: 'skuname',
          render: (createEle, params) => {
            if (params.row.isNew) {
              return createEle('Select', {
                attrs: {value: this.goodsRowBuffer.skuid},
                props: {'label-in-value': true},
                on: {
                  'on-change': (e) => {
                    this.orderGoodsRowEdit(e, params, {label: 'skuname', value: 'skuid'})
                  }
                }
              },
              this.getOptions)
            } else {
              return params.row.skuname
            }
          }
        },
        {
          title: '数量',
          key: 'number',
          render: (createEle, params) => {
            if (params.row.isEdit) {
              return createEle('Input', {
                attrs: {value: this.goodsRowBuffer.number},
                on: {
                  'on-change': (e) => {
                    this.orderGoodsRowEdit(e, params, 'number')
                  }
                }
              })
            } else {
              return params.row.number
            }
          }
        },
        {
          title: '价格',
          key: 'price',
          render: (createEle, params) => {
            if (params.row.isEdit) {
              return createEle('Input', {
                attrs: {value: this.goodsRowBuffer.price},
                on: {
                  'on-change': (e) => {
                    this.orderGoodsRowEdit(e, params, 'price')
                  }
                }
              })
            } else {
              return params.row.price
            }
          }
        },
        {
          title: '总计(元)',
          render: (createEle, params) => {
            if (params.row.isEdit) {
              return createEle('Input', {
                props: {value: this.goodsRowBuffer.total, disabled: true},
                on: {
                  'on-blur': (e) => {
                    this.baseRowEdit(e, params, 'total')
                  }
                }
              })
            } else {
              return Number(params.row.number) * Number(params.row.price)
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          render: (createEle, params) => {
            this.createEle = createEle
            if (params.row.isEdit) {
              return createEle('div', {
                style: {
                    color: '#2d8cf0',
                    fontSize: '25px',
                    textAlign: 'center'
                }
              }, [
                createEle('Icon', {
                  style: {
                    marginRight: '30px',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'checkmark'
                  },
                  nativeOn: {
                    click: () => {
                      this.saveOrderGoodsEdit(params)
                    }
                  }
                }),
                createEle('Icon', {
                  style: {
                    marginRight: '15px',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'close'
                  },
                  nativeOn: {
                    click: () => {
                      this.cancelOrderGoodsEdit(params)
                    }
                  }
                })
              ])
            } else {
              return createEle('div', {
                style: {
                    color: '#2d8cf0',
                    fontSize: '25px',
                    textAlign: 'center'
                }
              }, [
                createEle('Button', {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "edit"
                  },
                  style: {
                    marginRight: '5px'
                  },
                  nativeOn: {
                    click: () => {
                      this.orderGoodsEdit(params)
                    }
                  }
                }, '编辑'),
                createEle('Button', {
                  props: {
                    type: "error",
                    size: "small",
                    icon: "trash-a"
                  },
                  nativeOn: {
                    click: () => {
                      this.orderGoodsRemove(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        }
      ],
      // 订单商品列表表格数据
      orderGoodsData: []
    }
  },
  computed: {
    getOptions () {
      debugger
      var options = []
      for (var val of this.currentOrderSkuList) {
        options.push(
          this.createEle('Option', {
            attrs: {
              value: val.value,
              label: val.label
            }
          })
        )
      }
      return options
    }
  },
  methods: {
    // 获取订单收货地址列表
    getOrderAddress () {
      debugger
      Util.ajax.post('/setting.address/lists', {}).then(resp => {
        debugger
        for (var val of resp) {
          this.addressOption.push({
            label: val.address,
            value: val.id
          })
        }
      })
    },
    // 获取订单商品列表
    getOrderGoodsList () {
      debugger
      Util.ajax.post('/order/order_sku/detail', {
        order_sn: this.orderFormData.order_sn
      }).then(resp => {
        debugger
        var orderGoodsData = JSON.parse(JSON.stringify(resp))
        orderGoodsData.forEach(elem => {
          elem.isEdit = false
          elem.total = Number(elem.price) * Number(elem.number)
        })
        this.orderGoodsData = orderGoodsData
        this.goodsInfoUpdated()
      })
    },
    // 编辑订单商品
    orderGoodsEdit (params) {
      this.goodsRowBuffer = params.row
      this.goodsRowBuffer.index = params.index
      this.orderGoodsData[params.index].isEdit = true
    },
    // 订单商品行编辑失焦
    orderGoodsRowEdit (e, params, feild) {
      if (typeof feild === 'object') {
        debugger
        this.goodsRowBuffer.skuname = e.label
        this.goodsRowBuffer.skuid = e.value
      } else {
        if (isNaN(Number(e.target.value)) || e.target.value === '') {
          this.$Message.error({
            content: `请输入数字,且不能为空！`,
            duration: 3
          })
          return
        } else {
          this.goodsRowBuffer[feild] = e.target.value
          this.goodsRowBuffer.total = Number(this.goodsRowBuffer.price) * Number(this.goodsRowBuffer.number)
        }
      }
    },
    // 保存行编辑
    saveOrderGoodsEdit (params) {
      debugger
      if (params.row.isNew) {
        for (var val of this.orderGoodsData) {
          if (this.goodsRowBuffer.skuid === val.skuid) {
            this.$Message.error({
              content: `同一订单内请勿重复添加同一商品！`,
              duration: 5
            })
            return
          }
        }
      }
      this.orderGoodsData[params.index].price = this.goodsRowBuffer.price
      this.orderGoodsData[params.index].number = this.goodsRowBuffer.number
      this.orderGoodsData[params.index].skuname = this.goodsRowBuffer.skuname
      this.orderGoodsData[params.index].skuid = this.goodsRowBuffer.skuid
      this.orderGoodsData[params.index].isEdit = false
      this.orderGoodsData[params.index].isNew = false
      this.goodsRowBuffer = {}
      this.goodsInfoUpdated()
    },
    // 取消保存行编辑
    cancelOrderGoodsEdit (params) {
      if (params.row.isNew) {
        debugger
        this.orderGoodsData.splice(params.index, 1)
      } else {
        this.orderGoodsData[params.index].isEdit = false
        this.goodsRowBuffer = {}
      }
      this.goodsInfoUpdated()
    },
    // 新增订单商品
    newOrderGoods () {
      // 获取sku列表
      Util.ajax.post('/goods.goods_sku/lists', {
        custom_id: this.orderFormData.custom_id
      }).then(resp => {
        debugger
        var currentOrderSkuList = []
        resp.forEach(elem => {
          currentOrderSkuList.push({
            label: elem.skuname,
            value: elem.skuid
          })
        })
        this.currentOrderSkuList = currentOrderSkuList
      })
      debugger
      this.orderGoodsData.push({
        skuid: '',
        skuname: '',
        price: 0,
        number: 0,
        total: 0,
        isEdit: true,
        isNew: true
      })
      this.goodsRowBuffer = {
        skuid: '',
        skuname: '',
        price: 0,
        number: 0,
        total: 0,
        isEdit: true,
        isNew: true
      }
    },
    // 删除订单商品（行删除）
    orderGoodsRemove (params) {
      this.orderGoodsData.splice(params.index, 1)
      this.goodsInfoUpdated()
    },
    // 将表格数据的改变更新至props属性orderFormData
    goodsInfoUpdated () {
      var sku_ids = {}
      this.orderGoodsData.forEach(elem => {
        sku_ids[elem.skuid] = {
          number: elem.number,
          price: elem.price
        }
      })
      debugger
      this.orderFormData.sku_ids = sku_ids
    }
  },
  mounted () {
    // 获取订单商品列表
    this.getOrderGoodsList()
    // 获取收货地址列表
    this.getOrderAddress()
  }
}
</script>
<style lang="less">

</style>


