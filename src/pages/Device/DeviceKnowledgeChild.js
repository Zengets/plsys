import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm";
import AbReply from '@/components/AbReply';
import moment from "moment";
import SearchBox from '@/components/SearchBox';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/deviceknqueryList'],
}))
class DeviceKnowledgeChild extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      visible: false,
      fields: {},
      /*初始化 main List */
      postData: {
        "pageIndex": 1,
        "pageSize": 10,
        "equipmentModel": "",                  //(String)设备型号
        "knowledgeBaseDescribe": "",     //(String)描述
        "knowledgeBaseName": "",       //(String)文件名(标题)称
        "purposeType": this.props.purposeType,                   //(String)用途key
        "secondPurposeType": ""
      },
      postDatas: {
        equipmentKnowledgeBaseId: "",
        pageIndex: 1,
        pageSize: 10,
      },
      postUrl: "deviceknqueryList",
      curitem: {},
      expandedRowKeys: [],
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


  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel()
    })
  }

  setSecond(key, fn) {
    if (key == "2" || key == "3") {
      return
    }
    this.setNewState("getKnowledgeDetailByDicKey", { dicKey: key }, () => {
      fn ? fn() : null
    })
  }

  componentDidMount() {
    this.resetData();
    this.setSecond(this.props.purposeType);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.purposeType != nextProps.purposeType) {
      this.setState({
        postData: {
          "pageIndex": 1,
          "pageSize": 10,
          "equipmentId": nextProps.purposeType,             //(int)设备id
          "equipmentModel": "",                  //(String)设备型号
          "knowledgeBaseDescribe": "",     //(String)描述
          "knowledgeBaseName": "",       //(String)文件名(标题)称
          "purposeType": ""                   //(String)用途key
        }
      }, () => {
        this.setNewState(this.state.postUrl, this.state.postData);
        this.setSecond(nextProps.purposeType)
      })
    }
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
          if (i == "purposeType") {
            if (obj.value == "2" || obj.value == "3" || !obj.value) {
              fields.secondPurposeType.hides = true;
              fields.secondPurposeType.value = undefined;
              fields.secondPurposeType.option = [];
              if(obj.value=="3"){
                fields.knowledgeBaseVersion.hides = true;
                fields.knowledgeBaseUrl.requires = false;
              }

            } else {
              this.setNewState("getKnowledgeDetailByDicKey", { dicKey: obj.value }, () => {
                fields.secondPurposeType.hides = false;
                fields.secondPurposeType.value = undefined;
                fields.secondPurposeType.option = this.props.device.getKnowledgeDetailByDicKey.map((item) => {
                  return {
                    name: item.dicName,
                    id: item.dicKey,
                  }
                })
                this.setState({
                  fields: fields,
                })
              })
            }

          }
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
      curitem = this.props.device[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        equipmentModelId: {
          value: null,
          type: "select",
          title: "设备型号",
          keys: "equipmentModelId",
          requires: false,
          option: this.props.device.modelList.map((item) => {
            return {
              name: item.equipmentModel,
              id: item.id,
            }
          })
        },
        knowledgeBaseName: {
          value: null,
          type: "input",
          title: "文件名(标题)",
          keys: "knowledgeBaseName",
          requires: true
        },
        purposeType: {
          value: null,
          type: "select",
          title: "用途",
          keys: "purposeType",
          requires: true,
          option: this.props.device.purposeTypeList.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey,
            }
          })
        },
        secondPurposeType: {
          value: null,
          type: "select",
          title: "二级用途类型",
          keys: "secondPurposeType",
          requires: true,
          hides: true
        },
        knowledgeBaseVersion: {
          value: null,
          type: "input",
          title: "版本",
          keys: "knowledgeBaseVersion",
          requires: true
        },
        knowledgeBaseUrl: {
          value: [],
          type: "upload",
          uploadtype: "file",
          title: "文件地址",
          keys: "knowledgeBaseUrl",
          multiple: false,
          col: { span: 24 },
          requires: true
        },
        knowledgeBaseDescribe: {
          value: null,
          type: "textarea",
          title: "描述",
          keys: "knowledgeBaseDescribe",
          requires: false,
          col: { span: 24 },
        }
      },
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

      values.knowledgeBaseUrl = values.knowledgeBaseUrl[0].url ? values.knowledgeBaseUrl[0].url :
        values.knowledgeBaseUrl[0].response.data.dataList[0];


      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("deviceknsave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false, expandedRowKeys: [] });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("deviceknsave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false, expandedRowKeys: [] });
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }

    });
  }

  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
      postDatas: {
        ...this.state.postDatas,
        equipmentKnowledgeBaseId: record.id,
        pageIndex: 1, pageSize: 10,
      }
    }, () => {
      this.setNewState("deviceknchildqueryList", this.state.postDatas, () => {
        this.setState({
          childData: this.props.device.deviceknchildqueryList
        })

      })
    })

  }

  handleSearch = (selectedKeys, dataIndex, key) => {
    let { postUrl } = this.state;
    if (dataIndex == "purposeType") {
      if (selectedKeys[0] == "2" || selectedKeys[0] == "3") {

      } else {
        this.setSecond(selectedKeys[0], () => {
          this.setState({
            postData: {
              ...this.state.postData,
              secondPurposeType: undefined
            }
          }, () => {
            this.resetData()
          })
        })
      }
    }
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      if (key) {
        return
      }
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }



  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, expandedRowKeys, visible } = this.state,
      { deviceknqueryList, equipmentNoList, purposeTypeList, getKnowledgeDetailByDicKey } = this.props.device;
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
    const columns = this.props.purposeType == "0" || this.props.purposeType == "1" ?
      [
        {
          title: '设备型号',
          dataIndex: 'equipmentModel',
          key: 'equipmentModel',
          ...getsearchbox('equipmentModel')
        },
        {
          title: '文件名(标题)',
          dataIndex: 'knowledgeBaseName',
          key: 'knowledgeBaseName',
          ...getsearchbox('knowledgeBaseName'),
          render: (text, record) => {
            return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : <span>{ text }</span>)
          }
        },
        {
          title: '二级用途',
          dataIndex: 'secondPurposeTypeName',
          key: 'secondPurposeTypeName',
          ...getselectbox('secondPurposeType', getKnowledgeDetailByDicKey)
        },
        {
          title: '文件编号',
          dataIndex: 'documentNo',
          key: 'documentNo',
        },
        {
          title: '描述',
          dataIndex: 'knowledgeBaseDescribe',
          key: 'knowledgeBaseDescribe',
          ellipsis: true,
          ...getsearchbox("knowledgeBaseDescribe"),
          
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '版本',
          dataIndex: 'knowledgeBaseVersion',
          key: 'knowledgeBaseVersion',
        },
        {
          title: '上传者',
          dataIndex: 'updateUserName',
          key: 'updateUserName',
        },
        {
          title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            历史
        <a style={{ color: "#f50" }} onClick={() => {
              this.setState({
                postData: {
                  ...this.state.postData,
                  "pageIndex": 1,
                  "pageSize": 10,
                  "equipmentModel": "",                  //(String)设备型号
                  "knowledgeBaseName": "",       //(String)文件名(标题)称
                  "purposeType": this.props.purposeType,                  //(String)用途key
                  "knowledgeBaseDescribe": "",
                  "secondPurposeType": ""
                }
              }, () => { this.resetData() })
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
                this.getChildTable(record, true)
              }}>历史记录</a>
            </div>)

          }
        },
      ]
      :
      this.props.purposeType == "2" ?
        [
          {
            title: '设备型号',
            dataIndex: 'equipmentModel',
            key: 'equipmentModel',
            ...getsearchbox('equipmentModel')
          },
          {
            title: '文件名(标题)',
            dataIndex: 'knowledgeBaseName',
            key: 'knowledgeBaseName',
            ...getsearchbox('knowledgeBaseName'),
            render: (text, record) => {
              return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : <span>{ text }</span>)
            }
          },
          {
            title: '文件编号',
            dataIndex: 'documentNo',
            key: 'documentNo',
          },
          {
            title: '描述',
            dataIndex: 'knowledgeBaseDescribe',
            key: 'knowledgeBaseDescribe',
            ellipsis: true,
            ...getsearchbox("knowledgeBaseDescribe"),
            
          },
          {
            title: '创建日期',
            dataIndex: 'createTime',
            key: 'createTime',
          },
          {
            title: '版本',
            dataIndex: 'knowledgeBaseVersion',
            key: 'knowledgeBaseVersion',
          },
          {
            title: '上传者',
            dataIndex: 'updateUserName',
            key: 'updateUserName',
          },
          {
            title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              历史
              <a style={{ color: "#f50" }} onClick={() => {
                this.setState({
                  postData: {
                    ...this.state.postData,
                    "pageIndex": 1,
                    "pageSize": 10,
                    "equipmentModel": "",                  //(String)设备型号
                    "knowledgeBaseName": "",       //(String)文件名(标题)称
                    "purposeType": this.props.purposeType,                  //(String)用途key
                    "knowledgeBaseDescribe": "",
                    "secondPurposeType": ""
                  }
                }, () => { this.resetData() })
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
                  this.getChildTable(record, true)
                }}>历史记录</a>
              </div>)

            }
          },
        ] :
        this.props.purposeType == "3" ?
          [
            {
              title: '设备型号',
              dataIndex: 'equipmentModel',
              key: 'equipmentModel',
              ...getsearchbox('equipmentModel')
            },
            {
              title: '文件名(标题)',
              dataIndex: 'knowledgeBaseName',
              key: 'knowledgeBaseName',
              ...getsearchbox('knowledgeBaseName'),
              render: (text, record) => {
                return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : <span>{ text }</span>)
              }
            },
            {
              title: '文件编号',
              dataIndex: 'documentNo',
              key: 'documentNo',
            },
            {
              title: '描述',
              dataIndex: 'knowledgeBaseDescribe',
              key: 'knowledgeBaseDescribe',
              ellipsis: true,
              ...getsearchbox("knowledgeBaseDescribe"),
              
            },
            {
              title: '创建日期',
              dataIndex: 'createTime',
              key: 'createTime',
            },
            {
              title: '版本',
              dataIndex: 'knowledgeBaseVersion',
              key: 'knowledgeBaseVersion',
            },
            {
              title: '上传者',
              dataIndex: 'updateUserName',
              key: 'updateUserName',
            },
            {
              title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                留言板
      <a style={{ color: "#f50" }} onClick={() => {
                  this.setState({
                    postData: {
                      ...this.state.postData,
                      "pageIndex": 1,
                      "pageSize": 10,
                      "equipmentModel": "",                  //(String)设备型号
                      "knowledgeBaseName": "",       //(String)文件名(标题)称
                      "purposeType": this.props.purposeType,                  //(String)用途key
                      "knowledgeBaseDescribe": "",
                      "secondPurposeType": ""
                    }
                  }, () => { this.resetData() })
                }}>
                  <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                  重置
      </a>
              </span>,
              dataIndex: 'reply',
              key: 'reply',
              render: (text, record) => <a style={{ display: record.purposeType == "3" ? "block" : "none" }} onClick={() => {
                this.setState({
                  curitem: record,
                  iftype: {
                    name: "留言板",
                    value: "reply"
                  },
                  visible: true
                })
              }}>查看/留言</a>
            },
          ]
          :
          []

    const columnes = [
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
      },
      {
        title: '文件名(标题)',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
        render: (text, record) => {
          return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : <span>{ text }</span>)
        }
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
        ellipsis: true,
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '版本',
        dataIndex: 'knowledgeBaseVersion',
        key: 'knowledgeBaseVersion',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          上传者
      <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...this.state.postData,
                "pageIndex": 1,
                "pageSize": 10,
                "equipmentModel": "",                  //(String)设备型号
                "knowledgeBaseName": "",       //(String)文件名(标题)称
                "purposeType": this.props.purposeType,                  //(String)用途key
                "knowledgeBaseDescribe": "",
                "secondPurposeType": ""
              }
            }, () => { this.resetData() })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
      </a>
        </span>,
        dataIndex: 'updateUserName',
        key: 'updateUserName',
      },


    ]
    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("deviceknchildqueryList", this.state.postDatas);
      })
    }
    const expandedRowRender = () => {
      return <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }} columns={columnes} dataSource={this.state.childData ? this.state.childData.list : []}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 10,
          showQuickJumper: true,
          current: this.state.childData ? this.state.childData.pageNum : 1,
          total: this.state.childData ? parseInt(this.state.childData.total) : 0,
          onChange: pageChanges,
        }}
      />;
    };
    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("deviceknqueryList", this.state.postData);
      })
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    const addbtn = () => {
      return <a onClick={() => {
        this.setState({
          iftype: {
            name: "新增设备知识库",
            value: "add"
          },
          fv: true
        })
      }}>新增</a>
    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={this.props.title} extra={
          curitem.id ?
            <div style={{display:"flex"}}>
              {addbtn()}
              <Divider style={{ marginTop: 6,display:curitem.purposeType=="3"?"none":"block" }} type="vertical"></Divider>
              <a style={{display:curitem.purposeType=="3"?"none":"inline"}} onClick={() => {
                this.setState({
                  fv: true,
                  iftype: {
                    name: "修改设备知识库",
                    value: "edit"
                  },
                  curitem: curitem,
                  fields: {
                    knowledgeBaseVersion: {
                      value: curitem.knowledgeBaseVersion,
                      type: "input",
                      title: "版本",
                      keys: "knowledgeBaseVersion",
                      requires: true
                    },
                    knowledgeBaseUrl: {
                      value: [{
                        uid: moment().valueOf(),
                        name: curitem.knowledgeBaseName,
                        status: 'done',
                        url: curitem.knowledgeBaseUrl,
                      }],
                      defaultval: [{
                        uid: moment().valueOf(),
                        name: curitem.knowledgeBaseName,
                        status: 'done',
                        url: curitem.knowledgeBaseUrl,
                      }],
                      type: "upload",
                      uploadtype: "file",
                      title: "文件地址",
                      keys: "knowledgeBaseUrl",
                      multiple: false,
                      col: { span: 24 },
                      requires: true
                    },
                    knowledgeBaseDescribe: {
                      value: curitem.knowledgeBaseDescribe,
                      type: "textarea",
                      title: "描述",
                      keys: "knowledgeBaseDescribe",
                      requires: false,
                      col: { span: 24 },
                    }
                  },
                })
              }}>修改</a>
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <Popconfirm
                okText="确认"
                cancelText="取消"
                placement="bottom"
                title={"确认删除该知识库？"}
                onConfirm={() => {
                  this.setNewState("devicekndeleteById", { id: curitem.id }, () => {
                    let total = this.props.device.deviceknqueryList.total,
                      page = this.props.device.deviceknqueryList.pageNum;
                    if ((total - 1) % 10 == 0) {
                      page = page - 1
                    }

                    this.setState({
                      postData: { ...this.state.postData, pageIndex: page }
                    }, () => {
                      this.setNewState("deviceknqueryList", postData, () => {
                        message.success("删除成功！");
                      });
                    })
                  })
                }}>
                <a style={{ color: "#ff4800" }}>删除</a>
              </Popconfirm>

            </div>
            : addbtn()
        }>
          <Table bordered size="middle"
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            scroll={{ x: 1200, y: "59vh" }}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: deviceknqueryList.pageNum ? deviceknqueryList.pageNum : 1,
              total: deviceknqueryList.total ? parseInt(deviceknqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={deviceknqueryList.list ? deviceknqueryList.list : []}
            expandedRowRender={this.props.purposeType=="3"?null:expandedRowRender}
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
          >
          </Table>



          <AbReply
            visible={visible}
            title={iftype.name ? iftype.name : ""}
            placement="right"
            width={"96%"}
            onClose={() => {
              this.setState({
                visible: false
              })
            }}
            curitem={curitem}
            destroyOnClose={true}

          ></AbReply>

          
          <CreateForm
            width={800}
            fields={fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />

        </Card>
      </div>
    )
  }


}

export default DeviceKnowledgeChild



