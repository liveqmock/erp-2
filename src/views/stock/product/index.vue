<style lang="less" scoped>
@import '../../../styles/common.less';
</style>

<template>
    <Content>
        <Row class="margin-bottom-10">
            <Col span="24">
            <Button type="primary" @click = "jumpbuhuo">仓库补货</Button>
            <Button type="info" @click = "jumpfenjian">产品分拣</Button>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <thrgo-table
                    :border="false"
                    path="/stock.stock_product/lists"
                    :params="params"
                    :pagination="true"
                    :columns="columns"
                    :loading="true"
                ></thrgo-table>
            </Col>
        </Row>
       <Modal v-model="batchmodel" title="批次详情" width="800"> 
            <Table stripe border :columns = "piListCol" :height="500" :data="piListData"></Table>
            <Row>
            <Col span = "18" style = "text-align: right;">
              <Page :total="pagination2.total" :current="pagination2.current" :page-size = "pagination2.perPage" @on-change="changePage" show-elevator show-total></Page>
            </Col>
          </Row>
       </Modal>

        <Modal v-model="stockmodel" title="库存修改" @on-ok="updateStock"> 
            <Form :model="formItem" :label-width="80">
                <FormItem label="销售库存">
                    <Input v-model="formItem.product.sale_stock" placeholder="请输入销售库存" number></Input>
                </FormItem>
                <FormItem label="虚拟库存">
                    <Input v-model="formItem.product.virtual_stock" placeholder="请输入虚拟库存" number></Input>
                </FormItem>
                <FormItem label="锁定库存">
                    <Input v-model="formItem.product.lock_stock" placeholder="请输入锁定库存" number></Input>
                </FormItem>
                <FormItem label="安全库存">
                    <Input v-model="formItem.product.safe_stock" placeholder="请输入安全库存" number></Input>
                </FormItem>
            </Form>
        </Modal>

    </Content>
</template>

<script>
    import thrgoTable from '@/views/components/thrgo/table/table.vue';
    import Util from '@/libs/util';
    import add from '@/views/purchase/plan/add.vue';

    export default {
        name: 'stock_product_index',
        components: {
            thrgoTable,
            add
        },
        data () {
            return {
                uobj:{},
                batchmodel:false,
                loading: true,
                items: [],
                skusn:'',
                params: {
                    relations: ['sku','warehouse'],
                    limit: 12,
                    page: 1,
                },
                piListCol:[
                    {
                      title: "批次",
                      key: "batch_code",
                    },
                    {
                      title: "入库时间",
                      key: "create_time",
                    },
                    {
                      title: "数量",
                      key: "number",
                    },
                    {
                      title: "类型",
                      key: "type_text",
                    }
                ],
                // 分页数据
                pagination2: {
                    total: 0,
                    current: 1,
                    last: 0,
                    perPage: 12
                },
                // 表格行数据
                piListData: [],
                stockmodel:false,
                formItem : {
                    product: {
                        sale_stock: 0,
                        lock_stock: 0,
                        safe_stock: 0,
                        virtual_stock: 0
                    },
                    skusn:'',
                    warehouse_id:''
                },
                showData : {},
                columns: [
                    {
                        title: '产品名称',
                        key: 'sku.skuname',
                        render: (h, params) => {
                            return params.row.sku.skuname;
                        }
                    },
                    {
                        title: '产品编号',
                        key: 'sku.localsn',
                        render: (h, params) => {
                            return params.row.sku.localsn;
                        }
                    },
                    {
                        title: '产品品类',
                        key: 'sku.goods.category.name',
                        render: (h, params) => {
                            return params.row.sku.goods.category.name;
                        }
                    },
                    {
                        title: '产品规格',
                        key: 'sku.spec',
                        render: (h, params) => {
                            return params.row.sku.spec;
                        }
                    },
                    {
                        title: '所在仓库',
                        key: 'warehouse.name',
                        render: (h, params) => {
                            return params.row.warehouse.name;
                        }
                    },
                    {
                        title: '销售库存',
                        key: 'sale_stock'
                    },
                    {
                        title: '库存总量',
                        key: 'total_stock',
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: 'red'
                                }
                            }, params.row.total_stock);
                        }
                    },
                    {
                        title: '虚拟库存',
                        key: 'virtual_stock'
                    },
                    {
                        title: '可用库存',
                        key: 'available_stock'
                    },
                    {
                        title: '在途库存',
                        key: 'transport_stock'
                    },
                    {
                        title: '订单库存',
                        key: 'order_stock'
                    },
                    {
                        title: '锁定库存',
                        key: 'lock_stock'
                    },
                    {
                        title: '安全库存',
                        key: 'safe_stock'
                    },
                    {
                        title: '预售库存',
                        key: 'presell_stock'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        fixed: 'right',
                        width: 150,
                        className: 'operate',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                            click: () => {
                                                this.formItem.product.sale_stock = params.row.sale_stock;
                                                this.formItem.product.lock_stock = params.row.lock_stock;
                                                this.formItem.product.safe_stock = params.row.safe_stock;
                                                this.formItem.product.virtual_stock = params.row.virtual_stock;
                                                this.formItem.skusn = params.row.skusn;
                                                this.formItem.warehouse_id = params.row.warehouse_id;
                                                this.stockmodel=true;
                                            }
                                        }
                                }, '编辑'),
                                h('Button', {
                                    style: 'margin-left:5px',
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'eye'
                                    },
                                    on: {
                                            click: () => {
                                                this.skusn = params.row.skusn;
                                                this.getPiList();
                                                this.batchmodel=true;
                                            }
                                        }
                                }, '查看批次')
                            ]);
                        }
                    }
                ]
            };
        },
        methods:{
            updateStock(){
                Util.ajax.post('/stock.stock_product/save', this.formItem).then(resp => {
                    this.status = true
                    this.$Message.success({
                        content: `编辑成功`,
                        duration: 3
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                });
            },
            // 获取批次列表
            getPiList () {
              Util.ajax.post('/stock.stock/batch_list', {
                skusn: this.skusn,
                limit: 12,
                page: this.pagination2.current,
                attrs:['type_text'],
                order: 'create_time DESC'
              }).then((resp) => {
                this.piListData = resp.data;
                this.pagination2.total = resp.total;
                this.pagination2.current = resp.current_page;
                this.pagination2.last = resp.last_page;
              })
            },
            // 分页跳转
            changePage (page) {
              this.pagination2.current = page;
              this.getPiList();
            },
            //跳转补货
            jumpbuhuo(){
                this.$router.push('/purchase/plan/add');
            },
            //跳转分拣
            jumpfenjian(){
                this.$router.push('/stock/product/sorting');
            }
        },
        created () {

        }
    };
</script>

<style scoped>

</style>
