<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Content class="margin-top-20">
        <Card>
        <Row style="margin-top:20px">
            <Table :columns="columns1" :data="data1"></Table>
        </Row>
        <Button class="margin-top-20">取消</Button>
        <Button class="margin-top-20" @click="handleSubmit">提交</Button>
    </Card>
    </Content>
</template>

<script>
    import skuSelect from '@/views/components/thrgo/goods/sku-select.vue';
    import Util from '@/libs/util';

    export default {
        name: 'receipt',
        components: {
            skuSelect
        },
        data () {
            return {
                checked : [],
                order_sn : this.$route.query.order_sn,
                //商品数据
                goodsRowBuffer: [],
                modalSkuSelect: false,
                SkuSelectItems: [],
                loading: true,
                columns1: [
                    {
                        title: '商品编码',
                        key: 'sn'
                    },
                    {
                        title: '商品名称',
                        key: 'skuname'
                    },
                    {
                        title: '收货数量',
                        key: 'number',
                        render: (createEle, params) => {
                            return createEle('Input', {
                                attrs: {value: params.row.number},
                                on: {
                                    'on-change': (e) => {
                                        this.GoodsRowEdit(e,params,'number')
                                    }
                                }
                            })
                        }
                    }
                ],
                data1 : [],
            };
        },
        methods: {
            GoodsRowEdit (e,params,field) {
                this.goodsRowBuffer[params.row.skuid]['number'] = e.target.value;
            },

            init() {
                if(this.order_sn) {
                    Util.ajax.post('/order.order_sku/detail', {
                            order_sn: this.order_sn,
                    }).then(resp => {
                        this.data1 = resp;
                        for (var i in resp) {
                            var val = resp[i];
                            this.checked.push(val.skuid);
                            this.goodsRowBuffer[i] = {};
                            this.goodsRowBuffer[i]['sn'] = val.skusn;
                            this.goodsRowBuffer[i]['number'] = val.number;
                        }
                    })
                }
            },
            handleSubmit() {
                var params = {
                    order_sn: this.order_sn,
                    skuinfo : this.goodsRowBuffer
                };
                Util.ajax.post('/order.order/receipt', params).then(resp => {
                    this.status = true
                    this.$Message.success({
                        content: `保存成功`,
                        duration: 3
                    });
                    setTimeout(() => {
                        this.$router.push({path: `index`})
                    }, 1000);
                })
            },
        },
        mounted (){
            this.init();
        }
    };
</script>