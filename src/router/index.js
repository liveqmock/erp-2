import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';

Vue.config.productionTip = false

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title || to.title);
    /* if (to.name == 'home' && localStorage.currentCustomStatus == -2) {
        localStorage.currentCustomStatus = localStorage['customStatusB'] 
    } */
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('user') && to.name !== 'login' && to.name !== 'create') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && (to.name === 'login' || (to.name === 'checkPage' && localStorage.permission != '{}')) && localStorage.currentCustomStatus != 0 && localStorage.currentCustomStatus != -1 && localStorage.currentCustomStatus != -2) { // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else if (localStorage.currentCustomId == 0 && to.name !== 'create'){
            Util.title();
            next({
                name: 'create'
            });
        } else if (to.name != 'checkPage' && (localStorage.currentCustomStatus == 0 || localStorage.currentCustomStatus == -1) && !(localStorage.currentCustomStatus == -1 && to.name == 'create')) {
            Util.title();
            next({
                name: 'checkPage'
            });
        } else {
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            let title = '';
            Util.title(title);
            let custom_type = localStorage.currentCustomType ? parseInt(localStorage.currentCustomType) : 0;

            if (curRouterObj && curRouterObj.permission !== undefined) { // 需要判断权限的路由
                if (curRouterObj.permission.indexOf(custom_type) > -1) {
                    Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next);
                } else {
                    next({
                        replace: true,
                        name: 'error-403'
                    });
                }
            } else { // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next);
            }
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
