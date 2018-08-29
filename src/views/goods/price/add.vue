<template>
    <Content class="margin-top-20">
            <Table :columns="columns1" :data="data1"></Table>
                 
                 <Select @on-change='changev' v-model="model10"  :label-in-value="true" style="width:260px;margin-top:15px">

                  <Option  :disabled="item.disable" v-for="(item, index) in cityList" :value="item.value" >{{item.label}}</Option>
                 </Select>
                <Button type="success" @click="addnewdata" style="margin-top:15px">添加</Button>

    </Content>
</template>

<script>
 import Util from '@/libs/util';

export default {
    name: 'add',
    data() {
        return {
            cityList: [],
            addlabel: '',
            addval: '',
            model10: '100',
            canadd: true,
            columns1: [{
                    title: '客户分组',
                    key: 'name',
                    render: (h, params) => {
                        if (params.row.name) {

                            return params.row.name
                        } else {

                        }
                    }

                }, {
                    title: '报价',
                    key: 'quoted_price',

                    render: (h, params) => {
                        var dataindex = params.index;
                        return h('Input', {

                            props: {

                                value: params.row.quoted_price

                            },
                            on: {
                                "on-blur": (event) => {
                                    console.log('进来了 1111')
                                    this.data1[dataindex].quoted_price = event.target.value
                                }
                            }
                        });


                    }
                }, {
                    title: '最小起订量',
                    key: 'min',
                    render: (h, params) => {
                        var dataindex = params.index;

                        return h('Input', {
                            props: {

                                value: params.row.min

                            },
                            on: {
                                "on-blur": (event) => {
                                    console.log('进来了 2222')
                                    this.data1[dataindex].min = event.target.value
                                }
                            }
                        }, );

                    }
                }, {
                    title: '结算方式',
                    key: 'method',
                    width: 400,
                    render: (h, params) => {
                        var dataindex = params.index;

                        return h('RadioGroup', {
                            props: {

                                value: params.row.method
                            },
                            on: {
                                "on-change": (value) => {

                                    this.data1[dataindex].method = value

                                }
                            }
                        }, [
                            h('Radio', {

                                props: {
                                    label: 0


                                },
                            }, '现付'),
                            h('Radio', {

                                props: {
                                    label: 1


                                },
                            }, '到付'),
                            h('Radio', {

                                props: {
                                    label: 2
                                },
                            }, '账期'),
                            h('Radio', {

                                props: {
                                    label: 3

                                }
                            }, '分期')
                        ]);

                    }
                }, {
                    title: '操作',
                    key: 'name',
                    render: (h, params) => {

                        if (params.row.id == 0) {
                            return '-'
                        } else {
                            return h('Button', {
                                props: {

                                },

                                on: {
                                    'click': (t) => {
                                        this.data1.splice(params.index, 1);
                                        console.log(params.row.id)
                                        var canuseId = params.row.id;
                                        // 删除之后取消禁用
                                         console.log(params.row,'删除之后获取参数')
                                        this.canadd=true;
                                        if (this.cityList.length == 1) {
                                           
                                            if (this.cityList[0].value == canuseId){
                                                this.cityList[0].disable = false;
                                            }
                                        } else {
                                            this.cityList.forEach((item, index)=> {
                                                if (item.value == canuseId) {
                                                    item.disable = false
                                                }
                                            });
                                        }

                                    }
                                }
                            }, '删除');
                        }
                    }

                }

            ],
            data1: [

            ],
            model: '',
            paymethod: 0,
            customlist: [],
            ruleValidate: {

            },
        };
    },
    methods: {
        changev(item) {
            this.addlabel = item.label;
            this.addval = item.value;
            this.canadd=true;
        },
        addnewdata() {

            if (this.addval==100) {
                return
            }
            if (this.addval === '') {
                this.$Message.error({
                    content: '你还没有选择分组',
                    duration: 3
                });
                return
            }
            this.data1.forEach( (item, index)=> {
                if(item.id==this.addval){
                   this.canadd= false;
                }
            });
            if (this.canadd) {
                 this.data1.push({
                    name: this.addlabel,
                    id: this.addval,
                    quoted_price: 1,
                    min: 1,
                    method: 0
               });
            }
            this.model10='100';
            // 添加之后禁用当前选项
            if (this.cityList.length == 1) {
                if (this.cityList[0].value == this.addval) {
                    console.log(this.addval)
                    this.cityList[0].disable = true;
                }
            } else {
                this.cityList.forEach((item, index)=> {
                    if (item.value == this.addval) {
                        item.disable = true
                    }
                });
            }
        }
    },
    mounted() {}
};
</script>

<style scoped>

</style>
