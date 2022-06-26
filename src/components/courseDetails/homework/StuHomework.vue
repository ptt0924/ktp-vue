<template>
  <div class="wrapper-stu-homework">
    <div v-if="loadKey">
      <div v-for="task in tasks" :key="task.tno">
        <div class="homework-box">
          <div class="homework-inner">
            <div class="unique-top">
              <div class="work-type">
                <span class="work-type-first-span">个人作业</span>
                <span>{{ date_format(task.releaseTime) }}</span>
                <span>{{ time_format(task.releaseTime) }}</span>
              </div>
            </div>
            <div class="middle">
              <div class="unique-count">
                <span class="score">
                  <el-button @click="gotoTask(task)" type="primary">提交作业</el-button>
                </span>
              </div>
              <div class="unique-title">
                <el-link @click="gotoTask(task)" class="work-name">{{ task.taskName }}</el-link>
                <div>
                  <!--任务内容-->
                  <span class="unique-word" v-html="task.taskContent"></span>

<!--                  &lt;!&ndash;下载附件&ndash;&gt;-->
<!--                  <div class="annex-boxes" v-if="task.annexList !== '' && task.annexList !== null">-->
<!--                    &lt;!&ndash;遍历附件数组&ndash;&gt;-->
<!--                    <div-->
<!--                            v-for="item in task.annexList"-->
<!--                            class="annex-box"-->
<!--                            @click="download_annex(item.annexContent)">-->
<!--                      &lt;!&ndash;附件图片展示  substring(12) 从第12位开始截取&ndash;&gt;-->
<!--                      <img :src="getIconSource(item.annexContent.substring(12))" :alt="item.annexRefer.substring(12)" height="64px" width="64px"/>-->
<!--                      <div :align="'center'" class="annex-label">{{ item.annexContent.substring(12) }}</div>-->
<!--                      <el-link href="javascript:;" class="annex-download" type="primary" :underline="false">下载</el-link>-->
<!--                    </div>-->

<!--                  </div>-->


                </div>

              </div>
            </div>
            <div class="unique-bottom">
              <span class="work-deadline">
                <i class="el-icon-time"></i>截止日期：
                <span>{{ date_format(task.cutOffTime) }}</span>
                <span>{{ time_format(task.cutOffTime) }}</span>
              </span>
              <el-link @click="gotoDiscuss(task)" class="work-commend">讨论</el-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {request} from "@/network/request";

  export default {
    name: 'StuHomework',
    data() {
      return {
        course: {},
        tasks: [],
        loadKey: true
      }
    },
    mounted() {
      // 作业任务
      const taskConfig = request({
        url: '/api/task/getTasksByCno',
        method: 'get',
        params: {
          cno: this.$route.params.cno
        }
      })

      // 课程任务
      const courseConfig = request({
        url: '/api/course/getCourse',
        method: 'get',
        params: {
          cno: this.$route.params.cno
        }
      })

      axios.all([courseConfig, taskConfig])
              .then(axios.spread((res1, res2) => {
                this.course = res1.data
                this.tasks = res2.data
                console.log("tasks",this.tasks);
              }))
    },
    methods: {
      gotoDiscuss(task) {
        // this.$router.push(`/discuss/${this.$route.params.cno}/${task.tno}`)
      },
      date_format(date) {
        const d = new Date(date)
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
      },
      time_format(date) {
        const d = new Date(date)
        return `${d.getHours()}:${d.getMinutes()}`
      },
      gotoTask(task) {
        this.$router.push({path: `/stuTaskCommit/${task.courseNo}/${task.tno}`})
      },

      // 附件图片
      getIconSource(fileName) {
        let temp = fileName.split('.')
        try {d
        //
          return require('assets/fileicons/' + temp[temp.length - 1] + '.png')
        }catch (e) {
          return require('assets/fileicons/txt.png')
        }
      },
      // 下载事件
      download_annex(fileName) {
        const link = document.createElement("a")
        // 指定文件路径，映射后端的文件
        link.href = `../../../ktp_files/${fileName}`
        // 指定文件名
        link.download = fileName.substring(12)
        link.click()
      }
    }
  }
</script>

<style scoped>
  .wrapper-stu-homework {
    width: 83%;
    margin: auto;
    font-size: 14px;
    font-family: 'PingFang SC',tahoma,arial,'helvetica neue','hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif;
  }
  .fen-ge {
    padding-top: 105px;
  }
  .info-top {
    width: 96%;
    height: 200px;
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
    margin-bottom: 20px;
    padding: 48px 0 0 48px;
    border-radius: 8px;
  }
  .topm>h1 {
    font-size: 36px;
    color: #fff;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .topm .sele {
    font-size: 15px;
    color: #fff;
    text-align: left;
    height: 24px;
    line-height: 24px;
    background-position: 100px 10px;
    background-size: 14px auto;
    cursor: pointer;
    user-select: none;
    background: rgba(255,255,255,.4);
    border-radius: 2px;
    padding-right: 10px;
    padding-left: 10px;
    display: inline-block;
  }
  .topm .sele+ul li {
    cursor: pointer;
  }
  .infotextmain {
    display: inline-block;
    color: #fff;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
  }
  .topm .box-box {
    height: 35px;
    margin: 20px auto 0;
    color: #fff;
  }
  .topm ul {
    display: inline-block;
  }
  .topm ul li {
    margin-left: 10px;
    position: relative;
    background: rgba(255,255,255,.4);
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    display: inline-block;
    height: 24px;
    line-height: 24px;
  }
  .codetext {
    display: inline-block;
    line-height: 24px;
    height: 24px;
  }


  .homework-box {
    padding: 0 20px 0 40px;
    border: 1px solid #E2E6ED;
    border-radius: 8px;
    background: #FFF;
    text-align: left;
    margin-top: 20px;
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
  .unique-title {
    margin-bottom: 30px;
    margin-right: 340px;
  }
  .unique-word {
    font-size: 14px;
    height: 20px;
    vertical-align: middle;
    color: #707070;
  }
  .el-dropdown-link:hover {
    cursor: pointer;
  }
  .unique-count {
    float: right;
    display: flex;
    justify-content: space-between;
    text-align: center;
  }
  .unique-bottom {
    color: #A0A0A0;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .work-name {
    font-size: 20px;
    margin-bottom: 5px;
  }
  .work-deadline {
    margin-right: 40px;
    vertical-align: top;
  }

  .homework-box:hover .work-name {
    color: #4D90FE;
  }

  .annex-boxes {
    height: 100px;
  }
  .annex-box {
    float: left;
    text-align: center;
    height: 100px;
    width: 90px;
  }
  .annex-box:hover {
    cursor: pointer;
  }
  .annex-label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .annex-download {
    display: none;
  }
  .annex-box:hover .annex-download {
    display: block;
  }
</style>