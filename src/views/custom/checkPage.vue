<template>
  <Content :style="{padding: '50px 100px', minHeight: '280px'}">
    <Card>
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        创建企业结果查询
      </p>
      <div class = "checkImg">
        <img v-if = "checkStatus === 0" src="../../images/checking.png" alt="">
        <img v-else-if = "checkStatus == -1" src="../../images/checkfail.png" alt="">
      </div>
      <p v-if = "checkStatus === 0" class = "checkTip">您的资料正在审核中，请您耐心等待......</p>
      <p v-if = "checkStatus == -1" class = "checkTip">您的资料审核不通过，请 <a @click = "goCreate">重新填写资料</a></p>
      <p v-if = "checkStatus == 1" class = "checkTip">恭喜！您的资料已审核通过，请 <a @click = "logOut">退出</a>后重新登录</p>
      <div style = "text-align: center;margin-top: 80px;margin-bottom: 50px;">
          <Dropdown placement="bottom-end" @on-click="handleLoginDemo">
          <a href="javascript:void(0)">
            <Icon type="arrow-down-b"></Icon> 立即登录（体验账户）
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="caigou1">采购商用户</DropdownItem>
            <DropdownItem name="peisong1">配送商用户</DropdownItem>
            <DropdownItem name="gongying1">供应商用户</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button type = "text" style = "margin-left: 10px;" @click = "logOut">退出</Button>
      </div>
    </Card>
  </Content>
</template>
<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';
export default {
  name: "checkPage",
  data() {
    return {
      checkStatus: ""
    };
  },
  methods: {
    goCreate() {
      // localStorage['customStatusB'] = localStorage['currentCustomStatus']
      // localStorage['currentCustomStatus'] = -2// && localStorage.removeItem('currentCustomStatus')
      localStorage.isRecreate = '1'
      this.$router.push({
        name: "create"
      });
    },
    handleLoginDemo(val) {
      Util.ajax
        .post("/custom.user/access_token_login", {
          access_token_login: val
        })
        .then(res => {
          Cookies.set("user", res.username);
          window.localStorage["user_id"] = res.id;
          this.$store.commit("setUser", res);
          localStorage['currentCustomStatus'] && localStorage.removeItem('currentCustomStatus')
          this.$router.push({
            name: "home_index"
          });
        });
    },
    logOut() {
      localStorage['currentCustomStatus'] && localStorage.removeItem('currentCustomStatus')
      this.$store.commit("logout", this);
      this.$store.commit("clearOpenedSubmenu");
      this.$router.push({
        name: "login"
      });
    },
    getCheckStatus () {
      Util.ajax.post('/custom.custom/check_detail_by_access', {}).then(resp => {
        if (resp.cust_auditstate === 1) {
          localStorage.currentCustomStatus = resp.cust_auditstate
          this.checkStatus = Number(localStorage.currentCustomStatus);
          // this.$router.push({name: 'home'})
        } else {
          localStorage.currentCustomStatus = resp.cust_auditstate
          this.checkStatus = Number(localStorage.currentCustomStatus);
        }
      })
    }
  },
  beforeMount () {
    this.getCheckStatus()
  },
  mounted() {
    
    /* localStorage['customStatusB'] && (localStorage.currentCustomStatus = localStorage['customStatusB'])
    this.checkStatus = localStorage.currentCustomStatus; */
  }
};
</script>
<style lang="less" scoped>
.checkImg {
  margin-top: 20px;
  text-align: center;
}
.checkTip {
  font-size: 15px;
  text-align: center;
  margin: 10px 0;
  a {
    font-style: italic;
    &:hover {
      text-decoration: underline;
    }
  }
}
img {
  height: 150px;
  width: 150px;
}
</style>


