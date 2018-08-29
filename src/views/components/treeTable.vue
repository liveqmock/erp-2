<template>
	<div class="sgy-treeTable-wrapper">
		<div class="left-wrap">
			<p style="line-height: 20px; margin: 12px 0 10px; font-weight: bold;">分类树：</p>
			<div class="sgy-tree-box">
				<Tree :data="treeData"></Tree>
			</div>
		</div>
		<div class="right-wrap">
			<div style="margin-bottom: 10px;">
				<span>搜索：</span>
				<Input v-model="searchValue" placeholder="请输入搜索内容" style="margin-right: 5px; width: 300px"></Input>
				<Button type="primary" icon="ios-search">确定</Button>
			</div>
			<Table border ref="selection" :columns="columns4" :data="tableData" :loading="loading" size="small"></Table>
			<div style="margin: 10px;overflow: hidden">
		        <div style="float: right;">
		            <Page :total="100" :current="1" @on-change="changePage"></Page>
		        </div>
		    </div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "treeTable",
		data() {
			return {
				loading: true,
				searchValue: '',
				treeData: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    },
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                tableData: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
			}
		},
		mounted() {
			let that = this;
			setTimeout(function(){
				that.loading = false;
			}, 1000)
		},
        methods: {
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            changePage () {
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
                // this.tableData1 = this.mockTableData1();
            }
        }
	}
</script>

<style>
.sgy-treeTable-wrapper {
	padding: 20px;
	background-color: #fff;
}
.sgy-treeTable-wrapper .left-wrap, .sgy-treeTable-wrapper .right-wrap {
	display: inline-block;
	vertical-align: top;
}
.sgy-treeTable-wrapper .left-wrap {
	padding-right: 20px;
	width: 25%;
}
.sgy-treeTable-wrapper .right-wrap {
	margin-left: -4px;
	width: 75%;
}
.sgy-treeTable-wrapper .sgy-tree-box {
	padding: 0 10px;
	width: 100%;
	height: 100%;
	max-height: 433px;
	border: 1px solid #dddee1;
	overflow: auto;
}
</style>