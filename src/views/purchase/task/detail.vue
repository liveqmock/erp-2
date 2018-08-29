<template>
    <Content class = "contentBox">
      <Card>
          <p slot="title">
              <Icon type="document-text"></Icon>
              采购工单详情
          </p>
          <div class="orderBox">
            <!-- <Row>
              <Col span = "6">
                <p>订单信息</p>
              </Col>
              <Col span = "18"  class = "btnGroup">
                <Button type = "info" size = "small" @click = "orderEdit">编辑</Button>
              </Col>
            </Row> -->
            <Row>
            	<Col span="8">
            		<LabelItem label="工单号" :value="taskDetail.taskSn"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="采购计划名称" :value="taskDetail.planName"></LabelItem>
            	</Col>
            	<Col span="8">
                <LabelItem label = "状态" :value="taskStatus === 0 ? '待确认' : taskStatus === 1 ? '已确认' : taskStatus === 2 ? '已完成' : '已拒绝'"></LabelItem>
              </Col>
            </Row>
            <Row>
            	<Col span="8">
            		<LabelItem label="采购员" :value="taskDetail.purchaseName"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="开始时间" :value="taskDetail.startline"></LabelItem>
            	</Col>
            	<Col span="8">
                <LabelItem label="结束时间" :value="taskDetail.deadline"></LabelItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
            		<LabelItem label="采购方式" :value="taskDetail.buyType"></LabelItem>
            	</Col>
            	<Col span="8">
            		<LabelItem label="付款方式" :value="taskDetail.payType"></LabelItem>
            	</Col>
            	<Col span="8">&nbsp;</Col>
            </Row>
            </div>
          </div>
      </Card>
      <Card class = "gridCard" v-if = "taskOrder.length !== 0">
        <p slot="title">
            <Icon type="android-cart"></Icon>
            采购订单详情
        </p>
        <div class = "orderBox" v-for = "(order, index) in taskOrder" :key = "index">
          <p><Icon type="calendar"></Icon>&nbsp;订单{{index+1}}</p>
          <Row>
          	<Col span="8">
          		<LabelItem label="订单号" :value="order.orderSn"></LabelItem>
          	</Col>
          	<Col span="8">
          		<LabelItem label="供应商名称" :value="order.sellerName"></LabelItem>
          	</Col>
          	<Col span="8">
              <LabelItem label="下单时间" :value="order.makeOrderTime"></LabelItem>
            </Col>
          </Row>
          <Row>
          	<Col span="8">
          		<LabelItem label="订单总额" :value="order.realAmount"></LabelItem>
          	</Col>
          	<Col span="8">
          		<LabelItem label="商品总额" :value="order.goodsAmount"></LabelItem>
          	</Col>
          	<Col span="8">
              <LabelItem label="配送费用" :value="order.deliveryAmount"></LabelItem>
            </Col>
          </Row>
          <div class="sgy-cut-line"></div>
          <span class = "gridTitle">商品信息</span>
          <Table stripe border :columns = "orderGoodsCol" :data="order.skuInfo"></Table>
        </div>
      </Card>
      <div class = "floatBar">
        <div class = "btnGroup">
          <Button type="primary" @click = "taskConfirm" v-if = "!isConfirmed">确认工单</Button>
          <Button type="ghost" @click = "goThere">返回</Button>
        </div>
      </div>
    </Content>
</template>
<script>
import Util from "@/libs/util";
import skuSelect from "@/views/components/thrgo/goods/sku-select.vue";
import LabelItem from "@/views/components/thrgo/LabelItem.vue";

