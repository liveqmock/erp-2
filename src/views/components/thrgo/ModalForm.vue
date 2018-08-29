<template>
	<Modal
		:title="title"
		:value="value"
		:closable="closable"
		:mask-closable="maskClosable"
		:scrollable="scrollable"
		:width="width"
		:styles="styles"
		:class-name="className"
		:transition-names="transitionNames"
		:transfer="transfer"
		@on-visible-change="handleChange"
	>
		<main>
		    <slot></slot>
		</main>
		<div slot="footer">
	    	<Button type="text" @click="handleCancel">{{cancelText}}</Button>
	    	<Button type="primary" @click="handleOk" :loading="loading">
	    		<span v-if="!loading">{{okText}}</span>
	    		<span v-else>Loading...</span>
	    	</Button>
        </div>
	</Modal>
</template>

<script>
export default {
	name: 'modalForm',
	props: {
		title: {
			type: String,
			default: '操作弹窗'
		},
		value: {
	      	type: Boolean,
	      	default: false
	    },
		closable: {
			type: Boolean,
			default: true
		},
		maskClosable: {
			type: Boolean,
			default: true
		},
		loading: {
			type: Boolean,
			default: false
		},
		scrollable: {
			type: Boolean,
			default: false
		},
		okText: {
			type: String,
			default: '确定'
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		width: '',
		styles: {
			type: Object,
			default: function() {
				return {};
			}
		},
		className: String,
		transitionNames: {
			type: Array,
			default: function() {
				return ['ease', 'fade'];
			}
		},
		transfer: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {}
	},
	methods: {
		handleOk() {
			this.$emit('on-ok');
		},
		handleCancel() {
			// 点击取消、关闭弹窗回调
			this.$emit('on-cancel');
			// 通过v-model实现数据双向绑定
			this.$emit('input', false);
		},
		handleChange(flog) {
			// 用于监听弹窗点击×或者遮罩层关闭弹窗，这里判断this.value与弹窗返回的状态是否一样，如果不一样表示是点击×或者遮罩关闭
			if(this.value != flog){
				this.handleCancel();
			}
		}
	}
}
</script>

<style>
</style>