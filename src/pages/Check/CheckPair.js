import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty,
  Transfer,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm";
import SearchBox from '@/components/SearchBox';

const FormItem = Form.Item;
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;

@connect(({ check, loading }) => ({
  check,
  submittings: loading.effects['check/queryWithoutIds'],
  submittingc: loading.effects['check/queryListOfEquipment'],
}))
class CheckPair extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      selectedRowKeys: [],
      selectedRowKeyc: [],
      submits: [],
      submitc: [],
      postData: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        equipmentId: props.equipmentId ? props.equipmentId : null,
        pointCheckItem:""
      },
      postDatas: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        equipmentId: props.equipmentId ? props.equipmentId : null,
        pointCheckItem:""
      },
      curitem: {},
      fields: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.equipmentId != nextProps.equipmentId) {
      this.setState({
        selectedRowKeys: [],
        selectedRowKeyc: [],
        submits: [],
        submitc: [],
        postData: {
          "pageIndex": 1,//int 当前页码*
          "pageSize": 10,//int 每页条数*
          equipmentId: nextProps.equipmentId
        },
        postDatas: {
          "pageIndex": 1,//int 当前页码*
          "pageSize": 10,//int 每页条数*
          equipmentId: nextProps.equipmentId
        },
      }, () => {
        this.setNewState("queryListOfEquipment", this.state.postData, () => {
          this.props.check.haveItemList ?
            this.setState({
              submitc: this.props.check.haveItemList
            }) : null
        });
        this.setNewState("queryWithoutIds", this.state.postDatas);
      })
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

  componentDidMount() {
    this.setNewState("queryListOfEquipment", this.state.postData, () => {
      this.props.check.haveItemList ?
        this.setState({
          submitc: this.props.check.haveItemList
        }) : null
    });
    this.setNewState("queryWithoutIds", this.state.postDatas);
  }


  getval(key, arr) {
    let val = "";
    arr.map((item) => {
      if (item.equipmentPointCheckItemId == key) {
        val = item.periodType
      }
    })

    return val
  }

  onSelectChanges = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
    if (selectedRows.length == 0) {
      return
    }
    let now = selectedRows[0].id,
      submits = this.state.submits;
    let res = selectedRowKeys.indexOf(now)
    if (res == -1) {
      submits.push({
        periodType: "0",
        equipmentPointCheckItemId: now
      })
    } else {
      submits = selectedRowKeys.map((item) => {
        return {
          periodType: this.getval(item, this.state.submits) ? this.getval(item, this.state.submits) : "0",
          equipmentPointCheckItemId: item
        }
      })
    }
    this.setState({
      submits
    })
  };

  onSelectChangec = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeyc: selectedRowKeys });
    if (selectedRows.length == 0) {
      return
    }
  };

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
        roleName: {
          value: null,
          type: "input",
          title: "角色名称",
          keys: "roleName",
          requires: true
        },
        remark: {
          value: null,
          type: "textarea",
          title: "角色描述",
          keys: "remark",
          requires: false
        }
      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype, postDatas } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let postData = { ...values };
      this.setNewState("checksave", postData, () => {
        message.success("新增成功！");
        this.setState({ fv: false, postDatas: { ...postDatas, pageIndex: 1 } }, () => {
          this.setNewState("queryWithoutIds", this.state.postDatas);
        });
      });

    });
  }

  refreshData(ifs) {
    let { submits, submitc, selectedRowKeyc, postDatas, postData } = this.state;
    let { haveItemList } = this.props.check;
    let haveId = haveItemList
    console.log(haveId)
    if (ifs) {
      submits.map((item) => {
        haveId.push(item)
      });
    } else {
      haveId = haveId.filter((item) => { return selectedRowKeyc.indexOf(item.equipmentPointCheckItemId) == -1 });
    }
    this.setNewState("checkmenusave", {
      "equipmentId": this.props.equipmentId,
      "haveItemList": haveId
    }, () => {
      message.success("操作成功");
      this.setNewState("queryWithoutIds", postDatas);
      this.setNewState("queryListOfEquipment", postData, () => {
        let res = this.props.check.queryListOfEquipment.list;
        this.setState({
          selectedRowKeyc: [],
          selectedRowKeys: [],
          submitc: this.props.check.haveItemList,
          submits: []
        })
      });


    })

  }

  handleSearch = (selectedKeys, dataIndex) => {
    let  postUrl  = "queryWithoutIds";
    this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatas)
    });
  };

  handleSearchs = (selectedKeys, dataIndex) => {
    let  postUrl  = "queryListOfEquipment";
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }

  onRefs = (ref) => {
    this.childs = ref;
  }


  render() {
    let { fv, fields, iftype, curitem, postData, selectedRowKeys, selectedRowKeyc } = this.state,
      { userList, queryWithoutIds, queryListOfEquipment, haveItemList, periodType } = this.props.check;

    let getsearchbox = (key) => {
      if (this.child) {
        return this.child.getColumnSearchProps(key)
      } else {
        return null
      }
    },
    getsearchboxs = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: '点检项目',
        dataIndex: 'pointCheckItem',
        key: 'pointCheckItem',
        ...getsearchbox("pointCheckItem")
      },
      {
        title: '正常参考',
        dataIndex: 'normalReference',
        key: 'normalReference',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '点检周期',
        dataIndex: 'thoud',
        key: 'thoud',
        render: (text, record) => {
          if (selectedRowKeys.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return (
              <Select style={{ minWidth: 80 }} value={this.getval(record.id, this.state.submits)} onChange={(val) => {
                let submits = this.state.submits;
                submits = submits.map((item) => {
                  if (item.equipmentPointCheckItemId == record.id) {
                    item.periodType = val
                  }
                  return item
                })
                console.log(submits)
                this.setState({
                  submits
                })

              }}>
                {
                  periodType ?
                    periodType.map((item, i) => {
                      return (<Option value={item.dicKey} key={i}>{item.dicName}</Option>)
                    }) : null
                }
              </Select>


            )
          }

        }
      }

    ]

    const columnc = [
      {
        title: '点检项目',
        dataIndex: 'pointCheckItem',
        key: 'pointCheckItem',
        ...getsearchboxs("pointCheckItem")
      },
      {
        title: '正常参考',
        dataIndex: 'normalReference',
        key: 'normalReference',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '点检周期',
        dataIndex: 'periodType',
        key: 'periodType',
        render: (text, record) => {
          if (selectedRowKeyc.indexOf(record.equipmentPointCheckItemId) == -1) {
            return <span>{record.periodTypeName}</span>
          } else {
            return (
              <Select style={{ minWidth: 80 }} value={this.getval(record.equipmentPointCheckItemId, this.state.submitc)} onChange={(val) => {
                let submitc = this.state.submitc;
                submitc = submitc.map((item) => {
                  if (item.equipmentPointCheckItemId == record.equipmentPointCheckItemId) {
                    item.periodType = val
                  }
                  return item
                })
                this.setState({
                  submitc
                })
                this.setNewState("checkmenusave", {
                  equipmentId: this.props.equipmentId,
                  id: record.id,
                  periodType: val,
                  equipmentPointCheckItemId: record.equipmentPointCheckItemId
                }, () => {
                  this.setNewState("queryListOfEquipment", this.state.postData, () => {
                    message.success("修改成功！")
                  })
                })



              }}>
                {
                  periodType ?
                    periodType.map((item, i) => {
                      return (<Option value={item.dicKey} key={i}>{item.dicName}</Option>)
                    }) : null
                }
              </Select>)
          }


        }
      }

    ]


    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("queryWithoutIds", this.state.postDatas);
      })
    }

    let pageChangec = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("queryListOfEquipment", this.state.postData, () => {
          this.props.check.haveItemList ?
            this.setState({
              submitc: this.props.check.haveItemList
            }) : null
        });
      })
    }

    const rowSelections = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChanges,
    }
    const rowSelectionc = {
      selectedRowKeys: this.state.selectedRowKeyc,
      onChange: this.onSelectChangec,
    }

    return (
      <Row gutter={24} style={{ paddingBottom: 24 }}>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postDatas}></SearchBox>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearchs} postData={this.state.postData}></SearchBox>
        <Col span={11}>
          <Card hoverable style={{ height: 660 }} title={`未选择的项目`} extra={
            <a style={{ color: "#ff5000", fontSize: 16 }} onClick={() => {
              this.setState({
                iftype: {
                  name: "新增点检项目",
                  value: "addcheck"
                },
                fields: {
                  pointCheckItem: {
                    value: null,
                    type: "input",
                    title: "点检项目",
                    keys: "pointCheckItem",
                    requires: true
                  },
                  normalReference: {
                    value: null,
                    type: "input",
                    title: "正常参考",
                    keys: "normalReference",
                    requires: false
                  },
                  remark: {
                    value: null,
                    type: "textarea",
                    title: "备注",
                    keys: "remark",
                    requires: false
                  }
                },
              }, () => {
                this.setState({
                  fv: true
                })
              })
            }}>新增</a>
          }>
            <Table bordered size="middle" 
              rowSelection={rowSelections}
              dataSource={queryWithoutIds.list ? queryWithoutIds.list : []}
              loading={this.props.submittings}
              pagination={{ showTotal:total=>`共${total}条`, // 分页
                size: "small",
                pageSize: 10,
                showQuickJumper: true,
                current: queryWithoutIds.pageNum ? queryWithoutIds.pageNum : 1,
                total: queryWithoutIds.total ? parseInt(queryWithoutIds.total) : 0,
                onChange: pageChanges,
              }}
              rowKey='id'
              columns={columns}
            >

            </Table>
          </Card>
        </Col>
        <Col span={2} style={{ height: 660, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <Button type="primary" shape="circle" icon="double-right" size="small" style={{ marginBottom: 24 }} disabled={selectedRowKeys.length == 0} onClick={() => { this.refreshData(true) }} />
          <Button type="primary" shape="circle" icon="double-left" size="small" disabled={selectedRowKeyc.length == 0} onClick={() => { this.refreshData(false) }} />
        </Col>
        <Col span={11}>
          <Card hoverable style={{ height: 660 }} title={<a>已选择的项目</a>} extra={<span>选中了<a>{this.state.selectedRowKeyc.length}</a>项</span>}>
            <Table bordered size="middle" 
              rowSelection={rowSelectionc}
              dataSource={queryListOfEquipment.list ? queryListOfEquipment.list : []}
              loading={this.props.submittingc}
              pagination={{ showTotal:total=>`共${total}条`, // 分页
                size: "small",
                pageSize: 10,
                showQuickJumper: true,
                current: queryListOfEquipment.pageNum ? queryListOfEquipment.pageNum : 1,
                total: queryListOfEquipment.total ? parseInt(queryListOfEquipment.total) : 0,
                onChange: pageChangec,
              }}
              rowKey='equipmentPointCheckItemId'
              columns={columnc}
            >
            </Table>
          </Card>
        </Col>

        <CreateForm
          fields={fields}
          iftype={iftype}
          onChange={this.handleFormChange}
          wrappedComponentRef={this.saveFormRef}
          visible={fv}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />

      </Row>
    )
  }

}

export default CheckPair



