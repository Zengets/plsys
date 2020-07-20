import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment'
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'
import Link from 'umi/link';
import router from 'umi/router';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ repair, loading }) => ({
  repair,
  submitting: loading.effects['repair/repairqueryList'],
}))
class RepairList extends React.Component {

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
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        repairUserId: {
          value: null,
          type: "select",
          title: "当班维修工",
          keys: "repairUserId",
          requires: true,
          option: this.props.repair.queryAllRepair.map((item) => {
            return {
              name: item.userName,
              id: item.id
            }
          })
        }
      },
      /*初始化 main List */
      postData: {
        "pageIndex": 1,
        "pageSize": 10,
        "faultType": "",              //(int)故障名称
        "repairType": "",             //(int)维修类型
        "repairUserName": "",        //(String)维修人姓名
        "startTime": "",     //(String)开始时间
        "endTime": "",        //(String)结束时间
        "isCurrentUser": props.match.params.key,
        "isCurrentUserAudit": props.location.query.isCurrentUserAudit
      },
      postDataz: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        equipmentNo: "",//编号
        equipmentName: "",//设备名
        positionNo: "",//位置编号
        equipmentTypeId: "",//类型
      },
      postUrl: "repairqueryList",
      curitem: {}





    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'repair/' + type,
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
  }

  componentDidMount() {
    this.resetData()
    this.setNewState('deviceTypequeryTreeList', null);
  }

  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };
    this.setState({
      fields
    })
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
    this.setState({
      fv: false,
      fields: {
        repairUserId: {
          value: null,
          type: "select",
          title: "当班维修工",
          keys: "repairUserId",
          requires: true,
          option: this.props.repair.queryAllRepair.map((item) => {
            return {
              name: item.userName,
              id: item.id
            }
          })
        }
      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("rslmodifyRepairUser", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else {
        router.push(`/yxt/devices/devicetzlists/devicerepair/${values.equipmentIds}/${curitem.equipmentName}`)

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

  onRef = (ref) => {
    this.child = ref;
  }

  handleSearchz = (selectedKeys, dataIndex) => {
    let postUrl = "queryApplyReapairList"
    this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDataz)
    });
  };

  onRefs = (ref) => {
    this.childs = ref;
  }

  onRefz = (ref) => {
    this.childz = ref;
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { repairqueryList, repairTypeList, faultTypeList, chart, rslgetRepairDetail, dataList, confirmDetails, deviceTypequeryTreeList, repairStatusList,shopList } = this.props.repair;


    let getOption = (key) => {
      let res, allData = chart[key];
      switch (key) {
        case "repairTypeChart":
          res = {
            title: {
              text: '维修类型分布图',
              subtext: '',
              x: 0,
              textStyle: {
                fontSize: 16,
                fontWeight: "noraml",
                color: "#f50"
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}个 ({d}%)"
            },
            series: [
              {
                name: '维修类型',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                radius: ['20%', '40%'],
                data: allData,
                label: {
                  normal: {
                    formatter: '{b}: {c}个 ({d}%) ',
                    show: true
                  },
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };

          break;
        case "faultTypeChart":
          res = {
            title: {
              text: '故障类型分布图',
              subtext: '',
              x: 0,
              textStyle: {
                fontSize: 16,
                fontWeight: "noraml",
                color: "#f50"
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}个 ({d}%)"
            },
            series: [
              {
                name: '维修类型',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                radius: ['20%', '40%'],
                data: allData,
                label: {
                  normal: {
                    formatter: '{b}: {c}个 ({d}%) ',
                    show: true
                  },
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };

          break;

        case "repairCountChart":
          let xData = allData.map((item, i) => {
            return item.name
          }),
            yData = allData.map((item, i) => {
              return item.value
            })

          res = {
            title: {
              text: `维修工维修数量统计`,
              subtext: '',
              x: '0',
              textStyle: {
                fontSize: 16,
                fontWeight: "noraml",
                color: "#f50"
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            dataZoom: [{
              type: 'inside'
            }, {
              type: 'slider'
            }],
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: false }
              }
            },
            legend: {
              data: ["维修数量"],
              left: "center",
            },
            xAxis: [
              {
                type: 'category',
                data: xData,
                axisPointer: {
                  type: 'shadow'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: "维修数量",
                axisLabel: {
                  formatter: '{value} 台'
                }
              }
            ],
            series: [
              {
                name: "维修数量",
                type: 'bar',
                data: yData,
                label: {
                  normal: {
                    formatter: '{c} 台',
                    show: true
                  },
                },
              }
            ]
          }
          break;

      }

      return res

    }

    let getsearchbox = (key) => {
      if (this.child) {
        return this.child.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option) => {
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
    };

    const columns = this.props.match.params.key == "1" ? [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ...getsearchbox("taskNo")
      },
      {
        title: '故障时间',
        dataIndex: 'faultTime',
        key: 'faultTime',
        ...getdaterangebox("startTime", "endTime")
      },
      {
        title: '报修人',
        dataIndex: 'applyRepairUserName',
        key: 'applyRepairUserName',
      },
      {
        title: '班次',
        dataIndex: 'shiftName',
        key: 'shiftName',
      },
      {
        title: '确认人',
        dataIndex: 'confirmUserName',
        key: 'confirmUserName',
      },
      {
        title: '故障名称',
        dataIndex: 'faultTypeName',
        key: 'faultTypeName',
        render: (text, record) => {
          return (<span>{text}</span>)
        },
        ...getsearchbox("faultTypeName")
      },
      {
        title: '故障级别',
        dataIndex: 'faultLevelName',
        key: 'faultLevelName',
        render: (text) => <span>{text}</span>
      },
      {
        title: '维修类型',
        width: 110,
        dataIndex: 'repairTypeName',
        key: 'repairTypeName',
        ...getselectbox('repairType', repairTypeList)
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox("equipmentNo")
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox("positionNo")
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox("shopId", shopList&&shopList.map((item)=>{
          return {
            dicName:item.shopName,
            dicKey:item.id
          }
        })),
      },
      {
        title: '维修状态',
        dataIndex: 'statusName',
        key: 'statusName',
        ...getselectbox("status", repairStatusList),
        render: (text) => <span style={{ color: text == "待维修" ? "#666" : text == "维修中" ? "green" : text == "待验证" ? "#f50" : "#000" }}>{text}</span>,
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          查看
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "faultType": "",              //(int)故障名称
                "repairType": "",             //(int)维修类型
                "repairUserName": "",        //(String)维修人姓名
                "startTime": "",     //(String)开始时间
                "endTime": "",        //(String)结束时间
                "status": "",
                "shopId":""
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
        </a>
        </span>,
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (<div>
            <a onClick={() => {
              this.setNewState("rslgetRepairDetail", { id: record.id }, () => {
                this.setState({
                  visible: true,
                  iftype: {
                    name: `查看工单：${record.taskNo}的详情`,
                    value: "tosee"
                  }
                })
              })
            }}>查看详情</a>
          </div>)
        }
      },


    ] : [
        {
          title: '工单号',
          dataIndex: 'taskNo',
          key: 'taskNo',
          ...getsearchbox("taskNo")

        },
        {
          title: '故障时间',
          dataIndex: 'faultTime',
          key: 'faultTime',
          ...getdaterangebox("startTime", "endTime")
        },
        {
          title: '报修人',
          dataIndex: 'applyRepairUserName',
          key: 'applyRepairUserName',
        },
        {
          title: '班次',
          dataIndex: 'shiftName',
          key: 'shiftName',
        },
        {
          title: '维修人',
          dataIndex: 'repairUserName',
          key: 'repairUserName',
          ...getsearchbox('repairUserName')
        },
        {
          title: '确认人',
          dataIndex: 'confirmUserName',
          key: 'confirmUserName',
        },
        {
          title: '故障名称',
          dataIndex: 'faultTypeName',
          key: 'faultTypeName',
          render: (text, record) => {
            return (<span>{text}</span>)
          },
          ...getsearchbox("faultTypeName")
        },
        {
          title: '故障级别',
          dataIndex: 'faultLevelName',
          key: 'faultLevelName',
          render: (text) => <span>{text}</span>
        },
        {
          title: '维修类型',
          width: 110,
          dataIndex: 'repairTypeName',
          key: 'repairTypeName',
          ...getselectbox('repairType', repairTypeList)
        },
        {
          title: '设备编号',
          dataIndex: 'equipmentNo',
          key: 'equipmentNo',
          ...getsearchbox("equipmentNo")
        },
        {
          title: '设备位置号',
          dataIndex: 'positionNo',
          key: 'positionNo',
          ...getsearchbox("positionNo")
        },
        {
          title: '设备名',
          dataIndex: 'equipmentName',
          key: 'equipmentName',
        },
        {
          title: '设备型号',
          dataIndex: 'equipmentModel',
          key: 'equipmentModel',
        },
        {
          title: '产品线',
          dataIndex: 'shopName',
          key: 'shopName',
          ...getselectbox("shopId", shopList&&shopList.map((item)=>{
            return {
              dicName:item.shopName,
              dicKey:item.id
            }
          })),
        },
        {
          title: '维修状态',
          dataIndex: 'statusName',
          key: 'statusName',
          ...getselectbox("status", repairStatusList),
          render: (text) => <span style={{ color: text == "待维修" ? "#666" : text == "维修中" ? "green" : text == "待验证" ? "#f50" : "#000" }}>{text}</span>
        },
        {
          title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            查看
        <a style={{ color: "#f50" }} onClick={() => {
              this.setState({
                postData: {
                  ...postData,
                  "faultType": "",              //(int)故障名称
                  "repairType": "",             //(int)维修类型
                  "repairUserName": "",        //(String)维修人姓名
                  "startTime": "",     //(String)开始时间
                  "endTime": "",
                  "shopId":""
                }
              }, () => {
                this.resetData()
              })
            }}>
              <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
              重置
        </a>
          </span>,
          dataIndex: 'action',
          key: 'action',
          render: (text, record) => {
            return (<div>
              <a onClick={() => {
                this.setNewState("rslgetRepairDetail", { id: record.id }, () => {
                  this.setState({
                    visible: true,
                    iftype: {
                      name: `查看工单：${record.taskNo}的详情`,
                      value: "tosee"
                    }
                  })
                })
              }}>查看详情</a>
            </div>)
          }
        },


      ]

    const columnes = [
      {
        title: '配件料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
      },
      {
        title: '配件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '配件类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '使用数量',
        dataIndex: 'consumeCount',
        key: 'consumeCount',
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("repairqueryList", this.state.postData);
      })
    }, col = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 20,
      xl: 20,
      xxl: 20
    }, cols = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 4,
      xl: 4,
      xxl: 4
    }, coler = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 8
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

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

    return (
      <div>
        <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={this.props.match.params.key == "1" ? "我的待维修列表" : this.props.location.query.isCurrentUserAudit == "1" ? "我的撤回审批" : '故障报修列表'} extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                fields: {
                  equipmentIds: {
                    value: undefined,
                    type: "table",
                    title: "选择设备",
                    keys: "equipmentIds",
                    requires: true,
                    columns: this.columns,
                    dataSource: "queryApplyReapairList",
                    checktype: "radio",//单选or多选
                    hides: false,
                    dv: "id",//key
                    lb: "equipmentName"//value
                  },
                },
                fv: true,
                iftype: {
                  name: `设备维修处理`,
                  value: "device"
                }
              })
            }}>
              报修
            </a>
            <span style={{ display: curitem.id ? "flex" : "none" }}>
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <Link style={{ color: "#f50" }} to={`/yxt/devices/devicetzlists/devicerepair/${curitem.equipmentId}/${curitem.equipmentName}`}>
                维修
              </Link>
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <a onClick={() => {
                let record = this.state.curitem;
                this.setNewState("queryAllRepair", { id: record.equipmentId, startTime: record.faultTime }, () => {
                  let alloption = this.props.repair.queryAllRepair.map((item) => {
                    return {
                      name: item.userName,
                      id: item.id
                    }
                  }), allname = this.props.repair.queryAllRepair.map((item) => {
                    return item.userName
                  })
                  if (allname.indexOf(record.repairUserName) == -1 && record.repairUserName) {
                    alloption.push({
                      name: record.repairUserName,
                      id: record.repairUserId
                    })
                  }
                  this.setState({
                    fields: {
                      repairUserId: {
                        value: record.repairUserId ? record.repairUserId : null,
                        type: "select",
                        title: "当班维修工",
                        keys: "repairUserId",
                        requires: true,
                        option: alloption
                      }
                    },
                    curitem: record,
                    fv: true,
                    iftype: {
                      name: `修改工单：${record.taskNo}的当班维修工`,
                      value: "edit"
                    }
                  })
                })
              }}>修改维修人</a>

            </span>

          </div>

        }>
          <Table bordered size="middle"
            scroll={{ x: 1760, y: "59vh" }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: repairqueryList.pageNum ? repairqueryList.pageNum : 1,
              total: repairqueryList.total ? parseInt(repairqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={repairqueryList.list ? repairqueryList.list : []}
          >
          </Table>

          <Row gutter={24}>
            <Col span={12}>
              {
                chart.repairTypeChart ?
                  <ReactEcharts option={getOption("repairTypeChart")}></ReactEcharts> :
                  <Empty style={{ margin: "12px 0px" }} description={
                    <span>
                      维修类型统计表 - 暂无数据
                    </span>
                  } />
              }
            </Col>
            {/* <Col span={12}>
              {
                chart.faultTypeChart ?
                  <ReactEcharts option={getOption("faultTypeChart")}></ReactEcharts> :
                  <Empty style={{ margin: "12px 0px" }} description={
                    <span>
                      故障类型统计表 - 暂无数据
                    </span>
                  } />
              }
            </Col> */}
            {/*<Col span={24}>
              {
                chart.repairCountChart ?
                  <ReactEcharts option={getOption("repairCountChart")}></ReactEcharts> :
                  <Empty style={{ margin: "12px 0px" }} description={
                    <span>
                      维修工维修数量统计 - 暂无数据
                    </span>
                  } />
              }</Col> */}
          </Row>
          <Modal
            style={{ top: 30, maxWidth: "90%" }}
            width={1000}
            visible={this.state.visible}
            title={iftype.name}
            onCancel={() => { this.setState({ visible: false }) }}
            footer={null}
          >
            <Card style={{ marginBottom: 12 }} title='设备信息'>
              <div className={styles.limitdiv} style={{ position: "relative" }}>
                <img className={this.state.visible && rslgetRepairDetail.status == "4" ? styles.readed : styles.read} src="./images/readed.png" alt="" />
                <Row gutter={24}>
                  <Col {...coler}>
                    <p>
                      <span>
                        设备编号：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.equipmentNo
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p style={{ marginBottom: 0 }}>
                      <span>
                        设备位置号：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.positionNo
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        设备名：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.equipmentName
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        设备型号：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.equipmentModel
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        产品线：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.shopName
                        }
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>
            </Card>

            <Card style={{ marginBottom: 12 }} title="报修信息">
              <div className={styles.limitdiv}>
                <Row gutter={24}>
                  <Col {...col}>
                    <Row gutter={0}>
                      <Col {...coler}>
                        <p>
                          <span>
                            报修人：
                      </span>
                          <span>
                            {
                              rslgetRepairDetail.applyRepairUserName
                            }
                          </span>
                        </p>
                      </Col>
                      <Col {...coler}>
                        <p>
                          <span>
                            班次：
                      </span>
                          <span>
                            {
                              rslgetRepairDetail.shiftName
                            }
                          </span>
                        </p>
                      </Col>
                      <Col {...coler}>
                        <p>
                          <span>
                            报修时间：
                      </span>
                          <span>
                            {
                              rslgetRepairDetail.applyRepairTime
                            }
                          </span>
                        </p>
                      </Col>
                      <Col {...coler}>
                        <p>
                          <span>
                            报修类型：
                        </span>
                          <span>
                            {
                              rslgetRepairDetail.applyTypeName
                            }
                          </span>
                        </p>
                      </Col>
                      <Col {...coler}>
                        <p>
                          <span>
                            报修现象：
                        </span>
                          <span>
                            {
                              rslgetRepairDetail.applyPhenomenonName
                            }
                          </span>
                        </p>
                      </Col>
                      <Col span={24}>
                        <p>
                          <span>
                            故障描述：
                        </span>
                          <span>
                            {
                              rslgetRepairDetail.faultDesc
                            }
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col {...cols}>
                    <p>
                      <span>
                        故障图片：
                    </span>
                      <span>
                        <img onClick={() => {
                          Modal.info({
                            maskClosable: true,
                            title: `预览`,
                            okText: "关闭",
                            content: (
                              <div style={{ width: "100%" }}>
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={rslgetRepairDetail.faultPicUrl ? rslgetRepairDetail.faultPicUrl : "./images/default.png"} onError={(e) => { e.target.src = './images/default.png' }} />
                              </div>
                            ),

                          });

                        }} style={{ width: 120, height: 120, cursor: "pointer" }} src={rslgetRepairDetail.faultPicUrl ? rslgetRepairDetail.faultPicUrl : "./images/default.png"} onError={(e) => { e.target.src = './images/default.png' }} />
                      </span>
                    </p>

                  </Col>
                </Row>
              </div>
            </Card>

            <Card style={{ marginBottom: 12 }} title='故障信息'>
              <div className={styles.limitdiv}>
                <Row gutter={24}>
                  <Col {...coler}>
                    <p>
                      <span>
                        故障类型：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultClassifyName
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        故障名称：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultTypeName
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        故障现象：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultPhenomenon
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        故障等级：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultLevelName
                        }
                      </span>
                    </p>
                  </Col>

                  <Col {...coler}>
                    <p>
                      <span>
                        故障时间：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultTime
                        }
                      </span>
                    </p>
                  </Col>
                  <Col span={24}>
                    <p>
                      <span>
                        故障原因：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultReasonName
                        }
                      </span>
                    </p>
                  </Col>

                </Row>
              </div>
            </Card>

            <Card style={{ marginBottom: 12 }} title='维修信息'>
              <div className={styles.limitdiv}>
                <Row gutter={24}>
                  <Col {...coler}>
                    <p>
                      <span>
                        维修人：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.repairUserName
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        维修状态：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.statusName
                        }
                      </span>
                    </p>
                  </Col>

                  <Col {...coler}>
                    <p>
                      <span>
                        维修类型：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.repairTypeName
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        是否停机维修：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.repairIsPowerOff == "0" ? "不停机" : "停机"
                        }
                      </span>
                    </p>
                  </Col>

                  <Col {...coler}>
                    <p>
                      <span>
                        维修开始时间：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.repairStartTime
                        }
                      </span>
                    </p>
                  </Col>

                  <Col {...coler}>
                    <p>
                      <span>
                        维修结束时间：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.repairEndTime
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        工具箱确认：
                      </span>
                      <span>{rslgetRepairDetail.repairUserConfirmBox == "0" ? "不通过" : rslgetRepairDetail.repairUserConfirmBox == "1" ? "通过" : ""}</span>
                    </p>
                  </Col>

                  <Col span={24}>
                    <p>
                      <span>
                        维修内容：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.repairContent
                        }
                      </span>
                    </p>
                  </Col>

                  <Col span={24}>
                    <p>
                      消耗的配件列表：
                    </p>
                    <Table bordered size="middle" dataSource={dataList} columns={columnes}>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Card>

            <Card style={{ marginBottom: 12 }} title='验证信息' >
              <div className={styles.limitdiv}>
                <Row gutter={24}>
                  <Table bordered dataSource={confirmDetails}
                    pagination={false}
                    columns={[
                      {
                        title: '验证人姓名',
                        dataIndex: 'confirmUserName',
                        key: 'confirmUserName',
                      },
                      {
                        title: '状态',
                        dataIndex: 'statusName',
                        key: 'statusName',
                      },
                      {
                        title: '验证时间',
                        dataIndex: 'confirmTime',
                        key: 'confirmTime',
                      },
                      {
                        title: '验证结果',
                        dataIndex: 'confirmResult',
                        key: 'confirmResult',
                      },
                      {
                        title: '5S验证/品质验证',
                        dataIndex: 'confirmRoleType',
                        key: 'confirmRoleType',
                        render: (text, record) => <span>{
                          text == "1" ?
                            record.applyRepairUser5sConfirm == "0" ? "5S验证 不通过" : record.applyRepairUser5sConfirm == "1" ? "5S验证 通过" : ""
                            :
                            record.pqcQualityConfirm == "0" ? "品质验证 不通过" : record.pqcQualityConfirm == "1" ? "品质验证 通过" : ""}</span>
                      },
                      {
                        title: '描述',
                        dataIndex: 'confirmDesc',
                        key: 'confirmDesc',
                      },
                    ]}>
                  </Table>
                </Row>
              </div>
            </Card>



          </Modal>

          <CreateForm
            width={iftype.value == "device" ? 1000 : 600}
            tableUrl={[{
              url: "queryApplyReapairList",
              post: this.state.postDataz
            }]}/*配置页面表格数据*/
            fields={fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onRef={this.onRefs}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            onSelectChange={this.onSelectChange}
          />

        </Card>
      </div>
    )
  }


}

export default RepairList



