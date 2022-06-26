<template>
  <div style="display: flex" >
    <div class="upp-left-corner">
      <img src="../assets/img/logo_blue.png" alt="">
    </div>
    <div class="login-bg">
      <img src="../assets/img/newbg.png" alt=""/>
    </div>
<!--    <div class="login-bg2"></div>-->

    <div class="login-box">
      <div class="">
        <div class="title active">
          账号登录
        </div>

        <div class="main">
          <div class="useAccount">
            <input
                    type="text"
                    name="account"
                    v-model="user.username"
                    placeholder="账号"
            />
            <input
                    v-model="user.password"
                    type="password"
                    autocomplete="off"
                    name="pass"
                    placeholder="密码"
            />
          </div>
        </div>

        <div class="bottom">
          <div class="firstLine">
            <div class="autoLogin">
              <input type="checkbox" v-model:checked="autoLogin" @click="autoLogin_Status"/>
              <p>下次自动登录</p>
            </div>

            <a href="javascript:">忘记密码?</a>
          </div>
          <div class="secondLine">
            <button class="loginBtn" @click="login()">登录</button>
          </div>

          <div class="third">
            <router-link to="register">
              <p>还没有账号?<span style="color: #32baf0">去注册</span></p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {request} from "@/network/request";
  import {AVATAR, ROLE, STATE, TOKEN, UID,STATUS} from "@/store/mutation-type";

  export default {
    components: {},
    data() {
      return {
        user: {},
        // 初始化下次自动登录框状态
        autoLogin:false
      };
    },
    computed: {},
    watch: {},
    methods: {
      // 将下次自动登录框状态存入vuex以及localstorage里面
      autoLogin_Status(){
        console.log(this.autoLogin);
        this.$store.commit(STATUS,this.autoLogin);
      },

      login() {
        console.log("看看自己没有没有token",this.$store.state.token)
        request({
          url: '/api/user/login',
          method: 'post',
          params: {
            username: this.user.username,
            password: this.user.password,
            token:this.$store.state.token+""
          }
        }).then(res => {
          if (res.data.state === true) {

            console.log("登录成功看看反馈",res)
            this.$store.commit(STATE, res.data.state)
            this.$store.commit(TOKEN, res.data.token)
            this.$store.commit(ROLE, res.data.role)
            this.$store.commit(AVATAR, res.data.avatar)
            this.$store.commit(UID, res.data.uid)

            console.log("看看登录后没有没有token",this.$store.state.token)
            // 跳转页面至首页
            this.$router.push("/homepage")
          } else {
            this.$message({
              showClose: true,
              message: "用户名和密码不匹配，请重试",
              type: "error",
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: "请检查网络连接",
            type: "error",
          });
        })
      },

      // 自动登录
      auto_login(){
        request({
          url: '/api/user/checkToken',
          method: 'post',
        }).then(res => {
          if (res.data === true) {
            // 跳转页面至首页
            this.$router.push("/homepage")
          } else {
            this.$message({
              showClose: true,
              message: "token验证失效，请重新登录",
              type: "error",
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: "请检查网络连接",
            type: "error",
          });
        })
      }
    },
    created() {
    },
    mounted() {
      // 自动登录
      const token = this.$store.state.token;
      if (this.$store.state.status === "true" && token !== null){
        // 提示
        this.$message.info("1.5秒后自动进入首页")
        // 计时器 1.5秒之后进入首页
        setTimeout(() => {this.auto_login()},1500)
      }
    },
  };
</script>

<!--给HTML的DOM节点加一个不重复data属性(形如：data-v-2311c06a)来表示他的唯一性-->
<!--为了使样式私有化（模块化），不对全局造成污染，可以在style标签上添加scoped属性以表示它的只属于当下的模块-->
<style scoped>
  .resultInput {
    height: 30px;
  }

  .YZM-img {
    height: 150px;
  }

  .upp-left-corner{
    display: block;
    width: 10%;
    height: 10%;
    margin-left: 7%;
    margin-top: 3%;
    /*position: absolute;*/
    /*left: 10%;*/
    /*top: 10%;*/
  }

  .login-bg {
    /*离用户的距离，负数为更远*/
    z-index: -1;
  }

  .
  login-bg2 {
    background: rgba(20, 27, 47, 0.6);
  }

  .login-bg,
  .login-bg2 {
    /*width: 100%;*/
    /*height: 100%;*/
    /*position: fixed;*/
    /*top: 0;*/
    /*position: absolute;*/
    /*left: 10%;*/
    /*top: 10%;*/
    width: 45%;
    height: 100%;
    margin-left: -1%;
    margin-top: 6%;
  }

  img {
    width: 100%;
    height: 100%;
    /*垂直居中*/
    vertical-align: middle;
  }

  .login-box {
    background: white;
    width: 28%;
    height: 24%;
    margin-left: -2%;
    margin-top: 6%;
    /*position: absolute;*/
    /*left: 60%;*/
    /*top: 20%;*/
    /*transform: translate(-50%, -50%);*/
    border-radius: 1%;
    -webkit-box-shadow: 2px 2px 10px #909090;
  }

  .title {
    display: flex;
    justify-content: center;
    padding: 47px 41px 58px 0;
    font-size: 16px;
  }

  a {
    padding: 0 15px;
    outline: none;
    text-decoration: none;
    color: #5f6368;
  }

  .title a:nth-child(2)::after,
  .title a:nth-child(2)::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 1px;

    background: #e2e6ed;
    top: 11%;
  }

  .title a:nth-child(2)::after {
    left: 0;
  }

  .title a:nth-child(2)::before {
    right: 0;
  }

  .title a:nth-child(2) {
    position: relative;
  }

  .active {
    font-size: 26px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(59, 61, 69, 1);
  }

  .main,
  .bottom {
    overflow: hidden;
    padding: 0 30px 30px;
  }

  .bottom .firstLine {
    display: flex;
    justify-content: space-between;
  }

  .useMessage .secondLine input {
    width: 60%;
  }

  input {
    width: 98%;
    height: 64px;
    border-radius: 4px;
    /* float: left; */
    font-size: 16px;
    padding-left: 12px;
    margin-bottom: 24px;

    /* 去除input获得焦点时的黑色边框 */
    outline: none;

    border: 1px solid rgba(226, 230, 237, 1);
    box-sizing: border-box;

    /* 添加边框过渡效果 */
    transition: all 0.3s;
  }

  input:focus {
    border: 1px solid rgb(41, 105, 216);
  }

  .autoLogin input {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    margin-left: 4px;
  }

  .autoLogin {
    display: flex;
  }

  .bottom .firstLine .autoLogin p {
    font-size: 12px;
    margin: 0;
    padding: 0;
  }

  .bottom .firstLine a {
    font-size: 12px;
  }

  .loginBtn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #32baf0;
    text-align: center;
    border-radius: 5px;
    border-color: white;
    color: #fff;
    font-size: 16px;
    margin-top: 25px;
    outline: none;
  }

  .bottom .third {
    text-align: right;
    color: #afb1b3;
    font-size: 14px;
    margin-top: 9px;
  }

  .bottom .third p span {
    color: #32baf0;
  }

  .cancelBtn {
    width: 90%;
    color: white;
    background-color: #328eeb;
  }
</style>