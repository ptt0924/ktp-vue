<template>
  <div class="container">
    <Navigation/>
    <div class="main">
      <div class="nav">
        <!--没有置顶课程就展示全部课程-->
        <p v-if="topList.length === 0">全部课程</p>
        <ul>
          <!--课程排序-->
          <li v-if="this.$store.state.role === `1` || this.$store.state.role === `2`"
              class="sortFile"
              @click="SFDialog = true;selectSF(0);">
            <i class="el-icon-tickets"/>课程排序
          </li>
          <!--归档管理-->
          <li class="sortFile"
              @click="SFDialog = true;selectSF(1);"
              v-if="this.$store.state.role === `1` || this.$store.state.role === `2`">
            <i class="el-icon-printer"/>归档管理
          </li>
          <!--加入、创建课程-->
          <li>
            <el-button type="primary" style="height: 40px"
                       v-if="this.$store.state.role === `1` || this.$store.state.role === `2`"
                       @click="createCourseDialog = true"
            >+ 创建课程
            </el-button>
            <el-button type="primary" style="height: 40px"
                       v-else
                       @click="joinCourseDialog = true"
            >+ 加入课程
            </el-button>
          </li>
          <!--发布活动-->
          <li v-if="this.$store.state.role === `1` || this.$store.state.role === `2`">
            <el-button
                type="primary"
                style="height: 40px"
                @click="quickReleaseDialog = true"
            >+ 快速发布活动
            </el-button
            >
          </li>
        </ul>
      </div>

      <div class="courseShow">
        <courseCard
            v-if="$store.state.role === `2`"
            @childDeleteCourse="childDeleteCourse"
            @childArchiveCourse="childArchiveCourse"
            v-for="course in courses"
            :key="course.cno"
            :course="course"
            class="courseCard"
            :role="'0'"
        />

        <courseCard
            v-if="$store.state.role === `3`"
            @childDropOut="childDropOut"
            v-for="course in courses"
            :key="course.cno"
            :course="course"
            class="courseCard"
            :role="'1'"
        />

        <div class="addCourse" v-if="$store.state.role === `2`">
          <div class="addBg"></div>
          <div class="addfont">
            <i @click="createCourseDialog = true" class="el-icon-plus"></i>
            <p @click="createCourseDialog = true">创建课程</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速发布任务模态框 -->
    <!--发布未实现-->
    <el-dialog :visible.sync="quickReleaseDialog" width="40%" top="30vh">
      <p class="quickRelease">选择要发布的类型</p>
      <div class="quickReleaseSelect">
        <div class="quickReleaseIcon">
          <div></div>
          <p>公告</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>话题</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>课堂互动</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>作业</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>测试</p>
        </div>
      </div>
    </el-dialog>

    <!-- 创建课程模态框 -->
    <el-dialog v-if="this.$store.state.role === `1` || this.$store.state.role === `2`"
               :visible.sync="createCourseDialog" width="660px" top="30vh">
      <p slot="title" class="createCourseTitle">新建课程</p>
      <div class="createCourse">
        <el-input
            class="createCourseInput"
            v-model="createCourse.courseName"
            placeholder="请输入课程名称"
            maxlength="20"
        />
        <el-input
            class="createCourseInput"
            placeholder="请输入班级名称(选填)"
            maxlength="20"
            v-model="createCourse.className"
        />
        <div class="selectSemester">
          <p>选择学期:</p>
          <el-date-picker
              v-model="createCourse.semesterYear"
              type="year"
              placeholder="选择学年"
          >
          </el-date-picker>

          <el-select v-model="createCourse.semester">
            <el-option
                v-for="item in optionSemester"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div slot="footer" class="createCourseFooter">
        <el-button style="width: 100px" @click="createCourseDialog = false"
        >取消
        </el-button
        >
        <el-button
            type="primary"
            :disabled="createCourse.courseName.length<=0"
            style="width: 100px"
            @click="create()"
        >创建
        </el-button
        >
      </div>
    </el-dialog>

    <!-- 归档课程 模态框 -->
    <el-dialog :visible.sync="fileCourseDialog" width="450px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要归档"{{ this.course.name }}"吗?
      </p>

      <div class="file-tips">
        <p>您可以在“课堂”-“归档管理”中查看此课程</p>
        <p>
          【归档】，学生的课程也会一起被归档
        </p>
      </div>

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="fileCourseDialog = false" style="width: 100px"
        >取消
        </el-button
        >

        <el-button style="width: 100px" @click="courseArchive"
        >归档全部
        </el-button
        >
      </div>
    </el-dialog>

    <!-- 删除课程 模态框 -->
    <el-dialog :visible.sync="deleteCourseDialog" width="450px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要删除"{{ this.deleteCourseObj.courseName }}"吗?
      </p>

      <div class="delete-tips">
        <p>您的这个课程的任何信息或评论将被永久删除</p>
        <p>警告：此操作无法撤消</p>
        <p>提醒：已用课程数包含了“删除课程数”</p>
      </div>
      <div slot="footer" class="joinCourseFooter">
        <el-button @click="deleteCourseDialog = false" style="width: 100px"
        >取消
        </el-button
        >
        <el-button
            type="primary"
            style="width: 100px"
            @click="deleteCourse()"
        >删除
        </el-button
        >
      </div>
    </el-dialog>

    <!-- 加入课程 模态框 -->
    <el-dialog v-if="this.$store.state.role === `3`"
               :visible.sync="joinCourseDialog" width="295px" top="30vh">
      <p slot="title" class="joinCourseTitle">加入课程</p>
      <el-input
          v-model="joinCode"
          class="joinCourseInput"
          placeholder="请输入课程加课码验证"
          style="font-size: 16px"
          maxlength="6"
      />
      <div slot="footer" class="joinCourseFooter">
        <el-button @click="joinCourseDialog = false" style="width: 100px"
        >取消
        </el-button
        >
        <el-button
            type="primary"
            style="width: 100px"
            :disabled="joinCode.length!==6"
            @click="joinCourse()"
        >加入
        </el-button>
      </div>
    </el-dialog>

    <!-- 课程排序和归档管理 模态框-->
    <el-dialog :visible.sync="SFDialog" width="810px" top="30vh">
      <div slot="title" class="SFtitle">
        <p @click="selectSF(0)">课程排序</p>
        <p class="SFClick" @click="selectSF(1)">归档管理</p>
      </div>
      <!--课程排序-->
      <div v-if="SFState === 0">
        <!--draggable为true表示可拖拽-->
        <div
            ref="sortCourse"
            class="sortCourse"
            v-for="course of courseList"
            :key="course.cno"
            draggable="true"
        >
          <span></span>
          {{ course.courseName }}
        </div>
        <div ref="test"></div>
      </div>
      <!--课程存档-->
      <div v-else class="archive">
        <!--ArchiveFile.vue-->
        <!--监听子组件定义函数(事件) childDeleteCourse，第二个childDeleteCourse为父组件函数用于接收子组件传值并进行相应数据处理，可定义为同一个名称-->
        <!--course: 父组件向子组件传值-->
        <!--拖动移除  @dropOut="dropOut"-->
        <archiveFile
            class="archiveFile"
            v-for="archiveCourse in archiveCourses"
            :key="archiveCourse.cno"
            :course="archiveCourse"
            @childDeleteCourse="childDeleteCourse"
            @childRecoveryCourse="childRecoveryCourse"
            @dragleave="dropOut"
        />
      </div>
    </el-dialog>

    <!-- 恢复课程提示 模态框 -->
    <el-dialog :visible.sync="recoveryTipsDialog" width="350px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要恢复"{{ course.courseName }}"吗?
      </p>
      <div class="delete-tips">
        <p>您和您的学生将可以重新在此课程中互动。</p>
        <p>此课程会在课堂页上显示。</p>
      </div>

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="recoveryTipsDialog = false" style="width: 100px"
        >取消
        </el-button
        >
        <el-button
            type="primary"
            style="width: 100px"
            @click="courseRecover"
        >恢复课程
        </el-button
        >
      </div>
    </el-dialog>

    <!-- 退出课程 模态框 -->
    <el-dialog :visible.sync="dropOutDialog" width="450px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要删除"{{ this.dropOutObj.courseName }}"吗?
      </p>

      <div class="delete-tips">
        <p>您的这个课程的任何信息或评论将被永久删除</p>
        <p>警告：此操作无法撤消</p>
        <p>提醒：已用课程数包含了“删除课程数”</p>
      </div>

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="dropOutDialog = false" style="width: 100px"
        >取消
        </el-button>
        <el-button
            type="primary"
            style="width: 100px"
            @click="dropOut"
        >退出课程
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  /*组件的局部注册*/
import Navigation from "../components/homepage/Navigation";
import CourseCard from "../components/homepage/CourseCard";
import myModule from "../modules/myModule";
import ArchiveFile from "../components/homepage/ArchiveFile";
import {request} from "@/network/request";

