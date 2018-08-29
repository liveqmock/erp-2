<template>
    <div class="sgy-treeTable-wrapper">
        <div class="left-wrap">
            <p style="line-height: 20px; margin: 12px 0 10px; font-weight: bold;">分类树：</p>
            <div class="sgy-tree-box">
                <ul ref = "categoryUl">
                    <li :id="0" @click="handleCategorySelectChange">全部</li>
                    <li v-for="(category, index) in treeCategory" :id="category.id"  @click="handleCategorySelectChange">{{
                        category.title }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-wrap">
            <div style="margin-bottom: 10px;">
                <span>搜索：{{ this.params.keywords }}</span>
                <Input v-model="searchValue" placeholder="请输入搜索内容" style="margin-right: 5px; width: 300px">
                    <Button type="primary" icon="ios-search" slot="append" @click="handleSearch"></Button>
                </Input>
            </div>
            <thrgo-table
                    :border="false"
                    :loading="loading"
                    path="/goods.goods_sku/lists"
                    size="small"
                    :params="params"
                    :pagination="true"
                    :columns="goodsColumns"
                    :multiple="multiple"
                    :checked="checked"
                    @on-selection-callback="handleSelectionCallback"
            ></thrgo-table>
        </div>
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
                        limit: 12,
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
                        key: 'skuname'
                    },
                    {
                        title: '本地编码',
                        key: 'localsn'
                    },
                    {
                        title: '计量单位',
                        key: 'unit_text'
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
