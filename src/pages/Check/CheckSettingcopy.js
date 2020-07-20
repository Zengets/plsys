import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty,
  Transfer,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CheckPair from './CheckPair'
import Link from 'umi/link';
import SearchBox from '@/components/SearchBox';
import Abload from '@/components/Abload';
const FormItem = Form.Item;
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;

@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/equipmentqueryList'],
  submittings: loading.effects['check/equipmentqueryNoByUserId'],
  submittingc: loading.effects['check/equipmentqueryByUserId'],
}))
class checkSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      /*初始化 main List */
      postData: {
        "pageIndex": 1,//int 当前页面*
        "pageSize": 10,//int 页面条数*
        "chargeType": "0",//string 负责类型*
        "userId": "",//Long 负责人id
        "equipmentNo": "",//string 设备编号
        "equipmentName": ""//string 设备名称
      },
      postDatas: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        "chargeType": "0",//string 负责类型*
        "userId": ""//Long 负责人id*
      },
      postDatac: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        "chargeType": "0",//string 负责类型*
        "userId": ""//Long 负责人id*
      },
      postUrl: "equipmentqueryList",
      curitem: {},
      charge: "",
      selectedRowKeys: [],
      selectedRowKeyc: [],
      haveIds: []
    }
  }

  //新状态
  setNewState(type, values, fn) {
    //checkmenuqueryList,checkmenudeleteById,checkmenuqueryAll,checkmenusave
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

  onSelectChanges = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelectChangec = selectedRowKeys => {
    this.setState({ selectedRowKeyc: selectedRowKeys });
  };


  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
    })
  }

  componentDidMount() {
    this.resetData()
  }

  refreshData(ifs) {
    let { haveIds, selectedRowKeys, selectedRowKeyc, charge, postDatas, postDatac } = this.state;
    let haveId = JSON.parse(JSON.stringify(haveIds))

    if (ifs) {
      selectedRowKeys.map((item) => {
        haveId.push(item)
      });
    } else {
      haveId = haveId.filter((item) => { return selectedRowKeyc.indexOf(item) == -1 });
    }

    this.setNewState("equipmentsaves", {
      "userId": charge,
      "chargeType": "0",
      "equipIds": haveId
    }, () => {
      message.success("操作成功");
      this.setNewState("equipmentqueryNoByUserId", postDatas);
      this.setNewState("equipmentqueryByUserId", postDatac, () => {
        let res = this.props.check.equipmentqueryByUserId.list;
        this.setState({
          haveIds: res[0] ? res[0].haveIds : [],
          selectedRowKeyc: [],
          selectedRowKeys: []
        }, () => {
          this.resetData();
        })
      });


    })

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

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, charge, selectedRowKeys, selectedRowKeyc, postDatas, postDatac } = this.state,
      { equipmentqueryList, userList, equipmentqueryNoByUserId, equipmentqueryByUserId } = this.props.check;
    const rowSelections = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChanges,
    }
    const rowSelectionc = {
      selectedRowKeys: this.state.selectedRowKeyc,
      onChange: this.onSelectChangec,
    }
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

    const columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 110,
        ...getsearchbox("equipmentNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 110,
        ...getsearchbox("equipmentName")
      },
      {
        title: '点检负责人',
        dataIndex: 'userName',
        key: 'userName',
        width: 130,
        ...getselectbox("userId", userList ? userList.map((item) => {
          return {
            dicName: item.userName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: '所在部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
      {
        title: "点检内容",
        dataIndex: 'setting',
        key: 'setting',
        render: (text, record) => (<Button type="primary" ghost size='small' onClick={() => {
          this.setState({
            visible: true,
            curitem: record,
            iftype: {
              name: `设备:${record.equipmentName}点检内容`,
              value: "toset"
            }
          })

        }}>设置</Button>)
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          点检历史
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                equipmentName: "",
                equipmentNo: "",
                userId: ""
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
        render: (text, record) => <Link to={`/yxt/check/checksetting/checkhistory/${record.equipmentId}/${record.equipmentName}`}>查看点检历史</Link>
      },
    ]

    const columnes = [
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
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("equipmentqueryList", this.state.postData);
      })
    }

    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("equipmentqueryNoByUserId", this.state.postDatas);
      })
    }

    let pageChangec = (page) => {
      this.setState({
        postDatac: { ...this.state.postDatac, pageIndex: page }
      }, () => {
        this.setNewState("equipmentqueryByUserId", this.state.postDatac);
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
        <Card title='点检计划' extra={
           <Abload reload={() => {
            this.resetData()
          }} data={null} postName="uploadequipmentPointCheckPlan" left={0} filePath="http://www.plszems.com/download/点检计划导入模板.xlsx"></Abload>
        }>
          <div>
            <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
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
                current: equipmentqueryList.pageNum ? equipmentqueryList.pageNum : 1,
                total: equipmentqueryList.total ? parseInt(equipmentqueryList.total) : 0,
                onChange: pageChange,
              }}
              rowKey='id'
              columns={columns}
              dataSource={equipmentqueryList.list ? equipmentqueryList.list : []}
            >
            </Table>
          </div>
          <Modal
            width={iftype.value == "edit" ? 600 : "90%"}
            visible={this.state.visible}
            title={this.state.iftype.name}
            onCancel={() => { this.setState({ visible: false }) }}
            footer={iftype.value == "edit" ? [<Button key="back" onClick={() => { this.setState({ visible: false }) }}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={() => {
              this.setNewState("equipmentupdateByIds", {
                "id": curitem.id,//主键*
                "userId": curitem.userId,//负责人id*
                "chargeType": "0",//负责类型*
                "equipmentId": curitem.equipmentId
              }, () => { this.resetData(); message.success("操作成功"); this.setState({ visible: false }) })
            }}>
              提交
            </Button>,
            ] : null}
          >
            {
              iftype.value == "edit" ?
                <div>
                  <p>点检负责人：</p>
                  <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={curitem.userId}
                    onChange={(val) => {
                      this.setState({
                        curitem: { ...curitem, userId: val }
                      })
                    }}
                  >
                    {
                      userList ?
                        userList.map((item) => {
                          return (<Option value={item.id} key={item.id}>{item.userName}</Option>)
                        }) : ""
                    }
                  </Select>
                </div> :
                <CheckPair equipmentId={curitem.equipmentId} />
            }


          </Modal>

        </Card>
      </div>
    )
  }

}

export default checkSetting



