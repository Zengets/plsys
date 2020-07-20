// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'A0007',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/charators': [
    {
      pkid: '1',
      rolename: '公司管理员',
      remark: '是公司内最大的角色',
    },
    {
      pkid: '2',
      rolename: '公司高管',
      remark: '',
    },
    {
      pkid: '3',
      rolename: '部门主管',
      remark: '',
    },
    {
      pkid: '4',
      rolename: '设备主管',
      remark: '',
    },
    {
      pkid: '5',
        rolename: '维修工',
      remark: '',
    },
    {
      pkid: '6',
        rolename: '操作工',
      remark: '',
    },
    {
      pkid: '7',
        rolename: '助理',
      remark: '',
    },

    {
      pkid: '8',
        rolename: '主管',
      remark: '',
    },
    {
      pkid: '9',
        rolename: '部门经理',
      remark: '',
    },

    {
      pkid: '10',
        rolename: '总经理',
      remark: '',
    },
    {
      pkid: '11',
        rolename: '平台管理员',
      remark: '',
    },
    {
      pkid: '12',
        rolename: '测试人员权限',
      remark: '本次测试专用，仅此一次',
    },


  ],
  'GET /api/authtree': [
    {
      title: '设备管理',
      value: '58',
      key: '58',
      children: [
        {
        title: '设备列表',
        value: '581',
        key: '581',
      },{
        title: '设备折旧',
        value: '582',
        key: '582',
      },{
        title: '设备分类',
        value: '583',
        key: '583',
      },{
        title: '设备组合',
        value: '584',
        key: '584',
      }


      ],
    }, {
      title: '配件管理',
      value: '68',
      key: '68',
      children: [{
        title: '配件列表',
        value: '681',
        key: '681',
      }, {
        title: '配件分类',
        value: '682',
        key: '682',
      }, {
        title: '配件申领记录',
        value: '683',
        key: '683',
      }],
    },
    {
      title: '报表分析',
      value: '78',
      key: '78',
    }
  ],


  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === 'ng' && userName === 'ng') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === 'ng' && userName === 'ng') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
