<template>
  <div class="wrapper">
    <div class="top">
      <div v-if="$store.state.role === `2`">
        <el-button class="button" @click="deliver(1)" type="primary" plain>发布个人作业</el-button>
        <el-button class="button" @click="deliver(2)" type="primary" plain>发布小组作业</el-button>
      </div>
    </div>
    <div class="main">
      <PersonalDeliver
          v-show="showDeliver===1"
          :cno="course.cno"
          @deliver="deliver"

          @send="send"/>

      <div v-if="loadKey">
        <div v-for="task in tasks" :key="task.tno">
          <div class="homework-box" v-show="!editing[task.tno]">
            <div class="homework-inner">
              <div class="unique-top">
                <div class="work-type">
                  <span class="work-type-first-span">个人作业</span>
                  <span>{{ date_format(task.releaseTime) }}</span>
                  <span>{{ time_format(task.releaseTime) }}</span>
                  <el-dropdown @command="commandHandler" @click.native="focus=task.tno" trigger="click" style="float: right">
                    <span class="el-dropdown-link">· · ·</span>
                    <el-dropdown-menu slot="dropdown" style="width: 200px">
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="saveTo">保存到...</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="middle">
                <div class="unique-count">
                <span class="score">
                  <a>{{ task.correctNum }}</a>
                  <a>已批</a>
                </span>
                  <span class="score">
                  <a>{{ task.submitNum - task.correctNum }}</a>
                  <a>未批</a>
                </span>
                  <span class="score">
                  <a>{{ course.studentNum - task.submitNum }}</a>
                  <a>未交</a>
                </span>
                </div>
                <div class="unique-title">
                  <el-link @click="gotoRevise(task)" class="work-name">{{ task.taskName }}</el-link>
                  <div>
                    <span class="unique-word" v-html="task.taskContent"></span>
                  </div>
                </div>
              </div>
              <div class="unique-bottom">
              <span class="work-deadline">
                截止日期：
                <span>{{ date_format(task.cutOffTime) }}</span>
                <span>{{ time_format(task.cutOffTime) }}</span>
              </span>
                <el-link @click="gotoDiscuss(task)" class="work-commend">讨论</el-link>
              </div>
            </div>
          </div>
          <div v-show="editing[task.tno]">
            <PersonalDeliver :task="task" :edit="true" @deliver="editing[task.tno]=false" @send="send"/>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <p>欢迎开课!</p>
      <p>快速发布、收集学生作业，支持50多种文档在线批阅。</p>
      <p>
        多维度（全班查重、作业字数等）统计学生作业情况。（点击<span>播放视频</span>，查看使用详情）
      </p>
    </div>
  </div>
</template>

<script>
import PersonalDeliver from "@/components/utils/PersonalDeliver";
import {request} from "network/request";

