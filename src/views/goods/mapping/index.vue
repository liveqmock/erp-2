<template>
    <Content>
        <Row>
            <Col span="24">
                <thrgo-table
                    ref="child"
                    :border="false"
                    path="/goods.goods_category_mapping/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                ></thrgo-table>
            </Col>
        </Row>
    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import mapadd from './add.vue';
    import Util from '@/libs/util';

    export default {
        name: 'mapping_index',
        components: {
            thrgoTable
        },
        data () {
            return {
                ids:[],
                catid:'',
                loading: true,
                uobj:{},
                columns: [
                    {
                        title: '系统品类名',
                        key: 'category.name',
                        width: 200,
                        fixed: 'left',
                        sortable: true,
                        ellipsis: true,
                        render: (h, params) => {
                            return params.row.category.name;
                        }
                    },
                    {
                        title: '我的别名',
                        key: 'alias',
                    },
                    {
                        title: '我的编码',
                        align: 'left',
                        width: 130,
                        key: 'code',
                        sortable: true,
                    },
                    {
                        title: '创建时间',
                        width: 160,
                        key: 'create_time',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '更新时间',
                        width: 160,
                        key: 'update_time',
                        align: 'center',
                        sortable: true,
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
                                          this.catid =params.row.id; 
                                          this.setmodel()
                                        }
                                    },
                                }, '设置'),
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'trash-a'
                                    },
                                    on:{
                                        click:()=>{

                                           this.ids.push(params.row.id)
                                          
                                           this.deletprice()
                                        }
                                    },
                                }, '删除')
                            ]);
                        }
                    }
                ],
                params: {
                    cluster_id: 0,
                    relations: ['category'],
                    limit: 3,
                    page: 1
                }
            };
        },
        methods: {

          
           
            // 设置
            setmodel() {
               
                var vm = this;
                this.$Modal.confirm({
                    title: '编码设置',
                    width: '40%',
                   
                    render: (m) => {

                        return m(mapadd, {
                            props: {
                              formdata:vm.uobj,
                              
                             
                            },
                            
                        });
                    },
                     onOk: ()=>{
                       // 设置
                     
                       this.setoption()

                    }
                });
            },
        setoption(){
            Util.ajax.post('/goods.goods_category_mapping/set', {
                     catid:this.catid,
                     alias: this.uobj.alias,
                     code:this.uobj.code
                })
                .then((res) =>{
                    this.$refs.child.init()
                }, function(err) {

                })
           
        },
        // 删除接口
         deletprice() { 
            Util.ajax.post('/goods.goods_category_mapping/destroy', {
                    ids: this.ids
                })
                .then(function(res) {
                    this.$refs.child.init()
                   
                }, function(err) {

                })
            }
        }
    };
</script>