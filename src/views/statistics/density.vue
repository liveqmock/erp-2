<template>
	<div>
		<span>统计粒度：</span>
		<ul class="ui-tags">
			<li v-for="(item, index) in columns" :class="{selected: item.value == value}" @click="handleChange(item)">{{item.title}}</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: ''
		},
		columns: {
			type: Array,
			default: function() {
				return []
			}
		}
	},
	data() {
		return {
			
		}
	},
	methods: {
		handleChange(item) {
			if(item.value == this.value) return;
    		this.$emit('input', item.value);
		}
	}
}
</script>

<style>
.ui-tags, .ui-tags li {
	display: inline-block;
	font-size: 0;
	cursor: default;
}
.ui-tags li {
	margin-right: 1px;
	padding: 3px;
	min-width: 32px;
	color: #fff;
	font-size: 12px;
	font-weight: normal;
	text-align: center;
	background-color: #999;
	cursor: pointer;
}
.ui-tags li:nth-child(1) {
	background-color: #f1c205;
}
.ui-tags li:nth-child(2) {
	background-color: #328a05;
}
.ui-tags li:nth-child(3) {
	background-color: #de0b0b;
}
.ui-tags li:nth-child(4) {
	background-color: #0e6ed0;
}
.ui-tags li:nth-child(5) {
	background-color: #0b770b;
}
.ui-tags li:nth-child(6) {
	background-color: #333;
}
.ui-tags li.selected {
	background-color: #999;
}
</style>