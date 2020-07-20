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

//composequeryList,queryByBuddleId,queryNoByBuddleId,composesave
@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/composequeryList'],
  submittings: loading.effects['device/queryNoByBuddleId'],
  submittingc: loading.effects['device/queryByBuddleId'],
}))
class DeviceCompose extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      postData: {
        "pageIndex": 1,
        "pageSize": 10,
        "shopId": "",//产品线id，筛选条件
        "departmentId": "",//部门id，筛选条件
        "status": "",//状态，筛选条件
        "equipmentNo": "",//设备编号，筛选条件
        "positionNo": "",//位置号，筛选条件
        "equipmentName": "",//设备名，筛选条件
        "keepUserName": "" //保管人负责人id，筛选条件
      },
      postDatas: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        "id": "",//组设备id ，必填
        "equipmentName": "",//设备名，筛选条件
        "equipmentNo": "",//设备编号，筛选条件
        "positionNo": ""//位置好，筛选条件
      },
      postDatac: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 10,//int 每页条数*
        "id": "",//组设备id ，必填
        "equipmentName": "",//设备名，筛选条件
        "equipmentNo": "",//设备编号，筛选条件
        "positionNo": ""//位置好，筛选条件
      },
      postUrl: "composequeryList",
      curitem: {},
      selectedRowKeys: [],
      selectedArr: [],
      selectedRowKeyc: [],
      haveIds: []
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  onSelectChanges = selectedRowKeys => {
    this.setState({ selectedRowKeys });
    let { selectedArr } = this.state;
    let selectedKey = selectedArr.map((item) => { return item.equipmentId })
    function getProcess(params) {
      if (selectedKey.indexOf(params) == -1) {
        return ''
      } else {
        return selectedArr.filter((item) => { return item.equipmentId == params })[0].process
      }

    }

    let newArr = selectedRowKeys.map((item) => {
      return {
        equipmentId: item,
        process: getProcess(item)
      }
    })

    this.setState({
      selectedArr: newArr
    })

  };

  onSelectChangec = selectedRowKeys => {
    this.setState({ selectedRowKeyc: selectedRowKeys });
  };


  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.setState({
        fv: false
      })
    })
  }

  componentDidMount() {
    this.resetData();
  }

  refreshData(ifs) {
    let { haveIds, selectedRowKeys, selectedRowKeyc, postDatas, postDatac, selectedArr } = this.state;
    let haveId = JSON.parse(JSON.stringify(haveIds))
    console.log(haveId)
    if (ifs) {
      selectedArr.map((item) => {
        haveId.push(item)
      });
    } else {
      haveId = haveId.filter((item) => { return selectedRowKeyc.indexOf(item.equipmentId) == -1 });
    }

    this.setNewState("composesave", {
      "buddleEquipmentId": this.state.curitem.id,
      "equipmentList": haveId
    }, () => {
      message.success("操作成功");
      this.setNewState("queryNoByBuddleId", postDatas);
      this.setNewState("queryByBuddleId", postDatac, () => {
        let haveIds = this.props.device.have.map((item) => {
          return {
            equipmentId: item.equipmentId,
            process: item.process,
          }
        });
        this.setState({
          haveIds: haveIds ? haveIds : [],
          selectedRowKeyc: [],
          selectedRowKeys: []
        })
      });


    })

  }

  saveData() {
    let { haveIds, selectedRowKeys, selectedRowKeyc, postDatas, postDatac, selectedArr } = this.state;
    let haveId = JSON.parse(JSON.stringify(haveIds))

    this.setNewState("composesave", {
      "buddleEquipmentId": this.state.curitem.id,
      "equipmentList": haveId
    }, () => {
      message.success("修改成功");
      this.setNewState("queryNoByBuddleId", postDatas);
      this.setNewState("queryByBuddleId", postDatac, () => {
        let haveIds = this.props.device.have.map((item) => {
          return {
            equipmentId: item.equipmentId,
            process: item.process,
          }
        });
        this.setState({
          haveIds: haveIds ? haveIds : [],
          selectedRowKeyc: [],
          selectedRowKeys: []
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
    let postUrl = "queryNoByBuddleId";
    this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatas)
    });
  };

  handleSearchc = (selectedKeys, dataIndex) => {
    let postUrl = "queryByBuddleId";
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
    let { postData, postUrl, fv, fields, iftype, curitem, selectedRowKeys, selectedRowKeyc, postDatas, postDatac, selectedArr, haveIds } = this.state,
      { composequeryList, userList, queryNoByBuddleId, queryByBuddleId, search } = this.props.device;
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
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
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
        title: '编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo'),
        width: 200
      },
      {
        title: '产品规格',
        dataIndex: 'manufactureContent',
        key: 'manufactureContent',
        ...getsearchbox('manufactureContent'),
      },
      {
        title: '名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName')
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox('positionNo')
      },
      {
        title: '类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        key: 'statusName',
        ...getselectbox('status', search.equipmentStatusList),
        render: (text, record) => <a style={{
          color: record.status == 0 ? "green" :
            record.status == 1 ? "#398dcd" :
              record.status == 2 ? "#999" :
                record.status == 5 ? "#ff5000" :
                  "lightred"
        }}>{text}</a>
      },

      {
        title: '型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
      },
      {
        title: '所在部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        ...gettreeselectbox('departmentId', search.departmentDataList ? search.departmentDataList : [])
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox('shopId', search.shopList ? search.shopList.map((item) => {
          return {
            dicName: item.shopName,
            dicKey: item.id
          }
        }) : null)
      },
      {
        title: '保管负责人',
        dataIndex: 'keepUserName',
        key: 'keepUserName',
        ...getsearchbox('keepUserName')
      },
      {
        title: '工序',
        dataIndex: 'process',
        key: 'process',
        render: (text, record) => <span>{record.children ? "工序一" : text}</span>
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          二维码
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                "pageIndex": 1, //(int)页码
                "pageSize": 10, //(int)条数
                "shopId": "",//产品线id，筛选条件
                "manufactureContent": "",
                "departmentId": "",//部门id，筛选条件
                "status": "",//状态，筛选条件
                "equipmentNo": "",//设备编号，筛选条件
                "positionNo": "",//位置号，筛选条件
                "equipmentName": "",//设备名，筛选条件
                "keepUserName": "" //保管人负责人id，筛选条件
              }
            }, () => {
              this.setNewState('composequeryList', this.state.postData);
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
          </a>
        </span>,
        dataIndex: 'qrCodeUrl',
        key: 'qrCodeUrl',
        render: (text, record) => (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览${record.equipmentName}的二维码`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),

          });
        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
      }
    ];

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
        ...getsearchboxs("equipmentName"),
      },
      {
        title: "工序",
        dataIndex: "process",
        key: "process",
        width: 120,
        render: (text, record) => {
          if (selectedRowKeys.indexOf(record.id) != -1) {
            return <Select size='small' style={{ width: 100 }}
              placeholder='请选择工序'
              value={selectedArr.filter((item) => { return item.equipmentId == record.id })[0].process} onChange={(val) => {
                let newArr = selectedArr.map((item) => {
                  if (item.equipmentId == record.id) {
                    item.process = val
                  }
                  return item
                })
                this.setState({
                  selectedArr: newArr
                })
              }}>
              <Option value="工序二">工序二</Option>
              <Option value="工序三">工序三</Option>
            </Select>
          } else {
            return <span style={{ color: "#999" }}>请选择</span>
          }

        }
      }
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
        title: '工序',
        dataIndex: 'process',
        key: 'process',
        width: 120,
        render: (text, record) => {
          if (selectedRowKeyc.indexOf(record.id) != -1) {
            return <Select size='small' style={{ width: 100 }}
              placeholder='请选择工序'
              value={haveIds.filter((item) => { return item.equipmentId == record.id })[0].process} onChange={(val) => {
                let newArr = haveIds.map((item) => {
                  if (item.equipmentId == record.id) {
                    item.process = val
                  }
                  return item
                })
                this.setState({
                  haveIds: newArr
                })
              }}>
              <Option value="工序二">工序二</Option>
              <Option value="工序三">工序三</Option>
            </Select>
          } else {
            return <span style={{ color: "#999" }}>{text}</span>
          }

        }
      }

    ]



    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("composequeryList", this.state.postData);
      })
    }

    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("queryNoByBuddleId", this.state.postDatas);
      })
    }
    let pageChangec = (page) => {
      this.setState({
        postDatac: { ...this.state.postDatac, pageIndex: page }
      }, () => {
        this.setNewState("queryByBuddleId", this.state.postDatac);
      })
    }
    let col = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 7,
      xl: 7,
      xxl: 7
    }, cols = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 3,
      xl: 3,
      xxl: 3
    }
    const rowClassNameFn = (record, index) => {
      if (record.children) {
        const { curitem } = this.state;
        if (curitem && curitem.id === record.id) {
          return "selectedRow";
        }
      } else {
        return null;
      }
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
        <Card title='设备组合' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Abload reload={() => {
              this.resetData()
            }} data={null} postName="uploadbuddleEquipment" left={0} filePath="http://www.plszems.com/download/设备组合导入模板.xlsx"></Abload>
            <Divider style={{ display: curitem.id ? "block" : "none", marginTop: 6 }} type="vertical"></Divider>
            <a style={{ display: curitem.id ? "block" : "none" }} onClick={() => {
              if (fv) {
                this.resetData()
              } else {
                this.setNewState("queryNoByBuddleId", { ...postDatas, id: curitem.id });
                this.setNewState("queryByBuddleId", { ...postDatac, id: curitem.id }, () => {
                  let haveIds = this.props.device.have.map((item) => {
                    return {
                      equipmentId: item.equipmentId,
                      process: item.process,
                    }
                  });
                  this.setState({
                    haveIds: haveIds ? haveIds : [],
                    selectedRowKeyc: [],
                    selectedRowKeys: [],
                    iftype: {
                      name: "新增设备组合设置",
                      value: "add"
                    },
                    fv: !fv,
                    postDatas: { ...postDatas, id: curitem.id },
                    postDatac: { ...postDatac, id: curitem.id }
                  })
                });
              }



            }}>{fv ? "取消" : "编辑"}</a>
            <Divider type='vertical' style={{ marginTop: 6 }}></Divider>
            <a onClick={() => {
              message.loading("正在导出文件...")
            }} href={`/rs/buddleEquipment/exportFile?${bodyparse(this.state.postData)}`} target="_blank">
              导出设备组合
            </a>
          </div>

        }>
          <div style={{ height: fv ? "auto" : 0, overflow: "hidden", transition: "all 0.4s" }}>
            {
              fv && <Row gutter={24} style={{ height: fv ? 750 : 0, overflow: "hidden", marginTop: fv ? 24 : 0, transition: "all 0.4s" }}>
                <Col span={11} style={{ height: 750 }}>
                  <Card style={{ height: 690 }} title={<span>未选择的设备 <a style={{ color: "#f50", fontSize: 14 }} onClick={() => {
                    this.setState({
                      postDatas: {
                        ...postDatas,
                        "pageIndex": 1,//int 当前页码*
                        "pageSize": 10,//int 每页条数*
                        "equipmentNo": "",
                        "equipmentName": "",
                        "positionNo": ""
                      }
                    }, () => {
                      this.setNewState('queryNoByBuddleId', this.state.postDatas);
                    })
                  }}>
                    <Icon type="reload" style={{ paddingRight: 4, paddingLeft: 8 }} />
                    重置
                    </a></span>} extra={<span>选中了<a>{this.state.selectedRowKeys.length}</a>台设备</span>}>
                    <Table bordered size="middle"
                      rowSelection={rowSelections}
                      dataSource={this.props.device.queryNoByBuddleId.list ? this.props.device.queryNoByBuddleId.list : []}
                      loading={this.props.submittings}
                      pagination={{
                        showTotal: total => `共${total}条`, // 分页
                        size: "small",
                        pageSize: 10,
                        showQuickJumper: true,
                        current: this.props.device.queryNoByBuddleId.pageNum ? this.props.device.queryNoByBuddleId.pageNum : 1,
                        total: this.props.device.queryNoByBuddleId.total ? parseInt(this.props.device.queryNoByBuddleId.total) : 0,
                        onChange: pageChanges,
                      }}
                      rowKey='id'
                      columns={columnes}
                    >

                    </Table>

                  </Card>
                </Col>
                <Col span={2} style={{ height: 750, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                  <Button type="primary" shape="circle" icon="double-right" size="small" style={{ marginBottom: 24 }} disabled={selectedRowKeys.length == 0} onClick={() => { this.refreshData(true) }} />
                  <Button type="primary" shape="circle" icon="double-left" size="small" disabled={selectedRowKeyc.length == 0} onClick={() => { this.refreshData(false) }} />
                </Col>
                <Col span={11} style={{ height: 750 }}>
                  <Card style={{ height: 690 }} title={<a>
                    已选择的设备
                  <a style={{ color: "#f50", fontSize: 14 }} onClick={() => {
                      this.setState({
                        postDatac: {
                          ...postDatac,
                          "pageIndex": 1,//int 当前页码*
                          "pageSize": 10,//int 每页条数*
                          "equipmentNo": "",
                          "equipmentName": "",
                          "positionNo": ""
                        }
                      }, () => {
                        this.setNewState("queryByBuddleId", this.state.postDatac, () => {
                          let haveIds = this.props.device.have.map((item) => {
                            return {
                              equipmentId: item.equipmentId,
                              process: item.process,
                            }
                          });
                          this.setState({
                            haveIds: haveIds ? haveIds : []
                          })
                        });
                      })
                    }}>
                      <Icon type="reload" style={{ paddingRight: 4, paddingLeft: 8 }} />
                      重置
                  </a>
                  </a>} extra={<span>选中了<a>{this.state.selectedRowKeyc.length}</a>设备
                    {selectedRowKeyc.length > 0 && <Divider type='vertical' />}
                    {selectedRowKeyc.length > 0 && <Tag style={{ cursor: "pointer" }} color="#108ee9" onClick={() => {
                      this.saveData()
                    }}>修改</Tag>}
                  </span>}>
                    <Table bordered size="middle"
                      rowSelection={rowSelectionc}
                      dataSource={this.props.device.queryByBuddleId.list ? this.props.device.queryByBuddleId.list : []}
                      loading={this.props.submittingc}
                      pagination={{
                        showTotal: total => `共${total}条`, // 分页
                        size: "small",
                        pageSize: 10,
                        showQuickJumper: true,
                        current: this.props.device.queryByBuddleId.pageNum ? this.props.device.queryByBuddleId.pageNum : 1,
                        total: this.props.device.queryByBuddleId.total ? parseInt(this.props.device.queryByBuddleId.total) : 0,
                        onChange: pageChangec,
                      }}
                      rowKey='id'
                      columns={columnec}
                    >
                    </Table>
                  </Card>
                </Col>
              </Row>

            }
          </div>
          <div style={{ height: !fv ? "auto" : 0, overflow: "hidden" }}>
            <Table bordered size="middle" scroll={{ x: 1440, y: "59vh" }}
              onRow={record => {
                return {
                  onClick: event => {
                    if (record.children) {
                      this.setState({ curitem: record });
                    } else {
                      this.setState({ curitem: {} });
                    }
                  }, // 点击行
                };
              }}
              expandRowByClick
              rowClassName={(record, index) => rowClassNameFn(record, index)}
              loading={this.props.submitting}
              pagination={{
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: 10,
                showQuickJumper: true,
                current: composequeryList.pageNum ? composequeryList.pageNum : 1,
                total: composequeryList.total ? parseInt(composequeryList.total) : 0,
                onChange: pageChange,
              }}
              rowKey='id'
              columns={columns}
              dataSource={composequeryList.list ? composequeryList.list : []}
            >
            </Table>
          </div>
        </Card>
      </div>
    )
  }


}

export default DeviceCompose