export default {
  //用到的自定义组件
  components: {
    Navigation,
    CourseCard,
    ArchiveFile,
  },
  data() {
    return {
      // 置顶课程
      topList: [],
      // 所有课程 拿来操作
      courses: [],
      // 存档课程
      archiveCourses: [],
      // 所有课程
      courseList: [],
      // 归档文件
      fileCourses: [],
      quickReleaseDialog: false, //快速发布活动
      createCourseDialog: false, // 创建课程
      SFDialog: false, // 课程排序与归档
      SFState: 1, // 0为课程排序 1为归档管理 最开始登录页面时默认展示 归档管理
      // 新创建的课程
      createCourse: {
        semester: 1,
        className:'',
        courseName: '',
        semesterYear: '',
        owner: {
          // 从vuex仓库中拿全局状态值
          uid: this.$store.state.uid
        }
      },
      // 可供选择的学期
      optionSemester: [
        {
          value: 1,
          label: "第一学期",
        },
        {
          value: 2,
          label: "第二学期",
        },
      ],

      //控制各个模块的显隐藏属性，初始都不展示
      joinCourseDialog: false,
      deleteCourseDialog: false,
      fileCourseDialog: false,
      recoveryTipsDialog: false,
      transferCourseDialog: false,
      dropOutDialog: false,

      // 加入课程的课程码
      joinCode: "",
      // 要删除的课程
      deleteCourseObj: {},
      // 要恢复的课程
      course: {},
      // 要退出的课程
      dropOutObj: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 加入课程
    joinCourse() {
      // 加入课程
      request({
        url: '/api/cm/addMember',
        method: 'post',
        params: {
          // 加入课程验证码
          addCode: this.joinCode,
          // 加入学生的uid
          uid: this.$store.state.uid
        }
      }).then(res => {
        if (res.data === true) {
          this.$message({
            showClose: true,
            message: "加入课程成功",
            type: "success",
          })
          this.joinCourseDialog = false
          this.joinCode = ""
          this.getLearnCourse()
        } else {
          this.$message({
            showClose: true,
            message: "加课码错误",
            type: "error",
          })
        }
      })
    },
    //归档全部课程
    courseArchive() {
      console.log(this.changeCourseStatus(this.course, 1));
      this.fileCourseDialog = false
    },
    // 恢复课程
    courseRecover() {
      this.changeCourseStatus(this.course, 0)
      this.recoveryTipsDialog = false
    },
    //courseCard 子组件传值 退出课程
    childDropOut(obj) {
      this.dropOutObj = obj;
      this.dropOutDialog = true;
    },
    //archiveFile 子组件传值 恢复归档课程
    childRecoveryCourse(c) {
      this.SFDialog = false;
      this.course = c;
      this.recoveryTipsDialog = true;
    },
    //courseCard 子组件传值 归档课程
    childArchiveCourse(c) {
      this.fileCourseDialog = true;
      this.course = c;
      console.log('this.course', this.course);
    },
    //courseCard archiveFile子组件传值 删除课程
    childDeleteCourse(c) {
      this.deleteCourseObj = c;
      this.deleteCourseDialog = true;
    },
    // 退出课程
    dropOut() {
      request({
        url: '/api/cm/dropOut',
        method: 'post',
        params: {
          // 退出的课程号
          cno: this.dropOutObj.cno,
          // 退出人的uid，谁要退出
          uid: this.$store.state.uid
        }
      }).then(res => {
        if (res.data=== true) {
          if (this.$store.state.role === '3') {
            // 学习课程刷新
            this.getLearnCourse()
          } else {
            // 教学课程刷新
            this.getTeachCourses()
          }
          this.dropOutDialog = false
        } else {
          this.$message({
            showClose: true,
            message: '网络异常，请重试',
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: '网络异常，请重试',
          type: 'error'
        })
      })
      // 初始化退出课程
      this.dropOutObj = {}
    },
    // 删除课程
    deleteCourse() {
      this.changeCourseStatus(this.deleteCourseObj, 2)
      this.deleteCourseDialog = false
      this.deleteCourseObj = {}
    },
    //创建课程
    create() {
      if (
          this.createCourse.courseName === "" ||
          this.createCourse.courseName === undefined
      ) {
        this.$message({
          showClose: true,
          message: "请输入课程名",
          type: "error",
        });
        return;
      }
      // 如果未选择学年、以当前时间值作为学年
      if (!this.createCourse.semesterYear) {
        this.createCourse.semesterYear = new Date();
      }
      // 赋值
      this.createCourse.semesterYear = this.createCourse.semesterYear.getFullYear()

      // 创建课程
      request({
        url: '/api/course/addCourse',
        method: 'post',
        data: this.createCourse
      }).then(res => {
        if (res.data === true) {
          this.$message({
            showClose: true,
            message: "创建课程成功",
            type: "success",
          });
          // 获取全部教学课程
          this.getTeachCourses()
          this.createCourseDialog = false
        } else {
          this.$message({
            showClose: true,
            message: "创建课程失败，请重试",
            type: "error",
          });
        }
      })
    },
    // 获取教课程
    getTeachCourses() {
      request({
        url: '/api/course/getCreateCourses',
        method: 'get',
        params: {owner: this.$store.state.uid}
      }).then(res => {
        // 全部存在的课程
        this.courseList = res.data.filter(item => item.courseStatus === 0)
        this.courses = res.data.filter(item => item.courseStatus === 0)
        // 给存档课程组赋值
        this.archiveCourses = res.data.filter(item => item.courseStatus === 1)
      })
    },
    // 获取学课程
    getLearnCourse() {
      request({
        url: '/api/cm/getMyAllCourse',
        method: 'get',
        params: {uid: this.$store.state.uid}
      }).then(res => {
        console.log(res)
        this.courseList = res.data.filter(item => item.courseStatus === 0)
        console.log(this.courseList);
        this.courses = res.data.filter(item => item.courseStatus === 0)
        console.log(this.courses);
        this.archiveCourses = res.data.filter(item => item.courseStatus === 1)
        console.log(this.archiveCourses);
      })
    },
    // 改变样式
    selectSF(state) {
      // 0 排序  1 归档
      if (this.SFState === state) {
        // 状态未改变，返回
        return;
      }
      let p = document.getElementsByClassName("SFtitle")[0].children;
      // 样式的改变
      myModule.toggleClass(p[0], "SFClick");
      myModule.toggleClass(p[1], "SFClick");

      // 改变当前归档排序状态
      this.SFState = state;
    },

    // 改变课程状态
    changeCourseStatus(course, status) {
      request({
        url: '/api/course/updateCourseStatus',
        method: 'post',
        params: {
          cno: course.cno,
          courseStatus: status
        }
      }).then(res => {
        if (res.data === true) {
          // 根据角色重新向后台获取一遍教的课程或学的课程
          if (this.$store.state.role === `3`) {
            this.getLearnCourse()
          } else {
            this.getTeachCourses()
          }
        } else {
          this.$message({
            showClose: true,
            message: '网络异常，请重试',
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: '网络异常，请重试',
          type: 'error'
        })
      })
    }
  },
  created() {
    console.log(this.$store.state.role)
    if (this.$store.state.role === '3') {
      console.log("执行1")
      // 学生学习的课程
      this.getLearnCourse();
    } else {
      // 老师创建的课程
      console.log("执行2")
      this.getTeachCourses();
    }
  },
};
</script>
<style scoped>
.file-tips p {
  text-align: left;
  margin: 10px 0;
}

.delete-tips {
  text-align: left;
}

.delete-tips p:nth-child(2) {
  color: red;
  margin: 10px 0;
}

.delete-tips p:nth-child(3) {
  color: blue;
}

.archiveFile {
  margin: 16px 40px;
}

.archive {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

.sortCourse span {
  margin: 18px 5px 0 10px;
  background-color: rgb(49, 142, 235);
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.sortCourse {
  cursor: pointer;
  display: flex;
  border: 1px solid rgb(236, 236, 236);
  height: 58px;
  line-height: 58px;
  font-size: 16px;
  text-align: left;
}

.SFClick {
  border-bottom: 3px solid #aaa;
  color: #2d2d2d;
}

.SFtitle p {
  padding: 0 30px;
}

.SFtitle {
  display: flex;
  justify-content: center;
  color: #818181;
  font-size: 18px;
  cursor: pointer;
  line-height: 55px;

  border-bottom: 1px solid #dcdcdc;
  height: 58px;
  width: 100%;
}

.joinCourseInput {
  border-bottom: 2px solid #ececec;
}

.joinCourseInput:hover {
  border-bottom: 2px solid rgba(72, 104, 209, 0.3);
}

.joinCourseTitle {
  font-size: 18px;
  color: #a9a9a9;
  text-align: left;
  border-bottom: 1px solid #ececec;
  padding-bottom: 20px;
}

.createCourseFooter {
  text-align: right;
}

.otherOptions {
  margin-left: 10px;
  text-align: left;
}

.createCourse p {
  text-align: left;
  font-size: 14px;
  color: #666;
}

.selectSemester p:nth-child(1) {
  line-height: 39px;
  margin-left: -18px;
}

.selectSemester {
  margin: 20px 0;
}

.selectSemester,
.joinCourseFooter {
  display: flex;
  justify-content: space-around;
}

.createCourseInput {
  display: flex;
  border-bottom: 2px solid #c8c8c8;
}

.createCourseInput:hover {
  border-bottom: 2px solid #4d90fe;
}

.createCourseInput:nth-child(1)::before {
  content: "课程名称:";
  width: 80px;
  line-height: 66px;
  height: 40px;
}

.createCourseInput:nth-child(2)::before {
  content: "班级名称:";
  width: 80px;
  line-height: 66px;
  height: 40px;
}

.createCourseTitle {
  text-align: left;
  font-size: 18px;
}

.quickReleaseIcon p {
  font-size: 14px;
  font-weight: 600;
  color: rgba(67, 67, 67, 1);
}

.quickReleaseSelect {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  cursor: pointer;
}

.quickReleaseIcon div {
  background: url("../assets/img/icon-gg.png") center no-repeat rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(2) div {
  background: url("../assets/img/icon-ht.png") center no-repeat rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(3) div {
  background: url("../assets/img/icon-hd.png") center no-repeat rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(4) div {
  background: url("../assets/img/icon-zy.png") center no-repeat rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(5) div {
  background: url("../assets/img/icon-cs.png") center no-repeat rgba(44, 87, 171, 1);
}

.quickReleaseIcon div {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.quickRelease {
  margin-bottom: 30px;
}

.quickRelease {
  font-size: 24px;
  color: rgba(112, 112, 112, 1);
  font-weight: 600;
}

.el-dropdown-item {
  width: 100px;
  justify-content: center;
}

.addfont p {
  font-size: 14px;
  cursor: pointer;
}

.addfont i {
  margin-top: 46px;
  font-size: 20px;
}

.addBg {
  background-image: url("../assets/img/create-course.png");
  width: 100%;
  height: 127px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}

.addCourse {
  width: 270px;
  height: 275px;
  border-radius: 8px;
  border: 1px solid #e2e6ed;
}

.courseCard,
.addCourse {
  margin: 0 9px 10px;
}

.courseShow {
  padding-top: 60px;
  height: 100%;
  display: flex;

  align-content: flex-start;
  flex-wrap: wrap;
}

.sortFile {
  cursor: pointer;
}

.sortFile:hover {
  color: black;
}

.nav p,
.nav .sortFile {
  line-height: 42px;
}

.nav ul li {
  padding: 0 13px;
}

.nav ul {
  display: flex;
  justify-content: space-between;
  list-style: none;
}

.nav {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 36px;
  padding: 20px 0 12px 0;
  color: #78787a;
  border-bottom: 1px solid #d9d9f0;
}

.main {
  overflow: hidden;
  padding: 0 4%;
}

p {
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
}
</style>

<style>
.createCourseInput .el-input__inner {
  outline: none;
  border: none;
}

.joinCourseInput .el-input__inner {
  outline: none;
  border: none;
}
</style>