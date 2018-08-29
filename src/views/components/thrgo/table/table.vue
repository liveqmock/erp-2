<template>
    <Content>
          <div style="margin-bottom: 10px;" v-if = "isSearch">
              
                <Input v-model="searchValue" :placeholder="searchkey" style="margin-right: 5px; width: 300px">
                    <Button type="primary" icon="ios-search" slot="append" @click="handleSearch"  style="height:32px"></Button>
                </Input>
            </div>
            <!--<Col span="24" style="margin-top: 10px;text-align: right" v-if="typeof filters === 'object'">-->
            <!--<div style="background-color: #ffffff">通用筛选制作中</div>-->
            <!--</Col>-->
            <Col span="24">
            <Table
                    :size="size"
                    :columns="columns"
                    :data="data"
                    :loading="cloneLoading"
                    ref="selection"
                    highlight-row
                    @on-current-change="handleCurrentSelect"
                    @on-selection-change="handleChangeSelect"
            ></Table>
            </Col>
            <Col span="24" style="margin-top: 10px;text-align: right" v-if="pagination">
            <Page :total="total" :current="1" :page-size="pageSize" show-elevator @on-change="changePage"></Page>
            </Col>
        </Row>
    </Content>
</template>

<script>
   import Util from '@/libs/util';

export default {
    name: 'thrgoTable',
    props: {
        // 是否显示内置搜索栏
        isSearch: {
            type: Boolean,
            default: true
        },
        searchkey:{
            type: String,
            default:''
        },
        // 接口路径地址
        path: {
            type: String,
            default: ''
        },
        // 请求参数
        params: {
            type: Object,
            default: {}
        },
        columns: {
            type: Array,
            default: []
        },
        // filters: {
        //     type: Object,
        //     default: {}
        // },
        loading: {
            type: Boolean,
            default: false
        },
        size: '',
        checked: Array,
        pagination: Boolean,
        multiple: false
    },
    data() {
        return {
            searchValue: '',
            data: [],
            initTable: [],
            total: 0,
            pageSize: this.params.limit || 12,
            cloneLoading: this.loading,
           
        };
    },
    mounted() {
        this.init();
    },

    created() {},

    methods: {

        init() {
    
            Util.ajax.post(this.path, this.params)
                .then((res) => {
                   
                    if (this.$props.pagination === true) {
                        this.data = res.data;
                        this.initTable =res.data;
                        this.total = res.total;
                       
                        
                    } else {
                        this.data = res;

                        
                       
                    }
                    this.checkedRows();
                })
                .catch((err) => {
                    if (this.loading === true) {
                        this.cloneLoading = false;
                    }
                });
            this.cloneLoading = false;
            
        },

        changePage(page) {
            if (this.pagination === true) {
                this.params.page = page;
            }
            this.init();
        },

        checkedRows() {
            let rows = [];
            this.data = this.data.map(item => {
                if (this.checked.indexOf(item.skuid) > -1) {
                    item._checked = true;
                    rows.push(item);
                }
                return item;
            });
            this.$emit('on-selection-callback', rows);
        },

        handleCurrentSelect(row) {
            this.$emit('on-selection-callback', row);
        },

        handleChangeSelect(selection, row) {
            this.$emit('on-selection-callback', selection);
        },
          handleSearch() {
                this.$set(this.params,'keywords',this.searchValue);
            },
    },

    watch: {
        searchValue:function (val, oldVal) {
             if (val=='') {
                this.$set(this.params,'keywords','');
                this.init()
             }
        },
        params: {
            handler(cur, old) {
                this.init();
            },
            deep: true
        },
        checked: {
            handler(cur, old) {
                this.checkedRows();
            },
            deep: true
        }
    }
};
</script>

<style scoped>
</style>
