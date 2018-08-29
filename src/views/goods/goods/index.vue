<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content>
           
        <Row class="margin-bottom-10">
            <Col span="24">
            <Button type="primary" @click="add">添加产品</Button>
            </Col>
        </Row>
         <div>
            <TableFilter style="margin-top: 10px;"
                        :filters="filters"
                        @on-submit="handleSubmitFilter">
            </TableFilter>
        </div>
        
        <Row>
           
            <Col span="24">
                <thrgo-table
                    
                    ref="child"
                    :isSearch = "false"
                    :border="false"
                    path="/goods.goods/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                    :loading="true"
                ></thrgo-table>
            </Col>
        </Row>
    </Content>
</template>

<script>
    import TableFilter from '@/views/components/thrgo/table/TableFilter.vue';
    import edit  from './edit.vue';
    import goodsModelAdd from './add.vue';
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import Util from '@/libs/util';

    export default {
        name: 'goods_index',
        components: {
            goodsModelAdd,
            thrgoTable,
            edit,
            TableFilter
        },
        data () {
            return {
                 filters: [                     // 数据筛选
                    {
                        type: 'input',
                        name: 'keywords',
                        label: '名称',
                        value: ''
                    },
                    // {
                    //     type: 'select',
                    //     name: 'seller_id',
                    //     label: '供应商',
                    //     value: 'a',
                    //     options: [{label: '全部', value: 'a'}]
                    // },
                    {
                        type: 'select',
                        name: 'type',
                        label: '类型',
                        value: 'a',
                        options: [{label: '全部', value: 'a'},{label: '自营', value: '0'},{label: '代理', value: '1'},
                        {label: '代销', value: '2'},]
                    },
                     {
                        type: 'select',
                        name: 'catid',
                        label: '品类',
                        value: 'a',
                        options: [{label: '全部', value: 'a'}]
                    }, 
                    {
                        type: 'select',
                        name: 'brand_id',
                        label: '品牌',
                        value: 'a',
                        options: [{label: '全部', value: 'a'}]
                    }
                   
                  
                   
                ],
                modalSkuSelect:false,
                modal6:false,
                loading: true,
                ids:[],
                columns: [
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center',
                        width: 200,
                        fixed: 'left',
                     },
                   
                    {
                        title: '经营类型',
                        align: 'center',
                        
                        key: 'type_text',
                       
                        
                    },
                    // {
                    //     title: '供应商',
                    //     width: 200,

                    //     align: 'left',
                    //     ellipsis: true,
                    //     sortable: true,
                    //     render: (h, params) => {
                            
                    //         if (params.row.seller) {
                    //          return params.row.seller.name;
                    //         }
                    //     }
                    // },
                    {
                        title: '标签',
                        
                        key: 'tags_text',
                       
                    },
                    {
                        title: '品类',
                        render: (h, params) => {
                            if (params.row.category) {
                                return params.row.category.name; 
                            }
                           
                        }
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'brand.name',
                       
                        render: (h, params) => {
                           
                            if (params.row.brand) {
                              return params.row.brand.name;

                            }
                        }
                    },
                    {
                        title: '品种数量',
                        align: 'center',
                        sortable: true,
                        key: 'skusCount',
                        render: (h, params) => {
                          
                            if (params.row.skus) {
                              return params.row.skus.length;

                            }
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        fixed: 'right',
                        width: 200,
                        className: 'operate',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        icon: 'edit'
                                    },
                                    on:{
                                        click:()=>{
                                           
                                          
                                            
                                          
                                          console.log(params.row.id)
                                           this.$store.commit('removeTag', 'goods_index');
                                             this.$store.commit('closePage', 'goods_index');

                                              this.$router.push({
                                                         name: 'goods_goods_edit',
                                                         query: {
                                                            id: params.row.id,
                                                          }
                                                    })



                                             
                                         
                                         }
                                    }
                                   
                                }, '编辑'),
                              
                            ]);
                        }
                    }
                ],
                params: {
                    relations: ['seller','category','brand','skus','custom'],
                    attrs: ['skusCount'],
                    limit: 10,
                    page: 1
                }
            };
        },
        methods: {

            // 组装后的数据
            handleSubmitFilter(params, filters) {
                // params 组装后的数据
                
                 var vm = this;
                 if (params.seller_id=='a') {
                    params.seller_id=''
                 }
                 if (params.brand_id=='a') {
                     params.brand_id=''
                 }
                 if (params.catid=='a') {
                    params.catid=''
                 }
                 if (params.type=='a') {
                    params.type=-1;
                 } 

                  console.log(params)
                // 重新获取产品数据
                Util.ajax.post('/goods.goods/lists',{
                    keywords:params.keywords,
                    seller_id:params.seller_id,
                    brand_id:params.brand_id,
                    catid:params.catid,
                    type:params.type,
                    relations: ['seller','category','brand','skus','custom']
                })
               .then(function (res) {
                  console.log(res,'重新提交返回的数据')
                    vm.$refs.child.data= res;  

                        
             }, function (err) {

             })
         },

        // 获取品牌列表
            getbrand() {
                var vm = this;
                Util.ajax.post('/goods.goods_brand/lists')
                    .then(function (res) {
                       
                       res.forEach( (item, index)=> {
                          vm.filters[3].options.push({label:item.name,value:item.id})
                       });
                         console.log(res)

                       

                    }, function (err) {

                    })
            }, 
               // 获取品类的列表
            getlist() {
               
                var vm = this;
                Util.ajax.post('/goods.goods_category/lists')
                    .then(function (res) {

                        console.log(res,'品类');
                         res.forEach( (item, index)=> {
                          vm.filters[2].options.push({label:item.name,value:item.id})
                       });
                     
                           
                    }, function (err) {

                    })
            },   
            // 获取品供应商列表
            getcustomer() {
                var vm = this;
                Util.ajax.post('/custom.cluster/custom',{type_name:'seller'})
                    .then(function (res) {
                         res.forEach( (item, index)=> {
                          vm.filters[1].options.push({label:item.name,value:item.id})
                       });
                     
                           
                    }, function (err) {

                    })
            },
            // 跳转到产品添加的路由
            add () {

                this.$store.commit('removeTag', 'goods_index');
                this.$store.commit('closePage', 'goods_index');
                this.$router.push('/goods/goods/add');
            },
            // 删除
            deletgood() {
            Util.ajax.post('/goods.goods/destroy', {
                    ids: this.ids
                })
                .then((res) =>{
                    this.ids=[];
                    this.$refs.child.init()

                }, function(err) {

                })
            }

        },
        mounted(){
           
            this.getbrand();
            this.getlist();
            // this.getcustomer()
        }

    };
</script>

<style scoped>

</style>
