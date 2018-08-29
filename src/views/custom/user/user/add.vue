<template>
    <Content class="margin-top-20">
        <Form :model="userFormData" label-position="right" :label-width="120" :rules="actionStatus === 0 ? ruleValidateN : ruleValidateM" ref = "addUserForm">
            <Row :gutter="16">
                <Col span="16">
                <FormItem label="用户名" prop="username"  v-if = "actionStatus === 0">
                    <Input v-model="userFormData.username" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="登录密码" prop="password" v-if = "actionStatus === 0">
                    <Input v-model="userFormData.password" placeholder="请输入登录密码" ></Input>
                </FormItem>
                <FormItem label="昵称" prop="nickname">
                    <Input v-model="userFormData.nickname" placeholder="请输入昵称"></Input>
                </FormItem>
                <FormItem label="手机号码" prop="mobile" v-if = "actionStatus === 1">
                    <Input v-model="userFormData.mobile" placeholder="请输入电话"></Input>
                </FormItem>
                
                <FormItem label="邮箱" prop="email" v-if = "actionStatus === 1">
                    <Input v-model="userFormData.email" placeholder="请输入邮箱地址"></Input>
                </FormItem>
                </Col>
                <Col span="8">
                    <Upload class = "uploadSqure" type="drag" action="http://www.sgys.com/index.php/api/v1/attachment/attachment/upload" :on-success="handleAvatarSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError">
                    <div class = "uploadSqureIn">
                        <Icon type="ios-cloud-upload" size="70" style="color: #3399ff"></Icon>
                        <p>{{addOrUp}}</p>
                    </div>
                    </Upload>
                </Col>
            </Row>

                <FormItem label="手机号码" prop="mobile" v-if = "actionStatus === 0">
                    <Input v-model="userFormData.mobile" placeholder="请输入电话"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email" v-if = "actionStatus === 0">
                    <Input v-model="userFormData.email" placeholder="请输入邮箱地址"></Input>
                </FormItem>

            <FormItem label="姓名" prop="realname">
                <Input v-model="userFormData.realname" placeholder="请输入真实姓名"></Input>
            </FormItem>

            <FormItem label="所在部门" prop="branch_id">
                <Select :disabled = "userFormData.isCurrentUser" v-model="userFormData.branch_id" filterable label-in-value :label = "actionStatus === 1 ? userFormData.branch_name : ''" placeholder="请选择部门">
                    <Option v-for="(option, index) in depOption" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
            </FormItem>


            <FormItem label="所在岗位" prop="post_id">
                <Select :disabled = "userFormData.isCurrentUser" v-model="userFormData.post_id" filterable label-in-value :label = "actionStatus === 1 ? userFormData.post_name : ''" placeholder = "请选择岗位">
                    <Option v-for="(option, index) in jobOption" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
            </FormItem>


            <FormItem label="所属角色" prop="role_id">
                <Select :disabled = "userFormData.isCurrentUser" v-model="userFormData.role_id" filterable label-in-value :label = "actionStatus === 1 ? userFormData.role_name : ''" placeholder = "请选择权限角色">
                    <Option v-for="(option, index) in roleOption" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
            </FormItem>

            <FormItem label = "状态" prop = "status">
              <i-switch size="large" v-model="userFormData.status" :true-value = "1" :false-value = "0">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>


        </Form>
    </Content>
</template>

<script>
import Util from '@/libs/util'

