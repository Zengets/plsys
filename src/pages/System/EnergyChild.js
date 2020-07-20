import {
  Table, Input, Form, Divider, Modal, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty, InputNumber,
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm";
import SearchBox from '@/components/SearchBox';

const { Option } = Select;



@connect(({ system, loading }) => ({
  system,
  submittings: loading.effects['system/queryNo'],
  submittingc: loading.effects['system/queryYes'],
}))
class EnergyChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      selectedRowKeys: [],
      selectedRowKeyc: [],
      submits: [],
      submitc: [],
      postData: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        electricityMeterId: props.electricityMeterId ? props.electricityMeterId : null,
      },
      postDatas: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        electricityMeterId: props.electricityMeterId ? props.electricityMeterId : null,
      },
      curitem: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.electricityMeterId != nextProps.electricityMeterId) {
      this.setState({
        selectedRowKeys: [],
        selectedRowKeyc: [],
        submits: [],
        submitc: [],
        postData: {
          "pageIndex": 1,//int 当前页码*
          "pageSize": 10,//int 每页条数*
          electricityMeterId: nextProps.electricityMeterId
        },
        postDatas: {
          "pageIndex": 1,//int 当前页码*
          "pageSize": 10,//int 每页条数*
          electricityMeterId: nextProps.electricityMeterId
        },
      }, () => {
        this.setNewState("queryYes", this.state.postData, () => {
          this.props.system.haveItemList ?
            this.setState({
              submitc: this.props.system.haveItemList
            }) : null
        });
        this.setNewState("queryNo", this.state.postDatas);
      })
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/' + type,
      payload: values
    }).then((res) => {
      fn ? fn(res) : null;
    });
  }

  componentDidMount() {
    this.setNewState("queryYes", this.state.postData, () => {
      this.props.system.haveItemList ?
        this.setState({
          submitc: this.props.system.haveItemList
        }) : null
    });
    this.setNewState("queryNo", this.state.postDatas);
  }


  getval(key, arr) {
    let val = "";
    arr.map((item) => {
      if (item.shopId == key) {
        val = item.rate
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
        rate: "0",
        shopId: now
      })
    } else {
      submits = selectedRowKeys.map((item) => {
        return {
          rate: this.getval(item, this.state.submits) ? this.getval(item, this.state.submits) : "0",
          shopId: item
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


  refreshData(ifs) {
    let { submits, submitc, selectedRowKeyc, postDatas, postData } = this.state;
    let { haveItemList } = this.props.system;
    let haveId = haveItemList
    console.log(haveId)
    if (ifs) {
      submits.map((item) => {
        haveId.push(item)
      });
    } else {
      haveId = haveId.filter((item) => { return selectedRowKeyc.indexOf(item.shopId) == -1 });
    }
    this.setNewState("querysave", {
      "id": this.props.electricityMeterId,
      "list": haveId
    }, (res) => {
      res&&message.success("操作成功");

      this.setNewState("queryNo", postDatas);
      this.setNewState("queryYes", postData, () => {
        let res = this.props.system.queryYes.list;
        this.setState({
          selectedRowKeyc: [],
          selectedRowKeys: [],
          submitc: this.props.system.haveItemList,
          submits: []
        })
      });


    })

  }

  handleSearch = (selectedKeys, dataIndex) => {
    let postUrl = "queryNo";
    this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatas)
    });
  };

  handleSearchs = (selectedKeys, dataIndex) => {
    let postUrl = "queryYes";
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
    let { iftype, curitem, postData, selectedRowKeys, selectedRowKeyc } = this.state,
      { userList, queryNo, queryYes, haveItemList, rate } = this.props.system;

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
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '分配比例',
        dataIndex: 'rate',
        key: 'rate',
        render: (text, record) => {
          if (selectedRowKeys.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return (
              <InputNumber formatter={value => `${!isNaN(parseInt(value)) ? parseInt(value) : 0}‰`} parser={value => value.replace('‰', '')} min={0}
                max={1000}
                style={{ minWidth: 80 }}
                value={this.getval(record.id, this.state.submits)} onChange={(val) => {
                  let submits = this.state.submits;
                  submits = submits.map((item) => {
                    if (item.shopId == record.id) {
                      item.rate = val
                    }
                    return item
                  })
                  this.setState({
                    submits
                  })

                }}>
              </InputNumber>
            )
          }
        }
      },

    ]

    const columnc = [
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '分配比例',
        dataIndex: 'rate',
        key: 'rate',
        render: (text, record) => {
          if (selectedRowKeyc.indexOf(record.id) == -1) {
            return text + "‰"
          } else {
            return (
              <InputNumber formatter={value => `${!isNaN(parseInt(value)) ? parseInt(value) : 0}‰`} parser={value => value.replace('‰', '')} min={0}
                max={1000}
                style={{ minWidth: 80 }}
                value={this.getval(record.id, this.state.submitc)}
                onChange={(val) => {
                  let submitc = this.state.submitc;
                  submitc = submitc.map((item) => {
                    if (item.shopId == record.id) {
                      item.rate = val
                    }
                    return item
                  })
                  this.setState({
                    submitc
                  })

                }}>
              </InputNumber>
            )
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          if (selectedRowKeyc.indexOf(record.id) == -1) {
            return <span>选择后修改</span>
          } else {
            return <a onClick={() => {
              let postDatac = {
                "electricityMeterId": this.props.electricityMeterId,           //---------------电表id(必填)
                "shopId": record.id,                             //-------------产品线id(必填)
                "rate": this.getval(record.id,this.state.submitc)           //-------------分配比例(必填)(1-100之间整数)
              }
              this.setNewState("queryupdate", postDatac, (res) => {
                res&&message.success("操作成功");
                this.setNewState("queryNo", this.state.postDatas);
                this.setNewState("queryYes", this.state.postData, () => {
                  let res = this.props.system.queryYes.list;
                  this.setState({
                    selectedRowKeyc: [],
                    selectedRowKeys: [],
                    submitc: this.props.system.haveItemList,
                    submits: []
                  })
                });

              })


            }}>修改</a>
          }


        }


      }

    ]


    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("queryNo", this.state.postDatas);
      })
    }

    let pageChangec = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("queryYes", this.state.postData, () => {
          this.props.system.haveItemList ?
            this.setState({
              submitc: this.props.system.haveItemList
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
          <Card hoverable style={{ height: 660 }} title={`未选择的产品线`} extra={<span>选中了<a>{this.state.selectedRowKeys.length}</a>项</span>}>
            <Table bordered size="middle"
              rowSelection={rowSelections}
              dataSource={queryNo.list ? queryNo.list : []}
              loading={this.props.submittings}
              pagination={{
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: 10,
                showQuickJumper: true,
                current: queryNo.pageNum ? queryNo.pageNum : 1,
                total: queryNo.total ? parseInt(queryNo.total) : 0,
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
          <Card hoverable style={{ height: 660 }} title={<a>已选择的产品线</a>} extra={<span>选中了<a>{this.state.selectedRowKeyc.length}</a>项</span>}>
            <Table bordered size="middle"
              rowSelection={rowSelectionc}
              dataSource={queryYes.list ? queryYes.list : []}
              loading={this.props.submittingc}
              pagination={{
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: 10,
                showQuickJumper: true,
                current: queryYes.pageNum ? queryYes.pageNum : 1,
                total: queryYes.total ? parseInt(queryYes.total) : 0,
                onChange: pageChangec,
              }}
              rowKey='id'
              columns={columnc}
            >
            </Table>
          </Card>
        </Col>

      </Row>
    )
  }

}

export default EnergyChild



