

export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login'
      },
      { path: '/user/register', name: 'register', component: './User/Register' },
      { path: '/user/forgot', name: 'forgot', component: './User/Forgot' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/home' },
      {
        path: '/home',//系统首页
        name: 'home',
        icon: 'home',
        component: './Home/Homepage',
      },
      {
        path: '/jiagou',//组织架构
        name: 'jiagou',
        icon: 'gold',
        component: './Home/JiaGou',
      },
      {
        path: '/state',//设备状态
        name: 'state',
        icon: 'fund',
        component: './Home/State',
      },
      {
        path: '/alldeviceknowledge',
        name: 'alldeviceknowledge',
        icon: 'file',
        component: './Device/DeviceKnowledge',
      },
      {
        path: '/approval',//流程审批
        name: 'approval',
        icon: 'laptop',
        routes: [
          {
            path: '/approval/quanbu',
            name: 'quanbu',
            component: './Approval/AllApproval',
          },
          {
            path: '/approval/yanshou',
            name: 'yanshou',
            component: './Produce/Produce',
          },


          {
            path: '/approval/devicegoa',
            name: 'devicegoa',
            component: './Approval/DeviceGo',
          },
          {
            path: '/approval/devicegob',
            name: 'devicegob',
            component: './Approval/DeviceGo',
          },
          {
            path: '/approval/devicegoc',
            name: 'devicegoc',
            component: './Approval/DeviceGo',
          },
          {
            path: '/approval/spareget',
            name: 'spareget',
            component: './Approval/SpareGet',
          },
          {
            path: '/approval/weiwai',
            name: 'weiwai',
            component: './Approval/WeiWai',
          },
          {
            path: '/approval/noticeapproval',
            name: 'noticeapproval',
            component: './Approval/NoticeApproval',
          },
          {
            path: '/approval/sparebuy',
            name: 'sparebuy',
            component: './Approval/SpareBuy',
          },
        ]
      },
      {
        path: '/produce',//生产计划
        name: 'produce',
        icon: 'calendar',
        routes: [
          {
            path: '/produce/shengchang',
            name: 'shengchang',
            component: './Produce/Produce',
          },
          {
            path: '/produce/paichang',
            name: 'paichang',
            component: './Produce/Produces',
          },
          {
            path: '/produce/producesize',
            name: 'producesize',
            component: './Produce/ProduceSize',
          },
          {
            path: '/produce/producemonth',
            name: 'producemonth',
            component: './Produce/ProduceMonth',
          },
          {
            path: '/produce/produceplan',
            name: 'produceplan',
            component: './Produce/ProducePlan',
          },
          {
            path: '/produce/producedayinfo',
            name: 'producedayinfo',
            component: './Produce/ProduceDayInfo',
          },

        ]
      },
      {
        path: '/yxt',//运维系统
        name: 'yxt',
        icon: 'desktop',
        routes: [
          {
            path: '/yxt/device',//设备资产管理
            name: 'device',
            routes: [
              {
                path: '/yxt/device/tzlist',
                name: 'tzlist',
                component: './Device/Tzlist',
              },
              {
                path: '/yxt/device/devicetzlist',
                name: 'devicetzlist',
                component: './Device/DeviceTzlist',
              },
              {
                path: '/yxt/device/devicetype',
                name: 'devicetype',
                component: './Device/DeviceType',
              },

              {
                path: '/yxt/device/devicego',
                name: 'devicego',
                component: './Device/DeviceGo',
              },
              {
                path: '/yxt/device/devicestep',
                name: 'devicestep',
                component: './Device/DeviceStep',
              },
            ],
          },
          {
            path: '/yxt/devices',//设备使用管理
            name: 'devices',
            routes: [
              {
                path: '/yxt/devices/devicetzlists',
                name: 'devicetzlists',
                component: './Device/DeviceTzlists',
              },
              {
                path: '/yxt/devices/devicemodel',
                name: 'devicemodel',
                component: './Device/DeviceModel',
              },
              {
                path: '/yxt/devices/devicecompose',
                name: 'devicecompose',
                component: './Device/DeviceCompose',
              },
              {
                path: '/yxt/devices/devicelvli',
                name: 'devicelvli',
                component: './Device/DeviceLvli',
              },
              {
                path: '/yxt/devices/verbnotice',
                name: 'verbnotice',
                component: './Verb/VerbNotice',
              },
              {
                path: '/yxt/devices/repairduty',
                name: 'repairduty',
                component: './Repair/RepairDuty',
              },
              {
                path: '/yxt/devices/repairsetting',
                name: 'repairsetting',
                component: './Repair/RepairSetting',
              },
              {
                path: '/yxt/devices/checksettings',
                name: 'checksettings',
                component: './Check/CheckSettings',
              },
              {
                path: '/yxt/devices/verbplanset',
                name: 'verbplanset',
                component: './Verb/VerbPlanSet',
              },
              {
                path: '/yxt/devices/devicespare',
                name: 'devicespare',
                component: './Device/DeviceSpare',
              },

              {
                path: '/yxt/devices/devicetzlists/deviceRecord/:id/:key/:name',
                name: 'deviceRecord',
                hideInMenu: true,
                component: './Device/DeviceRecord',
              },
              {
                path: '/yxt/devices/devicetzlists/devicerepair/:id/:name',
                name: 'devicerepair',
                hideInMenu: true,
                component: './Device/DeviceRepair',
              },
              {
                path: '/yxt/devices/devicetzlists/devicerepair/:id/:name/:ifs',
                name: 'devicerepair',
                hideInMenu: true,
                component: './Device/DeviceRepair',
              },
            ],
          },
          {
            path: '/yxt/verb',//保养管理
            name: 'verb',
            routes: [
              {
                path: '/yxt/verb/verblist',
                name: 'verblist',
                routes: [
                  {
                    path: '/yxt/verb/verblist/lista',
                    name: 'lista',
                    component: './Verb/Verb',
                  },
                  {
                    path: '/yxt/verb/verblist/listb',
                    name: 'listb',
                    component: './Verb/Verb',
                  },
                  {
                    path: '/yxt/verb/verblist/listc',
                    name: 'listc',
                    component: './Verb/Verb',
                  },

                ]
              },
              {
                path: '/yxt/verb/verbxin',
                name: 'verbxin',
                routes: [
                  {
                    path: '/yxt/verb/verbxin/listd',
                    name: 'listd',
                    component: './Verb/Verb',
                  },
                  {
                    path: '/yxt/verb/verbxin/liste',
                    name: 'liste',
                    component: './Verb/Verb',
                  },
                  {
                    path: '/yxt/verb/verbxin/listf',
                    name: 'listf',
                    component: './Verb/Verb',
                  },
                ]
              },
              {
                path: '/yxt/verb/verbplan',
                name: 'verbplan',
                component: './Verb/VerbPlan',
              },
              {
                path: '/yxt/verb/verbmission',
                name: 'verbmission',
                component: './Verb/VerbMission',
              },
              {
                path: '/yxt/verb/verbmission/verbmymission/:key',
                name: 'verbmymission',
                component: './Verb/VerbMission',
                hideInMenu: true
              },

              {
                path: '/yxt/verb/verbmissionsee',
                name: 'verbmissionsee',
                component: './Verb/VerbMissionSee',
              },
              {
                path: '/yxt/verb/verbprosetting',
                name: 'verbprosetting',
                component: './Verb/VerbProSetting',
              },
              {
                path: '/yxt/verb/verbsummary',
                name: 'verbsummary',
                component: './Verb/VerbSummary',
              },
            ],
          },
          {
            path: '/yxt/repair',//维修管理
            name: 'repair',
            routes: [
              {
                path: '/yxt/repair/repairlist',
                name: 'repairlist',
                component: './Repair/RepairList',
              },
              {
                path: '/yxt/repair/repairlist/repairmylist/:key',
                name: 'repairmylist',
                component: './Repair/RepairList',
                hideInMenu: true
              },
              {
                path: '/yxt/repair/repairhistory',
                name: 'repairhistory',
                component: './Repair/RepairHistory',
              },
              {
                path: '/yxt/repair/repairtrouble',
                name: 'repairtrouble',
                component: './Repair/RepairTrouble',
              },
              {
                path: '/yxt/repair/repairweiwai',
                name: 'repairweiwai',
                component: './Repair/RepairWeiwai',
              },
            ],
          },
          {
            path: '/yxt/spare',//配件管理
            name: 'spare',
            routes: [
              {
                path: '/yxt/spare/sparelist',
                name: 'sparelist',
                component: './Spare/SpareList',
              },
              {
                path: '/yxt/spare/spareoverview',
                name: 'spareoverview',
                component: './Spare/SpareOverView',
              },
              {
                path: '/yxt/spare/spareuseage',
                name: 'spareuseage',
                component: './Spare/SpareUseage',
              },
              {
                path: '/yxt/spare/spareleft',
                name: 'spareleft',
                component: './Spare/SpareLeft',
              },
              {
                path: '/yxt/spare/sparelive',
                name: 'sparelive',
                routes: [
                  {
                    path: '/yxt/spare/sparelive/sparechange',
                    name: 'sparechange',
                    component: './Spare/SpareChange',
                  },
                  {
                    path: '/yxt/spare/sparelive/spareundo',
                    name: 'spareundo',
                    component: './Spare/SpareUnDo',
                  },
                  {
                    path: '/yxt/spare/sparelive/sparedone',
                    name: 'sparedone',
                    component: './Spare/SpareDone',
                  },
                ]
              },
              {
                path: '/yxt/spare/sparetype',
                name: 'sparetype',
                component: './Spare/SpareType',
              },
              {
                path: '/yxt/spare/spareget',
                name: 'spareget',
                component: './Spare/SpareGet',
              },
              {
                path: '/yxt/spare/sparebuy',
                name: 'sparebuy',
                component: './Spare/SpareBuy',
              },
              {
                path: '/yxt/spare/spareoverview/spareuseage/:id/:userid/:name',
                name: 'spareuseage',
                hideInMenu: true,
                component: './Spare/SpareUseage',
              },

            ],
          },
          {
            path: '/yxt/check',//点检管理
            name: 'check',
            routes: [
              {
                path: '/yxt/check/checkpoint',
                name: 'checkpoint',
                component: './Check/CheckPoint',
              },
              {
                path: '/yxt/check/checksetting',
                name: 'checksetting',
                component: './Check/CheckSetting',
              },
              {
                path: '/yxt/check/checkmession',
                name: 'checkmession',
                component: './Check/CheckMession',
              },
              {
                path: '/yxt/check/checklist',
                name: 'checklist',
                component: './Check/CheckList',
              },
              {
                path: '/yxt/check/checkerror',
                name: 'checkerror',
                component: './Check/CheckError',
              },
              {
                path: '/yxt/check/checkmession/checkmymession/:key',
                name: 'checkmymession',
                component: './Check/CheckMession',
                hideInMenu: true,
              },
              {
                path: '/yxt/check/checksetting/checkhistory/:id/:name',
                name: 'checkhistory',
                hideInMenu: true,
                component: './Check/CheckHistory',
              },
            ],
          },
          {
            path: '/yxt/energylist',
            name: 'energylist',
            component: './System/Energy',
          },
        ]
      },
      {
        path: '/chart',//统计报表
        name: 'chart',
        icon: 'area-chart',
        routes: [
          {
            path: '/chart/chartfault',
            name: 'chartfault',
            component: './Chart/ChartFault',
          },
          {
            path: '/chart/chartenergy',
            name: 'chartenergy',
            component: './Chart/ChartEnergy',
          },
          {
            path: '/chart/shengchan',
            name: 'shengchan',
            component: './Produce/Produce',
          },
          {
            path: '/chart/shebeir',
            name: 'shebeir',
            component: './Produce/Produce',
          },

          {
            path: '/chart/chartmoee',
            name: 'chartmoee',
            component: './Chart/ChartMoee',
          },
          {
            path: '/chart/chartjia',
            name: 'chartjia',
            component: './Chart/ChartJia',
          },
          {
            path: '/chart/chartmttr',
            name: 'chartmttr',
            component: './Chart/ChartMTTR',
          },
          {
            path: '/chart/chartmtbf',
            name: 'chartmtbf',
            component: './Chart/ChartMTBF',
          },
          {
            path: '/chart/chartstop',
            name: 'chartstop',
            component: './Chart/ChartSTOP',
          },
          {
            path: '/chart/charttask',
            name: 'charttask',
            component: './Chart/ChartTask',
          },
          {
            path: '/chart/deviceanalyse',
            name: 'deviceanalyse',
            component: './Chart/ChartChanne',
          },
          // {
          //   path: '/chart/deviceenegry',
          //   name: 'deviceenegry',
          //   component: './Device/DeviceEnegry',
          // },
        ],
      },
      {
        path: '/system',//系统设置
        name: 'system',
        icon: 'setting',
        routes: [
          {
            path: '/system/parts',
            name: 'parts',
            component: './System/Parts',
          },
          {
            path: '/system/form',
            name: 'form',
            component: './System/Form',
          },
          // {
          //   path: '/system/jiagou',
          //   name: 'jiagou',
          //   component: './System/Company',
          // },
          {
            path: '/system/supplier',
            name: 'supplier',
            component: './System/Supplier',
          },
          {
            path: '/system/staff',
            name: 'staff',
            component: './System/Staff',
          },
          {
            path: '/system/charactor',
            name: 'charactor',
            component: './System/Character',
          },
          {
            path: '/system/shuju',
            name: 'shuju',
            component: './System/DoCheck',
          },
          {
            path: '/system/companylist',
            name: 'companylist',
            component: './System/CompanyList',
          },

        ],
      },
      /*admin*/
      {
        path: '/admin',//系统管理
        name: 'admin',
        icon: 'laptop',
        routes: [
          {
            path: '/admin/reglist',
            name: 'reglist',
            component: './Admin/RegList',
          },
          {
            path: '/admin/company',
            name: 'company',
            component: './Admin/Company',
          },
          {
            path: '/admin/company/devices/:id/:company',
            name: 'devices',
            hideInMenu: true,
            component: './Admin/Devices',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
