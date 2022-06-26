<template>
  <div class="personal-deliver">
    <form id="personal_form">
      <el-input v-model="tname" placeholder="作业名称"></el-input>

      <!--编辑框-->
      <Editor class="editor" :description="description" @description="upDescription"/>

      <el-upload
          class="annex-upload"
          multiple
          action="/api/upload/uploadTask"
          :on-success="annexUploadSuccess"
          :on-error="annexUploadError"
          :before-upload="annexBeforeUpload"
          :on-remove="annexBeforeDelete">
        <el-button type="primary" class="annex-button"><i class="el-icon-paperclip el-icon--left"/>上传附件</el-button>
      </el-upload>
      <div class="form-line">
        <span class="form-span">截止日期：</span>
        <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :clearable="false">
        </el-date-picker>
        <el-time-select v-model="end_time" :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }" placeholder="选择时间" v-if="endDate !== ''" style="margin-left: 20px;">
        </el-time-select>
        <el-switch
            v-model="outdate"
            v-if="endDate !== ''"
            active-text="若超时，禁止提交"
            style="margin-left: 50px">
        </el-switch>
      </div>
      <div class="form-line">
        <span class="form-span">满分值：</span>
        <el-input v-model="max_point" style="width: 60px"></el-input>
      </div>
      <div class="form-line">
        <span class="form-span" style="line-height: 40px;height: 40px">是否查重：</span>
        <el-switch
            v-model="check_dump">
        </el-switch>
        <span v-if="check_dump === true">
          <span style="margin-left: 20px;color: #a0a0a0">查重禁戒值：</span>
          <el-input v-model="alarm_line" style="width: 60px;margin-left: 10px;"></el-input>
          <span style="text-align: right;width: 20px;display: inline-block">%</span>
        </span>
        <div style="margin-top: 15px;" v-if="check_dump === true">
          <span class="form-span"></span>
          <el-checkbox v-model="auto_alarm"></el-checkbox>
          <span v-if="check_dump === true">
            <span style="margin-left: 20px;color: #a0a0a0">查重率高于</span>
            <el-input v-model="alarm_line" style="width: 60px;margin-left: 10px;"></el-input>
            <span style="text-align: right;width: 80px;display: inline-block">%自动打回</span>
          </span>
        </div>
      </div>
      <div class="form-line">
        <el-button type="primary" style="float: left"><i class="el-icon-download el-icon--left"/>导入作业</el-button>
        <span style="float: right;display: flex;justify-content: space-between">
          <el-button type="primary" @click="cancel" style="float: left">取消</el-button>
          <el-button type="primary" @click="submit" style="float: left">{{ edit ? "保存" : "发布个人作业" }}</el-button>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
import Editor from "@/components/utils/Editor";
import {fileRequest, request} from "network/request";
import axios from 'axios'

export default {
  name: "PersonalDeliver",
  components: {Editor},
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object
    },
    cno: {
      type: String
    }
  },
  data() {
    return {
      tname: '',
      description: this.task === undefined ? '' : this.task.taskContent,
      endDate: '',
      end_time: '',
      annex: [],
      annex_map: [],
      outdate: false,
      max_point: '',
      check_dump: false,
      alarm_line: '',
      auto_alarm: false,
    }
  },
  mounted() {
    console.log("task",this.task)
    if (this.edit) {
      this.putUp()
    }
  },
  methods: {
    cancel() {
      this.$emit('deliver', 0)
    },
    submit() {
      const data = {
        tno: this.task === undefined ? '' : this.task.tno,
        taskName: this.tname,
        taskContent: this.description,
        cutOffTime: (this.endDate + ' ' + this.end_time + ':00'),
        courseNo: this.task === undefined ? this.cno : this.task.cno,
      }

      request({
        url: this.edit ? '/api/task/updateTask' : `/api/task/addTask`,
        method: 'post',
        data: data
      }).then(res => {
        const tno = res.data
        const task = "task"
        if (!this.edit) {
          const filesConfig = this.annex.map(f => {
            const formData = new FormData()
            formData.append('file', f)
            formData.append('tno', tno)
            formData.append('type',task)
            formData.append('key',tno)
            return fileRequest({
              url: '/api/uda/uploadTG',
              method: 'post',
              data: formData
            })
          })

          axios.all(filesConfig)
              .then(axios.spread((...res) => {
                for (let r of res) {
                  if (r.data === "false") {
                    this.$message.warning("上传文件过程汇中出错")
                    break
                  }
                }
              }))
        }
        this.$emit('send')
        this.$emit('deliver')
      })

    },
    putUp() {
      this.tname = this.task.taskName
      const cut_off_time_date = new Date(this.task.cutOffTime)
      this.endDate = `${cut_off_time_date.getFullYear()}-${cut_off_time_date.getMonth() + 1}-${cut_off_time_date.getDate()}`
      this.end_time = `${cut_off_time_date.getHours()}:${cut_off_time_date.getMinutes()}`
    },
    upDescription(description) {
      this.description = description
      console.log(description)
    },
    annexUploadSuccess(res) {
      this.annex.push({
        oriName: res,
        name: res.substring(10)
      })
      console.log("成功")
      this.$message.success("附件上传成功")
    },
    annexUploadError(res) {
      this.$message.error("附件上传失败")
    },
    annexBeforeDelete(file) {
      this.annex = this.annex.filter(f => f != file)
    },
    annexBeforeUpload(file) {
      this.annex.push(file)
      console.log(this.annex);
      return false
    },
  }

}
</script>

<style scoped>
.personal-deliver {
  border: 1px solid #E2E6ED;
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  padding: 20px 20px 60px;
  text-align: left;
}

.annex-button {
  float: left;
}

.editor, .form-line, .annex-upload {
  margin-top: 20px;
}

.editor {
  position: relative;
  z-index: 40;
}

.form-span {
  display: inline-block;
  width: 70px;
  text-align: right;
  margin-right: 15px;
}
</style>
