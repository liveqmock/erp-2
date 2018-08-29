<template>
	<div @mouseover="handleMouseover" @mouseout="showUpload = false" class="ui-upload-avatar">
		<div class="ui-avatar" :style="{'width': width + 'px', 'height': width + 'px', 'line-height': width + 'px'}" v-show="value">
			<img :src="imageUrl" />
		</div>
		<div class="ui-progress" v-show="uploading">
			<Progress :percent="percent" hide-info></Progress>
		</div>
		<div class="ui-upload" v-show="showUpload || !value">
			<Upload
		        ref="upload"
		        type="drag"
		        :action="ajax"
		        :show-upload-list="false"
		        :format="format"
		        :max-size="maxSize"
		        :before-upload="handleBeforeUpload"
		        :on-success="handleSuccess"
		        :on-format-error="handleFormatError"
		        :on-exceeded-size="handleMaxSize"
		        :on-progress="handleProgress"
		        :multiple="false"
		    >
		    	<div :style="{'line-height': width + 'px'}">
		            <Icon type="camera" size="20"></Icon>
		       	</div>
		    </Upload>
	    </div>
	</div>
</template>

<script>
import Util from '@/libs/util';
export default {
	props: {
		width: {										// 组件宽度
			type: Number,
			default: 60
		},
		format: {										// 图片格式
			type: Array,
			default: function() {
				return ['jpg','jpeg','png', 'gif', 'bmp'];
			}
		},
		maxSize: {										// 图片大小限制，KB为单位
			type: Number,
			default: 2048
		},
		banUpload: {									// 禁止上传，只做展示
			type: Boolean,
			default: false
		},
		value: String									// 默认图片地址
	},
	data() {
		return {
			ajax: Util.ajaxUrl + '/attachment/attachment/upload',
            showUpload: false,
            uploading: false,
            uploadList: [],
            percent: 0,
            imageUrl: ''
		}
	},
	methods: {
        handleSuccess (res, file, fileList) {
        	this.percent = 100;
        	this.imageUrl = res.result.url;
        	this.$emit('input', res.result.url);
        	setTimeout(() => {
        		this.uploading = false;
        		this.percent = 0;
        	}, 300)
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: file.name + ' 的格式不正确， 请选择'+ this.format.join('、') +'格式的文件。'
            });
        },
        handleMaxSize (file) {
        	// 单位换算
        	let _Mb = this.maxSize / 1024;
        	let f = _Mb.toString().split(".");
        	if(f.length > 1) {
        		_Mb = f[0] + '.' + f[1].substring(0, 2);
        	}
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: file.name + ' 文件太大了， 请选择'+ _Mb +'M以内的文件。'
            });
        },
        handleBeforeUpload () {
        	this.percent = 0;
        	this.uploading = true;
        },
        handleProgress(event, file, fileList) {
        	this.percent = file.percentage;
        },
        handleMouseover() {
        	if(!this.uploading && !this.banUpload){
        		this.showUpload = true;
        	}
        }
    },
    mounted() {
    	this.imageUrl = this.value;
    },
    watch: {
    	value(newVal, oldVal) {
    		if(this.imageUrl != newVal){
    			this.imageUrl = newVal;
    		}
    	}
    }
}
</script>

<style>
.ui-upload-avatar {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    border: 1px dashed #dddee1;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
}
.ui-upload-avatar:hover {
	border-color: #2d8cf0;
}
.ui-upload-avatar .ui-avatar {
	position: relative;
	z-index: 1;
}
.ui-upload-avatar .ui-avatar img {
    width: 100%;
    height: 100%;
}
.ui-upload-avatar .ui-upload, .ui-upload-avatar .ui-progress {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(255, 255, 255, .8);
	z-index: 2;
}
.ui-upload-avatar .ui-progress > div {
	position: absolute;
	left: 3px;
	right: 3px;
	top: 50%;
	margin-top: -9px;
	width: auto;
}
.ui-upload-avatar .ui-upload > div > div {
	border: 0;
	border-radius: 0;
	background-color: transparent;
}
</style>