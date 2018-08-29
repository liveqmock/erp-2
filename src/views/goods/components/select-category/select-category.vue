<style lang="less">

</style>
<template>
    <Transfer
            :data="categoryData"
            :target-keys="keyData"
            filterable
            :filter-method="filterMethod"
            @on-change="handleCategoryChange">
    </Transfer>
</template>

<script>
    import Util from '../../../../libs/util'

    export default {
        name: 'select-Category',
        props: {
            muti: {
                type: Boolean,
                default: false
            },
            max: {
                type: Number,
                default: 1
            },
            currentCategorys: Array
        },
        data () {
            return {
                // 上部框数据
                categoryData: [],
                // 下部框数据
                keyData: []
            }
        },
        methods: {
            // 获取品类类表
            getCategoryList () {
                var me = this
                Util.ajax.post('/goods.goods_category/lists', {
                    custom_id: -1
                }).then(resp => {
                    debugger
                    var categoryData = []
                    if (me.currentCategorys.length === 0) {
                        resp.forEach(elem => {
                            categoryData.push({
                                key: elem.id,
                                label: elem.name,
                                description: elem.description
                            })
                        })
                    } else {
                        /* resp.forEach(elem => {
                            debugger
                            for (var i = 0; i < me.currentCategorys.length; i++) {
                                if (me.currentCategorys[i].id === elem.id) {
                                    continue
                                } else if (i === me.currentCategorys.length - 1) {
                                    categoryData.push({
                                        key: elem.id,
                                        label: elem.name,
                                        description: elem.description
                                    })
                                }
                            }
                        }); */
                        for (var i = 0; i < me.currentCategorys.length; i++) {
                            for (var j = 0; j < resp.length; j++) {
                                if (me.currentCategorys[i] === resp[j]) {
                                    resp.splice(j, 1)
                                }
                            }
                        }
                        me.currentCategorys.forEach(elem => {
                            debugger
                            me.keyData.push(elem.id)
                        })
                    }
                    me.categoryData = categoryData
                }).catch(e => {
                    debugger
                })
            },
            // 传输矿选择事件
            handleCategoryChange (targetKeys, direction, moveKeys) {
                debugger
                var me= this
                if (direction === 'right') {
                    var keyData = []
                    this.categoryData.forEach(elem => {
                        targetKeys.forEach(key => {
                            if (key === elem.key) {
                                keyData.push(key)
                                var n = 0
                                for (var i = 0; i < this.currentCategorys.length; i++) {
                                    debugger
                                    if (me.currentCategorys[i].id !== key) {
                                        n++
                                    }
                                }
                                if (n === me.currentCategorys.length) {
                                    me.currentCategorys.push(
                                        {
                                            id: key,
                                            name: elem.label
                                        }
                                    )
                                }
                            }
                        })
                    })
                } else {
                    /* for (var i = 0; i < this.categoryData.length; i++) {
                        moveKeys.forEach(elem => {
                            if (key === this.categoryData[i].key) {
                                keyData.splice(i, 1)
                                for (var j = 0; j < this.currentCategorys.length; j++) {
                                    if (this.currentCategorys[j].id === key) {
                                        this.currentCategorys.splice(j, 1)
                                    }
                                }
                            }
                        })
                    } */
                    var keyData = this.keyData
                    var delData = []
                    debugger
                    for (var i = 0; i < keyData.length; i++) {
                        debugger
                        for (var j = 0; j < moveKeys.length; j++) {
                            debugger
                            if (keyData[i] === moveKeys[j]) {
                                delData.push(keyData[i])
                                keyData.splice(i, 1)
                            }
                        }
                    }
                    for (var k = 0; k < this.currentCategorys.length; k++) {
                        for (var m = 0; m < delData.length; m++) {
                            if (delData[m] === this.currentCategorys[k].id) {
                                this.currentCategorys.splice(k, 1)
                            }
                        }
                    }
                }
                debugger
                this.keyData = keyData
            }
        },
        mounted () {
            this.getCategoryList()
        }
    };
</script>
