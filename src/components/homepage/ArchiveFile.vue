<template>
  <div class="card">
    <img :src="bg" alt="" />
    <div class="main">
      <div class="info">
        <el-row>
          <el-col>
            <p class="infoTitle">{{ course.courseName }}</p>
          </el-col>
        </el-row>

        <el-row style="width: 200px">
          <el-col :span="12" style="margin-top: 10px">
            <div>角色: 教师</div>
          </el-col>
          <el-col :span="12" style="margin-top: 10px">
            <div>老师:{{ course.owner.name }}</div>
          </el-col>
        </el-row>
      </div>

      <el-dropdown trigger="click" style="height: 30px">
        <span class="el-dropdown-link">
          <i class="el-icon-more" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <!--原生点击事件click-->
          <!--给一个vue组件添加原生事件时需要加上native才会生效-->
          <el-dropdown-item @click.native="childRecoveryCourse()">恢复</el-dropdown-item>
          <el-dropdown-item @click.native="childDeleteCourse()">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 背景图片地址
      bg: "",
    };
  },
  // 父组件向子组件传值
  props: {
    // 归档课程
    course: {
      type: Object,
      require: true,
    },
  },
  computed: {},
  watch: {},
  methods: {
    // 归档课程
    childRecoveryCourse() {
      console.log('recovery');
      // 子组件向父组件传值，childRecoveryCourse为父组件方法名，this.course为传递的参数
      this.$emit("childRecoveryCourse", this.course);
    },
    // 删除课程
    childDeleteCourse(){
      this.$emit("childDeleteCourse", this.course);
    },
  },
  created() {
    this.bg = require(`../../assets/file/${Math.floor(Math.random()*31) + 1}.jpg`);

    console.log(this.course);
  },
};
</script>
<style scoped>
.main i {
  color: white;
  font-size: 27px;
}

.main {
  padding: 24px 16px 14px;
  display: flex;
  justify-content: space-between;
}

.infoTitle {
  font-size: 20px;
}

.info {
  color: #ffffff;
  font-size: 12px;
  text-align: left;
}

.card img {
  width: 100%;
  height: 100%;
  position: absolute;

  top: 0;
  left: 0;
}

.card {
  position: relative;
  width: 300px;
  height: 110px;
}
</style>