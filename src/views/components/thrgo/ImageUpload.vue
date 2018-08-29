<template>
	<div>
		<div class="ui-upload-list" v-for="item in uploadList">
	        <template v-if="item.status === 'finished'">
	            <img :src="item.url">
	            <div class="ui-upload-list-cover">
	                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
	                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
	            </div>
	        </template>
	        <template v-else>
	            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
	        </template>
	    </div>
	    <Upload
	        ref="upload"
	        type="drag"
	        :action="ajax"
	        :show-upload-list="false"
	        :default-file-list="value"
	        :on-success="handleSuccess"
	        :format="format"
	        :max-size="maxSize"
	        :on-format-error="handleFormatError"
	        :on-exceeded-size="handleMaxSize"
	        :before-upload="handleBeforeUpload"
	        :multiple="multiple"
	        style="display: inline-block;"
	    >
	    	<slot name="button">
	    		<div style="width: 58px;height:58px;line-height: 58px;">
		            <Icon type="camera" size="20"></Icon>
		        </div>
	    	</slot>
	    </Upload>
	    <Modal title="图片预览" v-model="visible">
	        <img :src="viewUrl" v-if="visible" style="width: 100%">
	    </Modal>
	</div>
</template>

<script>
import Util from '@/libs/util';
export default {
	props: {
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
		limit: {										// 上传数量限制
			type: Number,
			default: 5
		},
		multiple: false,								// 是否支持多选
		value: Array									// 数据，使用v-model模式实现数据双向绑定，初始传入数据则为默认数据
	},
	data() {
		return {
			ajax: Util.ajaxUrl + '/attachment/attachment/upload',
            viewUrl: '',
            visible: false,
            uploadList: []
        }
	},
	methods: {
        handleView (url) {
            this.viewUrl = url;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.handleSyncResult();
            this.$emit('input', this.uploadList);
        },
        handleSuccess (res, file, fileList) {
        	file.url = res.result.url;
        	this.$emit('input', this.uploadList);
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
        	// 如果filelist不等于uploadlist，先赋值
        	this.handleSyncResult();
        	// 以下是校验上传数量限制
            const check = this.uploadList.length < this.limit;
            if (!check) {
                this.$Notice.warning({
                    title: '最多可以上传 '+ this.limit +' 个文件。'
                });
            }
            return check;
        },
        handleSyncResult () {
        	// 同步数据
        	if(this.$refs.upload.fileList != this.uploadList){
        		this.uploadList = this.$refs.upload.fileList;
        	}
        },
        // 提供清空上传列表的method，需要在父组件调用此method
        clearFiles() {
        	this.$refs.upload.clearFiles();
        	this.handleSyncResult();
        	this.$emit('input', []);
        }
    },
    mounted () {
    	this.$nextTick(() => {
    		this.handleSyncResult();
    	})
    }
}
</script>

<style>
.ui-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.ui-upload-list img{
    width: 100%;
    height: 100%;
}
.ui-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.ui-upload-list:hover .ui-upload-list-cover{
    display: block;
}
.ui-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>