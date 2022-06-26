import Vue from 'vue'
import VueRouter from 'vue-router'
import Profile from 'views/ModifyPersonalData'
import Course from "../views/Course";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/Login')
    },
    {
      // 某门课程的成员展示
      path: '/courseMember/:cno',
      name: 'CourseMember',
      component: ()=> import('../views/CourseMember'),
      meta: {
        requireAuth: true,
        role: [2,3]
      }
    },
    {
        path: '/courseCard',
        name: 'CourseCard',
        component: ()=> import('../components/courseDetails/CourseNav')
    }
    ,
    {
      path: '/arc',
      name: 'arc',
      component: ()=> import('../components/homepage/ArchiveFile')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register')
    },
    {
        path: '/homepage',
        name: 'Homepage',
        component: () => import('../views/Homepage'), /*设置回调函数*/
        meta: {
            requireAuth: true,  /*需要权限*/
            role: [2, 3]
        }
    },
    {
      path: '/course',
      name: 'Course',
      component: ()=> import('../views/Course')
    },
    {
        path: '/course/:cno', /*cno为参数，参数前要有: */
        name: 'Course',
        component: Course, /*直接设置组件*/
        meta: {
            requireAuth: true,
            role: [2, 3]
        },
        children: [
            {
                path: '/',
                name: 'Interact',
                component: () => import('../components/courseDetails/interact/Interact'),
                meta: {
                    requireAuth: true,
                    role: [2, 3]
                },
            },
            {
                path: '/interact',
                name: 'Interact',
                component: () => import('../components/courseDetails/interact/Interact'),
                meta: {
                    requireAuth: true,
                    role: [2, 3]
                },
            },
            {
                path: '/stuHomework/:cno',
                name: 'StuHomework',
                component: () => import('../components/courseDetails/homework/StuHomework'),
                meta: {
                    requireAuth: true,
                    role: [3]
                }
            },
            {
                path: '/homework/:cno',
                name: 'Homework',
                component: () => import('../components/courseDetails/homework/Homework'),
                meta: {
                    requireAuth: true,
                    role: [2]
                },
            },
            {
                path: '/topic',
                name: 'Topic',
                component: () => import('../components/courseDetails/topic/Topic'),
                meta: {
                    requireAuth: true,
                    role: [2, 3]
                },
            },
        ]
    },
    {
        path: '/stuTaskCommit/:cno/:tno',
        name: 'StuTaskCommit',
        component: () => import('../views/StuTaskCommit'),
        meta: {
            requireAuth: true,
            role: [3]
        }
    },
    {
        path: '/teacherTaskCorrect/:cno/:tno',
        name: 'TeacherTaskCorrect',
        component: () => import('../views/TeacherTaskCorrect'),
        meta: {
            requireAuth: true,
            role: [2]
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            requireAuth: true,
            role: [2, 3]
        },
    },
]

const router = new VueRouter({
    /*
    * 例如：
       histroy:
       localhost:8080/user/list
       hash:
       localhost:8080/#/user/list*/
    mode: 'history', /*默认 hash 模式，使用 URL 的 hash 来模拟一个完整的 URL，于是当URL改变时，页面不会重新加载*/
    base: process.env.BASE_URL, /*应用的基路径*/
    routes
})

// 导航守卫: 路由拦截，防止恶意绕开权限通过url访问
// router.beforeEach((to, from, next) => {
//     /* from: 上一个页面*/
//     /* to: 下一个页面*/
//
//     if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//         if (window.localStorage.state !== undefined && window.localStorage.state === "true") {
//             // token有效
//             const role = to.meta.role.filter(el => el === window.localStorage.role) // 遍历其中数组的每一个
//             if (role.length !== 0) {
//                 next()
//             } else {
//                 // 回上一个页面
//                 router.back()
//             }
//         } else {
//             // token无效或者过期
//             next({
//                 path: '/'
//             })
//         }
//     } else {
// 不是访问博客链接的话或者访问博客链接该值为false时，则直接进入下面的内容，如果不调用Next则页面会卡住
//         next()
//     }
// })

export default router
