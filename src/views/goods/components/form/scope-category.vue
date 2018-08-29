<template>
    <Select @on-change="getcatid(formItem.catid)" v-model="formItem.catid">
        <Option v-for="item in categorys" :value="item.id" :key="item.id"> {{ item.name }}
        </Option>
    </Select>
</template>

<script>
    export default {
        name: "scope-category",
    }
</script>

<style scoped>

</style>
