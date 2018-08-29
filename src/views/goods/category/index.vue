<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content >
        <Modal
          v-model="modal1"
          title="管理品类"
          @on-ok="ok"
          @on-cancel="cancel" width="60%">
           
          <categoryModelAdd  ref="child"  ></categoryModelAdd>

    </Modal>
     <Modal
          v-model="modalmaoli"
          title="毛利设置"
          @on-ok="okrate"
          @on-cancel="cancel" width="40%">
        <Form ref="form" label-position="right" :label-width="120"  >
            <FormItem label="毛利率" >
              <InputNumber v-model="rate" :max="100" :min="0" :step="0.01" placeholder="毛利率设置"></InputNumber>&nbsp;%
          </FormItem>
         
       </Form>
        </Modal>
        <Row class="margin-bottom-10">
            <Col span="24">
            <Button type="primary" @click="add">管理品类</Button>
            </Col>
        </Row>
        <Row>
            <Col span="23">
                <Table border :columns="columns" :data="items" ></Table>
            </Col>
        </Row>
    </Content>
</template>
<script>
import categoryModelAdd from './add.vue';
import Util from '@/libs/util';
export default {
    name: 'brand',
    components: {
        categoryModelAdd
    },
    data() {
        return {
            rate:0,
            modalmaoli:false,
            addbranid:'',
            loading: true,
            modal1: false,
            items: [],
            ediadata: {},
            catid:'',
            columns: [
                {
                    title: '名称',
                    key:'name',
                    fixed: 'left',
                  
                },
                {
                    title: '状态',
                    width: 200,
                    key:'status_text',
                    align: 'center',
                    filters: [
                        {
                            label: '已通过',
                            value: 1
                        }, {
                            label: '审核中',
                            value: 0
                        }, {
                            label: '未通过',
                            value: -1
                        }
                    ],
                    filterMultiple: false,
                    filterMethod(value, row) {
                        return row.status === value;
                    }
                },
                {
                    title: '设置时间',
                    key: 'create_time',
                    width: 200,
                    align: 'center',
                    fixed: 'left'
                },  
                 {
                    title: '毛利率%',
                    key: 'profit',
                    width: 200,
                    align: 'center',
                    fixed: 'left'
                }, 
                {
                    title: '毛利设置',
                    key: 'create_time',
                    width: 200,
                    align: 'center',
                       render: (h, params) => {
                            return h('div', [
                           
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'gear-b'
                                    },
                                    on:{
                                        click:()=>{
                                           
                                            this.catid = params.row.id;
                                            this.rate=  +params.row.profit;
                                           this.modalmaoli=true;

                                           
                                        }
                                    },
                                }, '毛利设置'),
                              
                            ]);
                        }
                    
                }
            ]
        };
    },
    methods: {
           
        // 设置毛利率
        okrate(){
            console.log(this.catid)
            if (this.rate===0) {
                  this.$Message.error({
                                    content: '输入值不能为0 ',
                                    duration: 3
                    });
                return
            }
            if (this.rate>100) {
                  this.$Message.error({
                                    content: '输入值不能大于100 ',
                                    duration: 3
                                });
                return
            }
           Util.ajax.post('/goods.goods_category_profit/set', {
                 catid: this.catid,
                 rate:this.rate
              })
              .then((res)=> {
                this.$Message.success({
                         content: '毛利率设置成功 ',
                         duration: 3
                    });
                 this.getlist();
                
              }, function(err) {

             })
        },
     
        ok() {
            //执行添加的函数，传参：(pid,{})
            this.addbrand( )
        },
        cancel() {

        },
        add() {
            this.modal1 = true;
        },
        //删除品牌
        deletbrand(branid) {
            Util.ajax.post('/goods.goods_category/destroy', {
                ids: branid
            })
            .then(function(res) {
               
                vm.getlist()
            }, function(err) {

            })
        },
        addbrand(pid,cate){
            var vm = this;
            var idsarray= [];
            this.$refs.child.categoryTemporaryDatas.forEach((item,index)=>{
                idsarray.push(item.id);
            })
            
               
            Util.ajax.post('/goods.goods_category/manage_cate',{ids:idsarray})
                .then((res) =>{
                   
                  this.getlist();
                   
                   
                }, function(err) {

                })
          
        },

        // 获取列表
        getlist() {
            var vm = this;
            Util.ajax.post('/goods.goods_category/lists',{profit:true})
                .then(function(res) {
                    vm.items=res;
                      console.log(res)
                   }, function(err) {

                })
        }
    },
    created() {
        this.loading = false;
    },
    mounted() {
         this.getlist();
    },
};
</script>