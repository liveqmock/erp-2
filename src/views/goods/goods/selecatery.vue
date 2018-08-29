<template>
    <Content>
        <Cascader :data="data"  :clearable="true" v-model="categeryid"  change-on-select ></Cascader>
    </Content>
</template>

<script>
    import Util from '@/libs/util';

    export default {
        name: "selecatery",
        data() {
            return {
                categeryid: [],
                data: [],
                parent_id: 100000,
            };
        },
        methods: {
            loadArea(item, callback) {
                item.loading = true;
                this.parent_id = item.value;
                setTimeout(() => {
                    Util.ajax.post('/goods.goods_category/lists', {
                        pid: this.parent_id,
                        custom_id: -1
                    }).then((res) => {
                       
                        item.children = res.map(r => {
                            console.log(res)
                            let ret = {
                                label: r.name,
                                value: r.id,
                            };
                            
                            if(parseInt(r.level) !== 4) {
                               
                                ret.children = [];
                                ret.loading = false;
                            }
                            return ret;
                        });
                        callback();
                       
                        item.loading = false;
                    });

                }, 100);

            },


            getArea() {
                Util.ajax.post('/goods.goods_category/lists', {
                    id: this.parent_id
                }).then((res) => {
                    this.data = res.map(item => {
                        return {
                            label: item.name,
                            value: item.id,
                             
                           
                        };
                    });
                });
            }
        },

        mounted() {
            this.getArea();
        }
    }
</script>

<style scoped>

</style>