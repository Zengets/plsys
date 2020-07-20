import mockjs from 'mockjs';

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

let realdata = [{
  "id":"1",
  "equipmentId":"A000E01",
  "name":"QGQEF全自动双头二元包装充气封口机",
  "station":"1",
  "type":"QGQEF",
  "brand":"",
  "supplierId":"3",
  "serialNum":"",
  "price":"168000",
  "purchaseDate":"2016-09-09",
  "life":"7",
  "plan":"一级保养",
  "departmentId":"3",
  "state":"正常",
  "safetyLevelId":"6",
  "parameter":"",
  "lastMaintainDate":"2019-01-17",
  "nextMaintainDate":"2018-12-11",
  "mcuId":"A000014",
  "companyId":"4",
  "deleteMarker":"0",
  "deleteDate":"2018-12-12 11:09:01.0",
  "deletePerson":"20",
  "group":"乙组",
  "companyName":"江苏南高智能装备创新中心有限公司",
  "supplierName":"扬州美达灌装科技有限公司",
  "safetyLevelName":"4",
  "departmentName":"产品线1",
  "deletePersonName":"郑子翔",
  "plcId":"4",
  "scrapStartDate":"2019-01-19",
  "scrapPeriod":"2.53",
  "scrapStopDate":"2019-04-05",
  "responsiblePerson":"wr",
  "equipLocation":"nangao4",
  "comid":14,"typeID":1},{"id":"2","equipmentId":"A000E02","name":"QGQEY全自动四头二元灌液机","station":"2","type":"QGQEY","brand":"扬州美达","supplierId":"3","serialNum":"9630142597401","price":"150000","purchaseDate":"2018-01-01","life":"100","plan":"一级保养","departmentId":"3","state":"正常","safetyLevelId":"6","parameter":"灌装精度：≤±1%；单头最大灌装容量：300ml","lastMaintainDate":"2019-01-17","nextMaintainDate":"2019-01-24","mcuId":"A000002","companyId":"4","deleteMarker":"0","deleteDate":"2019-01-17 11:19:47.0","deletePerson":"20","group":"甲组","companyName":"江苏南高智能装备创新中心有限公司","supplierName":"扬州美达灌装科技有限公司","safetyLevelName":"4","departmentName":"产品线1","deletePersonName":"郑子翔","plcId":"2","plcName":"FBox02","scrapStartDate":"2019-03-04","scrapPeriod":"0.9","scrapStopDate":"2019-03-31","responsiblePerson":"徐涛","equipLocation":"产品线2","comid":15,"typeID":1},{"id":"3","equipmentId":"A000E03","name":"切割机床","station":"3","type":"GX530数控慢走丝线切割机床","brand":"MITSUBOSHI","supplierId":"4","serialNum":"5036971579025","price":"888000","purchaseDate":"2016-03-09","life":"100","plan":"一级保养","departmentId":"3","state":"正常","safetyLevelId":"2","parameter":"最大工件尺寸 1130×510×260\r\n最大工件尺寸：1130×510×260；最大工件重量：500","lastMaintainDate":"2018-11-30","nextMaintainDate":"2018-12-07","mcuId":"A000003","companyId":"4","deleteMarker":"0","group":"乙组","companyName":"江苏南高智能装备创新中心有限公司","supplierName":"MITSUBOSHI","departmentName":"产品线1","plcId":"4","scrapStartDate":"2019-02-22","scrapPeriod":"0.03","scrapStopDate":"2019-02-23","typeID":1},{"id":"4","equipmentId":"A000E04","name":"龙门磨床","station":"4","type":"GM3010数控龙门磨床","brand":"GUIBEI","supplierId":"5","serialNum":"6608197320116","price":"730000","purchaseDate":"2016-01-23","life":"150","plan":"一级保养","departmentId":"3","state":"正常","safetyLevelId":"2","parameter":"主电机功率：15kw；砂轮转速：2000rpm；最大磨削尺寸：2100*1000*630mm","lastMaintainDate":"2019-01-03","nextMaintainDate":"2019-01-10","mcuId":"A000004","companyId":"4","deleteMarker":"0","deleteDate":"2019-01-03 13:47:10.0","deletePerson":"85","group":"乙组","companyName":"江苏南高智能装备创新中心有限公司","supplierName":"GUIBEI","departmentName":"产品线1","deletePersonName":"徐涛1","plcId":"2","plcName":"FBox02","scrapPeriod":"5","responsiblePerson":"","equipLocation":"","comid":21,"typeID":1},{"id":"5","equipmentId":"A000E05","name":"3D打印机","station":"5","type":"WEEDO F300 3D打印机","brand":"威宝仕","supplierId":"6","serialNum":"4503221697845","price":"15000","purchaseDate":"2015-11-26","life":"90","plan":"一级保养","departmentId":"4","state":"正常","safetyLevelId":"2","parameter":"最高打印精度：0.08mm；打印平台尺寸：300mm * 300mm；最大打印高度：300mm","lastMaintainDate":"2018-11-30","nextMaintainDate":"2018-12-07","mcuId":"A000005","companyId":"4","deleteMarker":"0","group":"1组","companyName":"江苏南高智能装备创新中心有限公司","departmentName":"产品线2","comid":15,"typeID":2}]

