<template>
    <div class="sgy-treeTable-wrapper">
          <thrgo-table
                    :border="false"
                    :loading="loading"
                    path="/goods.goods_sku/supplier_lists"
                    size="small"
                    :params="params"
                    :pagination="true"
                    :columns="goodsColumns"
                    :multiple="multiple"
                    :checked="checked"
                    @on-selection-callback="handleSelectionCallback"
            ></thrgo-table>

       
    </div>
</template>

<script>
    import Vue from 'vue';
    import Util from '@/libs/util';
    import thrgoTable from '@/views/components/thrgo/table/table.vue';

    export default {
        name: 'skuSelect',
        components: {
            thrgoTable
        },
        props: {
            params: {
                type: Object,
                default: function() {
                    return {
                        relations:['custom'],
                        limit: 8,
                        page: 1
                    };
                }
            },
            // 多选
            multiple: {
                type: Boolean,
                default: false
            },
            checked: Array
        },
        data() {
            return {
                loading: true,
                searchValue: '',
                treeCategory: [],
                goodsColumns: [
                    {
                        title: '名称',
                        key: 'skuname',
                        
                    },
                    {
                        title: '供应商名称',
                        key: 'seller_id',
                        render: (h, params) => {
                       
                          return params.row.custom.name
                           
                        }
                    },
                    {
                        title: '编码',
                        key: 'localsn'
                    },
                    
                    {
                        title: '规格',
                        key: 'spec'
                    },
                    {
                        title: '状态',
                        key: 'status_text'
                    }
                ]
            };
        },
        mounted() {

            let that = this;
            setTimeout(function () {
                that.loading = false;
            }, 1000)

            if(this.multiple === true) {
                this.goodsColumns.unshift({
                    type: 'selection',
                    width: 60,
                    align: 'center'
                });
            }
            that.loadCategory();
        },

        methods: {
            // 加载左侧品类
            loadCategory() {
                Util.ajax.post('/custom.category/lists', {
                    status: 1,
                    attrs: {"0":"category_info"}
                }).then((res) => {
                    this.treeCategory = res.map((val, key) => {
                        return {
                            id: val.catid,
                            title: val.categoryInfo.name,
                            expand: false
                        };
                    });
                });
            },

            // 响应品类点击
            handleCategorySelectChange(obj) {
                Vue.set(this.params, 'catid', obj.target.id);
                for (var i = 0; i < this.$refs.categoryUl.children.length; i++) {
                    this.$refs.categoryUl.children[i].style.backgroundColor = "#fff"
                }
                obj.target.style.backgroundColor = "#ccc";

            },
            handleSearch() {
                Vue.set(this.params,'keywords',this.searchValue);
            },
            handleSelectionCallback(selection) {
                this.$emit('on-callback', selection);
            }

        }
    }
</script>

<style>
    .sgy-treeTable-wrapper {
        padding: 20px;
        background-color: #fff;
    }

    .sgy-treeTable-wrapper .left-wrap, .sgy-treeTable-wrapper .right-wrap {
        display: inline-block;
        vertical-align: top;
    }

    .sgy-treeTable-wrapper .left-wrap {
        padding-right: 20px;
        width: 25%;
    }

    .sgy-treeTable-wrapper .right-wrap {
        margin-left: -4px;
        width: 75%;
    }

    .sgy-treeTable-wrapper .sgy-tree-box {
        padding: 0 10px;
        width: 100%;
        height: 100%;
        max-height: 433px;
        border: 1px solid #dddee1;
        overflow: auto;
    }
    .sgy-treeTable-wrapper .sgy-tree-box > ul > li {
        border-bottom: 1px dashed #ccc;
        height: 20px;
    }
    .sgy-treeTable-wrapper .sgy-tree-box > ul > li:hover {
        background-color: #ccc;
    }
    .sgy-treeTable-wrapper .sgy-tree-box > ul > li:last-child {
        border-bottom: none
    }
</style>

