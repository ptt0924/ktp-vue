<template>
  <div class="">
    <div class="top">
        <el-button type='primary' class="button" v-if="$store.state.role === `2`">发起新话题</el-button>
    </div>
    <div class="main"></div>
    <div class="bottom">
      <p>点击上方按钮，您可以发起新话题。</p>
      <p>发起话题之后，无论是老师还是同学们，都可以基于此话题进行讨论</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
};
</script>
<style scoped>
.top{
    text-align: left;
}

.top button {
  width: 137px;
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
</style>