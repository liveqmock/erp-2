<template>
    <Content>
        <Row>
            <Col span="5" style="padding-right: 20px;">
	            <div class="sgy-menu-box">
	            	<h4>选择客户类型</h4>
	                <ul class="sgy-role-lists">
	                    <li v-for="role in roles" @click="changeType(role)" :class="{selected: role.selected}">{{role.name}}</li>
	                </ul>
	            </div>
            </Col>
            <Col span="19">
            <thrgo-table
                    :border="false"
                    size="small"
                    :loading="loading"
                    path="/custom.cluster/custom"
                    :params="tableParams"
                    :pagination="true"
                    :columns="tableColumns"
                    :multiple="multiple"
                    @on-selection-callback="handleSelectionCallback"
            ></thrgo-table>
            </Col>
        </Row>
    </Content>
</template>

<script>
	import Vue from 'vue';
    import Util from '@/libs/util';
    import thrgoTable from '@/views/components/thrgo/table/table.vue';

    export default {
        name: "customerSelect",
        components: {
            thrgoTable
        },
        props: {
            // 多选
            multiple: {
                type: Boolean,
                default: false
            },
            roleType: '',		// 指定类型
        },

        data() {
            return {
                loading: true,
                roles: [{
                	name: '供应商',
                	type: 'seller'
                },{
                	name: '采购商',
                	type: 'buyer'
                },{
                	name: '配送商',
                	type: 'distribution'
                },{
                	name: '物流商',
                	type: 'logistics'
                }],
                tableParams: {
                	type_name: '',
                    limit: 10,
                    page: 1
                },
                tableColumns: [
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '全称',
                        key: 'fullname'
                    },
                    {
                        title: '经营范围',
                        key: 'cust_scope'
                    },
                    {
                        title: '联系人',
                        key: 'cust_represent',
                        width: '80'
                    },
                    {
                        title: '联系电话',
                        key: 'cust_phone',
                        width: '118'
                    }
                ]
            };
        },
        mounted() {
            
            // 指定客户类型
            if(this.roleType){
            	this.tableParams.type_name = this.roleType;
            	this.roles = this.roles.filter(item => {
            		if(item.type == this.roleType){
            			Vue.set(item, 'selected', true);
            			return item;
            		}
            	})
            }
            
            if(this.multiple === true) {
                this.tableColumns.unshift({
                    type: 'selection',
                    width: 60,
                    align: 'center'
                });
            }


        },

        methods: {
            changeType(role) {
            	if(role.selected) return;
            	this.roles = this.roles.map(item => {
            		if(item.selected){
            			item.selected = false;
            		}
            		return item;
            	})
            	if(role.selected != undefined){
            		role.selected = true;
            	}else{
            		Vue.set(role, 'selected', true);
            	}
               	this.tableParams.type_name = role.type;
            },
            handleSelectionCallback(selection) {
                this.$emit('on-callback', selection);
            }
        }

    }
</script>

<style scoped>
.sgy-menu-box {
	border: 1px solid #dddee1;
}
.sgy-menu-box h4 {
	height: 32px;
	line-height: 32px;
	text-align: center;
	border-bottom: 1px solid #e9eaec;
	background-color: #f8f8f9;
}
.sgy-role-lists {
	padding: 8px;
}
.sgy-role-lists li {
	margin-top: 5px;
	line-height: 28px;
	cursor: pointer;
	text-align: center;
}
.sgy-role-lists li:first-child {
	margin-top: 0;
}
.sgy-role-lists li:hover {
	background-color: #eff6fe;
}
.sgy-role-lists li.selected {
	color: #439dfc;
	background-color: #eff6fe;
}
</style>
