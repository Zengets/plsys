import {
  Radio,
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Dropdown, Menu
} from 'antd';
import { connect } from 'dva';
import styles from '../style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox'


@connect(({ approval, loading }) => ({
  approval,
  submitting: loading.effects['approval/getqueryList'],
}))
class SpareGetChild extends React.Component {
  constructor(props) {
    super(props);
    this.columnes = [
      {
        title: '配件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '配件价值',
        dataIndex: 'sparePartsValue',
        key: 'sparePartsValue',
        render: (text) => <span>{text}元</span>
      },
      {
        title: '配件类型名称',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '申请数量',
        dataIndex: 'applyCount',
        key: 'applyCount',
      },
    ]

    this.state = {
      visible: false,
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        status:props.postData.status,
        "taskNo": "", //  申请单号
        "applyUserId": "",
        "applyType": "", // 申请类型： 0：预申领，1：回冲入库
        "isCurrentUser":"1"
      },
      postUrl: "getqueryList",
      curitem: {},
      postDatas: {
        "sparePartsApplyId": "",
        "pageIndex": 1,
        "pageSize": 10
      }
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

  onRefs = (ref) => {
    this.childs = ref;
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { getqueryList, userList, getqueryListAndApplyInfo, sparePartsApply } = this.props.approval;

    let getsearchbox = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, getdaterangebox = (start, end) => {
      if (this.childs) {
        return this.childs.getColumnRangeProps(start, end)
      } else {
        return null
      }
    }


    const columns = [
      {
        title: '申请单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        width: 100,
        ...getsearchbox('taskNo')
      },
      {
        title: '申请人',
        dataIndex: 'applyUserName',
        key: 'applyUserName',
        width: 100,
        ...getselectbox("applyUserId", userList ? userList.map((item) => {
          return {
            dicName: item.userName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '申请类型',
        dataIndex: 'applyTypeName',
        key: 'applyTypeName', width: 110,
        ...getselectbox("applyType", [{ dicKey: "0", dicName: "预申领" }, { dicKey: "1", dicName: "回冲入库" }])
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        width:120
        
      },
      {
        title: '申请说明',
        dataIndex: 'remark',
        key: 'remark',
        width:120
        
      },
      {
        title: '配件总价值(元)',
        dataIndex: 'totalSparePartsValue',
        key: 'totalSparePartsValue',
        width:140
      },
      {
        title: '审批结果',
        dataIndex: 'auditResultTypeName',
        key: 'auditResultTypeName',
        width:120

      },
      {
        title: '审批意见',
        dataIndex: 'auditOpinion',
        key: 'auditOpinion',
        width:120

      },
      {
        title: '审批时间',
        dataIndex: 'auditTime',
        key: 'auditTime',
        width:120
      },
      {
        title: '审批状态',
        dataIndex: 'status',
        key: 'status',
        width:120,
        render: (text, record) => {
          let name = text == 0 ? "待审批" :
            text == 1 ? "审批通过" :
              text == 2 ? "审批未通过" :
                text == 3 ? "撤回" : "",
            color = text == 0 ? "#666" :
              text == 1 ? "green" :
                text == 2 ? "#ff2100" :
                  text == 3 ? "#f50" : "";
          return (<span style={{ color: color }}>{name}</span>)
        }
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          查看详情
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "taskNo": "", //  申请单号
                "applyUserId": "",
                "applyType": "", // 申请类型： 0：预申领，1：回冲入库
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4,marginLeft:8 }} />
            重置
          </a>
        </span>,
        dataIndex: 'action',
        key: 'action',
        width: 180,
        render: (text, record) => {
          return (<div>
            <a onClick={() => {
              this.setNewState("getqueryListAndApplyInfo", { ...this.state.postDatas, "sparePartsApplyId": record.id, pageIndex: 1 }, () => {
                this.setState({
                  postDatas: { ...this.state.postDatas, "sparePartsApplyId": record.id },
                  visible: true,
                  curitem: record,
                  iftype: {
                    name: `查看单号：${record.taskNo}的详情`,
                    value: "tosee"
                  }
                })
              })
            }}>
              查看
            </a>
          </div>)
        }
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("getqueryList", this.state.postData);
      })
    }

    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("getqueryListAndApplyInfo", this.state.postDatas);
      })
    }

