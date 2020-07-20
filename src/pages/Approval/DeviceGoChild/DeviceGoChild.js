import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Menu, Dropdown, Steps, Popover, Radio
} from 'antd';
import { connect } from 'dva';
import styles from '../style.less';
import CreateForm from "@/components/CreateForm"
import moment from "moment"
import { node } from 'prop-types';
import SearchBox from '@/components/SearchBox'


const { Step } = Steps;

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;



@connect(({ approval, publicmodel, loading }) => ({
  approval,
  publicmodel,
  submitting: loading.effects['approval/queryByApprovalProcessType'],
}))

class DeviceGoChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postpoint: {
        radio: "",
        textarea: ""
      },
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      /*初始化 main List */
      postData: {
        "pageIndex": "1",
        "pageSize": "9",
        "approvalProcessType": props.postData.approvalProcessType,
        "status": props.postData.status
      },
      postUrl: "queryByApprovalProcessType",
      curitem: {}
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'approval/' + type,
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


  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRefc = (ref) => {
    this.child = ref;
  }

  onRef = (ref) => {
    this.childs = ref;
  }


  render() {
    let { postData, postUrl, fv, iftype, curitem } = this.state,
      { queryByApprovalProcessType, transferType, userList, godetailqueryById, relList, recallqueryList } = this.props.approval;

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
    }


    const getDetail = () => {
      return (<div style={{ width: "100%" }} className={styles.tosee}>
        <h2 style={{ backgroundColor: "#737373", padding: 12, color: "#fff", fontSize: 16, marginTop: 0 }}>流转详情</h2>
        <p>
          流转类型: <span>{godetailqueryById.approvarProceesName ? godetailqueryById.approvarProceesName : ""}</span>
        </p>
        <p>
          工单号: <span>{godetailqueryById.taskNo ? godetailqueryById.taskNo : ""}</span>
        </p>
        <p>
          当前审批节点: <span>{godetailqueryById.nodeName ? godetailqueryById.nodeName : ""}</span>
        </p>
        <p>
          申请人名: <span>{godetailqueryById.applyUserName}</span>
        </p>
        <p>
          申请时间: <span>{godetailqueryById.applyTime ? godetailqueryById.applyTime : ""}</span>
        </p>
        <p>
          状态: <span style={{ color: godetailqueryById.status == 0 ? "#666" : godetailqueryById.status == 1 ? "#398dcd" : godetailqueryById.status == 2 ? "green" : godetailqueryById.status == 4 ? "#ff2100" : "" }}>{godetailqueryById.status == 0 ? "待审批" : godetailqueryById.status == 1 ? "审批中" : godetailqueryById.status == 2 ? "已审批" : godetailqueryById.status == 4 ? "撤回" : ""}</span>
        </p>
        <div style={{ display: this.props.postData.approvalProcessType == "0" ? "block" : "none" }}>
          <p>
            调拨原因: <span>{godetailqueryById.allotReason ? godetailqueryById.allotReason : ""}</span>
          </p>
          <p>
            调拨出公司: <span>{godetailqueryById.allotOutCompanyName ? godetailqueryById.allotOutCompanyName : ""}</span>
          </p>
          <p>
            调拨进公司: <span>{godetailqueryById.allotInCompanyName ? godetailqueryById.allotInCompanyName : ""}</span>
          </p>
          <p>
            调拨出部门: <span>{godetailqueryById.allotOutDepartmentName ? godetailqueryById.allotOutDepartmentName : ""}</span>
          </p>
          <p>
            调拨进部门: <span>{godetailqueryById.allotInDepartmentName ? godetailqueryById.allotInDepartmentName : ""}</span>
          </p>
          <p>
            调拨出产品线: <span>{godetailqueryById.allotOutShopName ? godetailqueryById.allotOutShopName : ""}</span>
          </p>
          <p>
            调拨进产品线: <span>{godetailqueryById.allotInShopName ? godetailqueryById.allotInShopName : ""}</span>
          </p>
          <p>
            调拨进产品线: <span>{godetailqueryById.allotInShopName ? godetailqueryById.allotInShopName : ""}</span>
          </p>
        </div>

        <div style={{ display: this.props.postData.approvalProcessType == "2" ? "block" : "none" }}>
          <p>
            借出日期: <span>{godetailqueryById.loanOutDate ? godetailqueryById.loanOutDate : ""}</span>
          </p>
          <p>
            归还日期: <span>{godetailqueryById.returnDate ? godetailqueryById.returnDate : ""}</span>
          </p>
          <p>
            借用原因: <span>{godetailqueryById.loanReason ? godetailqueryById.loanReason : ""}</span>
          </p>
          <p>
            借出公司: <span>{godetailqueryById.loanOutCompanyName ? godetailqueryById.loanOutCompanyName : ""}</span>
          </p>
          <p>
            借入公司: <span>{godetailqueryById.loanInCompanyName ? godetailqueryById.loanInCompanyName : ""}</span>
          </p>
          <p>
            借出部门: <span>{godetailqueryById.loanOutDepartmentName ? godetailqueryById.loanOutDepartmentName : ""}</span>
          </p>
          <p>
            借入部门: <span>{godetailqueryById.loanInDepartmentName ? godetailqueryById.loanInDepartmentName : ""}</span>
          </p>
          <p>
            借出产品线: <span>{godetailqueryById.loanOutShopName ? godetailqueryById.loanOutShopName : ""}</span>
          </p>
          <p>
            借入产品线: <span>{godetailqueryById.loanInShopName ? godetailqueryById.loanInShopName : ""}</span>
          </p>
        </div>
        <div style={{ display: this.props.postData.approvalProcessType == "3" ? "block" : "none" }}>
          <p>
            报废原因: <span>{godetailqueryById.scarpReason ? godetailqueryById.scarpReason : ""}</span>
          </p>
          <p>
            报废处理: <span>{godetailqueryById.scarpDeal ? godetailqueryById.scarpDeal : ""}</span>
          </p>
          <p>
            报废处理人: <span>{godetailqueryById.scarpDealUserName ? godetailqueryById.scarpDealUserName : ""}</span>
          </p>
        </div>
        <p>
          备注: <span>{godetailqueryById.remark ? godetailqueryById.remark : ""}</span>
        </p>
        <h2 style={{ backgroundColor: "#737373", padding: 12, color: "#fff", fontSize: 16 }}>调拨设备列表</h2>
        <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }} dataSource={relList ? relList : []} columns={[
          {
            title: "设备名",
            dataIndex: "equipmentName",
            key: "equipmentName"
          }, {
            title: "设备编号",
            dataIndex: "equipmentNo",
            key: "equipmentNo"
          }, {
            title: "设备型号",
            dataIndex: "equipmentModel",
            key: "equipmentModel"
          }
        ]}></Table>
      </div>
      )
    }



    const menu = () => {
      let record = curitem;
      return record.id ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <a style={{ color: "#666" }} onClick={() => {
            this.setNewState("godetailqueryById", { id: record.equipmentApprovalProcessId, approvalProcessType: this.props.postData.approvalProcessType }, () => {
              this.setState({
                visible: true,
                curitem: record,
                iftype: {
                  name: `查看详情`,
                  value: "seedetail"
                }
              })
            })
          }}>
            流转详情
          </a>
          <Divider style={{ marginTop: 6 ,display:this.props.postData.status=='0'?"block":"none"}} type="vertical"></Divider>
          <a style={{display:this.props.postData.status=='0'?"block":"none"}} onClick={() => {
            let _it = this;
            Modal.confirm({
              style: { top: "25%" },
              title: `审批${curitem.nodeName}`,
              content: <div>
                <Radio.Group onChange={(e) => {
                  let val = e.target.value;
                  _it.setState({
                    postpoint: {
                      ..._it.state.postpoint,
                      radio: val
                    }
                  });
                }}>
                  <Radio value={0}>不通过</Radio>
                  <Radio value={1}>通过</Radio>
                </Radio.Group>
                <p style={{ marginTop: 18 }}>审批意见:</p>
                <Input.TextArea onChange={(e) => {
                  let val = e.target.value;
                  _it.setState({
                    postpoint: {
                      ..._it.state.postpoint,
                      textarea: val
                    }
                  });
                }} />

              </div>,
              okText: "提交",
              cancelText: "取消",
              onOk() {
                let arr = [0, 1]
                if (arr.indexOf(_it.state.postpoint.radio) == -1) {
                  message.warn("请选择是否通过")
                  return
                }

                _it.setNewState("approvalProcess", {
                  "id": curitem.id,
                  "equipmentApprovalProcessId": curitem.equipmentApprovalProcessId,
                  "isPass": _it.state.postpoint.radio,
                  "auditOpinion": _it.state.postpoint.textarea,
                  "approvalProcessType":_it.props.postData.approvalProcessType
                }, () => {
                  message.success("操作成功");
                  _it.resetData()
                })
                _it.setState({
                  postpoint: {
                    radio: undefined,
                    textarea: undefined
                  }
                })
              },
              onCancel() {
                _it.setState({
                  postpoint: {
                    radio: undefined,
                    textarea: undefined
                  }
                })
              },
            })
          }}>审批</a>
        </div>
      ) : null
    };

    const columns = [
      {
        title: '审批人',
        dataIndex: 'auditUserName',
        key: 'auditUserName',
      },
      {
        title: '审批节点',
        dataIndex: 'nodeName',
        key: 'nodeName',
      },
      {
        title: '审批时间',
        dataIndex: 'auditTime',
        key: 'auditTime',
      },
      {
        title: '审批意见',
        dataIndex: 'auditOpinion',
        key: 'auditOpinion',
      },
      {
        title: '审批结果',
        dataIndex: 'isPass',
        key: 'isPass',
        render:(text)=><span>{text=="0"?"不通过":text=="1"?"通过":""}</span>
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("queryByApprovalProcessType", this.state.postData);
      })
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
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={`${this.props.title}列表`} extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            {
              menu()
            }
          </div>
        }>
          <Table bordered
            size="middle"
            scroll={{ x:1200,y:"59vh" }}
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
              current: queryByApprovalProcessType.pageNum ? queryByApprovalProcessType.pageNum : 1,
              total: queryByApprovalProcessType.total ? parseInt(queryByApprovalProcessType.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={queryByApprovalProcessType.list ? queryByApprovalProcessType.list : []}
          >
          </Table>

          <Modal
            title={this.state.iftype.name}
            style={{ maxWidth: "90%" }}
            width={800}
            visible={this.state.visible}
            onOk={() => {
              this.setState({
                visible: false,
              });
            }}
            onCancel={() => {
              this.setState({
                visible: false,
              });
            }}
            footer={null}
          >
            {
              this.state.iftype.value == "seedetail" ?
                getDetail() : null
            }

          </Modal>



        </Card>
      </div>
    )
  }


}

export default DeviceGoChild



