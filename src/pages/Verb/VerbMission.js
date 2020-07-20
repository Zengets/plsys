import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Skeleton,
  Dropdown, Menu
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'
import moment from 'moment'
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/verbmsqueryList'],
  submittings: loading.effects['verb/verbmsqueryById'],
}))
class VerbMission extends React.Component {

  constructor(props) {
    super(props);
    let isCurrentUserConfirm = props.location.query.isCurrentUserConfirm;
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        userId: {
          value: null,
          type: "select",
          title: "保养执行人",
          keys: "userId",
          requires: true,
          option: props.verb.userList.map((item) => {
            return {
              name: item.userName,
              id: item.userId
            }
          })
        }
      },
      /*初始化 main List */
      postData: isCurrentUserConfirm == "1" ? {
        "pageIndex": 1,
        "pageSize": 10,
        "companyId": "",
        "taskNo": "",       // 工单号
        "equipmentName": "",    // 设备名称
        "status": "",             // 状态   3：已执行，4：关闭
        "maintainPlanType": "",    // 保养类型
        "isCurrentUser": props.match.params.key,
        "startDate": "",
        "endDate": "",
        "poolMonth": "",
        isCurrentUserConfirm
      } : {
          "pageIndex": 1,
          "pageSize": 10,
          "taskNo": "",       // 工单号
          "equipmentName": "",    // 设备名称
          "status": "",             // 状态   3：已执行，4：关闭
          "maintainPlanType": "",    // 保养类型
          "startDate": "",
          "endDate": "",
          "poolMonth": "",
          "isCurrentUser": props.match.params.key,
        },
      postUrl: "verbmsqueryList",
      curitem: {}
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'verb/' + type,
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
    let { postUrl, postData } = this.state;
    this.setState({
      postData: {
        ...postData,
        companyId: this.props.location.query.companyId,
        poolMonth: this.props.location.query.poolMonth
      }
    }, () => {
      this.resetData()
    })
  }

  componentWillReceiveProps(np) {
    if (this.props.location !== np.location) {
      let { postUrl, postData } = this.state;
      this.setState({
        postData: {
          ...postData,
          companyId: np.location.query.companyId,
          poolMonth: np.location.query.poolMonth
        }
      }, () => {
        this.resetData()
      })
    }

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
    if (curitem.id) {
      curitem = this.props.verb[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        userId: {
          value: null,
          type: "select",
          title: "保养执行人",
          keys: "userId",
          requires: true,
          option: this.props.verb.userList.map((item) => {
            return {
              name: item.userName,
              id: item.userId
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
      if(values.planStartMaintainDate){
        values.planStartMaintainDate = moment(values.planStartMaintainDate).format("YYYY-MM-DD")
      }
      let postData = { ...values, id: curitem.id };
      this.setNewState("verbmsupdateMaintainUser", postData, () => {
        message.success("修改成功！");
        this.setState({ visibleform: false });
        this.resetData();
      });

    });
  }

  getOption(key) {
    let chartMap = this.props.verb.chartMap;

    if (key == "line") {
      let line = chartMap.totalBudgetChart ? chartMap.totalBudgetChart : [];
      return {
        title: {
          text: '设备保养费用(元)',
          subtext: '',
          x: '0'
        },
        xAxis: {
          type: 'category',
          data: line.map((item) => { return item.name })
        },
        yAxis: {
          type: 'value',
          name: '费用(元)',
          axisLabel: {
            formatter: '{value} 元'
          }
        },
        series: [{
          data: line.map((item) => { return item.value }),
          type: 'line',
          label: {
            normal: {
              formatter: '{c}元',
              show: true
            },
          },
          smooth: true
        }]
      };
    } else if (key == "pie") {
      let pie = chartMap.maintainPlanTypeChart ? chartMap.maintainPlanTypeChart : [];
      return {
        title: {
          text: '保养类型分布',
          subtext: '',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          y: 30,
          data: pie.map((item) => { return item.name })
        },
        series: [
          {
            name: '保养类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                formatter: '{b}: {c} ({d}%) ',
                show: true
              },
            },
            data: pie
          }
        ]
      };
    } else {
      let pie = chartMap.statusChart ? chartMap.statusChart : [];
      return {
        title: {
          text: '任务状态分布',
          subtext: '',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          y: 30,
          data: pie.map((item) => { return item.name })
        },
        series: [
          {
            name: '保养类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                formatter: '{b}: {c} ({d}%) ',
                show: true
              },
            },
            data: pie
          }
        ]
      };
    }

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


  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { verbmsqueryList, maintainPlanType, verbmsqueryById, actualItemList, userList, sparePartsConsumeList } = this.props.verb;
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
    }

    const columns = this.props.match.params.key == "1" ? [
      {
        title: '公司',
        dataIndex: 'companyName',
        key: 'companyName',
        ...getselectbox('companyId', this.props.verb.companyList && this.props.verb.companyList.map((item) => {
          return {
            dicName: item.companyName,
            dicKey: item.id
          }
        }))
      },
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ...getsearchbox('taskNo')
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName')
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo')
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox('positionNo')
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, render) => (<span style={{ color: text == 0 ? "#999" : text == 1 ? "#ff2100" : text == 2 ? "#398dcd" : text == 5 ? "green" : "transparent" }}>{text == 0 ? "待执行" : text == 1 ? "延期" : text == 2 ? "执行中" : text == 5 ? "会签中" : ""}</span>),
        ...getselectbox('status', [
          { dicKey: "0", dicName: "待执行" },
          { dicKey: "1", dicName: "延期" },
          { dicKey: "2", dicName: "执行中" },
          { dicKey: "5", dicName: "会签中" },
        ])
      },
      {
        title: '保养类型',
        dataIndex: 'maintainPlanTypeName',
        key: 'maintainPlanTypeName',
        ...getselectbox('maintainPlanType', maintainPlanType)
      },

      {
        title: '计划开始日期',
        dataIndex: 'planStartMaintainDate',
        key: 'planStartMaintainDate',
        ...getdaterangebox("startDate", "endDate")
      },
      {
        title: '开始时间',
        dataIndex: 'startMaintainTime',
        key: 'startMaintainTime',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          查看
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...this.state.postData,
                "pageIndex": 1,
                "companyId": "",
                "taskNo": "",       // 工单号
                "equipmentName": "",    // 设备名称
                "status": "",             // 状态   3：已执行，4：关闭
                "maintainPlanType": "",    // 保养类型
                "equipmentNo": "",
                "positionNo": ""
              }
            }, () => { this.resetData() })
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
              this.setState({
                visible: true,
                iftype: {
                  name: `查看工单：${record.taskNo}的详情`,
                  value: "tosee"
                }
              }, () => {
                this.setNewState("verbmsqueryById", { id: record.id })
              })
            }}>查看详情</a>
          </div>)

        }
      },
    ] : [
        {
          title: '公司',
          dataIndex: 'companyName',
          key: 'companyName',
          ...getselectbox('companyId', this.props.verb.companyList && this.props.verb.companyList.map((item) => {
            return {
              dicName: item.companyName,
              dicKey: item.id
            }
          }))
        },
        {
          title: '工单号',
          dataIndex: 'taskNo',
          key: 'taskNo',
          ...getsearchbox('taskNo')
        },
        {
          title: '设备名',
          dataIndex: 'equipmentName',
          key: 'equipmentName',
          ...getsearchbox('equipmentName')
        },
        {
          title: '设备编号',
          dataIndex: 'equipmentNo',
          key: 'equipmentNo',
          ...getsearchbox('equipmentNo')
        },
        {
          title: '设备位置号',
          dataIndex: 'positionNo',
          key: 'positionNo',
          ...getsearchbox('positionNo')
        },
        {
          title: '任务状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, render) => (<span style={{ color: text == 0 ? "#999" : text == 1 ? "#ff2100" : text == 2 ? "#398dcd" : text == 5 ? "green" : "transparent" }}>{text == 0 ? "待执行" : text == 1 ? "延期" : text == 2 ? "执行中" : text == 5 ? "会签中" : ""}</span>),
          ...getselectbox('status', [
            { dicKey: "0", dicName: "待执行" },
            { dicKey: "1", dicName: "延期" },
            { dicKey: "2", dicName: "执行中" },
            { dicKey: "5", dicName: "会签中" },
          ])
        },
        {
          title: '保养类型',
          dataIndex: 'maintainPlanTypeName',
          key: 'maintainPlanTypeName',
          ...getselectbox('maintainPlanType', maintainPlanType)
        },
        {
          title: '计划开始日期',
          dataIndex: 'planStartMaintainDate',
          key: 'planStartMaintainDate',
          ...getdaterangebox("startDate", "endDate")
        },
        {
          title: '开始时间',
          dataIndex: 'startMaintainTime',
          key: 'startMaintainTime',
        },
        {
          title: '执行人',
          dataIndex: 'planMaintainUserName',
          key: 'planMaintainUserName',
          ...getsearchbox("planMaintainUserName")
        },
        {
          title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            查看
          <a style={{ color: "#f50" }} onClick={() => {
              this.setState({
                postData: {
                  ...this.state.postData,
                  "pageIndex": 1,
                  "companyId": "",
                  "taskNo": "",       // 工单号
                  "equipmentName": "",    // 设备名称
                  "status": "",             // 状态   3：已执行，4：关闭
                  "maintainPlanType": "",    // 保养类型
                  "equipmentNo": "",
                  "positionNo": ""
                }
              }, () => { this.resetData() })
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
                this.setState({
                  visible: true,
                  iftype: {
                    name: `查看工单：${record.taskNo}的详情`,
                    value: "tosee"
                  }
                }, () => {
                  this.setNewState("verbmsqueryById", { id: record.id })
                })
              }}>查看详情</a>
            </div>)

          }
        },
      ]

    function disabledDate(current) {
      return current && current < moment().add("day", -1).endOf('day');
    }


    const menu = (curitem) => (
      <div>
        {
          curitem.status == 0 || curitem.status == 1 ?
            <a style={{ color: "#666", marginRight: 12 }} onClick={() => {
              this.setNewState("verbmsstartMaintain", { id: curitem.id }, () => {
                this.setState({
                  curitem
                }, () => {
                  this.resetData()
                })
                message.success(`工单：${curitem.taskNo}状态变更为执行中`)
              })
            }}>
              开始保养
            </a> :
            curitem.status == 2 ?
              <a style={{ color: "#f50", marginRight: 12 }} onClick={() => {
                this.setNewState("verbmsfinishMaintain", { id: curitem.id }, () => {
                  this.setState({
                    curitem
                  }, () => {
                    this.resetData()
                  })
                  message.success(`工单：${curitem.taskNo}状态变更为会签中`)
                })
              }}>
                完成保养
              </a> :
              curitem.status == 5 ?
                <a style={{ color: "#f50", marginRight: 12 }} onClick={() => {
                  this.setNewState("missionconfirm", {
                    id: curitem.id,
                    comfirmLevel: curitem.oneLevelConfirm == "1" ? 2 : 1
                  }, () => {
                    this.setState({
                      curitem
                    }, () => {
                      this.resetData()
                    })
                    message.success(curitem.oneLevelConfirm == "1" ? `工单：${curitem.taskNo}状态变更为已完成` : `工单：${curitem.taskNo}需要制造部负责人会签`)
                  })
                }}>
                  {curitem.oneLevelConfirm == "1" ? "制造部负责人" : "设备主管"}会签
              </a> :
                null
        }
        <a style={{ color: "#f50", marginRight: 12 }} onClick={() => {
          this.setNewState("verbmscloseMaintain", { id: curitem.id }, () => {
            this.setState({
              curitem
            }, () => {
              this.resetData()
            })
            message.success(`工单：${curitem.taskNo}状态变更为已关闭`)
          })
        }}>
          关闭保养
        </a>
        <a onClick={() => {
          this.setNewState("queryByEquipId", {
            chargeType: 1,
            equipmentId: curitem.equipimentId
          }, () => {
            if (this.props.verb.userList.length == 0) {
              message.warn("执行人列表为空，暂时无法修改")
              return
            }
            
            this.setState({
              curitem: curitem,
              fields: {
                planStartMaintainDate: {
                  value: moment(curitem.planStartMaintainDate),
                  type: "datepicker",
                  title: "计划开始日期",
                  keys: "planStartMaintainDate",
                  requires: false,
                  disabled: curitem.status !== 0,
                  disabledDate: disabledDate
                },
                userId: {
                  value: curitem.planMaintainUserId,
                  type: "select",
                  title: "保养执行人",
                  keys: "userId",
                  requires: true,
                  option: this.props.verb.userList.map((item) => {
                    return {
                      name: item.userName,
                      id: item.userId
                    }
                  })
                }
              },
            }, () => {
              this.setState({
                iftype: {
                  name: `修改工单：${curitem.taskNo}`,
                  value: "edit"
                }, fv: true
              })
            })
          })

        }}>
          修改
          </a>
      </div>
    );

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("verbmsqueryList", this.state.postData);
      })
    }
    let col = {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 8,
      xl: 5,
      xxl: 5
    }, cols = {
      xs: 24,
      sm: 24,
      md: 16,
      lg: 16,
      xl: 4,
      xxl: 4
    }, coles = {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
      xxl: 12
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={this.props.match.params.key == "1" ? "我的未完成保养列表" : '未完成保养列表'} extra={
          <div>
            {
              this.state.curitem.id &&
              <div style={{ display: "flex", alignItems: "center" }}>
                {
                  menu(curitem)
                }
              </div>
            }
          </div>
        }>
          <Table
            bordered
            size="middle"
            scroll={{ x: 1200, y: "59vh" }}
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
              current: verbmsqueryList.pageNum ? verbmsqueryList.pageNum : 1,
              total: verbmsqueryList.total ? parseInt(verbmsqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={verbmsqueryList.list ? verbmsqueryList.list : []}
          >
          </Table>

          <Row gutter={24}>
            <Skeleton active loading={this.props.submitting}>
              <Col span={12} style={{ borderRight: "#F0F0F0 solid 1px", padding: 12 }}>
                <ReactEcharts option={this.getOption("pie")}></ReactEcharts>
              </Col>
              <Col span={12} style={{ padding: 12 }}>
                <ReactEcharts option={this.getOption("")}></ReactEcharts>
              </Col>
              <Col span={24} style={{ borderTop: "#F0F0F0 solid 1px", paddingTop: 12 }}>
                <ReactEcharts option={this.getOption("line")}></ReactEcharts>
              </Col>
            </Skeleton>
          </Row>

          <CreateForm
            fields={fields}
            data={{}}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />

          <Modal
            style={{ maxWidth: "90%", top: 20 }}
            width={1000}
            visible={this.state.visible}
            title={iftype.name}
            onCancel={() => {
              this.setState({
                visible: false
              })
            }}
            footer={null}
          >
            <div className={styles.limitdivs}>
              <Row gutter={24}>
                <Col span={24}>
                  <Skeleton loading={this.props.submittings} active>
                    <Card title="会签信息">
                      <p><span>设备主管会签：</span><a>{verbmsqueryById.oneLevelConfirmUserName}</a> <i style={{ textIndent: 4, fontSize: 12, display: "inline-block" }}>{verbmsqueryById.oneLevelConfirmTime}</i></p>
                    </Card>
                  </Skeleton>
                </Col>
                <Col span={24} style={{ marginTop: 24 }}>
                  <Skeleton loading={this.props.submittings} active>
                    <Card title="基本信息">
                      <Row>
                        <Col {...coles}>
                          <p><span>工单号：</span><span>{verbmsqueryById.taskNo}</span></p>
                        </Col>

                        <Col {...coles}>
                          <p><span>设备编号：</span><span>{verbmsqueryById.equipmentNo}</span></p>
                        </Col>

                        <Col {...coles}>
                          <p><span>设备名称：</span><span>{verbmsqueryById.equipmentName}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>保养类型：</span><span>{verbmsqueryById.maintainPlanTypeName}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>计划开始时间：</span><span>{verbmsqueryById.planStartMaintainDate}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>保养时长：</span><span>{verbmsqueryById.maintainHours}小时</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>任务状态：</span><span style={{ color: verbmsqueryById.status == 0 ? "#999" : verbmsqueryById.status == 1 ? "#ff2100" : verbmsqueryById.status == 2 ? "#398dcd" : "transparent" }}>{verbmsqueryById.status == 0 ? "待执行" : verbmsqueryById.status == 1 ? "延期" : verbmsqueryById.status == 2 ? "执行中" : "transparent"}</span></p>
                        </Col>
                      </Row>
                    </Card>
                  </Skeleton>
                </Col>
                <Col span={24} style={{ marginTop: 24 }}>
                  <Card title="保养内容">
                    <Skeleton loading={this.props.submittings} active>
                      <Table bordered size="middle"
                        rowKey="maintainItem"
                        dataSource={actualItemList}
                        columns={[
                          {
                            title: '保养项目',
                            dataIndex: 'maintainItem',
                            key: 'maintainItem',
                            width: 160,
                            render: (text) => (<span style={{ color: "#ff5000" }}>{text}</span>)
                          },
                          {
                            title: '保养内容',
                            dataIndex: 'maintainContent',
                            key: 'maintainContent',
                          },
                          {
                            title: '保养费用(元)',
                            dataIndex: 'actualMaintainCost',
                            key: 'actualMaintainCost',
                            width: 100,
                            render: (text) => (<a>{text}元</a>)
                          },
                        ]}
                      ></Table>
                    </Skeleton>
                  </Card>
                </Col>
                <Col span={24} style={{ marginTop: 24 }}>
                  <Skeleton loading={this.props.submittings} active>
                    <Card title="实际执行信息">
                      <Row>
                        <Col {...coles}>
                          <p><span>执行人：</span><span>{verbmsqueryById.planMaintainUserName}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>实际开始时间：</span><span>{verbmsqueryById.startMaintainTime}</span></p>
                        </Col>
                        <Col >
                          <p><span>保养费用(元)：</span><span>{verbmsqueryById.totalMaintainCost}元</span></p>
                        </Col>
                        <Col>
                          <p><span style={{ color: "#000" }}>消耗的配件列表：</span><span></span></p>
                          <Table bordered dataSource={sparePartsConsumeList ? sparePartsConsumeList : []} columns={[
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
                              title: '配件类型名称',
                              dataIndex: 'sparePartsTypeName',
                              key: 'sparePartsTypeName',
                            },
                            {
                              title: '使用数量',
                              dataIndex: 'consumeCount',
                              key: 'consumeCount',
                              render: (text) => <span>{text}个</span>
                            },
                          ]} />
                        </Col>
                      </Row>
                    </Card>
                  </Skeleton>
                </Col>

              </Row>
            </div>
          </Modal>

        </Card>
      </div>
    )
  }


}

export default VerbMission



