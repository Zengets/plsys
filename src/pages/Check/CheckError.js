import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import router from 'umi/router'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/queryListError'],
}))
class CheckError extends React.Component {

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
        pageSize: 9,
        "equipmentName": "",   //-----------------// 设备名称
        "equipmentNo": "",   //-------------设备编号
        "pointCheckUserName": "",  //----------------点检人名称
        "startDate": "",  //--------------点检开始时间
        "endDate": "",  //---------------点检结束时间
        "status": ""      //---------------状态(1待处理,2已处理)
      },
      postUrl: "queryListError",
      curitem: {}





    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'check/' + type,
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

  onRef = (ref) => {
    this.child = ref;
  }

  render() {
    let { postData, postUrl, iftype, curitem } = this.state,
      { queryListError, rslgetRepairDetail, dataList } = this.props.check;
    const columnes = [
      {
        title: '备件料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
      },
      {
        title: '备件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '备件类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '使用数量',
        dataIndex: 'consumeCount',
        key: 'consumeCount',
      },


    ]
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
    };
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox("equipmentName")
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
      },
      {
        title: '点检项目',
        dataIndex: 'pointCheckItem',
        key: 'pointCheckItem',
      },
      {
        title: '点检时间',
        dataIndex: 'pointCheckTime',
        key: 'pointCheckTime',
        ...getdaterangebox("startDate", "endDate")
      },
      {
        title: '点检结果',
        dataIndex: 'pointCheckItemResultType',
        key: 'pointCheckItemResultType',
        render: (text) => <span>{text == "1" ? "异常" : "正常"}</span>
      },
      {
        title: '异常记录',
        dataIndex: 'exceptionRecord',
        key: 'exceptionRecord',
      },
      {
        title: '异常状态',
        dataIndex: 'statusName',
        key: 'statusName',
        ...getselectbox("status", [{ dicName: "待处理", dicKey: "1" }, { dicName: "已处理", dicKey: "2" }])
      },
      {
        title: '处理方式',
        dataIndex: 'handleTypeName',
        key: 'handleTypeName',
      },
      {
        title: '处理人',
        dataIndex: 'handleUserName',
        key: 'handleUserName',
      },
      {
        title: '处理时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
      },
      {
        title: '点检人',
        dataIndex: 'pointCheckUserName',
        key: 'pointCheckUserName',
        ...getsearchbox("pointCheckUserName")
      },
      {
        title: "周期类型",
        dataIndex: 'periodTypeName',
        key: 'periodTypeName',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          维修记录
        <a style={{ color: "#f50", paddingLeft: 12 }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 9,
                "equipmentName": "",   //-----------------// 设备名称
                "equipmentNo": "",   //-------------设备编号
                "pointCheckUserName": "",  //----------------点检人名称
                "startDate": "",  //--------------点检开始时间
                "endDate": "",  //---------------点检结束时间
                "status": ""      //---------------状态(1待处理,2已处理)
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4 }} />
              重置
          </a>
        </span>,
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => <a style={{ display: record.handleId ? "block" : "none" }} onClick={() => {
          this.setNewState("rslgetRepairDetail", { id: record.handleId }, () => {
            this.setState({
              visible: true,
              iftype: {
                name: `查看：${record.equipmentName}的详情`,
                value: "tosee"
              }
            })
          })
        }}>查看详情</a>
      },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("queryListError", this.state.postData);
      })
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    }, coler = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 8
    }
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='点检异常' extra={curitem.id && curitem.status == "1" ?
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setNewState("checkRepair", { equipmentId: curitem.equipmentId }, () => {
                router.push(`/yxt/devices/devicetzlists/devicerepair/${curitem.equipmentId}/${curitem.equipmentName}/${curitem.id}`)
              })
            }}>报修处理</a>
            <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottomRight"
              title={"确认忽略该点检异常？"}
              onConfirm={() => {
                this.setNewState("checkIgnore", { id: curitem.id }, () => {
                  this.resetData();
                  message.success("忽略成功！");
                })
              }}>
              <a style={{ color: "#ff4800" }}>忽略</a>
            </Popconfirm>



          </div>
          : null}>
          <Table size="middle"
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
              pageSize: 9,
              showQuickJumper: true,
              current: queryListError.pageNum ? queryListError.pageNum : 1,
              total: queryListError.total ? parseInt(queryListError.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={queryListError.list ? queryListError.list : []}
          >
          </Table>


          <Modal
            style={{ top: 30, maxWidth: "90%" }}
            width={1000}
            visible={this.state.visible}
            title={iftype.name}
            onCancel={() => { this.setState({ visible: false }) }}
            footer={null}
          >
            <Card style={{ marginBottom: 12 }} title='设备信息'>
              <div className={styles.limitdiv}>
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
                    <p style={{ marginBottom: -10 }}>
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
                </Row>
              </div>
            </Card>



            <Card style={{ marginBottom: 12 }} title='故障信息'>
              <div className={styles.limitdiv}>
                <Row gutter={24}>
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
                        故障时间：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultTime
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        故障原因：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.faultReason
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
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
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={rslgetRepairDetail.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                              </div>
                            ),
                            onOk() { },
                          });

                        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={rslgetRepairDetail.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
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
              </div>
            </Card>

            <Card style={{ marginBottom: 12 }} title="报修信息">
              <div className={styles.limitdiv}>
                <Row gutter={24}>
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
                        报修时间：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.applyRepairTime
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
                      消耗的备件列表：
                    </p>
                    <Table size="middle" dataSource={dataList} columns={columnes}>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Card>
            <Card style={{ marginBottom: 12 }} title='验证信息'>
              <div className={styles.limitdiv}>
                <Row gutter={24}>
                  <Col {...coler}>
                    <p>
                      <span>
                        确认人：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.confirmUserName
                        }
                      </span>
                    </p>
                  </Col>
                  <Col {...coler}>
                    <p>
                      <span>
                        确认时间：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.confirmTime
                        }
                      </span>
                    </p>
                  </Col>
                  <Col span={24}>
                    <p>
                      <span>
                        确认结果：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.confirmResult
                        }
                      </span>
                    </p>
                  </Col>
                  <Col span={24}>
                    <p>
                      <span>
                        确认描述：
                      </span>
                      <span>
                        {
                          rslgetRepairDetail.confirmDesc
                        }
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>
            </Card>
          </Modal>



        </Card>
      </div>
    )
  }


}

export default CheckError



