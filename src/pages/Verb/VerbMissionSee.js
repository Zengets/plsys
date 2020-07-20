import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Skeleton
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'
import AbViewer from '@/components/AbViewer';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/verbtoqueryList'],
  submittings: loading.effects['verb/verbtoqueryById'],
}))
class VerbMissionSee extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        "companyId": "",
        "taskNo": "",       // 工单号
        "equipmentName": "",    // 设备名称
        "status": "",             // 状态   3：已执行，4：关闭
        "maintainPlanType": "",    // 保养类型
        "isCurrentUser": props.match.params.key,
        "startDate": "",
        "endDate": "",
        "poolMonth": "",

      },
      postUrl: "verbtoqueryList",
      curitem: {},
      vs: false
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
    })
  }

  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
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
    } else {
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
    let { postData, postUrl, iftype, curitem, vs } = this.state,
      { verbtoqueryList, maintainPlanType, verbtoqueryById, actualItemList, sparePartsConsumeList } = this.props.verb;
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
    }

    const columns = [
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
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, render) => (<span style={{ color: text == 3 ? "#398dcd" : text == 4 ? "#ff5000" : "transparent" }}>{text == 3 ? "已执行" : text == 4 ? "关闭" : ""}</span>),
        ...getselectbox('status', [
          { dicKey: "3", dicName: "已执行" },
          { dicKey: "4", dicName: "关闭" },
        ], "label", "value")
      },
      {
        title: '保养类型',
        dataIndex: 'maintainPlanTypeName',
        key: 'maintainPlanTypeName',
        ...getselectbox('maintainPlanType', maintainPlanType)
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
        title: '计划开始日期',
        dataIndex: 'startMaintainDate',
        key: 'startMaintainDate',
        ...getdaterangebox("startDate", "endDate")
      },
      {
        title: '开始时间',
        dataIndex: 'startMaintainTime',
        key: 'startMaintainTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endMaintainTime',
        key: 'endMaintainTime',
      },
      {
        title: '执行人',
        dataIndex: 'maintainUserName',
        key: 'maintainUserName',
        ...getsearchbox("maintainUserName")
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          查看
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...this.state.postData,
                pageIndex: 1,
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
                this.setNewState("verbtoqueryById", { id: record.id })
              })
            }}>查看详情</a>
          </div>)

        }
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("verbtoqueryList", this.state.postData);
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
      xs: 24,
      sm: 24,
      md: 24,
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
        <AbViewer
          title="打印"
          visible={vs}
          onClose={() => {
            this.setState({
              vs: false
            })
          }}
          type="docx"
          file={`/rs/equipmentMaintainBillExecute/export?id=${curitem.id}`}
        ></AbViewer>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='已完成保养任务列表' extra={
          <span>
            <a target="_blank" href={`/rs/equipmentMaintainBillExecute/exportFile?${bodyparse(this.state.postData)}`}>导出保养列表</a>
            <Divider style={{ display: curitem.id ? "inline-block" : "none" }} type='vertical' />
            <a style={{ display: curitem.id ? "inline-block" : "none" }} onClick={() => {
              this.setState({
                vs: true
              })
            }}>打印</a>
            <Divider style={{ display: curitem.id ? "inline-block" : "none" }} type='vertical' />
            <a onClick={() => {
              message.loading("正在导出文件...")
            }} style={{ display: curitem.id ? "inline-block" : "none" }} href={`/rs/equipmentMaintainBillExecute/export?id=${curitem.id}`} target="_blank">
              导出保养单详情
          </a>
          </span>

        }>
          <Table bordered size="middle" scroll={{ x: 1600, y: "59vh" }}
            loading={this.props.submitting}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: verbtoqueryList.pageNum ? verbtoqueryList.pageNum : 1,
              total: verbtoqueryList.total ? parseInt(verbtoqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={verbtoqueryList.list ? verbtoqueryList.list : []}
          >
          </Table>
          <Row gutter={24} style={{ marginTop: 20, paddingTop: 20, backgroundColor: "#f0f0f0" }}>
            <Skeleton active loading={this.props.submitting}>
              <Col span={12}>
                <ReactEcharts option={this.getOption("bar")}></ReactEcharts>
              </Col>
              <Col span={12}>
                <ReactEcharts option={this.getOption("line")}></ReactEcharts>
              </Col>
            </Skeleton>
          </Row>

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
                <Col span={24} style={{ marginBottom: 24, position: "relative" }}>
                  <Card title="会签信息">
                    <p><span>设备主管会签：</span><a>{verbtoqueryById.oneLevelConfirmUserName}</a> <i style={{ textIndent: 4, fontSize: 12, display: "inline-block" }}>{verbtoqueryById.oneLevelConfirmTime}</i></p>
                    <p><span>制造部负责人会签：</span><a>{verbtoqueryById.twoLevelConfirmUserName}</a> <i style={{ textIndent: 4, fontSize: 12, display: "inline-block" }}>{verbtoqueryById.twoLevelConfirmTime}</i></p>
                  </Card>
                  <img className={this.state.visible && verbtoqueryById.status == "3" ? styles.readed : styles.read} src="./images/readed.png" alt="" />
                </Col>
                <Col span={24}>
                  <Skeleton loading={this.props.submittings} active>
                    <Card title="基本信息">
                      <Row>
                        <Col {...coles}>
                          <p><span>工单号：</span><span>{verbtoqueryById.taskNo}</span></p>
                        </Col>

                        <Col {...coles}>
                          <p><span>设备编号：</span><span>{verbtoqueryById.equipmentNo}</span></p>
                        </Col>

                        <Col {...coles}>
                          <p><span>设备名称：</span><span>{verbtoqueryById.equipmentName}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>保养类型：</span><span>{verbtoqueryById.maintainPlanTypeName}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>计划开始时间：</span><span>{verbtoqueryById.startMaintainDate}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>预计完成时间：</span><span>{verbtoqueryById.endMaintainDate}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>保养时长：</span><span>{verbtoqueryById.maintainHours}小时</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>任务状态：</span><span style={{ color: verbtoqueryById.status == 3 ? "#398dcd" : verbtoqueryById.status == 4 ? "#ff5000" : "transparent" }}>{verbtoqueryById.status == 3 ? "已执行" : verbtoqueryById.status == 4 ? "关闭" : ""}</span></p>
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
                        pagination={{
                          showTotal: total => `共${total}条`, // 分页
                          size: "small",
                          pageSize: 4,
                        }}
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
                          <p><span>执行人：</span><span>{verbtoqueryById.maintainUserName}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>实际开始时间：</span><span>{verbtoqueryById.startMaintainTime}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>实际完成时间：</span><span>{verbtoqueryById.endMaintainTime}</span></p>
                        </Col>
                        <Col {...coles}>
                          <p><span>保养费用(元)：</span><span>{verbtoqueryById.totalMaintainCost}元</span></p>
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
                          ]} /></Col>

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

export default VerbMissionSee



