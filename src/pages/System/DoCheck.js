import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/NoqueryTreeList'],
}))
class Character extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        dicName: {
          value: null,
          type: "input",
          title: "数据名称",
          keys: "dicName",
          requires: true
        },
        dicDescription: {
          value: null,
          type: "textarea",
          title: "数据描述",
          keys: "dicDescription",
          requires: false
        }
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        dicKey: "",
        dicName: "",
      },
      postUrl: "NoqueryTreeList",
      curitem: {}
    }
  }

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
      curitem = this.props.system[this.state.postUrl].list.filter((item)=>{return item.id==curitem.id})[0]
    }
    this.setState({
      fv: false,
      curitem:curitem?curitem:{},
      fields: {
        dicName: {
          value: null,
          type: "input",
          title: "数据字典名称",
          keys: "dicName",
          requires: true
        },
        dicDescription: {
          value: null,
          type: "textarea",
          title: "数据字典描述",
          keys: "dicDescription",
          requires: false
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
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.key };
        this.setNewState("Nosave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values, parentId: curitem.key };
        this.setNewState("Nosave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else {
        //ELSE TO DO
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
      { NoqueryTreeList } = this.props.system;
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
        title: '数据编号',
        dataIndex: 'no',
        key: 'no',
        ...getsearchbox("dicKey")
      },
      {
        title: '数据名称',
        dataIndex: 'title',
        key: 'title',
        ...getsearchbox("dicName")
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text) => (<span>{text == 0 ? "系统" : text == 1 ? "自定义" : ""}</span>)
      },
      {
        title: '描述说明',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          操作
            <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1, // 第1页*
                pageSize: 10, // 每页10条*
                dicKey: "",
                dicName: "",
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
        render: (text, record) => {
          return (<div>
            {
              record.parentKey == 0 && <span><a onClick={() => {
                let fields=this.state.fields;
                if(record.no=="hyperlink"){
                  fields = {
                    dicName: {
                      value: null,
                      type: "input",
                      title: "数据字典名称",
                      keys: "dicName",
                      requires: true
                    },
                    dicDescription: {
                      value: "http://",
                      type: "textarea",
                      title: "数据字典描述(带http://的链接地址)",
                      keys: "dicDescription",
                      requires: true
                    }
                  }
                }
                this.setState({
                  fields,
                  iftype: {
                    name: `新增 ${record.title} 下的数据字典`,
                    value: "add"
                  },
                  curitem: record,
                },()=>{
                  this.setState({
                    fv: true
                  })
                })
              }}>新增</a>
              </span>
            }
            {
              record.parentKey != 0 && record.type == 1 ?
                <span>
                  <a onClick={() => {
                    this.setState({
                      fv: true,
                      iftype: {
                        name: `修改 ${record.title} `,
                        value: "edit"
                      },
                      curitem: record,
                      fields: {
                        dicName: {
                          value: record.title,
                          type: "input",
                          title: "数据字典名称",
                          keys: "dicName",
                          requires: true
                        },
                        dicDescription: {
                          value: record.description,
                          type: "textarea",
                          title: record.parentKey=="2019874312649613564"?"数据字典描述(带http://的链接地址)":"数据字典描述",
                          keys: "dicDescription",
                          requires: record.parentKey=="2019874312649613564"
                        }
                      },
                    })
                  }}>修改</a>
                  <Divider type="vertical"></Divider>
                  <Popconfirm
                    okText="确认"
                    cancelText="取消"
                    placement="bottom"
                    title={"确认删除该规则？"}
                    onConfirm={() => {
                      this.setNewState("NodeleteById", { id: record.key }, () => {
                        let total = this.props.system.NoqueryTreeList.total,
                          page = this.props.system.NoqueryTreeList.pageNum;
                        if ((total - 1) % 10 == 0) {
                          page = page - 1
                        }

                        this.setState({
                          postData: { ...this.state.postData, pageIndex: page }
                        }, () => {
                          this.setNewState("NoqueryTreeList", postData, () => {
                            message.success("删除成功！");
                          });
                        })
                      })
                    }}>
                    <a style={{ color: "#ff4800" }}>删除</a>
                  </Popconfirm>
                </span>
                : null
            }
          </div>)

        }
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("NoqueryTreeList", this.state.postData);
      })
    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

        <Card title='数据字典列表'>
          <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: NoqueryTreeList.pageNum ? NoqueryTreeList.pageNum : 1,
              total: NoqueryTreeList.total ? parseInt(NoqueryTreeList.total) : 0,
              onChange: pageChange,
            }}
            columns={columns}
            dataSource={NoqueryTreeList.list ? NoqueryTreeList.list : []}
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

export default Character