export default {
  components: {
    PersonalDeliver
  },
  data() {
    return {
      showDeliver: 0,
      loadKey: false,
      course: {},
      tasks: [],
      editing: [],
      focus: '',
    };
  },
  methods: {
    gotoDiscuss(task) {
      // this.$router.push(`/discuss/${this.$route.params.cno}/${task.tno}`)
    },
    send(restore = false) {
      request({
        url: '/api/task/getTasksByCno',
        method: 'get',
        params: {cno:this.course.cno}
      }).then(res => {
        this.tasks = res.data
        if (restore) {
          this.tasks.forEach(task => {
            this.editing[task.tno] = false;
          })
        }
        this.loadKey = true
      }).catch(err => {
        this.$message.error("网络异常，请重试")
        this.$router.back()
      })
    },
    deliver(index) {
      this.showDeliver !== index ? this.showDeliver = index:this.showDeliver = 0;
    },
    deepClone(orign,target) {
      const tar = target || {};
      const arrStr = "[object Array]";
      for (const prop in orign)
      {
        if (orign.hasOwnProperty(prop))  {
          if (typeof(orign[prop])=='object'&&typeof(orign[prop])!=="undefined") {
            tar[prop]=Object.prototype.toString.call(orign[prop])===arrStr?[]:{};
            deepClone(orign[prop],tar[prop]);
          } else {
            tar[prop] = orign[prop];
          }
        }
      }
      return tar;
    },
    date_format(date) {
      const d = new Date(date)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    },
    time_format(date) {
      const d = new Date(date)
      return `${d.getHours()}:${d.getMinutes()}`
    },
    commandHandler(command) {
      if (command === 'edit') {
        // this.editing[this.focus] = true
        let temp = this.deepClone(this.editing)
        temp[this.focus] = true
        this.editing = temp
      } else if (command === 'delete') {
        console.log(this.focus);
        request({
          url: '/api/task/deleteTask',
          method: 'post',
          params: {tno: this.focus}
        }).then(res => {
          if (res.data == true) {
            this.send()
            this.$message.success("删除作业成功")
          } else {
            this.$message.error("删除作业失败，请重试")
          }
        })
      }
    },
    gotoRevise(task) {
      this.$router.push({path: `/teacherTaskCorrect/${task.courseNo}/${task.tno}`})
    }
  },
  mounted() {
    console.log(this.$route.params.cno);
    request({
      url: '/api/course/getCourse',
      method: 'get',
      params: {cno: this.$route.params.cno}
    }).then(res => {
      this.course = res.data
      this.send(true)
    })
  }
};
</script>
<style scoped>
.wrapper {
  margin: auto;
  font-size: 14px;
  font-family: 'PingFang SC',tahoma,arial,'helvetica neue','hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif;
}

.homework-box {
  padding: 0 20px 0 40px;
  border: 1px solid #E2E6ED;
  border-radius: 8px;
  background: #FFF;
  text-align: left;
  margin-top: 20px;
}
.homework-box:hover .work-name {
  color: #4D90FE;
}
.work-name {
  font-size: 20px;
  margin-bottom: 5px;
}

.unique-word {
  font-size: 14px;
  height: 20px;
  vertical-align: middle;
  color: #707070;
}

.work-type {
  text-align: left;
  color:#5F6368;
  font-size: 14px;
  padding: 21px 0 10px;
  line-height: 30px;
}
.work-type span, .unique-bottom span {
  margin-right: 15px;
}
.work-type-first-span {
  background-color: #F1F3F4;
  padding: 3px 5px;
}
.el-dropdown-link:hover {
  cursor: pointer;
}
.unique-bottom {
  color: #A0A0A0;
  font-size: 14px;
  margin-bottom: 20px;
}
.work-deadline {
  margin-right: 40px;
  vertical-align: top;
}

.unique-count {
  float: right;
  display: flex;
  justify-content: space-between;
  text-align: center;
}
.unique-count span a {
  display: block;
  min-width: 80px;
  padding-left: 15px;
  color: #707070;
  padding-right: 15px;
}
.unique-count span a:first-child {
  font-size: 30px;
  height: 44px;
  line-height: 44px;
}
.unique-count span a:last-child {
  font-size: 14px;
  height: 26px;
  line-height: 26px;
}
.unique-title {
  margin-bottom: 20px;
  margin-right: 340px;
}

.bottom p span {
  color: #32baf0;
  cursor: pointer;
}

.bottom p:nth-child(1) {
  color: #707070;
}

.bottom p {
  color: #a0a0a0;
  font-size: 14px;
  line-height: 24px;
}

.bottom {
  background: #f1f3f4;
  border-radius: 4px;
  margin-top: 42px;
  text-align: center;
  padding: 35px 0;
}

.top div:nth-child(2) {
  margin-top: 10px;
  cursor: pointer;
}

.top div span {
  padding: 10px 0 0 5px;
  color: #5f6368;
  font-size: 14px;
}

.top .el-button {
  width: 137px;
}

.top .el-button:nth-child(2) {
  margin-left: 10px;
}

.top {
  display: flex;
  justify-content: space-between;
}
</style>