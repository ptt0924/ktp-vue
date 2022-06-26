<template>
  <div class="wrapper-stu-commit" v-if="this.renderKey">
    <task-commit-nav
            :cname="course.courseName"
            :tno="task.tno"
            :cno="course.cno"
            @back="back" />
    <div class="task-info">
      <div class="task-head">
        <div class="task-title">
          <span>{{ task.taskName }}</span>
        </div>
        <div class="task-word">
          <span v-html="task.taskContent"></span>
<!--          <img src="http://192.168.1.166:8090/_user/eeaa72a328c/DEZCTnewbg.png" alt="">-->
          <img :src=grade.annexRefer alt="">
        </div>
      </div>
      <div class="task-props">
        <span>截止日期：{{ date_format(task.cutOffTime) }} {{time_format(task.cutOffTime)}}</span>
        <span>个人作业</span>
      </div>
    </div>
    <div class="submit">
      <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"

              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div class="submit-box">
        <el-button style="width: 102px;" type="primary" :disabled="isDisabled" plain @click="submit">{{grade.answer == null ? '提交' : '更新提交'}}</el-button>
      </div>
      <span style="float: right">{{ grade.answer === null ? "未完成":"已提交" }}</span>
    </div>
    <div class="work-text">
      <span>答：</span>
      <el-input
              style="width: 97%;float: right"
              type="textarea"
              :autosize="{ minRows: 5 }"
              placeholder="在这里输入你的答案（仅老师可看）..."
              @input="canDisabled"
              v-model="answer">
      </el-input>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {request} from "network/request";
  import TaskCommitNav from "components/utils/TaskCommitNav";

  export default {
    name: "TaskCommit",
    components: {
      TaskCommitNav
    },
    data() {
      return {
        course: {},
        task: {},
        grade: {},
        renderKey: false,
        end_date: '',
        answer: '',
        isDisabled: true,
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      }
    },
    mounted() {
      const courseConfig = request({
        url: '/api/course/getCourse',
        method: 'get',
        params: {
          cno: this.$route.params.cno
        }
      })

      const taskConfig = request({
        url: '/api/task/getTaskByTno',
        method: 'get',
        params: {
          tno: this.$route.params.tno,
        }
      })

      const gradeConfig = request({
        url: '/api/grade/getGrade',
        method: 'get',
        params: {
          uid: this.$store.state.uid,
          tno: this.$route.params.tno
        }
      })

      axios.all([courseConfig, taskConfig, gradeConfig])
              .then(axios.spread((res1, res2, res3) => {
                this.course = res1.data
                this.task = res2.data
                this.grade = res3.data
                this.renderKey = true
                this.answer = this.grade.answer
                this.isDisabled = this.answer === '' || this.answer == null
                console.log(this.course);
              })).catch(err => {console.log(err)})
    },
    methods: {
      submit() {
        if (this.grade.answer == null) {
          this.grade.answer = this.answer
          request({
            url: '/api/grade/submitTask',
            method: 'post',
            data: this.grade
          }).then(res => {
            if (res.data === true) {
              this.$router.push(`/stuHomework/${this.course.cno}`)
              this.$message.success('提交成功')
            } else {
              this.$message.error('提交失败，请重试')
            }
          }).catch(err => {console.log(err)})
        } else {
          this.grade.answer = this.answer
          request({
            url: '/api/grade/updateSubmitTask',
            method: 'post',
            data: this.grade
          }).then(res => {
            if (res.data === true) {
              this.$router.push(`/stuHomework/${this.course.cno}`)
              this.$message.success('提交成功')
            } else {
              this.$message.error('提交失败，请重试')
            }
          })
        }

      },
      canDisabled() {
        this.isDisabled = this.answer === ''
      },
      date_format(date) {
        const d = new Date(date)
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;4
      },
      time_format(date) {
        const d = new Date(date)
        return `${d.getHours()}:${d.getMinutes()}`;
      },
      back() {
        this.$router.push(`/stuHomework/${this.course.cno}`)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },

  }
</script>

<style scoped>
  .submit-box{
    margin-left: 968px;
  }
  .wrapper-stu-commit {
    width: 83%;
    margin: 0 auto;
    font-size: 14px;
    font-family: 'PingFang SC',tahoma,arial,'helvetica neue','hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif;
  }
  .task-info {
    padding-top: 100px;
  }
  .submit {
    margin-top: 40px;
  }
  .task-title {
    font-size: 18px;
  }
  .task-word {
    font-size: 12px;
    margin-top: 14px;
    color: #5F6368;
  }
  .task-props {
    margin-top: 30px;
  }
  .task-props span{
    background-color: #F1F3F4;
    font-size: 12px;
    color: #5F6368;
    padding: 3px 5px;
    margin-right: 10px;
  }
  .work-text {
    margin-top: 20px;
  }
</style>
