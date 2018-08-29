<template>
    <Content>
        <Row>
            <Col span="24">
	          
	                <sku-select
	                        :multiple="true"
	                        @on-callback="handleSkuSelectCallback"
	                ></sku-select>
	            </Col>
        </Row>
    </Content>
</template>

<script>
	import Util from '@/libs/util';
    import skuSelect from '@/views/components/thrgo/goods/sku-sselect.vue';
   
    export default {
        name: 'demo',
        components: {
            skuSelect,
            
        },
        data() {
            return {
                   SkuSelectItems: [],
                 };
        },
       methods: {
            handleSkuSelectCallback (callback) {
                this.SkuSelectItems = callback;
                },
		}
    }
</script>

<style scoped>

</style>
