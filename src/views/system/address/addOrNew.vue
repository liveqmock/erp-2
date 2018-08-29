<template>
  <div>
    <Form ref = "addrForm" :model="addrData" label-position="right" :label-width="100" :rules="ruleValidate">
      <FormItem label = "收货人" prop = "name">
        <Input v-model = "addrData.name" placeholder="请输入收货人姓名"></Input>
      </FormItem>
      <!-- <FormItem label = "所在地区" prop = "name">
        <Input v-model = "addrData.name" placeholder="请输入收货人姓名"></Input>
      </FormItem> -->
      <FormItem label="所在地区" prop="district_id">
        <!-- <Area ref = "area"/> -->
        <Cascader :data="areaData" :load-data="loadArea" :clearable="true" v-model="addrData.district_id"></Cascader>
      </FormItem>
      <FormItem label = "详细地址" prop = "address">
        <Input v-model = "addrData.address" placeholder="请输入详细地址"></Input>
      </FormItem>
      <FormItem label = "邮编" prop = "zipcode">
        <Input v-model = "addrData.zipcode" placeholder="请输入邮编"></Input>
      </FormItem>
      <FormItem label = "手机" prop = "mobile">
        <Input v-model = "addrData.mobile" placeholder="请输入手机"></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Area from '@/views/components/thrgo/area.vue'
import Util from '@/libs/util'
export default {
  name: 'addOrNew',
  components: {Area},
  props: {
    addrData: Object,
    actionStatus: Number,
    addrParams: Object,
    formRef: Object
  },
  data () {
    return {
      ruleValidate: {
        name: [{required: true, message: "收货人不能为空", trigger: "blur" }],
        address: [{required: true, message: "详细地址不能为空", trigger: "blur" }],
        mobile: [{required: true, message: '联系电话不能为空或格式有误', trigger: 'blur', pattern: /^1[3|4|5|7|8][0-9]\d{4,8}$/}],
        zipcode: [{required: true, message: '邮编不能为空或格式有误', trigger: 'blur', pattern: /[1-9]\d{5}(?!\d)/}],
        district_id: [{required: true, message: "区域不能为空", trigger: "change", type: 'array'}]
      },
      areaData: [],
      parent_id: 100000
    }
  },

  methods: {
    loadArea(item, callback) {
      item.loading = true
      this.parent_id = item.value
      setTimeout(() => {
        Util.ajax.post('/setting.area/get_children', {
          id: this.parent_id
        }).then((res) => {
          item.children = res.map(r => {
            let ret = {
              label: r.name,
              value: r.id,
            };
            if(parseInt(r.level_type) !== 3) {
              ret.children = []
              ret.loading = false
            }
            return ret
          })
          callback()
          console.log(item)
          item.loading = false
        })
      }, 0)
    },
    getArea() {
      Util.ajax.post('/setting.area/get_children', {
        id: this.parent_id
      }).then((res) => {
        this.areaData = res.map(item => {
          return {
            label: item.name,
            value: item.id,
            children: [],
            loading: false
          }
        })
      })
    },
    /* areaChange (val, selected) {
      this.addrData.district_id = val[val.length - 1]
      debugger
    } */
  },

  mounted () {
    this.formRef.form = this.$refs.addrForm
    this.getArea()
  }
}
</script>
<style lang="less" scoped>

</style>


