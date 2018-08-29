<template>
    <Content class="margin-top-20">
         <RadioGroup v-model="vertical" vertical>
     <div class="clearfix">
        <div class="leftdiv"> 
        <Radio label="1"  >
            
            <span>毛利率</span>
             
        </Radio>
        </div>  
        <div class="rightdiv">
         <Select v-model="height" style="width:200px">
                <Option v-for="item in heightList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
         
         <InputNumber
            :max="100"
            :min="1"
            v-model="value10"

            
             ></InputNumber>
               <span class="rightpercent">%</span>
        <Select v-model="before_rate" style="width:200px">
                <Option v-for="item in before_rateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
            
            <InputNumber
            :max="100"
            :min="1"
            v-model="value9"
            
            ></InputNumber>
           <span class="rightpercent">%</span>

          </div>
        </div>  
         <div class="clearfix">
        <div class="leftdiv"> 
        <Radio label="0">
          
            <span>价格</span>
        </Radio>
    </div>
    <div class="rightdiv">
        基于
        <Select v-model="cost" style="width:200px">
                <Option v-for="item in costList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="before_rate1" style="width:200px">
                <Option v-for="item in before_rateList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
         
            <InputNumber
            :max="100"
            :min="1"
            v-model="value8"
            
            ></InputNumber>
            <span class="rightpercent">%</span>
        </div>
       </div>
    </RadioGroup>
    </Content>
</template>

<script>
   import Util from '@/libs/util';

export default {
    name: 'adjust',
    
    data() {

        return {
            value8:20,
            value9:20,
            value10: 20,
            vertical: '1',
             height:'0',
             heightList: [
                    {
                        value: '0',
                        label: '低于'
                    },
                    {
                        value: '1',
                        label: '高于'
                    },
                  
                ],
                before_rate:'0',
                before_rateList: [
                    {
                        value: '0',
                        label: '下降'
                    },
                    {
                        value: '1',
                        label: '上调'
                    },
                  
                ], 
                before_rate1:'0',
                before_rateList1: [
                    {
                        value: '0',
                        label: '下降'
                    },
                    {
                        value: '1',
                        label: '上调'
                    },
                  
                ],   
                cost:'0',
                costList: [
                    {
                        value: '0',
                        label: '现报价'
                    },
                    {
                        value: '1',
                        label: '成本价'
                    },
                  
                ],
               

         };
    },
    methods: {
    

    },
    mounted() {
      
  }
};
</script>

<style scoped>
.rightdiv{
    float: left;
}
.leftdiv{
    float: left;
}
.clearfix{
    overflow: hidden;
   margin-bottom: 20px;
}
.rightpercent{
   
    display: inline-block;
    height: 32px;
    position: relative;
    left: -50px;
    top: 3px;

}
</style>