    let renderDetail = () => {
      return (
        <div>
          <Card title="申请单信息">
            <div className={styles.limitdivs}>
              <Row gutter={24}>
                <Col span={12}>
                  <p>
                    <span>申请单号: </span>
                    <span> {sparePartsApply.taskNo}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>申请人: </span>
                    <span> {sparePartsApply.applyUserName}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>申请时间: </span>
                    <span> {sparePartsApply.applyTime}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>申请类型: </span>
                    <span> {sparePartsApply.applyTypeName}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>配件总价值(元): </span>
                    <span> {sparePartsApply.totalSparePartsValue}元</span>
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <span>申请说明: </span>
                    <span> {sparePartsApply.remark}</span>
                  </p>
                </Col>
                <Col span={24} style={{ borderTop: "#F0F0F0 dashed 1px", paddingTop: 18 }}>
                  <p>
                    <span style={{ color: "#f50" }}>申请配件列表: </span>
                  </p>
                  <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }} dataSource={getqueryListAndApplyInfo ? getqueryListAndApplyInfo.list : []}
                    columns={this.columnes}
                    rowKey="id"
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 10,
                      showQuickJumper: true,
                      current: getqueryListAndApplyInfo.pageNum ? getqueryListAndApplyInfo.pageNum : 1,
                      total: getqueryListAndApplyInfo.total ? parseInt(getqueryListAndApplyInfo.total) : 0,
                      onChange: pageChanges,
                    }}
                  >
                  </Table>
                </Col>
              </Row>
            </div>
          </Card>
          {
            iftype.value == "todeal" && <Card title={this.state.iftype.name} style={{ marginTop: 24 }}>
              <Row gutter={24}>
                <Col span={24} style={{ display: "flex" }}>
                  <p style={{ width: 64 }}>审批结果</p>
                  <div style={{ marginLeft: 10, flex: 1 }}>
                    <Radio.Group onChange={(e) => {
                      this.setState({
                        radio: e.target.value
                      })
                    }}>
                      <Radio value={0}>通过</Radio>
                      <Radio value={1}>未通过</Radio>
                    </Radio.Group>
                  </div>
                </Col>
                <Col span={24} style={{ display: "flex" }}>
                  <p style={{ width: 64 }}>审批意见</p>
                  <div style={{ marginLeft: 10, flex: 1 }}>
                    <Input.TextArea style={{ width: "100%" }} onChange={(e) => {
                      this.setState({
                        textarea: e.target.value
                      })
                    }} />
                  </div>
                </Col>
              </Row>
            </Card>
          }
        </div>
      )
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    //sparePartsApplyAuditList
    const expandedRowRender = (record) => {
      const columnss = [
        {
          title: '名称',
          dataIndex: 'auditUserName',
          key: 'auditUserName'
        },
        {
          title: '审批时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
          
        },
        {
          title: '审批状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
          render:(text)=><span style={{color:text == 0 ? "#666" :
          text == 1 ? "#ff2100" :
            text == 2 ? "green" :
              text == 3 ? "#f50" : ""}}>{text=="0"?"未审批":text=="1"?"待审批":text=="2"?"已审批":""}</span>
        },
         {
          title: '审批结果',
          dataIndex: 'auditResultTypeName',
          key: 'auditResultTypeName',
          render:(text)=><span style={{color:text=="不通过"?"#ff2100":"green"}}>{text}</span>
        },
         {
          title: '审批意见',
          dataIndex: 'auditOpinion',
          key: 'auditOpinion',
          
        },

      ];
      return <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }} columns={columnss} dataSource={record.sparePartsApplyAuditList} pagination={false} />;
    };

    return (
      <div>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={this.props.postData.status == "0" ? "配件待审批列表" :
            this.props.postData.status == "1" ? "配件审批通过列表" :
              this.props.postData.status == "2" ? "配件审批未通过列表" :
                this.props.postData.status == "3" ? "配件撤回列表" : ""} extra={
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            {
              curitem.id ? curitem.status == 0 ? <span>
                <a onClick={() => {
                  this.setNewState("getqueryListAndApplyInfo", { ...this.state.postDatas, "sparePartsApplyId": curitem.id, pageIndex: 1 }, () => {
                    this.setState({
                      postDatas: { ...this.state.postDatas, "sparePartsApplyId": curitem.id },
                      visible: true,
                      curitem: curitem,
                      iftype: {
                        name: `审批单号：${curitem.taskNo}`,
                        value: "todeal"
                      }
                    })
                  })
                }}>
                  审批
                </a>
                <Divider type="vertical"></Divider>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottom"
                  title={"确认撤回该申请？"}
                  onConfirm={() => {
                    this.setNewState("getrecall", { id: curitem.id }, () => {
                      let total = this.props.approval.getqueryList.total,
                        page = this.props.approval.getqueryList.pageNum;
                      if ((total - 1) % 10 == 0) {
                        page = page - 1
                      }

                      this.setState({
                        postData: { ...this.state.postData, pageIndex: page }
                      }, () => {
                        this.setNewState("getqueryList", postData, () => {
                          message.success("撤回成功！");
                        });
                      })
                    })
                  }}>
                  <a style={{ color: "#ff4800" }}>撤回</a>
                </Popconfirm>
              </span> : null : null
            }
          </div>
        }>
          <Table bordered size="middle"
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
              current: getqueryList.pageNum ? getqueryList.pageNum : 1,
              total: getqueryList.total ? parseInt(getqueryList.total) : 0,
              onChange: pageChange,
            }}
            expandRowByClick
            expandedRowRender={expandedRowRender}
            rowKey='id'
            columns={columns}
            dataSource={getqueryList.list ? getqueryList.list : []}
          >
          </Table>
          <Modal
            width={800}
            style={{ top: 12 }}
            visible={this.state.visible}
            title={iftype.name}
            onCancel={() => { this.setState({ visible: false }) }}
            footer={iftype.value == "tosee" ? null : [
              <Button key="back" onClick={() => { this.setState({ visible: false }) }}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={() => {
                if ([0, 1].indexOf(this.state.radio) == -1) {
                  message.warn("请选择审批结果");
                  return
                }
                if (!this.state.textarea) {
                  message.warn("请填写审批意见");
                  return
                }
                this.setNewState("getaudit", {
                  "id": curitem.id,// 配件申请主键*
                  "auditResultType": this.state.radio, // 审批结果*，0：通过，1：未通过
                  "auditOpinion": this.state.textarea // 审批意见(未通过时必填)
                }, () => {
                  message.success("操作成功");
                  this.resetData()
                  this.setState({
                    radio: null,
                    textarea: null,
                    visible: false
                  })
                })

              }}>
                确定
              </Button>,
            ]}
          >
            {
              renderDetail()
            }
          </Modal>
         

        </Card>
      </div>
    )
  }


}

export default SpareGetChild



