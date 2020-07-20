import {
  Table, Icon, Row, Col, PageHeader,
  Popconfirm, Divider, Drawer,
  message, Card, Modal
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import moment from 'moment';
import AllAdds from './AllAdds';
import AllAdd from './AllAdd'
import Abload from '@/components/Abload';

@connect(({ produce, loading }) => ({
  produce,
  submitting: loading.effects['produce/planqueryList'],
}))
class Produce extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
    ]
    this.columnc = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '班次',
        dataIndex: 'shiftName',
        key: 'shiftName',
      },
    ]
    this.columnx = [
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '产品规格',
        dataIndex: 'manufactureContent',
        key: 'manufactureContent',
      },
      {
        title: '料号',
        dataIndex: 'productNo',
        key: 'productNo',
      },
      {
        title: "克重(kg/万支)",
        dataIndex: 'gramWeight',
        key: 'gramWeight',
      },
      {
        title: "单机产能",
        dataIndex: 'planShiftProductQuantity',
        key: 'planShiftProductQuantity',
      },
    ]
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      pcData: [],
      ydData: [],
      checkedValues: [],
      fv: false,
      fields: undefined,
      /*初始化 main List */
      postData: {
        "pageIndex": 1,
        "pageSize": 10,
        "orderNo": "",  // 订单号
        "manufactureContent": "", // 产品规格
        "productNo": "",   // 生产料号
        "productPlanUserName": "", // 计划人员
        "shopId": "",  // 产品线主键
        "startDate": "", // 计划日期(开始)
        "status": "", // 状态, 0 : 待生产, 1 : 生产中, 2 : 待确认, 3 : 结束
      },
      postUrl: "planqueryList",
      postDataz: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        equipmentNo: "",//编号
        equipmentName: "",//设备名
        positionNo: "",//位置编号
        equipmentTypeId: "",//类型
        shopId: ""
      },
      postDatax: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        shopId: "", // 设备主键(必须)
        userName: "", // 用户名
      },
      postDatam: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        manufactureContent: "",           // 产品规格
        ids: "",   // 已选择的主键
      },
      curitem: {},
      visible: false
    }
  }


  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'produce/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  setNewStates(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicmodel/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }




  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel()
    })
    this.setNewState('deviceTypequeryTreeList', null);
  }

  componentWillMount() {
    this.resetData();
  }


  //表单改变
  handleFormChange = (changedFields) => {
    let fields = this.state.fields, obj;
    for (let i in changedFields) {
      obj = changedFields[i]
    }
    if (obj) {
      for (let i in fields) {
        if (i == obj.name) {
          fields[i].value = obj.value
          fields[i].name = obj.name
          fields[i].dirty = obj.dirty
          fields[i].errors = obj.errors
          fields[i].touched = obj.touched
          fields[i].validating = obj.validating
        }
      }
      this.setState({
        fields: fields,
      })
    }
  }

  /*绑定form*/
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  /*关闭*/
  handleCancel = () => {
    let curitem = this.state.curitem;
    if (this.state.curitem.id) {
      curitem = this.props.produce[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }

    this.setState({
      fv: false,
      visible: false,
      curitem: curitem ? curitem : {},
      fields: {
        orderNo: {
          value: null,
          type: "input",
          title: "订单号",
          keys: "orderNo",
          requires: false
        },
        manufactureContentId: {
          value: null,
          type: "table",
          title: "产品规格",
          keys: "manufactureContentId",
          columns: this.columnx,
          dataSource: "queryByConditionPage",
          checktype: "radio",
          dv: "id",
          lb: "manufactureContent",
          requires: true
        },
        planProductQuantity: {
          value: null,
          type: "inputnumber",
          title: "生产数量(万支)",
          keys: "planProductQuantity",
          requires: true
        },
        planProductLines: {
          value: null,
          type: "inputnumber",
          title: "产线数量",
          keys: "planProductLines",
          requires: true
        },
        productPlanDate: {
          value: moment(),
          type: "datepicker",
          title: "计划开始时间",
          keys: "productPlanDate",
          disabledDate: (current) => { return current < moment().add(-1, 'days') },
          requires: true
        },
        planProductDays: {
          value: null,
          type: "inputnumber",
          title: "预计开线天数",
          min: 1,
          keys: "planProductDays",
          requires: true
        },
        shopId: {
          value: null,
          type: "select",
          title: "产品线",
          keys: "shopId",
          requires: true,
          option: this.props.produce.shopList ? this.props.produce.shopList.map((item) => {
            return {
              name: item.shopName,
              id: item.id
            }
          }) : []
        },

      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype, curitemz, productPlanId } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (iftype.value == "edit") {
        values.manufactureContentId = values.manufactureContentId[0];
        values.productPlanDate = moment(values.productPlanDate).format("YYYY-MM-DD");
        let postData = { ...values, id: curitem.id };
        this.setNewState("plansave", postData, () => {
          message.success("修改成功！");
          this.handleCancel()
          this.resetData();
        });
      } else if (iftype.value == "add") {
        values.manufactureContentId = values.manufactureContentId[0];
        let postData = { ...values };
        this.setNewState("plansave", postData, () => {
          message.success("新增成功！");
          this.resetData(); this.handleCancel()
        });
      } else if (iftype.value == "addpc") {
        values.equipmentId = values.equipmentId[0];
        values.productDate = moment(values.productDate).format("YYYY-MM-DD");
        let postData = { ...values, productPlanId: curitem.id };
        this.setNewState("saveOrUpdate", postData, () => {
          message.success("新增成功！");
          this.resetData(); this.handleCancel()
        });
      } else if (iftype.value == "editpc") {
        values.equipmentId = values.equipmentId[0];
        values.productDate = moment(values.productDate).format("YYYY-MM-DD");
        let postData = { ...values, productPlanId: productPlanId, id: curitemz.id };
        this.setNewState("saveOrUpdate", postData, () => {
          message.success("修改成功！");
          this.resetData(); this.handleCancel()
        });
      }

    });
  }

  handleSearch = (selectedKeys, dataIndex, end) => {
    if (end) {
      let start = dataIndex;
      let { postUrl } = this.state;
      this.setState({ postData: { ...this.state.postData, [start]: selectedKeys[0] ? selectedKeys[0] : "", [end]: selectedKeys[1] ? selectedKeys[1] : "" } }, () => {
        this.setNewState(postUrl, this.state.postData)
      });
    } else {
      let { postUrl } = this.state;
      this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
        this.setNewState(postUrl, this.state.postData)
      });
    }
  };

  handleSearchc = (selectedKeys, dataIndex) => {
    let postUrl = "getProductors"
    this.setState({ postDatax: { ...this.state.postDatax, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDatax)
    });
  };

  handleSearchx = (selectedKeys, dataIndex) => {
    let postUrl = "queryByConditionPage"
    this.setState({ postDatam: { ...this.state.postDatam, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDatam)
    });
  };

  handleSearchz = (selectedKeys, dataIndex) => {
    let postUrl = "queryPageListPlus"
    this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDataz)
    });
  };

  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };
    this.setState({
      fields
    })
  }

  onRef = (ref) => {
    this.child = ref;
  }
  onRefc = (ref) => {
    this.childc = ref;
  }
  onRefs = (ref) => {
    this.childs = ref;
  }
  onRefz = (ref) => {
    this.childz = ref;
  }
  onRefx = (ref) => {
    this.childx = ref;
  }
  render() {
    let { postData, postDataz, postDatax, postDatam, fv, fields, iftype, curitem } = this.state,
      { planqueryList, departmentList, shopList, shiftList, deviceTypequeryTreeList } = this.props.produce;

    let getsearchbox = (key) => {
      if (this.child) {
        return this.child.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option, lb, vl) => {
      if (this.child) {
        return this.child.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, getdaterangebox = (start, end) => {
      if (this.child) {
        return this.child.getColumnRangeProps(start, end)
      } else {
        return null
      }
    }, getdatebox = (key, disableddate) => {
      if (this.child) {
        return this.child.getColumnDateProps(key, disableddate)
      } else {
        return null
      }
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getsearchboxc = (key) => {
      if (this.childc) {
        return this.childc.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getsearchboxz = (key) => {
      if (this.childz) {
        return this.childz.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxz = (key, option) => {
      if (this.childz) {
        return this.childz.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getsearchboxx = (key) => {
      if (this.childx) {
        return this.childx.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectboxx = (key, option, lb, vl) => {
      if (this.childx) {
        return this.childx.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, col = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 6,
      xxl: 6
    }, cols = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 8,
      xl: 8,
      xxl: 8
    };

    const columns = [
      {
        title: '计划编号',
        dataIndex: 'planNo',
        key: 'planNo',
        ...getsearchbox("planNo")
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        ...getsearchbox("orderNo")
      },
      {
        title: '产品规格',
        dataIndex: 'manufactureContent',
        key: 'manufactureContent',
        ...getsearchbox("manufactureContent")
      },
      {
        title: '生产料号',
        dataIndex: 'productNo',
        key: 'productNo',
        ...getsearchbox("productNo")
      },
      {
        title: '计划人员',
        dataIndex: 'productPlanUserName',
        key: 'productPlanUserName',
        ...getsearchbox('productPlanUserName'),
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox('shopId', shopList ? shopList.map((item) => {
          return {
            dicName: item.shopName,
            dicKey: item.id
          }
        }) : []),
      },
      {
        title: '计划产量(万支)',
        dataIndex: 'planProductQuantity',
        key: 'planProductQuantity',
      },
      {
        title: '单机产能(万支)',
        dataIndex: 'planShiftProductQuantity',
        key: 'planShiftProductQuantity',
      },
      {
        title: '克重(kg/万支)',
        dataIndex: 'gramWeight',
        key: 'gramWeight',
      },
      // {
      //   title: '计划产线数',
      //   dataIndex: 'planProductLines',
      //   key: 'planProductLines',
      // },
      {
        title: '计划完成率',
        dataIndex: 'planCompleteRate',
        key: 'planCompleteRate',
        render: (text) => <span>{text ? `${text}%` : ''}</span>
      },
      {
        title: '计划日期',
        dataIndex: 'productPlanDate',
        key: 'productPlanDate',
        width: 200,
        ...getdatebox("startDate")
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          状态
         <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                "pageIndex": 1,
                "pageSize": 10,
                "orderNo": "",  // 订单号
                "manufactureContent": "", // 产品规格
                "productNo": "",   // 生产料号
                "productPlanUserName": "", // 计划人员
                "shopId": "",  // 产品线主键
                "startDate": "", // 计划日期(开始)
                "status": "", // 状态, 0 : 待生产, 1 : 生产中, 2 : 待确认, 3 : 结束
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
          重置
      </a>
        </span>,
        dataIndex: 'status',
        key: 'status',
        width: 140,
        ...getselectbox("status", [
          {
            dicName: "待生产",
            dicKey: "0"
          },
          {
            dicName: "生产中",
            dicKey: "1"
          },
          {
            dicName: "待确认",
            dicKey: "2"
          },
          {
            dicName: "结束",
            dicKey: "3"
          },
          {
            dicName: "计划关闭",
            dicKey: "4"
          },

        ]),
        render: (text, record) => <span>{text == 0 ? "待生产" : text == 1 ? "生产中" : text == 2 ? "待确认" : text == 3 ? "结束" : text == 4 ? "计划关闭" : ""}</span>
      },
      // {
      //   title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      //     计划天数
      //   <a style={{ color: "#f50" }} onClick={() => {
      //       this.setState({
      //         postData: {
      //           "pageIndex": 1,
      //           "pageSize": 10,
      //           "orderNo": "",  // 订单号
      //           "manufactureContent": "", // 产品规格
      //           "productNo": "",   // 生产料号
      //           "productPlanUserName": "", // 计划人员
      //           "shopId": "",  // 产品线主键
      //           "startDate": "", // 计划日期(开始)
      //           "status": "", // 状态, 0 : 待生产, 1 : 生产中, 2 : 待确认, 3 : 结束
      //         }
      //       }, () => {
      //         this.resetData()
      //       })
      //     }}>
      //       <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
      //       重置
      //   </a>
      //   </span>,
      //   dataIndex: 'planProductDays',
      //   key: 'planProductDays',
      //   width:140
      // },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("planqueryList", this.state.postData);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    let renderPerson = (record) => {
      return <Row>
        <Col {...cols}>
          <PageHeader
            title="工序一"
          >
            <p>
              <span>废料(kg):</span>
              <span>{record.rejectWaste}</span>
            </p>
            <p>
              <span>可回收废料(kg):</span>
              <span>{record.recycleWaste}</span>
            </p>
            <p>
              <span>不可回收废料(kg):</span>
              <span>{record.unrecycleWaste}</span>
            </p>
            <p>
              <span>核定废料(kg):</span>
              <span>{record.confirmRejectWaste}</span>
            </p>
            <p>
              <span>确认可回收(kg):</span>
              <span>{record.confirmRecycleWaste}</span>
            </p>
            <p>
              <span>确认不可回收(kg):</span>
              <span>{record.confirmUnrecycleWaste}</span>
            </p>
            <p style={{ display: "flex", flexWrap: "wrap" }}>
              <span style={{ margin: "0 12px 6px 0", padding: 6 }}>生产人员 : </span>
              {
                record.productUserList &&
                record.productUserList.map((item) => {
                  return <span style={{ margin: "0 12px 6px 0", padding: 6, backgroundColor: "#f0f0f0", borderRadius: 4 }} key={item.userId}>{item.userName}</span>
                })
              }
            </p>
          </PageHeader>
        </Col>
        <Col {...cols}>
          <PageHeader
            title="工序二"
          >
            <p>
              <span>废料(kg):</span>
              <span>{record.rejectWaste1}</span>
            </p>
            <p>
              <span>可回收废料(kg):</span>
              <span>{record.recycleWaste1}</span>
            </p>
            <p>
              <span>不可回收废料(kg):</span>
              <span>{record.unrecycleWaste1}</span>
            </p>
            <p>
              <span>核定废料(kg):</span>
              <span>{record.confirmRejectWaste1}</span>
            </p>
            <p>
              <span>确认可回收(kg):</span>
              <span>{record.confirmRecycleWaste1}</span>
            </p>
            <p>
              <span>确认不可回收(kg):</span>
              <span>{record.confirmUnrecycleWaste1}</span>
            </p>
            <p style={{ display: "flex", flexWrap: "wrap" }}>
              <span style={{ margin: "0 12px 6px 0", padding: 6 }}>生产人员 : </span>
              {
                record.productUserList1 &&
                record.productUserList1.map((item) => {
                  return <span style={{ margin: "0 12px 6px 0", padding: 6, backgroundColor: "#f0f0f0", borderRadius: 4 }} key={item.userId}>{item.userName}</span>
                })
              }
            </p>
          </PageHeader>
        </Col>
        <Col {...cols}>
          <PageHeader
            title="工序三"
          >
            <p>
              <span>废料(kg):</span>
              <span>{record.rejectWaste2}</span>
            </p>
            <p>
              <span>可回收废料(kg):</span>
              <span>{record.recycleWaste2}</span>
            </p>
            <p>
              <span>不可回收废料(kg):</span>
              <span>{record.unrecycleWaste2}</span>
            </p>
            <p>
              <span>核定废料(kg):</span>
              <span>{record.confirmRejectWaste2}</span>
            </p>
            <p>
              <span>确认可回收(kg):</span>
              <span>{record.confirmRecycleWaste2}</span>
            </p>
            <p>
              <span>确认不可回收(kg):</span>
              <span>{record.confirmUnrecycleWaste2}</span>
            </p>
            <p style={{ display: "flex", flexWrap: "wrap" }}>
              <span style={{ margin: "0 12px 6px 0", padding: 6 }}>生产人员 : </span>
              {
                record.productUserList2 &&
                record.productUserList2.map((item) => {
                  return <span style={{ margin: "0 12px 6px 0", padding: 6, backgroundColor: "#f0f0f0", borderRadius: 4 }} key={item.userId}>{item.userName}</span>
                })
              }
            </p>
          </PageHeader>
        </Col>
      </Row>
    }

    let renderAdd = (record) => {
      let column = [
        {
          title: '计划人',
          dataIndex: 'assignUserName',
          key: 'assignUserName',
        },
        {
          title: '产品线名',
          dataIndex: 'shopName',
          key: 'shopName',
        },
        {
          title: "位置号",
          dataIndex: 'positionNo',
          key: 'positionNo',
        },
        {
          title: "设备编号",
          dataIndex: 'equipmentNo',
          key: 'equipmentNo',
        },
        {
          title: '产品规格',
          dataIndex: 'manufactureContent',
          key: 'manufactureContent',
        },
        {
          title: '生产日期',
          dataIndex: 'productDate',
          key: 'productDate',
        },
        {
          title: '班次',
          dataIndex: 'shiftName',
          key: 'shiftName',
        },
        {
          title: '班别',
          dataIndex: 'className',
          key: 'className',
        },
        {
          title: '目标产量(万支)',
          dataIndex: 'planProductQuantity',
          key: 'planProductQuantity',
        },
        {
          title: '产量/箱',
          dataIndex: 'box',
          key: 'box',
        },
        {
          title: '产量(万支)',
          dataIndex: 'manufactureTotalQuantity',
          key: 'manufactureTotalQuantity',
        },
        {
          title: '核定产量(万支)',
          dataIndex: 'confirmManufactureTotalQuantity',
          key: 'confirmManufactureTotalQuantity',
        },
        {
          title: '克重(kg/万支)',
          dataIndex: 'gramWeight',
          key: 'gramWeight',
        },
        {
          title: '废品率',
          dataIndex: 'rejectionRate',
          key: 'rejectionRate',
          render: (text) => { return text && <span>{text}%</span> }
        },
        {
          title: '核定人',
          dataIndex: 'confirmUserName',
          key: 'confirmUserName',
        },
        {
          title: '核定时间',
          dataIndex: 'confirmTime',
          key: 'confirmTime',

        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => <span>{text == 0 ? "待生产" : text == 1 ? "生产中" : text == 2 ? "待确认" : text == 3 ? "结束" : text == 4 ? "计划关闭" : ""}</span>
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (text, record) => <div>
            <a onClick={() => {
              let user1 = record.productUserList.map((item) => {
                return item.userId
              }), user2 = record.productUserList1.map((item) => {
                return item.userId
              }), user3 = record.productUserList2.map((item) => {
                return item.userId
              })
              let alluserids = [...user1, ...user2, ...user3];
              alluserids = [...new Set(alluserids)].join(",")

              this.childs.changedData("getProductors", {
                pageIndex: 1,    //第几页
                pageSize: 10,     //每页大小
                shopId: record.shopId, // 设备主键(必须)
                userName: "", // 用户名
                userIds: alluserids
              }, 1, () => {
                this.childs.changedData("queryPageListPlus", {
                  pageIndex: 1,    //第几页
                  pageSize: 10,     //每页大小
                  equipmentNo: "",//编号
                  equipmentName: "",//设备名
                  positionNo: "",//位置编号
                  equipmentTypeId: "",//类型
                  shopId: record.shopId,
                  equipmentIds: record.equipmentId
                }, 1, () => {
                  this.setState({
                    productPlanId: record.productPlanId,
                    postDatax: {
                      pageIndex: 1,    //第几页
                      pageSize: 10,     //每页大小
                      shopId: record.shopId, // 设备主键(必须)
                      userName: "", // 用户名
                      userIds: record.productUserList.map((item) => {
                        return item.userId
                      }).join(",")
                    },
                    postDataz: {
                      pageIndex: 1,    //第几页
                      pageSize: 10,     //每页大小
                      equipmentNo: "",//编号
                      equipmentName: "",//设备名
                      positionNo: "",//位置编号
                      equipmentTypeId: "",//类型
                      shopId: record.shopId,
                      equipmentIds: record.equipmentId
                    },
                    fields: {
                      equipmentId: {
                        value: [record.equipmentId],
                        type: "table",
                        title: "选择设备",
                        keys: "equipmentId",
                        requires: true,
                        columns: this.columns,
                        dataSource: "queryPageListPlus",
                        checktype: "radio",
                        hides: false,
                        dv: "id",
                        lb: "equipmentName"
                      },
                      shiftId: {
                        value: record.shiftId,
                        type: "select",
                        title: "选择班次",
                        keys: "shiftId",
                        requires: true,
                        option: this.props.produce.shiftList ? this.props.produce.shiftList.map((item) => {
                          return {
                            name: item.shiftName,
                            id: item.id
                          }
                        }) : []
                      },
                      classType: {
                        value: record.classType,
                        type: "select",
                        title: "选择班别",
                        keys: "classType",
                        requires: true,
                        option: [{
                          name: "白班",
                          id: 0
                        }, {
                          name: "夜班",
                          id: 1
                        }]
                      },
                      productDate: {
                        value: record.productDate ? moment(record.productDate) : undefined,
                        type: "datepicker",
                        title: "生产日期",
                        keys: "productDate",
                        requires: true,
                      },
                      planProductQuantity: {
                        value: record.planProductQuantity,
                        type: "inputnumber",
                        title: "计划生产数量",
                        keys: "planProductQuantity",
                        requires: true,
                      },
                      // productionIdList: {
                      //   value: record.productUserList.map((item) => {
                      //     return item.userId
                      //   }),
                      //   type: "table",
                      //   title: "工序一人员",
                      //   keys: "productionIdList",
                      //   requires: true,
                      //   columns: this.columnc,
                      //   dataSource: "getProductors",
                      //   dv: "id",
                      //   lb: "userName"
                      // },
                      // productionIdList1: {
                      //   value: record.productUserList1.map((item) => {
                      //     return item.userId
                      //   }),
                      //   type: "table",
                      //   title: "工序二人员",
                      //   keys: "productionIdList1",
                      //   requires: false,
                      //   columns: this.columnc,
                      //   dataSource: "getProductors",
                      //   dv: "id",
                      //   lb: "userName"
                      // },
                      // productionIdList2: {
                      //   value: record.productUserList2.map((item) => {
                      //     return item.userId
                      //   }),
                      //   type: "table",
                      //   title: "工序三人员",
                      //   keys: "productionIdList2",
                      //   requires: false,
                      //   columns: this.columnc,
                      //   dataSource: "getProductors",
                      //   dv: "id",
                      //   lb: "userName"
                      // },
                    }
                  }, () => {
                    this.setState({
                      fv: true,
                      curitemz: record,
                      iftype: {
                        name: "修改排产计划",
                        value: "editpc"
                      },
                    })
                  })
                })
              })
            }}>修改</a>
            <Divider type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该排产计划？"}
              onConfirm={() => {
                this.setNewState("savedeleteById", { id: record.id }, () => {
                  this.resetData();
                  message.success("删除成功！");
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </div>
        },


      ]

      return <Table bordered
        size="middle"
        pagination={false}
        rowKey='id'
        columns={column}
        expandedRowRender={record => renderPerson(record)}
        expandRowByClick
        dataSource={record.shiftProductList ? record.shiftProductList : []}
      >
      </Table>
    }

    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchboxz("equipmentNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchboxz("equipmentName")
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchboxz("positionNo")
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectboxz('equipmentTypeId', deviceTypequeryTreeList),
      },
    ]

    this.columnc = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        ...getsearchboxc("userName")
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '班次',
        dataIndex: 'shiftName',
        key: 'shiftName',
      },
    ]

    this.columnx = [
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectboxx("shopId", shopList ? shopList.map((item) => {
          return {
            dicName: item.shopName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '产品规格',
        dataIndex: 'manufactureContent',
        key: 'manufactureContent',
        ...getsearchboxx("manufactureContent")
      },
      {
        title: '料号',
        dataIndex: 'productNo',
        key: 'productNo',
      },
      {
        title: "克重(kg/万支)",
        dataIndex: 'gramWeight',
        key: 'gramWeight',
      },
      {
        title: "单机产能",
        dataIndex: 'planShiftProductQuantity',
        key: 'planShiftProductQuantity',
      },
    ]

    function bodyparse(vals) {
      let val = JSON.parse(JSON.stringify(vals))
      delete val.pageSize;
      delete val.pageIndex;
      let res = ''
      for (let key in val) {
        let value = val[key] ? val[key] : ''

        res += `&${key}=${value}`;
      }
      return res.substr(1)
    }
    return (
      <div>

        <Drawer
          visible={this.state.visible}
          width={"88%"}
          title={iftype.name}
          onClose={() => {
            this.setState({
              visible: false
            })
          }}
        >
          {
            iftype.value == "add" ?
              <AllAdds onClose={() => {
                this.setState({
                  visible: false
                })
              }} resetData={() => {
                this.handleCancel()
                this.resetData()
              }}>
              </AllAdds> :
              iftype.value == "addplan" && this.state.visible ?
                <AllAdd
                  sendData={(shiftProductList) => {
                    let postDatathis = shiftProductList.map((item) => {
                      return {
                        equipmentId: item.equipmentId.indexOf("|") !== -1 ? item.equipmentId.split("|")[0] : item.equipmentId,
                        shiftId: item.shiftId,
                        classType: item.classType,
                        productDate: item.productDate,
                        productDay: item.productDay,
                        planProductQuantity: item.planProductQuantity,
                        productPlanId: curitem.id
                      }

                    })

                    this.setNewState("batchSaveOrUpdate", postDatathis, () => {
                      this.setState({
                        visible: false
                      })
                      message.success("操作成功")
                      this.resetData()
                    })

                    console.log(shiftProductList)
                  }}
                  postDataz={{
                    pageIndex: 1,    //第几页
                    pageSize: 10,     //每页大小
                    equipmentNo: "",//编号
                    equipmentName: "",//设备名
                    positionNo: "",//位置编号
                    equipmentTypeId: "",//类型
                    shopId: curitem.shopId
                  }}
                  resetData={() => {
                    this.handleCancel()
                    this.resetData()
                  }}
                  curitem={{ shiftProductList: [] }}
                >

                </AllAdd> : null
          }



        </Drawer>



        <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearchc} postData={this.state.postDatax}></SearchBox>
        <SearchBox onRef={this.onRefx} handleSearch={this.handleSearchx} postData={this.state.postDatam}></SearchBox>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='月生产计划' extra={<div style={{ display: "flex" }}>
          <span style={{ cursor: "pointer" }} onClick={() => {
            this.setState({
              iftype: {
                name: "新增生产计划",
                value: "add"
              },
            }, () => {
              this.setState({
                visible: true
              })
            })
          }}>新增</span>
          <div style={{ display: curitem.id ? "flex" : "none", alignItems: "center" }}>
            <Divider type="vertical"></Divider>
            <span style={{ cursor: "pointer" }} onClick={() => {
              this.setNewState("getProductorsByShopIdDown", { shopId: curitem.shopId }, () => {
                this.setState({
                  iftype: {
                    name: "新增排产",
                    value: "addplan"
                  },
                }, () => {
                  this.setState({
                    visible: true,
                  })
                })
              })

            }}>新增排产</span>
            <Divider type="vertical"></Divider>

            <a onClick={() => {
              this.childs.changedData("queryByConditionPage", {
                pageIndex: 1,    //第几页
                pageSize: 10,     //每页大小
                manufactureContent: "",           // 产品规格
                ids: curitem.manufactureContentId,   // 已选择的主键
              }, 1, () => {
                this.setState({
                  postDatam: {
                    pageIndex: 1,    //第几页
                    pageSize: 10,     //每页大小
                    manufactureContent: "",           // 产品规格
                    ids: curitem.manufactureContentId,   // 已选择的主键
                  },
                  fields: {
                    orderNo: {
                      ...fields.orderNo,
                      value: curitem.orderNo,
                    },
                    manufactureContentId: {
                      ...fields.manufactureContentId,
                      value: curitem.manufactureContentId ? [curitem.manufactureContentId] : [],
                    },
                    planProductQuantity: {
                      ...fields.planProductQuantity,
                      value: curitem.planProductQuantity,
                    },
                    planProductLines: {
                      ...fields.planProductLines,
                      value: curitem.planProductLines,
                    },
                    productPlanDate: {
                      ...fields.productPlanDate,
                      value: curitem.productPlanDate ? moment(curitem.productPlanDate.split("~")[0]) : undefined,
                    },
                    planProductDays: {
                      ...fields.planProductDays,
                      value: curitem.planProductDays,
                    },
                    shopId: {
                      ...fields.shopId,
                      value: curitem.shopId,
                      hides: true
                    },


                  },
                }, () => {
                  this.setState({
                    fv: true,
                    iftype: {
                      name: "修改生产计划",
                      value: "edit"
                    },
                  })
                })
              })


            }}>修改</a>
            <Divider type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该生产计划？"}
              onConfirm={() => {
                this.setNewState("plandeleteById", { id: curitem.id }, () => {
                  let total = this.props.produce.planqueryList.total,
                    page = this.props.produce.planqueryList.pageNum;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    message.success("删除成功！");
                    this.resetData()
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </div>
          <Divider type='vertical' style={{ marginTop: 6 }}></Divider>
          <Abload reload={() => {
            this.resetData()
          }} postName="uploadproductPlan" filePath="http://www.plszems.com/download/生产计划导入模板.xlsx"></Abload>
          <Divider type='vertical' style={{ marginTop: 6 }}></Divider>
          <a onClick={() => {
            let post = JSON.parse(JSON.stringify(this.state.postData))
            delete post.pageIndex;
            delete post.pageSize

            this.setNewState("mdexportFileCheck", post, () => {
              message.loading("正在导出文件...")
              window.open(`/rs/productPlan/exportFile?${bodyparse(this.state.postData)}`)
            })
          }} target="_blank">
            导出生产计划
          </a>
        </div>
        }>
          <Table bordered size="middle"
            scroll={{ x: 1680, y: "59vh" }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            expandRowByClick
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: planqueryList.pageNum ? planqueryList.pageNum : 1,
              total: planqueryList.total ? parseInt(planqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={planqueryList.list ? planqueryList.list : []}
            expandedRowRender={record => renderAdd(record)}

          >
          </Table>

          <CreateForm
            tableUrl={iftype.value.indexOf("pc") != -1 ? [{
              url: "queryPageListPlus",
              post: this.state.postDataz
            }, {
              url: "getProductors",
              post: this.state.postDatax
            }] : [
                {
                  url: "queryByConditionPage",
                  post: this.state.postDatam
                }
              ]}/*配置页面表格数据*/
            width={1200}
            fields={this.state.fields}
            iftype={iftype}
            onRef={this.onRefs}
            onSelectChange={this.onSelectChange}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />


        </Card>
      </div>
    )
  }


}

export default Produce



