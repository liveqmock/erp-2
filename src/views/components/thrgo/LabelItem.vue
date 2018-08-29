<template>
	<div class="sgy-label-item">
		<div :class="['sgy-label', {'sgy-label-colon': colon}]" :style="{width: labelWidth + 'px'}">{{label}}</div>
		<div class="sgy-box">{{value}}</div>
	</div>
</template>

<script>
export default {
	name: 'labelItem',
	props: {
		label: String,			// label
		value: String,			// 文案
		labelWidth: Number,		// label宽度，默认100px
		colon: {				// 是否label后加冒号， 默认true
			type: Boolean,
			default: true
		}
	},
	data() {
		return {}
	}
}
</script>

<style>
.sgy-label-item {
	display: flex;
	height: 35px;
	line-height: 35px;
}
.sgy-label-item > div {
	display: inline-block;
}
.sgy-label-item .sgy-label {
	text-align: right;
	width: 100px;
}
.sgy-label-item .sgy-label-colon:after {
	content: '：';
}
.sgy-label-item .sgy-box {
	margin-left: 10px;
	flex: 1;
}
</style>