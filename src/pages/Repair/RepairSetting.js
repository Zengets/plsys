import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty,
  Transfer, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox'
import Abload from '@/components/Abload';
const FormItem = Form.Item;
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;

@connect(({ repair, loading }) => ({
  repair,
  submitting: loading.effects['repair/equipmentqueryList'],
  submittings: loading.effects['repair/equipmentqueryNoByUserId'],
  submittingc: loading.effects['repair/equipmentqueryByUserId'],
  loader: loading.effects['verb/association'],
}))
class RepairSetting extends React.Component {

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
        "chargeType": "2",//string 负责类型*(0维修,1保养)
        "userId": "",//Long 负责人id
        "equipmentNo": "",//string 设备编号
        "equipmentName": ""//string 设备名称
      },
      postDatas: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        "chargeType": "2",//string 负责类型*(0维修,1保养)
        "userId": ""//Long 负责人id*
      },
      postDatac: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        "chargeType": "2",//string 负责类型*(0维修,1保养)
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

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'repair/' + type,
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
    this.resetData();
    this.setNewState('deviceTypequeryTreeList', null);

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

    this.setNewState("equipmentsavec", {
      "userId": charge,
      "chargeType": "2",
      "equipIds": haveId
    }, () => {
      message.success("操作成功");
      this.setNewState("equipmentqueryNoByUserId", postDatas);
      this.setNewState("equipmentqueryByUserId", postDatac, () => {
        let res = this.props.repair.equipmentqueryByUserId.list;
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
  handleSearchs = (selectedKeys, dataIndex) => {
    let postUrl = "equipmentqueryNoByUserId";
    this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatas)
    });
  };
  handleSearchc = (selectedKeys, dataIndex) => {
    let postUrl = "equipmentqueryByUserId";
    this.setState({ postDatac: { ...this.state.postDatac, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatac)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }
  onRefs = (ref) => {
    this.childs = ref;
  }
  onRefc = (ref) => {
    this.childc = ref;
  }


  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, charge, selectedRowKeys, selectedRowKeyc, postDatas, postDatac } = this.state,
      { equipmentqueryList, userList, uiassociation, equipmentqueryNoByUserId, equipmentqueryByUserId, deviceTypequeryTreeList, companyList } = this.props.repair;
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
    }, getsearchboxs = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxs = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getsearchboxc = (key) => {
      if (this.childc) {
        return this.childc.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxc = (key, option) => {
      if (this.childc) {
        return this.childc.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    };

    const columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo')
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName')
      },
      {
        title: '验证人',
        dataIndex: 'userName',
        key: 'userName',
        ...getselectbox('userId', userList ? userList.map((item) => {
          return {
            dicName: item.userName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: "组织",
        dataIndex: 'companyName',
        key: 'companyName',
        ...getselectbox("companyId", companyList ? companyList.map((item) => {
          return {
            dicKey: item.id,
            dicName: item.companyName
          }
        }) : null)
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          联系电话
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                equipmentName: "",
                equipmentNo: "",
                userId: "",
                companyId: ""
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
          </a>
        </span>,
        dataIndex: 'telephone',
        key: 'telephone',
      },


    ]

    const columnes = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchboxs("equipmentNo")
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchboxs("positionNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchboxs("equipmentName")
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectboxs('equipmentTypeId', deviceTypequeryTreeList),
      },
    ]
    const columnec = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchboxc("equipmentNo")
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchboxc("positionNo")
      },
      {
        title: '名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchboxc("equipmentName")
      },
      {
        title: '类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectboxc('equipmentTypeId', deviceTypequeryTreeList),
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
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearchs} postData={this.state.postDatas}></SearchBox>
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearchc} postData={this.state.postDatac}></SearchBox>
        <Card title='验证负责人' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
           <Tooltip title="关联设备负责人--选择一个公司，同一产品线下的人员和设备,根据人员拥有的移动端(维修工 / 验证员 / 检查员保养员 )的角色,自动关联设备(维修 / 验证 / 点检 / 保养)负责人">
              <a disabled={this.props.loader} onClick={() => {
                let _it = this;
                this.setNewState("queryBusinessByUserId", null, () => {
                  Modal.confirm({
                    title: "选择公司",
                    content: <div style={{paddingTop:12}}>
                      <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear
                        onChange={(val) => {
                          _it.setState({
                            companyId: val,
                          })
                        }}
                      >
                        {
                          _it.props.repair.queryBusinessByUserId ?
                          _it.props.repair.queryBusinessByUserId.map((item) => {
                              return (<Option value={item.id} key={item.id}>{item.companyName}</Option>)
                            }) : ""
                        }
                      </Select>
                    </div>,
                    onOk: () => {
                      if(!_it.state.companyId){
                        message.warn("请先选择公司！")
                        return
                      }
                      message.loading("自动关联中,该过程需要较长时间,您可以进行其他操作...", 2)
                      _it.setNewState("association", {companyId:_it.state.companyId}, () => {
                        _it.resetData()
                      });
                    },
                    okText: "立即关联",
                    cancelText: "取消"
                  })
                })




              }}>自动关联</a>
            </Tooltip>
            <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
            <Abload reload={() => {
              this.resetData()
            }} data={null} postName="uploaduserEquipment" left={0} filePath="http://www.plszems.com/download/设备负责人导入模板.xlsx"></Abload>
            <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增验证负责人设置",
                  value: "add"
                },
                fv: !fv
              })
            }}>{fv ? "返回" : "新增"}</a>
            <Divider style={{ display: curitem.id ? "block" : "none", marginTop: 6 }} type="vertical"></Divider>
            <a style={{ display: curitem.id ? "block" : "none" }} onClick={() => {
              this.setNewState("uiassociation", {
                equipmentId:curitem.equipmentId,
                chargeType:"2"
              }, () => {
                this.setState({
                  visible: true,
                  iftype: {
                    name: `修改设备${curitem.equipmentName}的验证负责人`,
                    value: "edit"
                  },
                  curitem: curitem,
                })
              })
            }}>修改</a>
            <Divider style={{ display: curitem.id ? "block" : "none", marginTop: 6 }} type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该验证负责人设置？"}
              onConfirm={() => {
                this.setNewState("equipmentdeleteByIdc", { id: curitem.id }, () => {
                  let total = this.props.repair.equipmentqueryList.total,
                    page = this.props.repair.equipmentqueryList.pageNum;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("equipmentqueryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ display: curitem.id ? "block" : "none", color: "#ff4800" }}>删除</a>
            </Popconfirm>
            <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
            <a onClick={() => {
              this.setState({
                visible: true,
                iftype: {
                  name: "替换负责人",
                  value: "rechange"
                }
              })
            }}>替换负责人</a>
            <Divider type='vertical' style={{ marginTop: 3 }}></Divider>
            <a onClick={() => {
              message.loading("正在导出文件...")
            }} href={`/rs/userEquipment/exportFile?${bodyparse(this.state.postData)}`} target="_blank">
              导出负责人
            </a> 


          </div>

        }>
          <div style={{ height: fv ? "auto" : 0, overflow: "hidden", transition: "all 0.4s" }}>
            <p>验证负责人：</p>
            <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={charge}
              onChange={(val) => {
                this.setState({
                  charge: val,
                  postDatas: {
                    ...postDatas, userId: val, pageIndex: 1
                  },
                  postDatac: {
                    ...postDatac, userId: val, pageIndex: 1
                  }
                }, () => {
                  this.setNewState("equipmentqueryNoByUserId", this.state.postDatas);
                  this.setNewState("equipmentqueryByUserId", this.state.postDatac, () => {
                    let res = this.props.repair.equipmentqueryByUserId.list;
                    this.setState({
                      haveIds: res[0] ? res[0].haveIds : []
                    })
                  });
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
            <div style={{ height: charge ? 0 : 700, overflow: "hidden", marginTop: charge ? 0 : 24, transition: "all 0.4s", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Empty description={
                <span>
                  请先选择 <a>验证负责人<Icon type="arrow-up" /></a>
                </span>
              } />
            </div>

            <Row gutter={24} style={{ height: charge ? 700 : 0, overflow: "hidden", marginTop: charge ? 24 : 0, transition: "all 0.4s" }}>
              <Col span={11} style={{ height: 700 }}>
                <Card style={{ height: 640 }} title={<span>未选择的设备 <a style={{ color: "#f50", fontSize: 14 }} onClick={() => {
                  this.setState({
                    postDatas: {
                      ...postDatas,
                      "pageIndex": 1,//int 当前页码*
                      "pageSize": 10,//int 每页条数*

                      "equipmentNo": "",
                      "equipmentName": "",
                      "equipmentTypeId": "",
                      "positionNo": ""
                    }
                  }, () => {
                    this.setNewState('equipmentqueryNoByUserId', this.state.postDatas);
                  })
                }}>
                  <Icon type="reload" style={{ paddingRight: 4, paddingLeft: 8 }} />
                  重置
          </a></span>} extra={<span>选中了<a>{this.state.selectedRowKeys.length}</a>台设备</span>}>
                  <Table bordered size="middle"
                    rowSelection={rowSelections}
                    dataSource={equipmentqueryNoByUserId.list ? equipmentqueryNoByUserId.list : []}
                    loading={this.props.submittings}
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 10,
                      showQuickJumper: true,
                      current: equipmentqueryNoByUserId.pageNum ? equipmentqueryNoByUserId.pageNum : 1,
                      total: equipmentqueryNoByUserId.total ? parseInt(equipmentqueryNoByUserId.total) : 0,
                      onChange: pageChanges,
                    }}
                    rowKey='id'
                    columns={columnes}
                  >

                  </Table>

                </Card>
              </Col>
              <Col span={2} style={{ height: 700, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <Button type="primary" shape="circle" icon="double-right" size="small" style={{ marginBottom: 24 }} disabled={selectedRowKeys.length == 0} onClick={() => { this.refreshData(true) }} />
                <Button type="primary" shape="circle" icon="double-left" size="small" disabled={selectedRowKeyc.length == 0} onClick={() => { this.refreshData(false) }} />
              </Col>
              <Col span={11} style={{ height: 700 }}>
                <Card style={{ height: 640 }} title={<a>已选择的设备
                  <a style={{ color: "#f50", fontSize: 14 }} onClick={() => {
                    this.setState({
                      postDatac: {
                        ...postDatac,
                        "pageIndex": 1,//int 当前页码*
                        "pageSize": 10,//int 每页条数*
                        "equipmentNo": "",
                        "equipmentName": "",
                        "equipmentTypeId": "",
                        "positionNo": ""
                      }
                    }, () => {
                      this.setNewState("equipmentqueryByUserId", this.state.postDatac, () => {
                        let res = this.props.repair.equipmentqueryByUserId.list;
                        this.setState({
                          haveIds: res[0] ? res[0].haveIds : []
                        })
                      });
                    })
                  }}>
                    <Icon type="reload" style={{ paddingRight: 4, paddingLeft: 8 }} />
                    重置
                  </a>
                </a>} extra={<span>选中了<a>{this.state.selectedRowKeyc.length}</a>设备</span>}>
                  <Table bordered size="middle"
                    rowSelection={rowSelectionc}
                    dataSource={equipmentqueryByUserId.list ? equipmentqueryByUserId.list : []}
                    loading={this.props.submittingc}
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 10,
                      showQuickJumper: true,
                      current: equipmentqueryByUserId.pageNum ? equipmentqueryByUserId.pageNum : 1,
                      total: equipmentqueryByUserId.total ? parseInt(equipmentqueryByUserId.total) : 0,
                      onChange: pageChangec,
                    }}
                    rowKey='id'
                    columns={columnec}
                  >
                  </Table>
                </Card>

              </Col>




            </Row>








          </div>
          <div style={{ height: !fv ? "auto" : 0, overflow: "hidden" }}>
            <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
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
            visible={this.state.visible}
            title={this.state.iftype.name}
            onCancel={() => { this.setState({ visible: false }) }}
            onOk={() => {
              if(iftype.value !== "rechange"){

                this.setNewState("equipmentupdateByIdz", {
                  "id": curitem.id,//主键*
                  "userId": curitem.userId,//负责人id*
                  "chargeType": "2",//负责类型*
                  "equipmentId": curitem.equipmentId
                }, () => { this.resetData(); message.success("操作成功"); this.setState({ visible: false }) })

              }else{
                if(!this.state.charges||!this.state.chargec){
                  message.error("请选择人员")
                  return
                } 
                 this.setNewState("replaceUser", {
                  "oldUserId": this.state.charges,//主键*
                  "newUserId": this.state.chargec,//负责人id*
                  "chargeType": "2",//负责类型*
                }, () => { this.resetData(); message.success("操作成功"); this.setState({ visible: false }) })

              }
                

            }}
          >
            {
              iftype.value !== "rechange" ?
                <div>
                  <p>维修负责人：</p>
                  <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={curitem.userId}
                    onChange={(val) => {
                      this.setState({
                        curitem: { ...curitem, userId: val }
                      })
                    }}
                  >
                    {
                      uiassociation ?
                        uiassociation.map((item) => {
                          return (<Option value={item.id} key={item.id}>{item.userName}</Option>)
                        }) : ""
                    }
                  </Select>
                </div> : <div>
                  <p>原负责人：</p>
                  <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={this.state.charges}
                    onChange={(val) => {
                      this.setState({
                        charges: val,
                        chargec: "",
                      }, () => {
                        this.setNewState("queryUpdateByUserId", {
                          "userId": val,   //------------原负责人id*
                          "chargeType": "2"    //----------------负责类型(0;点检   1:保养    2:验证     3:维修)*
                        },()=>{
                          this.setState({
                            queryUpdateByUserId:this.props.repair.queryUpdateByUserId
                          })
                        })
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
                  <p style={{ marginTop: 12 }}>现负责人：</p>
                  <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={this.state.chargec}
                    onChange={(val) => {
                      this.setState({
                        chargec: val,
                      })
                    }}
                  >
                    {
                      this.state.queryUpdateByUserId ?
                        this.state.queryUpdateByUserId.map((item) => {
                          return (<Option value={item.id} key={item.id}>{item.userName}</Option>)
                        }) : ""
                    }
                  </Select>



                </div>
            }

          </Modal>
        
        
        </Card>
      </div>
    )
  }


}

export default RepairSetting



