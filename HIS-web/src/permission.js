import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条设置
const whiteList = ['/login', '/auth-redirect'] // 页面重定向白名单

router.beforeEach(async(to, from, next) => {
  // 进度条开始
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  // 判断用户是否已登录 （已存在token）
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果用户将前往登录所在的路由但是已经登录，则重定向至项目首页
      next({ path: '/' })
      NProgress.done()
    } else {
      //判断用户是否有角色权限信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        //如果已有角色权限信息，则说明已经获取到用户信息，直接跳转到下一个默认页面
        next()  
      } else {
        try {
          //调用store中user/getInfo方法，通过用户的token获取用户的信息
          const {roles} = await store.dispatch('user/getInfo')
          //调用store中permission/generateRoutes方法，根据用户角色返回相应的路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          //将获取到的异步路由挂载到路由表中
          router.addRoutes(accessRoutes)
          //跳转到下一页面
          next({ ...to, replace: true })
        } catch (error) {
          // 如果获取信息过程出现异常，则调用store中user/resetToken，清空cookie中的token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          //重定向到登录界面
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    //如果没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在白名单中，则不会重定向
      next()
    } else {
      // 其他页面会被重定向到登录界面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
