<template>
  <div class="card">
    <div class="bg">
      <img :src="bg" alt="" />
    </div>
    <div class="head">
      <div class="iconState">
        <div class="squr"></div>
        <div class="icon" v-if="role === '1'">学</div>
        <div class="icon" v-else>教</div>
      </div>

      <div class="courseName">
        <!---->
        <router-link
          :to="{
            path: `/course/${course.cno}`,
          }"
          >{{ course.courseName }}</router-link>
      </div>

      <div class="courseInfo">

        <el-dropdown trigger="click">
          <div class="addCode">
            <img src="../../assets/img/addCode.png" alt="加课码" />
            <p>
              加课码:<span> {{ course.addCourseCode }}</span>
            </p>
            <i
              class="el-icon-arrow-down el-icon--right"
              style="margin-top: 4px"
            ></i>
          </div>
          <el-dropdown-menu slot="dropdown" v-if="this.$store.state.role === '2'">
            <el-dropdown-item
              @click.native="addCodeReset()"
              >重置</el-dropdown-item>
          </el-dropdown-menu>

          <el-dropdown-menu>

          </el-dropdown-menu>

        </el-dropdown>

        <div class="semester">
          <p>{{ getTermYear }}</p>
          <p v-if="course.semester === 1">第一学期</p>
          <p v-else-if="course.semester === 2">第二学期</p>
        </div>
      </div>
    </div>
    <!--作业-->
    <div class="main">
      <p>近期作业</p>
      <p v-for="item of homework" :key="item.id" class="homework">
        <span class="homework-title">
          {{ item.name }}
        </span>
      </p>
      <p class="homework" v-show="homework.length === 0">无</p>
    </div>

    <div class="bottom">
      <div class="teacher">
        <div class="isTop">成员{{ course.studentNum }}人</div>
        <!-- <el-avatar style="width: 25px; height: 25px"></el-avatar> -->
        <!-- <p>{{ course.teacher }}</p> -->
      </div>
      <div class="set">
        <el-dropdown v-if="role === '0'" trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-more iconMore"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>详细</el-dropdown-item>
            <el-dropdown-item @click.native="deleteCourse()"
              >删除</el-dropdown-item
            >
            <el-dropdown-item @click.native="fileCourse()"
              >归档</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown v-else trigger="click" placement="top">
          <span class="el-dropdown-link">
            <i class="el-icon-more iconMore"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dropOut()">退课</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from "@/network/request";

export default {
  components: {},
  props: {
    course: {
      type: Object,
      require: true,
    },
    role: {
      //0 teach 1 learn
      type: String,
      require: true,
    },
  },
  data() {
    return {
      bg: "",
      // 作业列表
      homework: [],
    };
  },
  computed: {
    getTermYear() {
      return `${this.course.semesterYear}-${parseInt(this.course.semesterYear) + 1}`;
    },
  },
  methods: {
    detailCourse(){
       this.$router.push(`/course/${this.course.cno}`)
    },

    //退课
    dropOut() {
      this.$emit("childDropOut", this.course);
    },

    // 归档课程
    fileCourse() {
      this.course.role = this.role;
      // 子组件往上调用父组件的方法
      this.$emit("childArchiveCourse", this.course);
    },
    // 删除课程
    deleteCourse() {
      this.$emit("childDeleteCourse", this.course);
    },
    // 重置加课码 启用加课码
    addCodeReset() {
      request({
        url: '/api/course/refreshAddCourseCode',
        method: 'post',
        params: {cno: this.course.cno}
      }).then(res => {
        console.log(res.data);
        if (res.data !== "false") {
          this.course.addCourseCode = res.data
        } else {
          this.$message({
            showClose: this,
            message: '网络异常，请重试',
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: this,
          message: '网络异常，请重试',
          type: 'error'
        })
      })
    },
  },
  created() {
    this.bg = require(`../../assets/bg/${Math.floor(Math.random()*14) + 1}.png`); // [1,15) floor向下取整 ---> [1,2,3,...,13,14]
    // this.homework = this.course.recentTasks;
  },
};
</script>
<style  scoped>
.iconMore {
  padding: 3px 0 0 10px;
  font-size: 18px;
  color: rgba(44, 88, 171, 1);
}

.isTop {
  font-size: 12px;
  padding-top: 5px;
}

.teacher p {
  font-size: 12px;
  margin: 5px 0 0 13px;
}

.teacher,
.set {
  display: flex;
}

.bottom {
  display: flex;
  justify-content: space-between;
  padding: 7px 10px;
}

.main > p:nth-child(1) {
  padding-top: 14px;
  font-size: 12px;
  color: rgba(95, 99, 104, 1);
}

.homework {
  cursor: pointer;
  margin-top: 11px;
  font-size: 14px;
  color: rgba(31, 32, 35, 1);
  font-weight: 500;
}

.homework-title {
  border-bottom: 1px solid #ffffff;
}

.homework:hover .homework-title {
  border-bottom: 1px solid #32baf0;
  color: #32baf0;
}

.courseInfo {
  display: flex;
  justify-content: space-between;
}

.semester {
  margin: 12px 12px 0 0;
  text-align: left;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.addCode img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.addCode {
  margin: 24px 0 0 18px;
  width: 140px;
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.courseClass {
  margin-top: 8px;
}

.courseClass,
.courseName {
  text-align: left;
  margin-left: 15px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a {
  color: white;
  outline: none;
  text-decoration: none;
}

.courseName {
  font-size: 20px;
  width: 210px;
}

.courseName a:hover {
  border-bottom: 1px solid white;
}

.iconState {
  position: relative;
  margin-left: 233px;
}

.squr {
  width: 0;
  height: 0;
  border-left: 10px solid #32baf0;
  border-right: 10px solid #32baf0;
  border-bottom: 4px solid transparent;
  position: absolute;
  left: 0;
  top: 22px;
}

.icon {
  background: #32baf0;
  color: #fff;
  font-size: 14px;
  width: 20px;
  height: 22px;
}

.bg {
  position: absolute;
  z-index: -1;
}

.bg img {
  width: 270px;
  height: 127px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.main {
  height: 106px;
  border-bottom: 1px solid #e2e6ed;
  padding: 0 16px;
  text-align: left;
}

.head {
  height: 127px;
}

.card {
  width: 270px;
  height: 275px;
  border: 1px solid #e2e6ed;
  border-radius: 8px;
  position: relative;
}
</style>