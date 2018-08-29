<template>
	<div style="height: 52px">
		<div class="sgy-submit-affix">
			<Button type="primary" @click="handleOk">{{okValue}}</Button>
			<Button @click="handleCancel">{{cancelValue}}</Button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'submitAffix',
		props: {
			okValue: {
				type: String,
				default: '确定'
			},
			cancelValue: {
				type: String,
				default: '取消'
			}
		},
		data() {
			return {

			}
		},
		methods: {
			handleOk() {
				this.$emit('onOk');
			},
			handleCancel() {
				this.$emit('onCancel');
			}
		}
	}
</script>

<style>
.sgy-submit-affix {
	position: fixed;
	left: 200px;
	bottom: 0;
	right: 0;
	padding: 10px;
	text-align: center;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);
	background-color: #fff;
	z-index: 999;
}
.sgy-submit-affix button {
	margin: 0 3px;
}
</style>
