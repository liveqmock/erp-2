<template>
  <div class = "supplierAdd">
    <Form :model = "supplierFormData" label-position = "right" :label-width = "120" :rules = "supplierRules">
      <FormItem label = "供应商" prop = "to_custom_id">
        <Select v-model = "supplierFormData.to_custom_id" filterable remote :remote-method="searchSupByName" :loading="supSeaLoading" label-in-value placeholder = "请输入供应商完整名称搜索"  @on-change = "customSelected">
          <Option v-for = "(option, index) in supplierOption" :value = "option.value" :key = "index">{{option.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label = "选择可供品类" prop = "category_ids">
        <CheckboxGroup v-model="checkAllNameGroup" @on-change="checkAllGroupChange">
          <Checkbox v-for = "(item, index) in categoryList" :label="item.value" :key="index">{{item.label}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <!-- <FormItem label = "请求推送报价（在供应商有新产品上线或现有产品报价变化时)">
        <RadioGroup v-model="supplierFormData.is_push">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem>
        <Checkbox v-model = "supplierFormData.is_push" :true-value = "1" :false-value = "0">请求推送报价（在供应商有新产品上线或现有产品报价变化时)</Checkbox>
      </FormItem>
      <FormItem>
        <Checkbox v-model = "supplierFormData.is_detail" :true-value = "1" :false-value = "0">同意向对方发送我的企业信息</Checkbox>
      </FormItem>
      <FormItem label = "留言信息">
        <Input v-model="supplierFormData.leave_message" type="textarea" :rows="4" placeholder="输入留言内容......"></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Util from '@/libs/util'

export default {
  name: 'supplierAdd',
  props: {
    supplierFormData: Object,
    supplierFormParams: Object,
    actionStatus: Number
  },
  data () {
    return {
      // 获取企业下拉列表作为供应商数据
      supplierOption: [],
      // 品类列表
      categoryList: [],
      // 品类名已选数组
      checkAllNameGroup: [],
      supplierRules:{},
      // 品类id已选数组
      // checkAllIdGroup: [],
      indeterminate: false,
      checkAll: false,
      // 供应商搜索状态
      supSeaLoading: false
    }
  },

  computed: {
    // 品类id已选字符串
    /* checkAllIdGroup () {
      //debugger
      var me = this
      var ids = ''
      for (var j = 0; j < me.categoryList.length; j++) {
        for (var i = 0; i < me.checkAllNameGroup.length; i++) {
          if (me.checkAllNameGroup[i] === me.categoryList[j].label) {
              ids += `${me.categoryList[j].value},`
          }
        }
      }
      // this.categoryList.forEach(elem => {
      //   //debugger
      //   for (var i = 0; i < me.checkAllNameGroup.length; i++) {
      //     if (me.checkAllNameGroup[i] === elem.label) {
      //       if (i === me.checkAllNameGroup.length - 1 && i !== 0) {
      //         ids += `${elem.value}`
      //       } else {
      //         ids += `${elem.value},`
      //       }
      //     }
      //   }
      // })
      me.supplierFormData.category_ids = ids
      return ids
    } */
  },
  
  methods: {
    // 获取企业下拉列表作为供应商
    searchSupByName (queryData) {
      //debugger
      if (queryData === '') return
      this.supSeaLoading = true
      Util.ajax.post('/custom.custom/lists', {
        type_name: 'seller',
        name: queryData,
        cust_auditstate: 1,
        relations: ['user']
      }).then(resp => {
        //debugger
        var supplierOption = JSON.parse(JSON.stringify(resp.data))
        this.supplierOption = []
        supplierOption.forEach(elem => {
          this.supplierOption.push({
            label: elem.name,
            value: elem.id
          })
        });
      this.supSeaLoading = false
      })
    },
    /* getSupplierOption () {
      Util.ajax.post('/custom.custom/lists', {
        cust_auditstate: 1
      }).then((resp) => {
        //debugger
        var supplierOption = JSON.parse(JSON.stringify(resp.data))
        supplierOption.forEach(elem => {
          this.supplierOption.push({
            label: elem.fullname,
            value: elem.id
          })
        });
      })
    }, */
    // 获取可供品类列表
    getCategoryList (id) {
      //debugger
      Util.ajax.post('/custom.category/lists', {
        status: 1,
        custom_id: id
      }).then((resp) => {
        //debugger
        var categoryList = JSON.parse(JSON.stringify(resp))
        categoryList.forEach(elem => {
          this.categoryList.push({
            label: elem.categoryInfo.name,
            value: elem.categoryInfo.id
          })
        })
      })
    },
    // 全选checkbox点击事件
    handleCheckAll () {
      //debugger
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.checkAllGroup = ['香蕉', '苹果', '西瓜'];
      } else {
        this.checkAllGroup = [];
      }
    },
    // checkgroup选择项改变事件
    checkAllGroupChange (checkArr) {
      //debugger
      console.log(arguments)
      this.supplierFormData.category_ids = checkArr.join(',')
      console.log(this.checkAllIdGroup)
    },
    // 企业选择事件
    customSelected (val) {
      debugger
      this.getCategoryList(val.value)
    }

  },

  mounted () {
    // this.getSupplierOption()
    //debugger
    // this.getCategoryList()
  }
}
</script>
<style lang="less">
  @import "./index.less";
</style>


