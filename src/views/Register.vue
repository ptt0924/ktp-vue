<template>
  <div>
    <div class="upp-left-corner">
      <img src="../assets/img/logo_blue.png" alt="">
    </div>
    <div class="reg-bg">
      <img src="../assets/img/newbg.png" alt=""/>
    </div>

    <div class="main">
      <div v-if="state === 0" class="regSwitch">
        <p>注册账号</p>
        <p>请选择您在日常教学的实际身份</p>
        <div class="firstLine">
          <img
                  src="../assets/img/teacher.png"
                  alt="teacher"
                  @click="state = 1"
          />
          <div @click="state = 1" class="cursor">我是老师/助教</div>
        </div>

        <div class="secondLine">
          <img
                  src="../assets/img/student.png"
                  alt="student"
                  @click="state = 2"
          />
          <div @click="state = 2" class="cursor">我是学生</div>
        </div>
      </div>

      <div v-else-if="state !== 0" class="regMessage">
        <img
                src="../assets/img/returnReg.png"
                class="back"
                alt="返回"
                @click="state = 0"
        />
        <h3 v-if="state === 1">老师/助教注册</h3>
        <h3 v-if="state === 2">学生注册</h3>

        <el-input
                v-model="regAccount.username"
                class="el-input"
                placeholder="用户名"
                @blur="checkAccount()"
        />
        <el-input
                show-password
                slot="reference"
                v-model="regAccount.password"
                class="el-input"
                placeholder="密码"
        />

        <el-input
                show-password
                slot="reference"
                v-model="againPassword"
                class="el-input"
                placeholder="再次输入确认密码"
                @blur="checkPassword"
        />
        <el-input
                v-model="regAccount.name"
                class="el-input"
                placeholder="姓名"
        />
        <el-input
                v-model="regAccount.id"
                class="el-input"
                placeholder="学号/教师号"
        />
        <el-select
                class="el-input"
                v-model="temp"
                filterable
                remote
                reserve-keyword
                placeholder="学校"
                :loading="loading">
          <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
          </el-option>
        </el-select>

        <el-button
                type="primary"
                class="el-button"
                @click="checkNull"
        >
          <span v-if="state == 1">注册为老师/助教</span>
          <span v-else>注册为学生</span>
        </el-button
        >
      </div>

      <div class="bottom">
        <router-link to="login">
          <a href="">已有账号?</a>
          <a href="">去登录</a>
        </router-link>
      </div>
    </div>

    <el-dialog title="注册成功" :visible.sync="successDialog" width="380px">
      <p>
        <i class="el-icon-circle-check green-font"></i>
        您的账号{{ regAccount.username }}注册成功,可以登录!
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="login">直 接 登 录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "@/network/request";
  import {AVATAR, ROLE, STATE, TOKEN, UID} from "@/store/mutation-type";

  export default {
    components: {},
    data() {
      return {
        againPassword: "",
        temp:{},
        regAccount: {
          username: "",
          password: "",
          name: "",
          id: "",
          school: {},
          role: {}
        },
        state: 0, // 模态框分三个状态: 0选择身份 1教师注册 2学生注册
        successDialog: false,
        schools: [],
        options: [],
        loading: false,
      };
    },
    computed: {},
    watch: {},
    methods: {
      login() {
        request({
          url: '/api/user/login',
          method: 'post',
          params: {
            username: this.regAccount.username,
            password: this.regAccount.password
          }
        }).then(res => {
          if (res.data.state == true) {
            this.$store.commit(STATE, res.data.state)
            this.$store.commit(TOKEN, res.data.token)
            this.$store.commit(ROLE, res.data.role)
            this.$store.commit(AVATAR, res.data.avatar)
            this.$store.commit(UID, res.data.uid)

            // 跳转页面至首页
            this.$router.push("/homepage")
          } else {
            this.$message({
              showClose: true,
              message: "请检查网络连接",
              type: "error",
            })
            this.$router.push("/login")
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: "请检查网络连接",
            type: "error",
          })
        })
      },
      checkNull() {
        this.regAccount.school  = {
          sid:this.temp.value,
          schoolName:this.temp.label,
        }
        if (this.regAccount.username === "" || this.regAccount.password === ""
                || this.regAccount.school.sid=== undefined || this.regAccount.name === "") {
          this.$message({
            showClose: true,
            message: "信息不能为空",
            type: "error",
          })
          return;
        }

        if (this.state == 2 && this.regAccount.id === "") {
          this.$message({
            showClose: true,
            message: "信息不能为空",
            type: "error",
          })
          return;
        }

        this.register()
      },
      register() {


        this.regAccount.role = {
          rid: this.state + 1,
          roleName: ''
        }

        console.log("注册信息",this.regAccount)
        request({
          url: '/api/user/registry',
          method: 'post',
          data: this.regAccount
        }).then(res => {
          if (res.data == "注册成功") {
            this.successDialog = true;
          } else {
            this.$message({
              showClose: true,
              message: "注册失败,请检查个人信息",
              type: "error",
            })
            this.againPassword = ""
            this.regAccount = {
              username: "",
              password: "",
              name: "",
              school: {},
              role: {}
            }
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: "网络异常，请重试",
            type: "error",
          })
        })
      },
      // remoteMethod(query) {
      //   if (query !== '') {
      //     this.loading = true;
      //     setTimeout(() => {
      //       this.loading = false;
      //       this.options = this.schools.filter(item => {
      //         console.log(item.schoolName.indexOf(query) > -1)
      //         return item.schoolName.indexOf(query) > -1;
      //       });
      //     }, 200);
      //
      //   } else {
      //     this.options = [];
      //   }
      // },
      checkAccount() {
        if (this.regAccount.username === "") {
          this.$message({
            showClose: true,
            message: "用户名不能为空",
            type: "error",
          });
          return false;
        }

        request({
          url: '/api/user/checkUsername',
          method: 'post',
          params: {username: this.regAccount.username}
        }).then(res => {
          if (res.data == false) {
            this.$message({
              showClose: true,
              message: "该账户已存在,请重新输入",
              type: "error",
            });
            return false;
          }
        })

        return true;
      },
      checkPassword() {
        // 确认密码的提示
        if (this.againPassword == "" || this.againPassword != this.regAccount.password) {
          this.$message({
            showClose: true,
            message: "两次密码不相同",
            type: "error",
          })
        }
      },
    },
    created() {
      request({
        url: '/api/school/getAllSchool',
        method: 'get',
      }).then(res => {
        this.schools = res.data
        console.log(this.schools)
        for (let i=0;i<this.schools.length;i++){
          this.options.push({
            value:this.schools[i].sid,
            label:this.schools[i].schoolName
          })
        }
      })
    },
  };
