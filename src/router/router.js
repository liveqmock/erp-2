import Main from '@/views/Main.vue';
import RouterPage from '@/views/RouterPage.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => {
        require(['@/views/login.vue'], resolve);
    }
};

export const createRouter = {
    path: '/create',
    name: 'create',
    meta: {
        title: '创建企业信息'
    },
    component: resolve => {
        require(['@/views/custom/create.vue'], resolve);
    }
};

export const checkRouter = {
    path: '/checkPage',
    name: 'checkPage',
    meta: {
        title: '审核查询'
    },
    component: resolve => {
        require(['@/views/custom/checkPage.vue'], resolve);
    }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['@/views/error-page/404.vue'], resolve);
    }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => {
        require(['@//views/error-page/403.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => {
        require(['@/views/error-page/500.vue'], resolve);
    }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => {
        require(['@/views/form/article-publish/preview.vue'], resolve);
    }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => {
        require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve);
    }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: resolve => {
                require(['@/views/own-space/own-space.vue'], resolve);
            }
        },
        {
            path: 'order/buyer/detail',
            title: '订单详情',
            name: 'order_buyer_detail',
            component: resolve => {
                require(['@/views/order/buyer/detail.vue'], resolve);
            }
        },
        {
            path: 'order/seller/detail',
            title: '订单详情',
            name: 'order_seller_detail',
            component: resolve => {
                require(['@/views/order/seller/detail.vue'], resolve);
            }
        },
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: resolve => {
                require(['@/views/message/message.vue'], resolve);
            }
        },

        {
            path: '/goods/goods/add',
            title: '添加产品',
            name: 'goods_goods_add',
            component: resolve => {
                require(['@/views/goods/goods/add.vue'], resolve);
            }
        },
        {
            path: '/goods/goods/edit',
            title: '编辑产品',
            name: 'goods_goods_edit',
            component: resolve => {
                require(['@/views/goods/goods/edit.vue'], resolve);
            }
        },
        {
            path: '/demo',
            name: 'demo',
            meta: {
                title: '示例文件'
            },
            component: resolve => {
                require(['@/views/demo.vue'], resolve);
            }
        },
        {
            path: '/purchase/plan/add',
            title: '创建采购计划',
            name: 'purchase_plan_add',
            component: resolve => {
                require(['@/views/purchase/plan/add.vue'], resolve);
            }
        },
        {
            path: '/order/buyer/receipt',
            title: '确认收货',
            name: 'order_buyer_receipt',
            component: resolve => {
                require(['@/views/order/buyer/receipt.vue'], resolve);
            }
        },
        {
            path: '/stock/instore/add',
            title: '创建入库单',
            name: 'stock_instore_add',
            component: resolve => {
                require(['@/views/stock/instore/add.vue'], resolve);
            }
        },
        {
            path: '/stock/outstore/add',
            title: '创建出库单',
            name: 'stock_outstore_add',
            component: resolve => {
                require(['@/views/stock/outstore/add.vue'], resolve);
            }
        },
        {
            path: '/stock/inventory/add',
            title: '库存盘点',
            name: 'stock_inventory_add',
            component: resolve => {
                require(['@/views/stock/inventory/add.vue'], resolve);
            }
        },
        {
            path: '/stock/product/sorting',
            title: '产品分拣',
            name: 'stock_product_sorting',
            component: resolve => {
                require(['@/views/stock/product/sorting.vue'], resolve);
            }
        },
        {
            path: 'purchase/order/detail',
            title: '采购工单详情',
            name: 'purchase_order_detail',
            component: resolve => {
                require(['@/views/purchase/task/detail.vue'], resolve)
            }
        },
        {
            path: 'finance/payment/pay',
            title: '付款单支付',
            name: 'finance_payment_pay',
            component: resolve => {
                require(['@/views/finance/payment/pay.vue'], resolve)
            }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/home',
        title: {i18n: 'home'},
        icon: 'home',
        name: 'home',
        component: Main,
        children: [
            {
                path: 'index',
                title: '首页',
                meta: {
                    title: '首页'
                },
                name: 'home_index',
                component: resolve => {
                    require(['@/views/home/home.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/goods',
        title: '产品',
        icon: 'aperture',
        name: 'goods',
        component: Main,
        children: [
            // {
            //     path: 'mapping',
            //     title: '产品编码',
            //     name: 'goods_mapping',
            //     component: resolve => {
            //         require(['@/views/goods/mapping/index.vue'], resolve);
            //     }
            // },
            {
                path: 'brand',
                title: '品牌管理',
                name: 'goods_brand',
                component: resolve => {
                    require(['@/views/goods/brand/index.vue'], resolve);
                }
            }, {
                path: 'category',
                title: '品类管理',
                name: 'goods_category',
                component: resolve => {
                    require(['@/views/goods/category/index.vue'], resolve);
                }
            }, {
                path: 'index',
                title: '产品管理',
                name: 'goodsIndex',
                component: resolve => {
                    require(['@/views/goods/goods/index.vue'], resolve);
                }
            }, {
                path: 'price',
                title: '价格管理',
                name: 'priceIndex',
                component: resolve => {
                    require(['@/views/goods/price/index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/custom/user',
        title: '用户',
        icon: 'person',
        name: 'custom_user',
        component: Main,
        children: [
            {
                path: 'branch',
                title: '部门管理',
                name: 'custom_user_branch',
                component: resolve => {
                    require(['@/views/custom/user/branch/index.vue'], resolve);
                }
            }, {
                path: 'user/job',
                title: '岗位管理',
                name: 'custom_user_job',
                component: resolve => {
                    require(['@/views/custom/user/job/index.vue'], resolve);
                }
            }, {
                path: 'role',
                title: '角色管理',
                name: 'custom_user_role',
                component: resolve => {
                    require(['@/views/custom/user/role/index.vue'], resolve);
                }
            }, {
                path: 'index',
                title: '用户管理',
                name: 'custom_user_manage',
                component: resolve => {
                    require(['@/views/custom/user/user/index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/custom/custom',
        title: '客户',
        icon: 'person-stalker',
        name: 'custom_custom',
        // permission: [],
        component: Main,
        children: [
            {
                path: 'supply',
                title: '供应商管理',
                name: 'custom_supply',
                permission: [1, 2],
                component: resolve => {
                    require(['@/views/custom/custom/supply/index.vue'], resolve);
                }
            }, {
                path: 'purchase',
                title: '采购商管理',
                name: 'custom_purchase',
                permission: [2, 3],
                component: resolve => {
                    require(['@/views/custom/custom/purchase/index.vue'], resolve);
                }
            }/* , {
                path: 'logistics',
                title: '配送商管理',
                name: 'custom_logistics',
                permission: [1, 3],
                component: resolve => {
                    require(['@/views/custom/custom/logistics/index.vue'], resolve);
                }
            } */
        ]
    },
    {
        path: '/purchase',
        title: '采购',
        icon: 'plus',
        name: 'purchase',
        component: Main,
        permission: [1, 2],
        children: [
            {
                path: 'plan',
                title: '计划管理',
                name: 'purchase_plan',
                component: resolve => {
                    require(['@/views/purchase/plan/index.vue'], resolve);
                }
            },
            // {
            //     path: 'category',
            //     title: '分工配置',
            //     name: 'purchase_task_setting',
            //     component: resolve => {
            //         require(['@/views/purchase/task/setting.vue'], resolve);
            //     }
            // },
            {
                path: 'order',
                title: '采购工单',
                name: 'purchase_task',
                component: resolve => {
                    require(['@/views/purchase/task/index.vue'], resolve);
                }
            }
        ]
    },
    // {
    //     path: '/purchase',
    //     title: '销售',
    //     icon: 'plus',
    //     name: 'purchase',
    //     component: Main,
    //     children: [
    //         {
    //             path: '/purchase/index',
    //             title: '销售管理',
    //             name: 'purchase_index',
    //             component: resolve => {
    //                 require(['@/views/purchase/index.vue'], resolve);
    //             }
    //         }
    //     ]
    // },
    {
        path: '/order',
        title: '订单',
        icon: 'bag',
        name: 'order',
        component: Main,
        children: [
            {
                path: 'buyer/index',
                title: '采购订单',
                name: 'order_buyer',
                permission: [1, 2],
                component: resolve => {
                    require(['@/views/order/buyer/index.vue'], resolve);
                }
            },
            {
                path: 'seller/index',
                title: '销售订单',
                name: 'order_seller',
                permission: [2, 3],
                component: resolve => {
                    require(['@/views/order/seller/index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/finance',
        title: '财务',
        icon: 'social-yen',
        name: 'finance',
        component: Main,
        children: [
            {
                path: 'account',
                title: '账户管理',
                name: 'finance_account',
                component: resolve => {
                    require(['@/views/finance/account/index.vue'], resolve);
                }
            },
            {
                path: 'bill',
                title: '资金账户',
                name: 'finance_bill',
                component: resolve => {
                    require(['@/views/finance/bill/index.vue'], resolve);
                }
            },
            {
                path: 'receive',
                title: '收款管理',
                name: 'finance_receive',
                permission: [2, 3],
                component: resolve => {
                    require(['@/views/finance/receive/index.vue'], resolve);
                }
            },
            {
                path: 'payment',
                title: '付款管理',
                name: 'finance_payment',
                permission: [1, 2],
                component: resolve => {
                    require(['@/views/finance/payment/index.vue'], resolve);
                }
            }
        ]
    },
    // {
    //     path: '/logistics',
    //     title: '物流',
    //     icon: 'earth',
    //     name: 'logistics',
    //     component: Main,
    //     children: [
    //         {
    //             path: '/logistics/index',
    //             title: '物流',
    //             name: 'logistics_index',
    //             component: resolve => {
    //                 require(['@/views/logistics/index.vue'], resolve);
    //             }
    //         }
    //     ]
    // },
    {
        path: '/stock',
        title: '仓储',
        icon: 'ios-home-outline',
        name: 'stock',
        component: Main,
        children: [
            {
                path: 'warehouse',
                title: '库房管理',
                name: 'stock_warehouse',
                component: resolve => {
                    require(['@/views/stock/warehouse/index.vue'], resolve);
                }
            }, {
                path: 'product',
                title: '库存产品',
                name: 'stock_product',
                component: resolve => {
                    require(['@/views/stock/product/index.vue'], resolve);
                }
            }, {
                path: 'instore',
                title: '入库管理',
                name: 'stock_instore',
                component: resolve => {
                    require(['@/views/stock/instore/index.vue'], resolve);
                }
            }, {
                path: 'outstore',
                title: '出库管理',
                name: 'stock_outstore',
                component: resolve => {
                    require(['@/views/stock/outstore/index.vue'], resolve);
                }
            }, {
                path: 'inventory',
                title: '损溢盘存',
                name: 'stock_inventory',
                component: resolve => {
                    require(['@/views/stock/inventory/index.vue'], resolve);
                }
            }
        ]
    },
    {
    	path: '/statistics',
    	title: '统计',
        icon: 'stats-bars',
        name: 'statistics',
        component: Main,
        children: [
            {
                path: 'customer',
                title: '客户统计',
                name: 'stat_customer',
                component: RouterPage,
                children: [
		            {
		                path: 'trade',
		                title: '客户交易',
		                name: 'stat_customer_trade',
		                component: resolve => {
		                    require(['@/views/statistics/customer/trade.vue'], resolve);
		                }
		            }
		        ]
            },
            {
                path: 'product',
                title: '产品统计',
                name: 'stat_product',
                component: RouterPage,
                children: [
                	
		            {
		                path: 'variety',
		                title: '品种统计',
		                name: 'stat_product_variety',
		                component: resolve => {
		                    require(['@/views/statistics/product/variety.vue'], resolve);
		                }
		            },
		            {
		                path: 'category',
		                title: '品类统计',
		                name: 'stat_product_category',
		                component: resolve => {
		                    require(['@/views/statistics/product/category.vue'], resolve);
		                }
		            }
		        ]
            },
            {
                path: 'order',
                title: '订单统计',
                name: 'stat_order',
                component: resolve => {
                    require(['@/views/statistics/order/index.vue'], resolve);
                }
            },
            {
                path: 'analysis',
                title: '财务分析',
                name: 'stat_analysis',
                component: RouterPage,
                children: [
		            {
		                path: 'operate',
		                title: '经营分析',
		                name: 'stat_analysis_operate',
		                component: resolve => {
		                    require(['@/views/statistics/analysis/operate.vue'], resolve);
		                }
		            },
		            {
		                path: 'batch',
		                title: '批次分析',
		                name: 'stat_analysis_batch',
		                component: resolve => {
		                    require(['@/views/statistics/analysis/batch.vue'], resolve);
		                }
		            },
		            {
		                path: 'finance',
		                title: '财务分析',
		                name: 'stat_analysis_finance',
		                component: resolve => {
		                    require(['@/views/statistics/analysis/finance.vue'], resolve);
		                }
		            },
		            {
		                path: 'profit',
		                title: '收益分析',
		                name: 'stat_analysis_profit',
		                component: resolve => {
		                    require(['@/views/statistics/analysis/profit.vue'], resolve);
		                }
		            }
		        ]
            }
        ]
    },
    {
        path: '/system',
        title: '设置',
        icon: 'gear-b',
        name: 'system',
        component: Main,
        multilevel: true,		// 多级展示方式
        children: [
            // {
            //     path: '/system/info',
            //     title: '信息维护',
            //     name: 'system_custom_info',
            //     component: resolve => {
            //         require(['@/views/system/custom/info.vue'], resolve);
            //     }
            // },
            {
                path: 'address',
                title: '收货地址',
                name: 'system_address',
                component: resolve => {
                    require(['@/views/system/address/index.vue'], resolve);
                }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    createRouter,
    checkRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