function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      name:realdata[i]?realdata[i].name:"",
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      subDescription: desc[i % 5],
      description:
        '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content:
        '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',

    });
  }

  return list;
}

let sourceData;

function getFakeList(req, res) {
  const params = req.query;
  const count = params.count * 1 || 20;
  const result = fakeList(count);
  sourceData = result;
  return res.json(result);
}

function postFakeList(req, res) {
  const { /* url = '', */ body } = req;
  // const params = getUrlParams(url);
  const { method, id } = body;
  // const count = (params.count * 1) || 20;
  let result = sourceData;

  switch (method) {
    case 'delete':
      result = result.filter(item => item.id !== id);
      break;
    case 'update':
      result.forEach((item, i) => {
        if (item.id === id) {
          result[i] = Object.assign(item, body);
        }
      });
      break;
    case 'post':
      result.unshift({
        body,
        id: `fake-list-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}

const getNotice = [
  {
    id: 'xxx1',
    title: titles[0],
    logo: avatars[0],
    description: '那是一种内在的东西，他们到达不了，也无法触及的',
    updatedAt: new Date(),
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: titles[1],
    logo: avatars[1],
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: new Date('2017-07-24'),
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: titles[2],
    logo: avatars[2],
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: new Date(),
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: titles[3],
    logo: avatars[3],
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: new Date('2017-07-23'),
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: titles[4],
    logo: avatars[4],
    description: '凛冬将至',
    updatedAt: new Date('2017-07-23'),
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: titles[5],
    logo: avatars[5],
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: new Date('2017-07-23'),
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
];

const getActivities = [
  {
    id: 'trend-1',
    updatedAt: new Date(),
    user: {
      name: '曲丽丽',
      avatar: avatars2[0],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-2',
    updatedAt: new Date(),
    user: {
      name: '付小小',
      avatar: avatars2[1],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-3',
    updatedAt: new Date(),
    user: {
      name: '林东东',
      avatar: avatars2[2],
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-4',
    updatedAt: new Date(),
    user: {
      name: '周星星',
      avatar: avatars2[4],
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/',
    },
    template: '将 @{project} 更新至已发布状态',
  },
  {
    id: 'trend-5',
    updatedAt: new Date(),
    user: {
      name: '朱偏右',
      avatar: avatars2[3],
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/',
    },
    comment: {
      name: '留言',
      link: 'http://github.com/',
    },
    template: '在 @{project} 发布了 @{comment}',
  },
  {
    id: 'trend-6',
    updatedAt: new Date(),
    user: {
      name: '乐哥',
      avatar: avatars2[5],
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/',
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
];

function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}

export default {
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'POST /api/fake_list': postFakeList,
  'GET /api/captcha': getFakeCaptcha,
  'GET /api/staff':[],
  'GET /api/getMenu':
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        // dashboard
        { path: '/', redirect: '/home' },
        {
          path: '/repair',
          name: 'repair',
          icon: 'tool',
          component: './List/Repair',
        },
        {
          path: '/tool',
          name: 'tool',
          icon: 'setting',
          component: './List/Projects',
        },
        {
          path: '/tool/Projectdetails/:id',
          name: 'Projectdetails',
          hideInMenu: 'true',
          component: './List/Projectdetails'
        },
        {
          path: '/info',
          name: 'info',
          icon: 'info-circle',
          component: './Info/Info',
        },
        {
          component: '404',
        },
      ],
    },
  'GET /api/getRepair':{"code":"1","data":[
    {
      "id":"1",
      "equipmentId":"A000E01",
      "name":"QGQEF全自动双头二元包装充气封口机",
      "station":"1",
      "type":"QGQEF",
      "brand":"",
      "supplierId":"3",
      "serialNum":"",
      "price":"168000",
      "purchaseDate":"2016-09-09",
      "life":"7",
      "plan":"一级保养",
      "departmentId":"3",
      "state":"6",
      "safetyLevelId":"6",
      "parameter":"",
      "lastMaintainDate":"2019-01-17",
      "nextMaintainDate":"2018-12-11",
      "mcuId":"A000014",
      "companyId":"4",
      "group":"259",
      "plcId":"4",
      "scrapStartDate":"2019-01-20",
      "scrapPeriod":"2.5",
      "scrapStopDate":"2019-04-05",
      "responsiblePerson":"20",
      "equipLocation":"nangao4",
      "comid":14,
      "typeID":1},
    {"id":"2","equipmentId":"A000E02","name":"QGQEY全自动四头二元灌液机","station":"2","type":"QGQEY","brand":"扬州美达","supplierId":"3","serialNum":"9630142597401","price":"150000","purchaseDate":"2018-01-01","life":"100","plan":"一级保养","departmentId":"3","state":"3","safetyLevelId":"6","parameter":"灌装精度：≤±1%；单头最大灌装容量：300ml","lastMaintainDate":"2019-01-17","nextMaintainDate":"2019-01-24","mcuId":"A000002","companyId":"4","group":"258","plcId":"2","scrapStartDate":"2019-03-04","scrapPeriod":"0.9","scrapStopDate":"2019-03-31","responsiblePerson":"徐涛","equipLocation":"产品线2","comid":15,"typeID":1},{"id":"3","equipmentId":"A000E03","name":"切割机床","station":"3","type":"GX530数控慢走丝线切割机床","brand":"MITSUBOSHI","supplierId":"4","serialNum":"5036971579025","price":"888000","purchaseDate":"2016-03-09","life":"100","plan":"一级保养","departmentId":"3","state":"4","safetyLevelId":"2","parameter":"最大工件尺寸 1130×510×260\r\n最大工件尺寸：1130×510×260；最大工件重量：500","lastMaintainDate":"2018-11-30","nextMaintainDate":"2018-12-07","mcuId":"A000003","companyId":"4","group":"259","plcId":"4","scrapStartDate":"2019-02-22","scrapPeriod":"0.03","scrapStopDate":"2019-02-23","comid":1,"typeID":1},{"id":"20","equipmentId":"A000222","name":"1","departmentId":"3","state":"5","safetyLevelId":"7","companyId":"4"},{"id":"21","equipmentId":"A00011","name":"12387","departmentId":"6","state":"3","safetyLevelId":"6","companyId":"4"},{"id":"23","equipmentId":"A000125","name":"12387","departmentId":"6","state":"4","safetyLevelId":"6","companyId":"4"},{"id":"24","equipmentId":"A000126","name":"12387","departmentId":"6","state":"2","safetyLevelId":"6","companyId":"4"}],"message":"success"}

};

















