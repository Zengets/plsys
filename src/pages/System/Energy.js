import {
  Table, Icon, Select, DatePicker,
  Popconfirm, Divider,
  message, Card, Modal
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import EnergyChild from './EnergyChild'
import DrawImage from "@/components/DrawImage"
import moment from 'moment'
let { Option } = Select;
import Abload from '@/components/Abload';
//EnequeryList,EneDequeryList,Enesave,EneDesave,EnedeleteById,uploadelectricityMeterReadDay
@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/EnequeryList'],
  submittings: loading.effects['system/EneDequeryList'],
  Enesave: loading.effects['system/Enesave'],
  EneDesave: loading.effects['system/EneDesave'],
}))
class Energy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      iftype: {
        name: "",
        value: ""
      },
      pcData: [],
      ydData: [],
      checkedValues: [],
      fv: false,
      fields: undefined,
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        electricityMeterName: "",  //----------电表名称(搜索条件)
        electricityMeterNo: "",   //-------------电表编号(搜索条件)
        companyId: ""
      },
      postUrl: "EnequeryList",
      postDatas: {
        "pageIndex": "1",  //---------------当前页码(必传)
        "pageSize": "10",  //---------------每页条数(必传)
        "electricityMeterId": ""   //----------电表主键(必填)
      },
      curitem: {},
      visible: false
    }
  }

  handleOk = e => {
    this.setNewState("Admincasave", {
      userId: this.state.curitem.id,
      roleIds: this.state.checkedValues
    }, () => {
      message.success("操作成功");
      this.setState({
        visible: false,
      });
    })
  };

  handleCancels = e => {
    this.setState({
      visible: false,
    });
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

  componentWillMount() {
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
    let curitem = this.state.curitem;
    if (this.state.curitem.id) {
      curitem = this.props.system[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        companyId: {
          value: null,
          type: "select",
          title: "组织",
          keys: "companyId",
          requires: true,
          option: this.props.system.companyList.map((item) => {
            return {
              name: item.companyName,
              id: item.id
            }
          })
        },
        electricityMeterNo: {
          value: null,
          type: "input",
          title: "电表编号",
          keys: "electricityMeterNo",
          requires: true
        },
        electricityMeterName: {
          value: null,
          type: "input",
          title: "电表名称",
          keys: "electricityMeterName",
          requires: true
        },
        boxName: {
          value: null,
          type: "input",
          title: "电柜名",
          keys: "boxName",
          requires: true
        },
        useArea: {
          value: null,
          type: "input",
          title: "用电区域",
          keys: "useArea",
          requires: true
        },
        mutualParams: {
          value: null,
          type: "inputnumber",
          title: "互感系数",
          min: 1,
          keys: "mutualParams",
          requires: true
        },
        isProdcut: {
          value: null,
          type: "select",
          title: "用电类型",
          keys: "isProdcut",
          requires: true,
          option: [
            {
              name: "生产用电",
              id: 1
            }, {
              name: "动力系统",
              id: 2
            }
          ]
        },
        remarks: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remarks",
          requires: false
        },

      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype,curitemz } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("Enesave", postData, () => {
          message.success("修改成功！");
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("Enesave", postData, () => {
          message.success("新增成功！");
          this.resetData();
        });
      } else if (iftype.value == "itemadd") {
        let postData = { ...values, electricityMeterId: curitem.id };
        this.setNewState("EneDesave", postData, () => {
          message.success("新增成功！");
          this.handleCancel();
          this.getChildTable(curitem, true);
        });
      }else if (iftype.value == "itemedit") {
        let postData = { ...values, id: curitemz.id };
        this.setNewState("evenupdate", postData, () => {
          message.success("修改成功！");
          this.handleCancel();
          this.getChildTable(curitem, true);
        });
      }

    });
  }

  onChange = (checkedValues, key) => {
    if (key == "1") {
      this.setState({
        pcData: checkedValues
      }, () => {
        let res = this.state.pcData.concat(this.state.ydData)
        this.setState({
          checkedValues: res
        })

      })
    } else {
      this.setState({
        ydData: checkedValues
      }, () => {
        let res = this.state.pcData.concat(this.state.ydData)
        this.setState({
          checkedValues: res
        })
      })
    }

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

  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
      postDatas: {
        electricityMeterId: record.id,
        pageIndex: 1,
        pageSize: 10,
      },
      curitem: record
    }, () => {
      this.setNewState("EneDequeryList", this.state.postDatas)
    })
  }

  onRefQrCode = (ref) => {
    this.childs = ref;
  }

  render() {
    let { postData, postDatas, expandedRowKeys, fv, fields, iftype, curitem } = this.state,
      { EnequeryList, EneDequeryList, departmentList, shopList, shopLists, companyList } = this.props.system;

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
    }, col = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 6,
      xxl: 6
    }

    const columns = [
      {
        title: '组织',
        dataIndex: 'companyName',
        key: 'companyName',
        ...getselectbox('companyId', companyList.map((item) => {
          return {
            dicName: item.companyName,
            dicKey: item.id
          }
        })),
        
      },
      {
        title: '电表编号',
        dataIndex: 'electricityMeterNo',
        key: 'electricityMeterNo',
        ...getsearchbox('electricityMeterNo'),
        
      },
      {
        title: '电表名称',
        dataIndex: 'electricityMeterName',
        key: 'electricityMeterName',
        ...getsearchbox('electricityMeterName'),
        
      },
      {
        title: '电柜名',
        dataIndex: 'boxName',
        key: 'boxName',
        
      },
      {
        title: '用电区域',
        dataIndex: 'useArea',
        key: 'useArea',
        
      },
      {
        title: '互感系数',
        dataIndex: 'mutualParams',
        key: 'mutualParams',
      },
      {
        title: '用电类型',
        dataIndex: 'isProdcutName',
        key: 'isProdcutName',
        ...getselectbox("isProdcut", [{
          dicName: "生产用电",
          dicKey: 1
        }, {
          dicName: "动力系统",
          dicKey: 2
        }])
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
      },
      {
        title: '二维码',
        dataIndex: 'qrCodeUrl',
        key: 'qrCodeUrl',
        render: (text, record) => <img onClick={(e) => {
          e.stopPropagation();
          Modal.info({
            maskClosable: true,
            title: `编号：${record.electricityMeterNo}   名称：${record.electricityMeterName}`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),
          });

        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          分配产品线比例
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 10,
                electricityMeterName: "",  //----------电表名称(搜索条件)
                electricityMeterNo: "",   //-------------电表编号(搜索条件)
                companyId: "",
                isProdcut: "",
              }
            }, () => {
              this.resetData();
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
        </a>
        </span>,
        dataIndex: 'fenpei',
        key: 'fenpei',
        render: (text, record) => <a onClick={(e) => {
          e.stopPropagation();
          this.setState({
            visible: true,
            curitem: record,
            iftype: {
              name: "分配产品线比例",
              value: "share"
            }
          })
        }}>比例</a>
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("EnequeryList", this.state.postData);
      })
    }, pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("EneDequeryList", this.state.postDatas);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    let renderAdd = (record) => {
      let column = [
        {
          title: '电表度数',
          dataIndex: 'electricityMeterDegree',
          key: 'electricityMeterDegree',
        },
        {
          title: '使用度数',
          dataIndex: 'useDegree',
          key: 'useDegree',
        },
        {
          title: '记录时间',
          dataIndex: 'time',
          key: 'time',
          render: (text, record) => <span>{record.year}-{record.month}-{record.day}</span>
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (text, record) => <a onClick={() => {
            this.setState({
              fields: {
                electricityMeterDegree: {
                  value: record.electricityMeterDegree,
                  type: "inputnumber",
                  title: "电表度数",
                  min: 1,
                  keys: "electricityMeterDegree",
                  requires: true
                },
              },
              fv: true,
              curitemz:record,
              iftype: {
                name: `修改电表度数`,
                value: "itemedit"
              }
            })
          }}>修改</a>
        },
        {
          title: <a onClick={() => {
            this.setState({
              fields: {
                electricityMeterDegree: {
                  value: null,
                  type: "inputnumber",
                  title: "电表度数",
                  min: 1,
                  keys: "electricityMeterDegree",
                  requires: true
                },
              },
              fv: true,
              iftype: {
                name: `新增${curitem.electricityMeterName}下的记录`,
                value: "itemadd"
              }
            })
          }}>新增记录</a>,
          dataIndex: 'adden',
          key: 'adden',
        },
      ]


      return <Table bordered
        size="middle"
        loading={this.props.submittings}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 10,
          showQuickJumper: true,
          current: EneDequeryList.pageNum ? EneDequeryList.pageNum : 1,
          total: EneDequeryList.total ? parseInt(EneDequeryList.total) : 0,
          onChange: pageChanges,
        }}
        rowKey='id'
        columns={column}
        dataSource={EneDequeryList.list ? EneDequeryList.list : []}
      >
      </Table>


    }
    function bodyparse(val) {
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
        <DrawImage name='电表二维码' onRef={this.onRefQrCode}></DrawImage>

        <Card title='电表列表' extra={<div style={{ display: "flex" }}>
          <a onClick={() => {
            let _it = this;
            function disabledDate(current) {
              // Can not select days before today and today
              return current && current > moment().endOf('day');
            }
            Modal.info({
              maskClosable: true,
              title: "请选择组织跟导出的时间",
              content: <div style={{ padding: "12px 0px" }}>
                <Select placeholder='请选择组织' style={{ width: "100%", marginBottom: 12 }} onChange={(val) => {
                  _it.setState({
                    companyId: val
                  })
                }}>
                  {
                    companyList.map((item) => {
                      return <Option value={item.id} key={item.id}>{item.companyName}</Option>
                    })
                  }
                </Select>
                <DatePicker.RangePicker placeholder={['开始时间', '结束时间']} style={{ width: "100%" }} allowClear={false} disabledDate={disabledDate} onChange={(val) => {
                  _it.setState({
                    startTime: val[0],
                    endTime: val[1]
                  })
                }} />
              </div>,
              onOk: () => {
                let { companyId, startTime, endTime } = _it.state;
                if (!companyId || !startTime || !endTime) {
                  message.warn("请选择组织跟时间")
                  return
                }
                message.loading("正在导出...")
                window.open(`/rs/electricityMeterReadDay/exportFile?companyId=${companyId}&startTime=${moment(startTime).format('YYYY-MM-DD')}&endTime=${moment(endTime).format('YYYY-MM-DD')}`);
              },
              okText: "导出",
              cancelText: "取消"
            })

          }}>导出电表电量</a>
          <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
          <span style={{ cursor: "pointer" }} onClick={() => {
            this.setState({
              iftype: {
                name: "新增电表",
                value: "add"
              },
            }, () => {
              this.setState({
                fv: true
              })
            })
          }}>新增</span>

          <div style={{ display: curitem.id ? "flex" : "none", alignItems: "center" }}>
            <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
            <a onClick={() => {
              this.setState({
                fields: {
                  companyId: {
                    ...fields.companyId,
                    value: curitem.companyId,
                    disabled: true
                  },
                  electricityMeterNo: {
                    ...fields.electricityMeterNo,
                    value: curitem.electricityMeterNo,
                  },
                  electricityMeterName: {
                    ...fields.electricityMeterName,
                    value: curitem.electricityMeterName,
                  },
                  boxName: {
                    ...fields.boxName,
                    value: curitem.boxName,
                  },
                  useArea: {
                    ...fields.useArea,
                    value: curitem.useArea,
                  },
                  mutualParams: {
                    ...fields.mutualParams,
                    value: curitem.mutualParams,
                  },
                  isProdcut: {
                    ...fields.isProdcut,
                    value: curitem.isProdcut,
                  },
                  remarks: {
                    ...fields.remarks,
                    value: curitem.remarks,
                  },
                },
              }, () => {
                this.setState({
                  fv: true,
                  iftype: {
                    name: "修改电表",
                    value: "edit"
                  },
                })
              })

            }}>修改</a>
            <Divider type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该电表？"}
              onConfirm={() => {
                this.setNewState("EnedeleteById", { id: curitem.id }, () => {
                  let total = this.props.system.EnequeryList.total,
                    page = this.props.system.EnequeryList.pageNum;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("EnequeryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </div>
          <Divider type='vertical' style={{ marginTop: 6 }}></Divider>
          <Abload reload={() => {
            this.resetData()
          }} postName="uploadelectricityMeterReadDay" filePath="http://www.plszems.com/download/电表补录导入模板.xlsx"></Abload>
          <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
          <span style={{ cursor: "pointer" }} onClick={() => {
            let postData = this.state.postData;
            delete postData.pageIndex;
            delete postData.pageSize;
            this.setNewState("csqueryQrCode", postData, () => {
              let data = this.props.system.csqueryQrCode.map((item, i) => {
                return {
                  positionNo: item.useArea,
                  equipmentNo: item.electricityMeterNo,
                  qrCodeUrl: item.qrCodeUrl
                }
              });
              this.childs.setAllCanvas(data, 18, 16, 250, 280)
            })
          }}>导出二维码</span>
        </div>
        }>
          <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
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
              current: EnequeryList.pageNum ? EnequeryList.pageNum : 1,
              total: EnequeryList.total ? parseInt(EnequeryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={EnequeryList.list ? EnequeryList.list : []}
            expandedRowRender={record => renderAdd(record)}
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
          >
          </Table>

          <CreateForm
            width={800}
            fields={this.state.fields}
            iftype={iftype}
            confirmLoading={iftype.value == "itemadd" ? this.props.EneDesave : this.props.Enesave}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          <Modal
            width={1000}
            title={iftype.name}
            visible={this.state.visible}
            onCancel={() => {
              this.setState({
                visible: false
              })
            }}
            footer={null}
          >
            <EnergyChild electricityMeterId={curitem.id}></EnergyChild>
          </Modal>


        </Card>
      </div>
    )
  }


}

export default Energy



