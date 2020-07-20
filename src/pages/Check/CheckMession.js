import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox';
import CreateForm from "@/components/CreateForm"

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/queryByDateAndWeekNum'],
}))
class CheckMession extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        equipmentName: "", //设备名
        equipmentNo: '',
        pointCheckUserName: '',
        taskNo: '',
        status: "",
        isCurrentUser: props.match.params.key,
      },
      postUrl: "queryByDateAndWeekNum",
      curitem: {},
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {}
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
  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
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
    if(this.state.curitem.id){
      curitem = this.props.check[this.state.postUrl].list.filter((item)=>{return item.id==curitem.id})[0]
    }
    this.setState({
      fv: false,
      curitem:curitem?curitem:{},
      fields: {},
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
      let postData = { ...values, id: curitem.id };
      this.setNewState("updatePointCheckUser", postData, () => {
        message.success("修改成功！");
        this.resetData();
      });

    });
  }


  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { queryByDateAndWeekNum, queryItemTaskByDayTaskId, queryByEquipId } = this.props.check;
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
    const columns = this.props.match.params.key=="1"?[
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ...getsearchbox('taskNo'),
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo'),
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName'),
      },
      {
        title: '点检状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => <span>{text == "0" ? "未点检" : "已点检"}</span>,
        ...getselectbox("status", [{
          dicName: "未点检",
          dicKey: "0"
        }, {
          dicName: "已点检",
          dicKey: "1"
        }])
      },
      {
        title: '点检日期',
        dataIndex: 'pointCheckItemDate',
        key: 'pointCheckItemDate',
      },
      {
        title: '点检周期',
        dataIndex: 'periodTypeName',
        key: 'periodTypeName',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          点检内容
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 10,
                equipmentName: "", //设备名
                equipmentNo: '',
                pointCheckUserName: '',
                taskNo: ''
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
              this.setNewState("queryItemTaskByDayTaskId", { id: record.id }, () => {
                this.setState({
                  visible: true,
                  iftype: {
                    name: `工单：${record.taskNo} 的点检内容`,
                    value: "tosee"
                  }
                })
              })
            }}>查看</a>
          </div>)

        }
      },
    ]:[
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ...getsearchbox('taskNo'),
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo'),
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName'),
      },
      {
        title: '点检负责人',
        dataIndex: 'pointCheckUserName',
        key: 'pointCheckUserName',
        ...getsearchbox('pointCheckUserName'),
      },
      {
        title: '点检状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => <span>{text == "0" ? "未点检" : "已点检"}</span>,
        ...getselectbox("status", [{
          dicName: "未点检",
          dicKey: "0"
        }, {
          dicName: "已点检",
          dicKey: "1"
        }])
      },
      {
        title: '点检日期',
        dataIndex: 'pointCheckItemDate',
        key: 'pointCheckItemDate',
      },
      {
        title: '点检周期',
        dataIndex: 'periodTypeName',
        key: 'periodTypeName',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          点检内容
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 10,
                equipmentName: "", //设备名
                equipmentNo: '',
                pointCheckUserName: '',
                taskNo: ''
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
              this.setNewState("queryItemTaskByDayTaskId", { id: record.id }, () => {
                this.setState({
                  visible: true,
                  iftype: {
                    name: `工单：${record.taskNo} 的点检内容`,
                    value: "tosee"
                  }
                })
              })
            }}>查看</a>
          </div>)

        }
      },
    ],
      columnes = [
        {
          title: '点检项目',
          dataIndex: 'pointCheckItem',
          key: 'pointCheckItem',
        },
        {
          title: '点检日',
          dataIndex: 'pointCheckItemDate',
          key: 'pointCheckItemDate',
        },
        {
          title: '点检时间',
          dataIndex: 'pointCheckTime',
          key: 'pointCheckTime',
        },
        {
          title: '正常参考',
          dataIndex: 'normalReference',
          key: 'normalReference',
        },
        {
          title: '是否异常',
          dataIndex: 'pointCheckItemResultType',
          key: 'pointCheckItemResultType',
          render: (text) => <span>{text == 0 ? "正常" : text == 1 ? "异常" : "未点检"}</span>
        },
        {
          title: '异常现象',
          dataIndex: 'exceptionRecord',
          key: 'exceptionRecord',
        },
        {
          title: '点检人',
          dataIndex: 'pointCheckUserName',
          key: 'pointCheckUserName',
        },
        {
          title: '点检类型',
          dataIndex: 'periodTypeName',
          key: 'periodTypeName',
        },
      ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("queryByDateAndWeekNum", this.state.postData);
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
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={this.props.match.params.key == "1" ? "我的点检任务列表" : '点检任务列表'} extra={
          <div>
            {
              curitem.id && <a onClick={() => {
                this.setNewState("queryByEquipId", {
                  chargeType: 0,
                  equipmentId: curitem.equipmentId
                }, () => {
                  this.setState({
                    fv: true, fields: {
                      userId: {
                        value: curitem.pointCheckUserId,
                        type: "select",
                        title: "点检负责人",
                        keys: "userId",
                        requires: true,
                        option: this.props.check.queryByEquipId.map((item) => {
                          return {
                            name: item.userName,
                            id: item.userId
                          }
                        })
                      },
                    }
                  })
                })
              }}>
                修改点检负责人
              </a>
            }
          </div>
        }>
          <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
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
              current: queryByDateAndWeekNum.pageNum ? queryByDateAndWeekNum.pageNum : 1,
              total: queryByDateAndWeekNum.total ? parseInt(queryByDateAndWeekNum.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={queryByDateAndWeekNum.list ? queryByDateAndWeekNum.list : []}
          >
          </Table>
          <Modal
            width={1000}
            title={iftype.name}
            visible={this.state.visible}
            onCancel={() => {
              this.setState({ visible: false })
            }}
            footer={null}
          >
            <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }} dataSource={queryItemTaskByDayTaskId} columns={columnes} pagination={false}></Table>
          </Modal>
          <CreateForm
            fields={fields}
            iftype={iftype}
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

export default CheckMession



