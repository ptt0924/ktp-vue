<template>
  <div class="interact">
    <div class="top" v-if="$store.state.role === `2`">
      <el-button class="button" type="primary" plain>发布课件互动</el-button>
      <el-button class="button" type="primary" plain>发布试题互动</el-button>
    </div>

    <div class="main">
      <div class="main-left" v-show="interactList.length===0">
        <p>点击上方按钮，发布课堂互动吧！将您的课堂变得更有趣！</p>
        <p>
          老师随时组织投票与讨论，学生使用手机直接参与互动。可以制作精美的微课
        </p>
        <p>
          大屏幕同步展示互动结果，活跃课堂气氛。（点击<span>播放视频</span>，查看使用详情）
        </p>
      </div>

      <div class="main-right">
        <div class="main-right-top">
          <div class="main-right-top-box">
            <i class="el-icon-video-camera"></i>
            <p>直播</p>
          </div>

          <div class="main-right-top-box">
            <i class="el-icon-date"></i>
            <p>考勤</p>
          </div>

          <div class="main-right-top-box">
            <i class="el-icon-chat-dot-square"></i>
            <p>提问</p>
          </div>

          <div class="main-right-top-box">
            <i class="el-icon-service"></i>
            <p>抢答</p>
          </div>

          <div class="main-right-top-box">
            <i class="el-icon-medal-1"></i>
            <p>表现</p>
          </div>

          <div class="main-right-top-box">
            <i class="el-icon-data-line"></i>
            <p>黑板</p>
          </div>
        </div>

        <div class="main-right-bottom">
            <el-button type='primary' class="el-button" >录屏（录制电脑屏幕教学过程）</el-button>
            <p>(录屏+第三方直播 帮助视频)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
        // 交流互动课堂数组
        interactList:[],
    };
  },
};
</script>
<style scoped>
.main-right-bottom p{
    text-align: center;
    cursor: pointer;
    color: #32BAF0;
    font-size: 14px;
}

.main-right-bottom .el-button{
    margin:20px 0;
    width:242px
}

.main-right-top-box:nth-child(3),
.main-right-top-box:nth-child(4) {
  background: #447fcf;
  box-shadow: 0px 4px 8px 0px rgba(68, 127, 207, 0.5);
}

.main-right-top-box:nth-child(2),
.main-right-top-box:nth-child(6) {
  background: #1dc5df;
  box-shadow: 0px 4px 8px 0px rgba(29, 197, 223, 0.5);
}

.main-right-top-box:nth-child(1),
.main-right-top-box:nth-child(5) {
  box-shadow: 0px 4px 8px 0px rgba(50, 186, 240, 0.5);
  background: rgb(50, 186, 240);
}

.main-right-top {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

.main-right-top-box {
  width: 64px;
  height: 64px;
  margin: 24px 0 0 24px;
  color: white;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

.main-right-top-box p {
  font-size: 12px;
}

.main-right-top-box i{
  font-size: 20px;
  margin-top: 12px;
}

.main p span {
  cursor: pointer;
  color: #32baf0;
}

.main-left p {
  color: #a0a0a0;
  font-size: 14px;
  line-height: 24px;
}

.main-left p:nth-child(1) {
  font-size: 14px;
  color: #707070;
  font-weight: 400;
  margin-bottom: 5px;
}

.button {
  width: 137px;
}

.top {
  text-align: left;
}

.main {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}

.main-right {
  width: 286px;
  height: 302px;
  border: 1px solid #e2e6ed;
  border-radius: 8px;
}

.main-left {
  text-align: center;
  height: 71px;
  width: 916px;
  padding: 35px 0;
  background: #f1f3f4;
  border-radius: 4px;
}

</style>