<template>
    <div class="container">
        <div class="navOptions">
            <ul class="first">
                <li class="item">
                    <img class="logo" src="../../assets/img/logo-mainblue.png" alt=""/>
                </li>
                <li class="item active" @click="changeState(1)">
                    <a href="javascript:">课堂</a>
                </li>
                <!-- this.$router.push("/homepage")-->
                <li class="item" @click="changeState(2)">
                    <a href="javascript:">精品慕课</a>
                </li>
                <li class="item" @click="changeState(3)">
                    <a href="javascript:">我的精品</a>
                </li>
                <li class="item" @click="changeState(4)">
                    <a href="javascript:">双选会</a>
                </li>
                <li class="item" @click="changeState(5)">
                    <a href="javascript:">论文管理</a>
                </li>
            </ul>

            <ul class="second">
                <li>
                    <img src="../../assets/img/tool_icon.png" alt="工具"/>
                </li>

                <li>
                    <i class="el-icon-bell" style="font-size: 25px"></i>
                </li>

                <li>
                    <el-dropdown trigger="click">
                        <!--:src="avatar"-->
                        <div class="avatar"><img :src="avatar"></div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                            >
                                <div class="icon" style="background-position: 50% 56%"/>
                                开通VIP
                            </el-dropdown-item
                            >
                            <el-dropdown-item
                            >
                                <div class="icon" style="background-position: 50% 30%"/>
                                机构账号绑定
                            </el-dropdown-item
                            >
                            <el-dropdown-item
                            >
                                <router-link to="/profile" style='display:flex'>
                                    <div class="icon" style="background-position: 50% 2%"/>
                                    个人设置
                                </router-link>
                            </el-dropdown-item
                            >
                            <el-dropdown-item
                            >
                                <div class="icon" style="background-position: 50% 83%"/>
                                <span @click="logout">退出账号</span>
                            </el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import myModule from "../../modules/myModule.js";
    import {AVATAR, ROLE, STATE, TOKEN, UID,STATUS} from "@/store/mutation-type";
    import {request} from "../../network/request";
    import axios from 'axios'

    export default {
        components: {},
        data() {
            return {
                avatar: this.$target.target+"/"+this.$store.state.avatar,
                state: 1, // 1 课堂 2 精品慕课 3 我的精品 4 双选会 5论文管理
            };
        },
        methods: {
            changeState(val) {
                if (val === this.state) {
                } else {
                    let arr = document.querySelectorAll(".item");
                    // 移除之前的状态
                    myModule.toggleClass(arr[this.state], "active");
                    // 更新当前的状态
                    myModule.toggleClass(arr[val], "active");
                    // 更新state
                    this.state = val;
                }
                if (val===1){
                    this.$router.push("/homepage")
                }
            },
            logout() {
                console.log("logout")
                // 存入 vuex仓库
                this.$store.commit(STATE, false)
                this.$store.commit(TOKEN, "")
                this.$store.commit(ROLE, undefined)
                this.$store.commit(AVATAR, undefined)
                this.$store.commit(UID, undefined)
                this.$store.commit(STATUS,"false")
                this.$router.replace("/login")
            }
        },
        created() {
        },
        mounted() {
            this.avatar = this.$target.target+"/"+this.$store.state.avatar;
            console.log(this.avatar);
        },
    };
</script>
<style scoped>
    .avatar {
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        background: #fff;
        cursor: pointer;
    }

    .avatar > img {
        width: 35px;
        height: 35px;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 50%;
    }

    .icon {
        margin: 5px 6px 0 0;
        width: 25px;
        height: 25px;
        background-image: url("../../assets/img/user-info-icon-bg.png");
    }

    .second li:nth-child(3) {
        padding-top: 19px;
    }

    .second li img {
        width: 25px;
        height: 25px;
    }

    .first .item a {
        color: #5f6368;
    }

    .first .item {
        padding: 21px 10px 19px 10px;
        margin: 0 15px;
    }

    .active {
        border-bottom: solid 2px #2c58ab;
    }

    .navOptions {
        padding: 0 4%;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
    }

    .second,
    .first {
        display: flex;
    }

    .first li,
    .second li {
        display: inline;
        list-style: none;
        vertical-align: middle;
        padding: 0;
        margin: 0;
    }

    .second li {
        padding: 25px 10px 0 10px;
    }

    .logo {
        width: 106px;
        height: 28px;
    }

    a {
        outline: none;
        text-decoration: none;
        color: #5f6368;
    }

    .container {
        width: 100%;
        height: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
</style>

<style>
    .el-dropdown-menu__item {
        display: flex;
    }
</style>