export default {
  components: {
    skuSelect,
    LabelItem
  },
  data() {
    return {
      // 当前采购工单id表示
      currentPurchaseTaskSn: '',
      // 工单详情对象
      taskDetail: {
        taskSn: '',
        planName: '',
        purchaseName: '',
        startline: '',
        deadline: '',
        payType: '',
        buyType: ''
      },
      // 工单状态
      taskStatus: '',
      // 订单列表数据
      taskOrder: [],
      // 订单商品列表表格字段
      orderGoodsCol: [
        { title: "商品名称", key: "skuname" },
        { title: "规格", key: "spec" },
        { title: "单位", key: "unit" },
        {
          title: "单价",
          key: "price",
          render: (h, params) => {
            return this.toFixedFilter(params.row.price);
          }
        },
        { title: "购买数量", key: "number" },
        {
          title: "总价",
          key: "total_fee",
          render: (h, params) => {
            return this.toFixedFilter(params.row.total_fee);
          }
        }
      ]
    };
  },
  computed: {
    isConfirmed () {
      return this.taskStatus === 0 ? false : true
    }
  },
  methods: {
    // 获取采购工单详情
    getPurchaseTaskList () {
      Util.ajax.post('/purchase/purchase_task/detail', {
        task_sn: this.currentPurchaseTaskSn,
        attrs: ['user_info', 'plan_info']
      }).then(resp => {
        this.taskDetail.taskSn = resp.task_sn ? resp.task_sn : ''
        this.taskDetail.planName = resp.plan_info ? (resp.plan_info.name ? resp.plan_info.name : '') : ''
        this.taskDetail.purchaseName =resp.user_info ? (resp.user_info.username ? resp.user_info.username : '') : ''
        this.taskDetail.startline = resp.startline ? resp.startline : ''
        this.taskDetail.deadline = resp.deadline ? resp.deadline : ''
        this.taskDetail.payType = resp.pay_type_text ? resp.pay_type_text : ''
        this.taskDetail.buyType = resp.buy_type_text ? resp.buy_type_text : ''
        this.taskStatus = resp.status
      })
    },
    // 获取当前采购工单下订单列表
    getTaskOrder () {
      Util.ajax.post('/order.order/buyer_lists', {
        task_sn: this.currentPurchaseTaskSn,
        attrs: ['own_sku_info', 'seller_info']
      }).then(resp => {
        var taskOrder = []
        resp.forEach(elem => {
          taskOrder.push({
            orderSn: elem.order_sn,
            sellerName: elem.seller_info.fullname,
            makeOrderTime: elem.create_time,
            realAmount: elem.real_amount,
            goodsAmount: elem.goods_amount,
            deliveryAmount: elem.delivery_amount,
            skuInfo: elem.own_sku_info
          })
        })
        this.taskOrder = taskOrder
      })
    },
    // 确认工单
    taskConfirm () {
      this.$Modal.confirm({
        title: '是否确认执行',
        content: '<p>是否确认同意执行该采购工单？</p>',
        onOk: () => {
          Util.ajax.post('/purchase.purchase_task/confirm', {
            task_sn: this.currentPurchaseTaskSn
          }).then(resp => {
            this.$Message.success({
              content: '确认成功！',
              duration: 3
            })
            this.getPurchaseTaskList(),
            this.getTaskOrder()
          })
        },
        onCancel: () => {}
      });
    },
    toFixedFilter(num) {
      return num ? parseFloat(num).toFixed(2) : "0.00";
    },
    floatFilter(num) {
      return parseFloat(num);
    },
    formatDate(date) {
      if (typeof date == "string") {
        date = new Date(date);
      }
      let m = date.getMonth() + 1;
      let d = date.getDate();
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      return date.getFullYear() + "-" + m + "-" + d;
    },
    // 返回采购工单列表
    goThere() {
      this.$router.push({ name: "purchase_task" });
    },
    OBJClone(cur, old) {
      for (let key in old) {
        cur[key] = old[key];
      }
    }
  },
  mounted() {
    this.currentPurchaseTaskSn = this.$router.history.current.query.task_sn
    // this.taskStatus = this.$router.history.current.query.status
    this.getPurchaseTaskList()
    this.getTaskOrder()
  }
};
</script>
<style lang="less" scoped>
@import "./taskSn.less";

.sgy-cut-line {
  margin: 10px 0;
  border-top: 1px dashed #e9eaec;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>


