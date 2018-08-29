<template>
    <Content>
        <Cascader :data="data" :load-data="loadArea" :clearable="true" v-model="value"></Cascader>
    </Content>
</template>

<script>
    import Util from '@/libs/util';

    export default {
        name: "Area",
        data() {
            return {
                value: [],
                data: [],
                parent_id: 100000,
            };
        },
        methods: {
            loadArea(item, callback) {
                item.loading = true;
                this.parent_id = item.value;
                setTimeout(() => {
                    Util.ajax.post('/setting.area/get_children', {
                        id: this.parent_id
                    }).then((res) => {
                        item.children = res.map(r => {
                            let ret = {
                                label: r.name,
                                value: r.id,
                            };
                            if(parseInt(r.level_type) !== 3) {
                                ret.children = [];
                                ret.loading = false;
                            }
                            return ret;
                        });
                        callback();
                        console.log(item)
                        item.loading = false;
                    });

                }, 100);

            },


            getArea() {
                Util.ajax.post('/setting.area/get_children', {
                    id: this.parent_id
                }).then((res) => {
                    this.data = res.map(item => {
                        return {
                            label: item.name,
                            value: item.id,
                            children: [],
                            loading: false
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
