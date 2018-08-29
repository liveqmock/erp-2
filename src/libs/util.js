import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';
import iView from 'iview';

let util = {

};
util.title = function (title) {
    title = title || '农业产业供应链管理云服务平台';
    window.document.title = title;
};

const ajaxUrl = env === 'development'
      ? 'http://192.168.0.88/sgys/public/index.php/api/v1'
    : env === 'production'
        ? 'http://api.3gys.cn/index.php/api/v1'
        : 'http://debug.3gys.cn';

util.ajaxUrl = ajaxUrl;
util.uploadUrl = ajaxUrl + "/attachment/attachment/upload";

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.ajax = axios.create({
    baseURL: ajaxUrl,
    params: {},
    headers: {
        // Timestamp : parseInt(new Date().getTime() / 1000)
    },
    timeout: 30000
});

// 请求拦截器
util.ajax.interceptors.request.use(
    config => {
        config.params['access_token'] = localStorage.token;
        config.params['current_custom_id'] = localStorage.currentCustomId;
        config.headers.platform = 'frontend';
        config.headers.version = 'v1.0.0';
        iView.LoadingBar.start();
        return config;
    }
);

// 响应拦截器
util.ajax.interceptors.response.use(
    response => {
        iView.LoadingBar.finish();
        if(response.data.code !== 200) {
            iView.Message.error(response.data.message);
            return Promise.reject();
        }
        return response.data.result;
    },
    error => {
        iView.LoadingBar.error();
        return Promise.reject();
    }
);

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if(childArr[i].children && childArr[i].children.length > 0){
                    	// 新增的三级导航功能的内容
                    	let k = 0;
                    	let thirdChild = childArr[i].children;
                    	while (k < thirdChild.length) {
                    		if (thirdChild[k].name === name) {
		                        return true;
		                    }
                    		k++;
                    	}
                    }else if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                }
            ];
            if(currentPathObj.multilevel) {
            	currentPathArr.push({
            		title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
            	})
            	// 二级导航只有一个时不合并功能
            	let childObj = currentPathObj.children.filter((item) => {
            		return item.name === name;
            	})[0]
            	currentPathArr.push({
            		title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: childObj.name
            	})
            }else{
            	currentPathArr.push({
            		title: currentPathObj.title,
                    path: '',
                    name: name
            	})
            }
        } else {
            /*
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
            */
           	let childObj = currentPathObj.children.filter((child) => {
           		if(child.name === name){
           			return true;
           		}else{
           			// 三级导航新增内容
           			if(child.children && child.children.length > 0){
           				let i = 0;
           				let items = child.children;
           				while (i < items.length){
           					if(items[i].name === name){
           						return true;
           					}
           					i++;
           				}
           			}
           			return false;
           		}
            })[0];
            
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                }
            ];
            // 导航修改
            if(childObj.children && childObj.children.length > 0) {
            	// 增加三级导航功能
            	// 二级导航
            	currentPathArr.push({
            		title: childObj.title,
                    path: '',
                    name: childObj.name
            	})
            	let thirdObj = childObj.children.filter((item) => {
            		return item.name === name;
            	})[0]
            	// 三级导航
            	currentPathArr.push({
            		title: thirdObj.title,
                    path: currentPathObj.path + '/' + childObj.path + '/' + thirdObj.path,
                    name: thirdObj.name
            	})
            }else{
            	// 二级导航
            	currentPathArr.push({
            		title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
            	})
            }
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);
    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
            	if(item.children.length > 1){
            		let i = 0,
            		childs = item.children;
            		while (i < childs.length){
            			if(childs[i].name === name){
            				return true;
            			}
            			i++;
            		}
            	}else{
            		return name === item.children[0].name;
            	}
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            if(tag.children){
            	tag = tag.children.filter(item => {
            		return item.name === name;
            	})[0]
            }
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (semver.lt(packjson.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin更新啦',
                desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
            });
        }
    });
};

export default util;
