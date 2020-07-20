import {
  Table, Tree, Divider, Row, Col, Icon, Select, Alert, Popconfirm, message, Card, Modal, Button, Tag, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import { Map, Marker } from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation';

const { TreeNode } = Tree;

//jgqueryTreeList,syscomsave,syscomchangeStatus
@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/jgqueryTreeList'],
}))
class CompanyList extends React.Component {

  constructor(props) {
    super(props);
    let _it = this;
    this.amapEvents = {
      created: (Amap) => {
        AMap.plugin('AMap.Geocoder', () => {
          console.log(0)
          window.geocoder = new AMap.Geocoder();
        })

      }
    };

    this.state = {
      location: [],
      visible: false,
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
      },
      postUrl: "jgqueryTreeList",
      curitem: {}
    }
  }

  onCheck = (checkedKeys, info) => {
    message.destroy();
    if (this.state.iftype.liziyuan == 2) {
      message.warn("移动端无法操作")
    } else {
      this.setState({ checkedKeys });
    }

  };


  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/' + type,
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
      this.handleCancel()
    })
  }

  componentDidMount() {
    this.resetData();
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
    this.setState({
      fv: false,
    }, () => {
      setTimeout(() => {
        this.setState({
          fields: {
            companyCode: {
              value: null,
              type: "input",
              title: "编号",
              keys: "companyCode",
              requires: true,
            },
            companyName: {
              value: null,
              type: "input",
              title: "名称",
              keys: "companyName",
              requires: true,
            },
            companyAddress: {
              value: null,
              type: "input",
              title: "地址",
              keys: "companyAddress",
              requires: true,
            },
            companyType: {
              value: null,
              type: "select",
              title: "职能类型",
              keys: "companyType",
              requires: true,
              option: [{ name: "业务", id: 1 },
              { name: "非业务", id: 2}]
            },

            contant: {
              value: null,
              type: "input",
              title: "联系人",
              keys: "contant",
              requires: true,
            },
            telephone: {
              value: null,
              type: "input",
              title: "联系人手机号",
              keys: "telephone",
              requires: true,
            },
            remark: {
              value: null,
              type: "textarea",
              title: "备注",
              keys: "remark",
              requires: false,
            }

          },
        })
      }, 500);

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
      values.longitude = "";
      values.latitude = "";
      let _it = this;

      if (iftype.value == "addchild") {
        let postData = { departmentName: values.departmentName, parentId: curitem.companyCode ? "0" : curitem.key, companyId: curitem.companyId };
        _it.setNewState("jgsave", postData, () => {
          message.success("新增成功！");
          _it.resetData();
        });
      } else if (iftype.value == "editchild") {
        let postData = { departmentName: values.departmentName, id: curitem.companyCode ? "0" : curitem.key, companyId: curitem.companyId };
        _it.setNewState("jgsave", postData, () => {
          message.success("新增成功！");
          _it.resetData();
        });
      } else {
        window.geocoder.getLocation(values.companyAddress, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result中对应详细地理坐标信息
            var lnglat = result.geocodes[0].location;
            console.log(lnglat)
            values.longitude = lnglat.lng;
            values.latitude = lnglat.lat;
          } else {
            message.warn("无法获取到该地址的经纬度！")
          }

          if (!values.longitude) {
            return
          }

          if (iftype.value == "edit") {
            let postData = { ...values, id: curitem.key };
            _it.setNewState("syscomsave", postData, () => {
              message.success("修改成功！");
              _it.resetData();
            });
          } else if (iftype.value == "add") {
            let postData = { ...values };
            _it.setNewState("syscomsave", postData, () => {
              message.success("新增成功！");
              _it.resetData();
            });
          }

        })
      }








    });
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
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { jgqueryTreeList, nodeList, queryCount, company } = this.props.system;
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
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }



    const columns = [
      {
        title: '编号',
        dataIndex: 'companyCode',
        key: 'companyCode',
      },
      {
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        
      },
      {
        title: '地址',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        
      },
      {
        title: '联系人',
        dataIndex: 'contant',
        key: 'contant',
      },
      {
        title: '类型',
        dataIndex: 'companyTypeName',
        key: 'companyTypeName',
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: "状态",
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          record.companyCode ? <span>{text == 0 ? "停用" : "启用"}<Icon style={{ color: "#ff5000", paddingLeft: 8 }} type='sync' onClick={(e) => {
            e.stopPropagation()
            this.setNewState("syscomchangeStatus", {
              id: record.key,
              status: record.status == 1 ? "0" : "1"
            }, () => {
              this.resetData();
              message.success(record.title + "的状态修改成功")
            })

          }} /> </span> : null
        )
      },
      {
        title: '地图查看',
        dataIndex: 'map',
        key: 'map',
        render: (text, record) => (
          record.companyCode ?
            <a onClick={(e) => {
              e.stopPropagation()
              this.setState({
                location: { longitude: record.longitude, latitude: record.latitude },
                iftype: {
                  name: record.title,
                  value: "map"
                },
              }, () => {
                if (!record.longitude) {
                  message.warn("位置信息缺失，无法定位...");
                }
                this.setState({
                  visible: record.longitude ? true : false
                })
              })
            }}>打开地图</a> : null)
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return record.companyCode ?
            <span>
              <a onClick={(e) => {
                e.stopPropagation()
                this.setState({
                  iftype: {
                    name: "修改" + record.title,
                    value: "edit"
                  },
                  curitem:record,
                  fields: {
                    companyCode: {
                      ...fields.companyCode,
                      value: record.companyCode
                    },
                    companyName: {
                      ...fields.companyName,
                      value: record.title
                    },
                    companyAddress: {
                      ...fields.companyAddress,
                      value: record.companyAddress
                    },
                    contant: {
                      ...fields.contant,
                      value: record.contant
                    },
                    companyType:{
                      ...fields.companyType,
                      value: record.companyType
                    },
                    telephone: {
                      ...fields.telephone,
                      value: record.telephone
                    },
                    remark: {
                      ...fields.remark,
                      value: record.remark
                    }
                  },
                }, () => {
                  this.setState({
                    fv: true
                  })
                })
              }}>修改</a>
              <Divider type="vertical"></Divider>
              <a style={{ color: "#f50" }} onClick={(e) => {
                e.stopPropagation()
                this.setState({
                  fv: true,
                  curitem: record,
                  fields: {
                    departmentName: {
                      value: null,
                      type: "input",
                      title: "部门名称",
                      keys: "departmentName",
                      requires: true,
                    }
                  },
                  iftype: {
                    name: "新增" + record.title + "的部门",
                    value: "addchild"
                  }
                })
              }}>新增部门</a>
            </span>
            : <span>
              <a onClick={(e) => {
                e.stopPropagation()
                this.setState({
                  iftype: {
                    name: "修改" + curitem.title,
                    value: "editchild"
                  },
                  curitem:record,
                  fields: {
                    departmentName: {
                      value: record.title,
                      type: "input",
                      title: "部门名称",
                      keys: "departmentName",
                      requires: true,
                    }
                  },
                }, () => {
                  this.setState({
                    fv: true
                  })
                })
              }}>修改</a>
              <Divider type="vertical"></Divider>
              <Popconfirm
                okText="确认"
                cancelText="取消"
                placement="bottom"
                title={"确认删除该部门？"}
                onConfirm={() => {
                  this.setNewState("jgdeleteById", { id: curitem.key }, () => {
                    this.resetData();
                    message.success("删除成功！");
                  })
                }}>
                <a style={{ color: "#ff4800" }}>删除</a>
              </Popconfirm>
            </span>

        }
      },

    ]



    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} />;
      });

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.key === record.key) {
        return "selectedRow";
      }
      return null;
    };
    const pluginProps = {
      enableHighAccuracy: true,
      timeout: 10000,
      showButton: true,
      buttonPosition: 'RB',
    }, cols = {
      xs: 24,
      sm: 12,
      md: 9,
      lg: 9,
      xl: 9,
      xxl: 9
    }, col = {
      xs: 24,
      sm: 12,
      md: 5,
      lg: 5,
      xl: 5,
      xxl: 5
    }, cola = {
      xs: 24,
      sm: 12,
      md: 2,
      lg: 2,
      xl: 2,
      xxl: 2
    }, colb = {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 8,
      xl: 8,
      xxl: 8
    }


    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Map events={this.amapEvents}>
        </Map>
        <Card title={<span onClick={() => {
          console.log(window.geocoder)
        }}>组织架构列表</span>} extra={
          <div>
            {
              curitem.key && <span>
                <a onClick={() => {
                  message.loading("加载中...", 1)
                  this.setNewState("queryCount", { id: curitem.key }, () => {
                    this.setState({
                      iftype: {
                        name: "查看人员",
                        value: "seeUser"
                      },
                      visible: true
                    })
                  })

                }}>查看人员</a>
                <Divider type="vertical"></Divider>
              </span>
            }

            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增组织",
                  value: "add"
                },
                fv: true
              })
            }}>新增组织</a>



          </div>
        }>
          <Table bordered size="middle"
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            expandRowByClick
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            scroll={{ x: 1200, y: "59vh" }}
            loading={this.props.submitting}
            pagination={false}
            rowKey='key'
            columns={columns}
            dataSource={jgqueryTreeList ? jgqueryTreeList : []}
          >
          </Table>
          {
            fields &&
            <CreateForm
              fields={fields}
              data={{}}
              iftype={iftype}
              onChange={this.handleFormChange}
              wrappedComponentRef={this.saveFormRef}
              visible={fv}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
          }

          <Modal
            width={iftype.value == "map" ? 1000 : "90%"}
            style={{ top: iftype.value == "map" ? 60 : 20 }}
            visible={this.state.visible}
            title={iftype.name}
            onCancel={() => {
              this.setState({ visible: false })
            }}
            footer={null}
          >
            {
              iftype.value == "map" ? <div style={{ width: '100%', height: '500px', position: "relative" }}>
                <Map events={this.amapEvents} center={this.state.location}>
                  <Marker position={this.state.location} />
                  <Geolocation {...pluginProps} />
                  <Button style={{ position: "absolute", right: 18, top: 18 }} type="primary" shape="round" icon="sync" onClick={() => {
                    let t = JSON.parse(JSON.stringify(this.state.location))
                    this.setState({
                      location: t
                    })
                  }} />
                </Map>
              </div> : <div>
                  <Row gutter={12}>
                    <Col {...colb}>
                      <Card hoverable>
                        <p style={{ margin: 0 }}><span style={{ fontSize: 16 }}>名称: </span><a>{company.companyName}</a></p>
                      </Card>
                    </Col>
                    <Col {...cola}>
                      <Card hoverable>
                        <p style={{ margin: 0 }}><span style={{ fontSize: 16 }}>编号: </span><a>{company.companyCode}</a></p>
                      </Card>
                    </Col>
                    <Col {...cols}>
                      <Card hoverable>
                        <p style={{ margin: 0 }}><span style={{ fontSize: 16 }}>地址: </span><a>{company.companyAddress}</a></p>
                      </Card>
                    </Col>
                    <Col {...col}>
                      <Card hoverable>
                        <p style={{ margin: 0 }}><span style={{ fontSize: 16 }}>总人数: </span><a>{company.count}人</a></p>
                      </Card>
                    </Col>

                    <Col span={24}>
                      <Card style={{ marginTop: 16 }}>
                        {
                          queryCount.dataList ?
                            queryCount.dataList.map((item, i) => (<div key={i} style={{ marginBottom: 12 }}>
                              <div><span style={{ fontSize: 16 }}>部门名称：</span> <a>{item.departName} </a>   <span style={{ fontSize: 16, paddingLeft: 10 }}>部门人数：</span><a>{item.num}人</a> <Icon type="arrow-down" style={{ color: "#f50" }} /></div>
                              <div style={{ backgroundColor: "#f0f0f0", padding: "12px 12px 4px 12px", marginTop: 12 }}>
                                {
                                  item.name.length != 0 ?
                                    item.name.map((ztem, j) => (<Tag style={{ marginBottom: 8, width: 88 }} key={j}><span style={{
                                      lineHeight: "27px",
                                      display: "inline-block", width: 70, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", height: 22
                                    }}>{ztem}</span></Tag>)) : <span style={{ marginBottom: 8, display: "inline-block", color: "#333" }}>暂无人员</span>
                                }
                              </div>

                            </div>)) :
                            <Empty></Empty>
                        }


                      </Card>
                    </Col>


                  </Row>




                </div>
            }

          </Modal>

        </Card>
      </div>
    )
  }


}

export default CompanyList



