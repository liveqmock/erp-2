<template>
    <Content>
        <Row>
     <Button class="tiaojia"  type="primary"  @click="showadjust" >一键调价</Button>

            <Col span="24">
                <thrgo-table
                    :searchkey="searchkey"
                    ref="child"
                    :border="false"
                     path="/goods.goods_sku/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                ></thrgo-table>
            </Col>

        </Row>
        <Modal
        v-model="modal1"
        title="价格设置"
        @on-ok="setoption"
        @on-cancel="cancel"
        width="80%"
        >
        <priceadd ref="priceadd" ></priceadd>
    </Modal> 
    <Modal
        v-model="showadjustmodel"
        title="一键调价"
        width="800px"
        >
        <adjust ref="adjust" ></adjust>
        <p slot="footer">
          <Button type="primary" @click="submitadjust">提交调价</Button>
          <Button type="text" @click="canceladjust">取消调价</Button>

        </p>
    </Modal> 

    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import Util from '@/libs/util';
    import priceadd from './add.vue';
    import adjust from './adjust.vue';


    export default {
        name: 'price_index',
        components: {
            thrgoTable,
            priceadd,
            adjust
        },
        data () {
            
            return {
                searchkey:'输入产品名称',
                uobj:{},
                modal1:false,
                showadjustmodel:false,
                ids:[],
                paramarray:[],
                loading: true,
                catid:'',
                columns: [
                    {
                        title: '名称',
                        key: 'skuname',
                        width: 200,
                        fixed: 'left',
                        sortable: true,
                        render: (h, params) => {
                           
                         return params.row.skuname

                        }
                    },
                    {
                        title: '规格',
                         key: 'spec',
                        align: 'center',
                        width:200
                        
                    },
                    {
                        title: '参考成本(元)',
                        align: 'center',
                        width: 200,
                        key: 'cost',
                        sortable: true

                    },
                    {
                        title: '默认报价(元)',
                        width: 200,
                        key: 'quote',
                        align: 'left',
                      
                        
                       
                    },
                    {
                        title: '默认最小起订',
                        width: 200,
                        key: 'min_number',
                       
                    },
                    {
                        title: '默认结算方式',
                        width: 200,
                        key: 'method_text',
                        
                    },
                    {
                        title: '状态',
                        width: 200,
                        key: 'status_text',
                       
                        filters: [
                            {
                                label: '上架',
                                value: 1
                            },
                            {
                                label: '下架',
                                value: 0
                            },
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            
                            return row.status === value;
                        },
                        render: (h, params) => {
                            return params.row.status_text;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                       fixed: 'right',
                        width: 300,
                        className: 'operate',
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
                                           
                                             // this.$refs.priceadd.data1 = params.row.prices;


                                            
                                            this.skuid = params.row.skuid;

                                            this.catid = params.row.catid
                                            this.modal1 =true;
                                            this.getprielists()
                                             
                                        }
                                    }
                                   
                                }, '设置')
                              
                            ]);
                        }
                    }
                ],
                params: {
                  
                    relations: ['prices','parent'],
                
                    limit: 10,
                    page: 1
                }
            };
        },
        methods: {
            // 显示一键调价组件
            showadjust(){
                this.showadjustmodel=true;
            },
            //取消调价
            canceladjust(){
                this.showadjustmodel=false;
            },
            // 提交调价
            submitadjust(){

                
                var parmpbj;
                // 判断基于毛利率还是基于价格
                // 基于价格
               if(this.$refs.adjust.vertical==0){
                    
                    parmpbj={
                        model:0,
                        params:{
                           cost:this.$refs.adjust.cost,
                           type:this.$refs.adjust.before_rate1,
                           rate:this.$refs.adjust.value8 
                        }
                        
                    }


               }
               // 基于毛利率
               if(this.$refs.adjust.vertical==1){
                // 判断是否是上调
                    if(this.$refs.adjust.height==1){
                        this.$refs.adjust.value9 
                    }

                parmpbj={
                     model:1,
                     params:{
                        height:this.$refs.adjust.height,
                        before_rate:this.$refs.adjust.value10,
                        type:this.$refs.adjust.before_rate,
                        after_rate:this.$refs.adjust.value9
                    }
                  }
               }
              
               Util.ajax.post('goods.goods_price/one_key_adjust',parmpbj)
                .then((res)=> {
                      this.$Message.success({
                                    content: '调价成功',
                                    duration: 3
                                });

                      this.showadjustmodel=false;

                 }, function(err) {

               })

            },
            // 获取已有价格分组列表
            getprielists(){
                var vm  =this;
                Util.ajax.post('/goods.goods_price/cluster_lists', {
                   skuid:this.skuid
                 
                 
                })
                .then((res)=> {
                    console.log(res,'获取所有报价列表');
                    var  priecarry = [];
                    res.forEach( function(item, index) {

                           priecarry.push(item)  
                       
                    });
                   
                    this.$refs.priceadd.data1 =priecarry;

                    // 设置需要显示的分组列表
                     this.$refs.priceadd.cityList=[];
                     var  deafault={value:'100',label:"请选择分组"};
                      this.$refs.priceadd.cityList.push(deafault);
                    res.forEach( (item, index) => {
                    // 已经存在的设置禁止选
                    if (item.id!=0) {
                        if (item.quoted_price!=0) {
                            item.disable=true;
                        }else {
                            item.disable=false;
                        }
                      item.disable=true;
                       this.$refs.priceadd.cityList.push({
                          value:item.id,
                          label:item.name,
                          disable:item.disable
                       }) 
                      }
                     
                    });
                    
                    
                    
                   }, function(err) {

                })
            },
         

            cancel(){},
        
             
            
         //调价提交 
          setoption(){
           
            var paramsary = [];
            var  haszeroprice=false;
            this.$refs.priceadd.data1.forEach( function(item, index) {
                if (item.quoted_price==0) {
                    haszeroprice=true;
                    return
                }
                paramsary.push({name:item.name,cluster_id:item.id,quoted_price:item.quoted_price,min:item.min,method:item.method})
            });
          console.log(haszeroprice)
          if (haszeroprice) {
               this.$Message.error({
                        content: '价格不能为0',
                        duration: 3
                    });

               return

          }
        
          
            var vm =this;
            Util.ajax.post('/goods.goods_price/adjust', {
                  skuid:this.skuid,
                  params:paramsary
                })
                .then((res)=> {
                    this.$Message.success({
                                 content: '调价设置成功',
                                duration: 3
                            });
                    this.$refs.priceadd.data1 =[];
                    this.$refs.child.init()


                }, function(err) {

                })
           
        },
        // 删除
            deletprice() { 
            Util.ajax.post('/goods.goods_price/destroy', {
                    ids: this.ids
                })
                .then((res) =>{
                    this.ids=[];
                    this.$refs.child.init()
                    
                }, function(err) {

                })
            }
        },
         mounted() {
            
        }
    };

</script>
<style scoped>
.tiaojia{
    position: absolute;
    right: 100px;
   
    cursor: pointer;
    z-index: 1000000;
}
</style>