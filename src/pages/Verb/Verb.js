import {
  Table, Popconfirm, Form, Divider, Modal, Button, Row, Col, Icon, Select, message, Card, Tag
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import moment from 'moment'
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const { Option } = Select;


@connect(({ verb, menu, loading }) => ({
  verb,
  menu,
  submitting: loading.effects['verb/queryOfMonth'],
  jkqueryList: loading.effects['verb/jkqueryList'],
}))
class Verb extends React.Component {

  constructor(props) {
    super(props);
    function getType() {
      if (props.menu.curMenu.indexOf("lista") != -1) {
        return "0"
      } else if (props.menu.curMenu.indexOf("listb") != -1) {
        return "1"
      } else if (props.menu.curMenu.indexOf("listc") != -1) {
        return "2"
      } else if (props.menu.curMenu.indexOf("listd") != -1) {
        return "3"
      } else if (props.menu.curMenu.indexOf("liste") != -1) {
        return "4"
      } else if (props.menu.curMenu.indexOf("listf") != -1) {
        return "5"
      }
    }

    this.state = {
      /*初始化 main List */
      expandedRowKeys:[],
      cur: "current",
      postData: {
        pageIndex: 1,
        pageSize: 10,
        type: "current", //next：下个月。last：上个月。current：当前月
        taskNo: "",
        equipmentNo: "",
        maintainPlanType: getType(),
        status: "",
      },
      postUrl: "queryOfMonth",
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
    this.setNewState(postUrl, postData)
  }

  componentDidMount() {
    this.resetData()
  }



  //search box  
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


  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
      curitem: record
    }, () => {
      this.setNewState("jkqueryList", {
        billToExecuteId: record.id,
      })
    })
  }

  render() {
    let { postData, postUrl, curitem, cur,expandedRowKeys } = this.state,
      { queryOfMonth, maintainPlanType,jkqueryList } = this.props.verb;

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

    const columns = [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ...getsearchbox("taskNo")
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox("equipmentNo")
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
      {
        title: '保养类型',
        dataIndex: 'maintainPlanTypeName',
        key: 'maintainPlanTypeName',
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => <span>{text == 0 ? "待执行" : text == 1 ? "延期" : text == 2 ? "执行中" : text == 3 ? "已执行" : text == 4 ? "关闭" : text == 5 ? "会签中" : ""}</span>,
        ...getselectbox("status", [
          { dicKey: "0", dicName: "待执行" },
          { dicKey: "1", dicName: "延期" },
          { dicKey: "2", dicName: "执行中" },
          { dicKey: "5", dicName: "会签中" },
          { dicKey: "3", dicName: "已执行" },
          { dicKey: "4", dicName: "关闭" },
        ])
      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartMaintainDate',
        key: 'planStartMaintainDate',
      },
      {
        title: '保养用时',
        dataIndex: 'maintainHours',
        key: 'maintainHours',
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
        title: '负责人',
        dataIndex: 'planMaintainUserName',
        key: 'planMaintainUserName',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          备注
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                taskNo: "",
                equipmentNo: "",
                status: ""
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
          </a>
        </span>,
        dataIndex: 'remark',
        key: 'remark',
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("queryOfMonth", this.state.postData);
      })
    }
    function bodyparse(val) {
      let res = ''
      for (let key in val) {
        let value = val[key] ? val[key] : ''

        res += `&${key}=${value}`;
      }
      return res.substr(1)
    }


    let renderAdd = (record) => {
      let column = [
        {
          title: '保养项目',
          dataIndex: 'maintainItem',
          key: 'maintainItem',
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
          render: (text) => (<a>{text}元</a>)
        },
      ]

      return <Table bordered
        size="middle"
        loading={this.props.submittings}
        pagination={false}
        rowKey='id'
        loading={this.props.jkqueryList}
        columns={column}
        dataSource={jkqueryList ? jkqueryList : []}
      >
      </Table>


    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='保养计划列表' extra={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tag color={cur == "last" ? "green" : ""} onClick={() => {
              this.setState({
                postData: { ...postData, type: "last" },
                cur: "last"
              }, () => {
                this.resetData()
              })
            }}>上月</Tag>
            <Tag color={cur == "current" ? "green" : ""} onClick={() => {
              this.setState({
                postData: { ...postData, type: "current" },
                cur: "current"
              }, () => {
                this.resetData()
              })
            }}>本月</Tag>
            <Tag color={cur == "next" ? "green" : ""} onClick={() => {
              this.setState({
                postData: { ...postData, type: "next" },
                cur: "next"
              }, () => {
                this.resetData()
              })
            }}>下月</Tag>
            <Divider type='vertical' style={{marginTop:3}}></Divider>
            <a onClick={()=>{
              message.loading("正在导出文件...")
            }} href={`/rs/equipmentMaintainBillToExecute/exportExcelOfMonth?${bodyparse(this.state.postData)}`} target="_blank">
              导出任务清单
            </a>
          </div>
        }>
          <Table bordered size="middle"
            scroll={{ x: 1600, y: "59vh" }}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: queryOfMonth.pageNum ? queryOfMonth.pageNum : 1,
              total: queryOfMonth.total ? parseInt(queryOfMonth.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={queryOfMonth.list ? queryOfMonth.list : []}
            expandedRowRender={record => renderAdd(record)}
            expandedRowKeys={expandedRowKeys}
            expandRowByClick
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
          >
          </Table>

        </Card>
      </div>
    )
  }


}

export default Verb



