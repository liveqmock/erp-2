<template>
  <div class = "accountAction">
    <Form :model = "accountFormData" label-position = "right" :label-width = "120">
      <!-- <FormItem prop = "type" label = "账户类型">
        <RadioGroup v-model="accountFormData.type">
          <Radio :label="1">在线账户</Radio>
          <Radio :label="0">线下账户</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem prop = "name" label = "账户名称" v-if = "accountFormData.type === 0">
        <Input v-model="accountFormData.name" type="text" placeholder="请输入账户名称"></Input>
      </FormItem>
      <!-- 线下银行 -->
      <FormItem prop = "open_bank" label = "开户行"  v-if = "accountFormData.type === 0">
        <Input v-model="accountFormData.open_bank" type="text" placeholder="请输入开户行名称"></Input>
      </FormItem>
      <FormItem prop = "card_num" label = "银行帐号" v-if = "accountFormData.type === 0">
        <Input v-model="accountFormData.card_num" type="text" placeholder="请输入银行卡号"></Input>
      </FormItem>
      <FormItem prop = "general_taxpayer" label = "是否一般纳税人"  v-if = "accountFormData.type === 0">
        <RadioGroup v-model="accountFormData.general_taxpayer">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop = "ident_num" label = "纳税人识别号"  v-if = "accountFormData.type === 0">
        <Input v-model="accountFormData.ident_num" type="text" placeholder="请输入纳税人识别号"></Input>
      </FormItem>
      <FormItem prop = "address" label = "地址(银行开户预留)" v-if = "accountFormData.type === 0">
        <Input v-model="accountFormData.address" type="text" placeholder="请输入地址"></Input>
      </FormItem>
      <FormItem prop = "mobile" label = "手机(银行开户预留)" v-if = "accountFormData.type === 0">
        <Input v-model="accountFormData.mobile" type="text" placeholder="请输入手机号码"></Input>
      </FormItem>
      <FormItem prop = "phone" label = "座机(银行开户预留)" v-if = "accountFormData.type === 0">
        <Input v-model="accountFormData.phone" type="text" placeholder="请输入座机号码"></Input>
      </FormItem>
      <!-- *** -->
      <!-- <FormItem prop = "online_code" label = "线上账户类型"  v-if = "accountFormData.type === 1">
        <RadioGroup v-model="accountFormData.online_code">
          <Radio label="wechat">微信支付</Radio>
          <Radio label="alipay">支付宝</Radio>
        </RadioGroup>
      </FormItem> -->
      <!-- 微信组 -->
      <FormItem prop = "mch_id" label = "商户号" v-if = "accountFormData.type === 1 && accountFormData.online_code === 'wechat'">
        <Input v-model="accountFormData.online_config.mch_id" type="text" placeholder="请输入商户号"></Input>
      </FormItem>
      <FormItem prop = "key" label = "API密钥" v-if = "accountFormData.type === 1 && accountFormData.online_code === 'wechat'">
        <Input v-model="accountFormData.online_config.key" type="text" placeholder="请输入API密钥"></Input>
      </FormItem>
      <FormItem prop = "app_id" label = "公众账号ID" v-if = "accountFormData.type === 1 && accountFormData.online_code === 'wechat'">
        <Input v-model="accountFormData.online_config.app_id" type="text" placeholder="请输入微信支付分配的公众账号ID"></Input>
      </FormItem>
      <FormItem prop = "appid" label = "应用ID" v-if = "accountFormData.type === 1 && accountFormData.online_code === 'wechat'">
        <Input v-model="accountFormData.online_config.appid" type="text" placeholder="请输入微信开放平台审核通过的应用APPID"></Input>
      </FormItem>
      <FormItem prop = "status" label = "启用状态 " v-if = "accountFormData.type === 1 && accountFormData.online_code === 'wechat'">
        <RadioGroup v-model="accountFormData.online_config.status">
          <Radio :label="1">启用</Radio>
          <Radio :label="0">停用</Radio>
        </RadioGroup>
      </FormItem>
      <!-- 支付宝组 -->
      <FormItem prop = "app_id" label = "应用ID" v-if = "accountFormData.type === 1 && accountFormData.online_code === 'alipay'">
        <Input v-model="accountFormData.online_config.app_id" type="text" placeholder="请输入支付宝分配的应用APPID"></Input>
      </FormItem>
      <FormItem prop = "ali_public_key" label = "应用公钥" v-if = "accountFormData.type === 1 && accountFormData.online_code === 'alipay'">
        <Input v-model="accountFormData.online_config.ali_public_key" type="textarea" :autosize="{minRows: 5}" placeholder="请输入应用公钥"></Input>
      </FormItem>
      <FormItem prop = "private_key" label = "应用私钥" v-if = "accountFormData.type === 1 && accountFormData.online_code === 'alipay'">
        <Input v-model="accountFormData.online_config.private_key" type="textarea" :autosize="{minRows: 5}" placeholder="请输入应用私钥"></Input>
      </FormItem>
      <FormItem prop = "status" label = "启用状态 " v-if = "accountFormData.type === 1 && accountFormData.online_code === 'alipay'">
        <RadioGroup v-model="accountFormData.online_config.status">
          <Radio :label="1">启用</Radio>
          <Radio :label="0">停用</Radio>
        </RadioGroup>
      </FormItem>
      <!-- 其他通用 -->
      <!-- <FormItem prop = "default" label = "是否默认">
        <RadioGroup v-model="accountFormData.default">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem> -->
      <!-- <FormItem prop = "status" label = "状态">
        <RadioGroup v-model="accountFormData.status">
          <Radio :label="1">正常</Radio>
          <Radio :label="0">已禁用</Radio>
        </RadioGroup>
      </FormItem> -->
    </Form>
  </div>
</template>
<script>
export default {
  name: 'accountAction',
  props: {
    accountFormData: Object,
    sccountFormParams: Object,
    actionStatus: Number
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less">

</style>