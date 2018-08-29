<template>
    <div class="sgy-treeTable-wrapper">
        <div class="wrap">
            <thrgo-table
                    :border="false"
                    :loading="loading"
                    path="/stock.stock/batch_list"
                    size="small"
                    :params="batchesParams"
                    :pagination="true"
                    :columns="batchesColumns"
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
            // 多选
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                loading: true,
                searchValue: '',
                treeCategory: [],
                batchesParams: {
                    relations:['sku','warehouse'],
                    limit: 12,
                    page: 1
                },
                checked: [19],
                batchesColumns: [
                    {
                        title: '批次',
                        key: 'batch_code'
                    },
                    {
                        title: '名称',
                        key: 'sku.skuname',
                        render: (h, params) => {
                            return params.row.sku.skuname;
                        }
                    },
                    {
                        title: '编码',
                        key: 'sku.localsn',
                        render: (h, params) => {
                            return params.row.sku.localsn;
                        }
                    },
                    {
                        title: '仓库',
                        key: 'warehouse.name',
                        render: (h, params) => {
                            return params.row.warehouse.name;
                        }
                    },
                    {
                        title: '数量',
                        key: 'number'
                    },
                    {
                        title: '时间',
                        key: 'create_time'
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
                this.batchesColumns.unshift({
                    type: 'selection',
                    width: 60,
                    align: 'center'
                });
            }
        },

        methods: {
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
</style>
