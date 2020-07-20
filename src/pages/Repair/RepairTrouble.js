import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment'
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'
import Abload from '@/components/Abload';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ repair, loading }) => ({
  repair,
  submitting: loading.effects['repair/TroublequeryTreeList'],
}))
class RepairTrouble extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      expandedRowKeys: [],
      fields: {
        faultName: {
          value: null,
          type: "input",
          title: "故障名称",
          keys: "faultName",
          requires: true,
        },
        faultCode: {
          value: null,
          type: "input",
          title: "故障代码",
          keys: "faultCode",
          requires: true,
        },
        faultPhenomenon: {
          value: null,
          type: "input",
          title: "故障现象",
          keys: "faultPhenomenon",
          requires: true,
        },
        faultSolution: {
          value: null,
          type: "input",
          title: "处理方法",
          keys: "faultSolution",
          requires: true,
        },
        equipmentTypeName: {
          value: null,
          type: "input",
          title: "设备型号",
          keys: "equipmentTypeName",
          requires: false,
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false,
        },
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        faultName: "",
        faultCode: ""
      },
      postUrl: "TroublequeryTreeList",
      curitem: {}

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


  resetData(fn) {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel();
      fn ? fn() : null
    })
  }

  componentDidMount() {
    this.resetData()
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
      curitem = this.props.repair[this.state.postUrl].list.filter((item)=>{return item.id==curitem.id})[0]
    }
    this.setState({
      fv: false,
      curitem:curitem?curitem:{},
      fields: {}
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
      if (iftype.value == "add") {
        let postData = { ...values, parentId: curitem.key ? curitem.key : 0 };
        this.setNewState("Troublesave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false });
          this.resetData(() => {
            this.setState({
              expandedRowKeys: [curitem.key]
            })

          });
        });

      } else {
        let postData = { ...values, id: curitem.key, parentId: curitem.parentKey ? curitem.parentKey : 0 };
        this.setNewState("Troublesave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });

      }

    });
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
    let { postData, postUrl, fv, fields, iftype, curitem, expandedRowKeys } = this.state,
      { TroublequeryTreeList, repairTypeList, faultTypeList, chart, rslgetRepairDetail, dataList } = this.props.repair;


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
    }, getdaterangebox = (start, end) => {
      if (this.child) {
        return this.child.getColumnRangeProps(start, end)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: <span>故障名称</span>,
        dataIndex: 'title',
        key: 'title',
        ...getsearchbox("faultName"),
        render: (text, record) => {
          return <a style={{ color: record.parentKey=="0" ? "#f50" : "#398dcd" }}>{text}</a>
        }
      },
      {
        title: '故障代码',
        dataIndex: 'no',
        key: 'no',
        ...getsearchbox("faultCode")
      },
      {
        title: '故障现象',
        dataIndex: 'faultPhenomenon',
        key: 'faultPhenomenon',
      },
      {
        title: '解决方案',
        dataIndex: 'faultSolution',
        key: 'faultSolution',
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...getsearchbox("equipmentTypeName")
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          备注
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                faultName: "",
                faultCode: ""
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4,marginLeft:8 }} />
            重置
          </a>
        </span>,
        dataIndex: 'description',
        key: 'description',
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("TroublequeryTreeList", this.state.postData);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.key === record.key) {
        return "selectedRow";
      }
      return null;
    };

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='故障设置列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a style={{ color: "#f50", marginRight: 12 }} onClick={() => {
              this.setState({
                curitem: {},
                iftype: {
                  name: `新增设备故障`,
                  value: "add"
                },
                fields: {
                  faultName: {
                    value: null,
                    type: "input",
                    title: "故障名称",
                    keys: "faultName",
                    requires: true,
                  },
                  faultCode: {
                    value: null,
                    type: "input",
                    title: "故障代码",
                    keys: "faultCode",
                    requires: true,
                  },
                  equipmentTypeName: {
                    value: null,
                    type: "input",
                    title: "设备型号",
                    keys: "equipmentTypeName",
                    requires: false,
                  },
                  remark: {
                    value: null,
                    type: "textarea",
                    title: "备注",
                    keys: "remark",
                    requires: false,
                  },
                }
              }, () => {
                this.setState({
                  fv: true,
                })
              })
            }}>
              新增故障
          </a>
            <div style={{ display: curitem.key ? "flex" : "none", alignItems: "center",marginRight:12 }}>
              <a onClick={() => {
                this.setState({
                  iftype: {
                    name: `新增 ${curitem.title} 下的故障`,
                    value: "add"
                  },
                  fields: {
                    faultPhenomenon: {
                      value: null,
                      type: "input",
                      title: "故障现象",
                      keys: "faultPhenomenon",
                      requires: true,
                    },
                    faultSolution: {
                      value: null,
                      type: "input",
                      title: "处理方法",
                      keys: "faultSolution",
                      requires: true,
                    },
                    remark: {
                      value: null,
                      type: "textarea",
                      title: "备注",
                      keys: "remark",
                      requires: false,
                    },
                  }
                }, () => {
                  this.setState({
                    fv: true,
                  })
                })
              }}>
                新增故障现象
            </a>
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <a onClick={() => {
                this.setState({
                  iftype: {
                    name: `修改${curitem.title}`,
                    value: "edit"
                  },
                  fields: {
                    faultName: {
                      value: curitem.title,
                      type: "input",
                      title: "故障名称",
                      keys: "faultName",
                      requires: true,
                      hides: curitem.parentKey != "0"
                    },
                    faultCode: {
                      value: curitem.no,
                      type: "input",
                      title: "故障代码",
                      keys: "faultCode",
                      requires: true,
                      hides: curitem.parentKey != "0"
                    },
                    faultPhenomenon: {
                      value: curitem.faultPhenomenon,
                      type: "input",
                      title: "故障现象",
                      keys: "faultPhenomenon",
                      requires: true,
                      hides: curitem.parentKey == "0"
                    },
                    faultSolution: {
                      value: curitem.faultSolution,
                      type: "input",
                      title: "处理方法",
                      keys: "faultSolution",
                      requires: true,
                      hides: curitem.parentKey == "0"
                    },
                    equipmentTypeName: {
                      value: curitem.equipmentTypeName,
                      type: "input",
                      title: "设备型号",
                      keys: "equipmentTypeName",
                      requires: false,
                      hides: curitem.parentKey != "0"
                    },
                    remark: {
                      value: curitem.description,
                      type: "textarea",
                      title: "备注",
                      keys: "remark",
                      requires: false,
                    },
                  },
                }, () => {
                  this.setState({
                    fv: true
                  })
                })
              }}>修改</a>
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <Popconfirm
                okText="确认"
                cancelText="取消"
                placement="bottom"
                title={"确认删除该故障设置？"}
                onConfirm={() => {
                  this.setNewState("TroubledeleteById", { id: curitem.key }, () => {
                    let total = this.props.repair.TroublequeryTreeList.total,
                      page = this.props.repair.TroublequeryTreeList.pageNum;
                    if ((total - 1) % 10 == 0) {
                      page = page - 1
                    }
                    this.setState({
                      postData: { ...this.state.postData, pageIndex: page }
                    }, () => {
                      this.setNewState("TroublequeryTreeList", postData, () => {
                        message.success("删除成功！");
                      });
                    })
                  })
                }}>
                <a style={{ color: "#ff4800" }}>删除</a>
              </Popconfirm>
            </div>
            <Abload reload={() => {
              this.resetData()
            }} data={null} postName="uploadequipmentFaultType" left={0} filePath="http://www.plszems.com/download/设备故障导入模板.xlsx"></Abload>

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
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => {
              this.setState({
                expandedRowKeys: expanded ? [record.key] : []
              })
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: TroublequeryTreeList.pageNum ? TroublequeryTreeList.pageNum : 1,
              total: TroublequeryTreeList.total ? parseInt(TroublequeryTreeList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='key'
            columns={columns}
            dataSource={TroublequeryTreeList.list ? TroublequeryTreeList.list : []}
          >
          </Table>

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

export default RepairTrouble



