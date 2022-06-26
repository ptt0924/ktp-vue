import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'

// vue使用了vuex 用来保存全局共享的状态值，保存在state中 ，存值、取值：this.$store.state.属性名
Vue.use(Vuex)

export default new Vuex.Store({
  // state 专门用来保存 共享的状态值
  state: {
    // 从localstorage里面拿
    token: window.localStorage.token === undefined ? "" : window.localStorage.token,
    return_state: window.localStorage.state === undefined ? false : window.localStorage.state,
    user: window.localStorage.user === undefined ? {} : window.localStorage.user,
    role: window.localStorage.role === undefined ? "" : window.localStorage.role,
    avatar: window.localStorage.avatar === undefined ? "moon.jpg" : window.localStorage.avatar,
    uid: window.localStorage.uid === undefined ? "" :window.localStorage.uid,
    status: window.localStorage.status === undefined ? "FALSE" : window.localStorage.status
  },
  // mutations: 专门书写方法,用来更新 state 中的值
  mutations,
  actions: {},
  modules: {}
})