</script>
<style scoped>
  .green-font {
    color: greenyellow;
  }

  .getCaptcha {
    cursor: pointer;
    line-height: 36px;
    margin-top: 14px;
    width: 126px;
    height: 40px;
    box-sizing: border-box;
    text-align: center;
    color: #818181;
    border: 1px solid #dcdcdc;
    background: #f2f2f2;
    border-radius: 3px;
  }

  .not-allowed {
    cursor: not-allowed;
  }

  .yellow-font {
    color: #f93;
  }

  .red-font {
    color: indianred;
  }

  .YZM-img {
    height: 50px;
    margin-top: 10px;
    border: solid 1px black;
    width: 157px;
  }

  .el-input {
    margin-top: 14px;
    font-size: 14px;
  }

  .cursor {
    cursor: pointer;
  }

  .el-button {
    margin-top: 10px;
    font-size: 16px;
  }

  .YZMdiv {
    display: flex;
    justify-content: space-between;
  }

  .regMessage h3 {
    line-height: 40px;
    font-size: 32px;
    color: #3b3d45;
    font-weight: 400;
    margin-left: 20px;
    display: inline-flex;
  }

  .regMessage .back {
    width: 40px;
    height: 40px;
    margin-top: -11px;
  }

  .regMessage {
    flex-wrap: wrap;
  }

  .regSwitch {
    height: 394px;
  }

  .bottom {
    text-align: right;
    margin: 15px 0;
    font-size: 14px;
  }

  a {
    outline: none;
    text-decoration: none;
    color: #5f6368;
  }

  .bottom a:nth-child(2) {
    color: #32baf0;
  }

  .main .firstLine,
  .main .secondLine {
    margin-top: 70px;
    display: flex;
  }

  .main .firstLine img,
  .main .secondLine img {
    width: 60px;
    height: 60px;
  }

  .main .firstLine div,
  .main .secondLine div {
    width: 330px;
    height: 60px;
    background-color: #32baf0;
    margin-left: 40px;
    text-align: center;
    line-height: 64px;
    color: white;
    border-radius: 5px;
    font-size: 16px;
  }

  .upp-left-corner{
    display: block;
    width: 148px;
    height: 37px;
    position: absolute;
    left: 69px;
    top: 53px;
  }

  .reg-bg {
    position: fixed;
    left: 13%;
    top: 10%;
  }

  img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }

  .main {
    width: 410px;
    padding: 30px 30px 0;
    background-color: white;
    position: absolute;
    left: 70%;
    top: 49%;
    transform: translate(-50%, -50%);
    border-radius: 1%;
    text-align: left;
    -webkit-box-shadow: 2px 2px 10px #909090;
  }

  .main p:nth-child(1) {
    font-size: 32px;
  }

  .main p:nth-child(2) {
    margin-top: 20px;
    font-size: 14px;
  }
</style>

<style>
  .el-button--primary {
    width: 100%;
  }
</style>