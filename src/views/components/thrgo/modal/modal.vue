<template>
    <Modal
        title='添加库房'
        width='40%'
        v-model='modalWarehouseForm'
        :loading='loading'
        @on-ok="doSubmit"
    >
    <div slot="footer">
        <Button type="text" size="large" @click="Cancel">取消</Button>
        <Button type="primary" size="large" @click="Ok">确定</Button>
    </div>
    </Modal>
</template>

<script>
    export default {
        name: "thrgoModal",
        props: {

        }
    }
</script>

<style scoped>

</style>
