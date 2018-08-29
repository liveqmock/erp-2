<template>
    <Content class="margin-top-20">
        <Form ref="form" label-position="right" :label-width="120" :model="item" :rules="ruleValidate">
            <Row style="margin-top:20px">
                <Col span="24">
                <FormItem label="仓库名称" prop="name">
                    <Input v-model="item.name" placeholder="仓库名称"></Input>
                </FormItem>
                <FormItem label="联系人员" prop="contact">
                    <Input v-model="item.contact" placeholder="联系人员"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="telephone">
                    <Input v-model="item.telephone" placeholder="联系电话"></Input>
                </FormItem>
                <FormItem label="所在地区" prop="area_id">
                    <Area/>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                    <Input v-model="item.address" placeholder="详细地址"></Input>
                </FormItem>
                <FormItem label="是否默认" prop="default">
                    <i-switch v-model="item.default" size="large" :true-value="1" :false-value="0">
                        <span slot="open">默认</span>
                    </i-switch>
                </FormItem>
                </Col>
            </Row>
        </Form>
    </Content>
</template>

<script>
    import Area from '@/views/components/thrgo/area.vue';
    export default {
        name: 'warehouse-form',
        components: { Area },
        props: {
            item: Object
        },
        data() {
            return {
                ruleValidate: {
                    name: [
                        {required: true, message: '仓库名称不能为空', trigger: 'blur'}
                    ],
                    contact: [
                        {required: true, message: '联系人员不能为空', trigger: 'blur'}
                    ],
                    telephone: [
                        {required: true, message: '联系电话不能为空', trigger: 'blur'}
                    ]
                }
            };
        }
    };
</script>

<style scoped>

</style>