export default {
  name: "add",
  props: {
      userFormData: Object,
      userFormParams: Object,
      actionStatus: Number,
      formRef: Object
  },
  data() {
    return {
      // 部门列表加载状态
      depLoading: false,
      // 部门列表下拉数据
      depOption: [],
      // 岗位列表加载状态
      jobLoading: false,
      // 岗位列表下拉数据
      jobOption: [],
      // 角色列表加载状态
      roleLoading: false,
      // 角色列表下拉数据
      roleOption: [],
      formItem: {
        name: ""
      },
      ruleValidateN: {
        username: [{required: true, message: "名称不能为空", trigger: "blur" }],
        password: [{required: true, message: "密码长度为6~16位字母数字混合", trigger: "blur", pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/}],
        mobile: [{required: true, message: '手机号码不能为空或手机格式有误', trigger: 'blur', pattern: /^1[3|4|5|7|8][0-9]\d{4,8}$/}],
        branch_id: [{required: true, message: "部门不能为空", trigger: "change", type:'number' }],
        post_id: [{required: true, message: "岗位不能为空", trigger: "change", type:'number'}],
        role_id: [{required: true, message: "角色不能为空", trigger: "change", type:'number' }],
        realname: [{required: true, message: "真实姓名不能为空", trigger: "blur" }],
        email: [{required: true, message: '邮箱填写有误', trigger: 'blur', pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/}]
      },
      ruleValidateM: {
        // username: [{required: true, message: "名称不能为空", trigger: "blur" }],
        mobile: [{required: true, message: '手机号码不能为空或手机格式有误', trigger: 'blur', pattern: /^1[3|4|5|7|8][0-9]\d{4,8}$/}],
        password: [{required: true, message: "密码长度为6~16位字母数字混合", trigger: "blur", pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/}],
        branch_id: [{required: true, message: "部门不能为空", trigger: "change", type:'number' }],
        post_id: [{required: true, message: "岗位不能为空", trigger: "change", type:'number'}],
        role_id: [{required: true, message: "角色不能为空", trigger: "change", type:'number' }],
        realname: [{required: true, message: "真实姓名不能为空", trigger: "blur" }],
        email: [{required: true, message: '邮箱填写有误', trigger: 'blur', pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/}]
      },
      defaultList: [],
      imgName: "",
      visible: false,
      uploadList: []
    }
  },
  computed: {
    // 头像已传列表
    /* avatarList () {
      return [{name: '头像', url: this.userFormData.avatar}]
    }  */
    // 上传头像提示
    addOrUp () {
      return this.actionStatus === 1 ? '修改头像' : '上传头像'
    }
  },
  methods: {
    // 获取部门下拉菜单列表
    getDepOption () {
      //debugger
      var me = this
      this.depLoading = true
      Util.ajax.post('/custom.branch/lists', {
        custom_id: window.localStorage['currentCustomId'],
        name: '',
        is_tree: null,
        order: '',
        limit: false,
        page: 0
      }).then((resp) => {
        //debugger
        var depListData = JSON.parse(JSON.stringify(resp.data))
        var depOption = []
        depListData.forEach(elem => {
          depOption.push({
            label: elem.name,
            value: elem.id
          })
        })
        //debugger
        me.depOption = depOption
        me.depLoading = false
      })
    },
    // 获取岗位下拉菜单列表
    getJobOption () {
      //debugger
      var me =this
      this.jobLoading  = true
      Util.ajax.post('/custom.post/lists', {
        custom_id: window.localStorage['currentCustomId'],
        name: '',
        achieves: '',
        order: '',
        limit: '',
        page: ''
      }).then((resp) => {
        //debugger
        var jobListData = JSON.parse(JSON.stringify(resp))
        var jobOption = []
        jobListData.forEach(elem => {
          jobOption.push({
            label: elem.name,
            value: elem.id
          })
        })
        me.jobOption = jobOption
        me.jobLoading = false
      })
    },
    // 头像上传格式错误
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误！',
        desc: '文件【 ' + file.name + ' 】格式错误，请上传图片文件！'
      });
    },
    // 头像上传成功函数
    handleAvatarSuccess (res, file, fileList) {
      this.userFormData.avatar = res.result.url;
      this.$Message.success({
          content: `头像上传成功`,
          duration: 3
      });
    },
    // 获取角色下拉菜单列表
    getRoleOption () {
      //debugger
      var me = this
      this.roleLoading = true
      Util.ajax.post('/custom.user_role/lists', {
        custom_id: window.localStorage['currentCustomId'],
        name: '',
        achieves: [],
        order: '',
        limit: false,
        page: 0
      }).then((resp) => {
        //debugger
        var roleListData = JSON.parse(JSON.stringify(resp.data))
        var roleOption = []
        roleListData.forEach(elem => {
          roleOption.push({
            label: elem.name,
            value: elem.id
          })
        })
        //debugger
        me.roleOption = roleOption
        me.roleLoading = false
      })
    },
    handleBeforeUpload(file) {
      this.$Notice.warning({
        title: "文件准备上传",
        desc: "文件 " + file.name + " 准备上传。"
      });
    },
    handleProgress(event, file) {
      this.$Notice.info({
        title: "文件正在上传",
        desc: "文件 " + file.name + " 正在上传。"
      });
    },View(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess2(res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      file.url =
        "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    },
    handleFormatError2(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件 " + file.name + " 太大，不能超过 2M。"
      });
    },
    handleBeforeUpload2() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传 5 张图片。"
        });
      }
      return check;
    },
    // 获取组件表格
    getFormRef (name) {
      return this.$refs[name]
    },
    /* getDepChange (val) {
      //debugger
      this.userFormData.branch_id = val.value
    } */
  },
  mounted() {
    // this.uploadList = this.$refs.upload.fileList
    //debugger
    this.getDepOption()
    this.getJobOption()
    this.getRoleOption()
    this.formRef.form = this.$refs.addUserForm
    //debugger
  }
};
</script>

<style scoped>

</style>
