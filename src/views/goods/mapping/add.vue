<template>
    <Content class="margin-top-20">
        <Form ref="formdata" :model="formdata"  label-position="right" :label-width="120" :rules="ruleValidate">
            <FormItem label="别名" prop="alias" >
                <Input v-model="formdata.alias" placeholder="品牌名称"></Input>
            </FormItem>
            <FormItem label="品牌描述" prop="code">
                <Input v-model="formdata.code"  placeholder="编码"></Input>
            </FormItem>
        
        </Form>
    </Content>
</template>

<script>
    export default {
        name: 'add',
        props:{
            type:Object,
            formdata:Object

        },
        data () {
            return {
             ruleValidate: {
                    alias: [
                        {required: true, message: '企业简称不能为空', trigger: 'blur'}
                    ],
                   
                   
                },
             
              

            };
        },
        methods: {
          
        },
     mounted () {
     }
};
</script>

<style scoped>

</style>
