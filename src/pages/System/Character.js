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
  submitting: loading.effects['system/AdminqueryList'],
}))
class Character extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: {
        checked: [], halfChecked: []
      },
      iftype: {
        name: "",
        value: ""
      },
      selectedRowKeys: [],
      fv: false,
      fields: {
        sourceType: {
          value: null,
          type: "select",
          title: "资源类型",
          keys: "sourceType",
          requires: true,
          option: [
            {
              id: 1,
              name: "PC端"
            }
          ]
        },
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
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        roleName: "", //角色名
        sourceType: ""
      },
      postDatas: {
        "roleId": "",   //(Long 角色id) *           
        "pageIndex": 1,   //(integer 当前页码) *
        "pageSize": 10,  //(integer 每页条数) *
        "userName": "",   //string 姓名
        "departmentName": "",   //long 部门id
        "jobTitle": ""   //string 职责
      },
      postUrl: "AdminqueryList",
      curitem: {}
    }
  }

  onCheck = (checkedKeys, info) => {
    message.destroy();
    if (this.state.iftype.liziyuan == 2) {
      message.warn("移动端无法操作")
    }else {
      this.setState({ checkedKeys });
    }

  };



  onSelectChange = selectedRowKeys => {

    this.setState({ selectedRowKeys });
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
    this.setNewState("AdminqueryCompanyList", null)
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
        sourceType: {
          value: null,
          type: "select",
          title: "资源类型",
          keys: "sourceType",
          requires: true,
          option: [
            {
              id: 1,
              name: "PC端"
            }
          ]
        },
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
  handleCancels = () => {
    this.setState({
      visible: false
    })
  }

  handleOk = () => {
    message.destroy();
    if (this.state.iftype.liziyuan == 2) {
      message.warn("移动端无法操作")
      return
    }
    if (this.state.iftype.value == "companies") {
      this.setNewState("addcomsave",{
        "roleId":this.state.curitem.id,
        "haveIds":this.state.selectedRowKeys},()=>{
        this.resetData();
        message.success("操作成功");
        this.setState({
          visible:false
        })
      })

    } else {
      this.setNewState("Adminprsave", {
        roleId: this.state.curitem.id,
        permissionIds: this.state.checkedKeys.checked,
      }, () => {
        message.success("操作成功");
        this.setState({
          visible: false,
        });
      })
    }
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
        let postData = { ...values, id: curitem.id };
        this.setNewState("Adminsave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("Adminsave", postData, () => {
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
  handleSearchs = (selectedKeys, dataIndex) => {
    let postUrl = "queryUserByRoleId";
    this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatas)
    });
  };


  onRef = (ref) => {
    this.child = ref;
  }

  onRefs = (ref) => {
    this.childs = ref;
  }
  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, postDatas, selectedRowKeys } = this.state,
      { AdminqueryList, AdminprqueryAll, queryUserByRoleId, AdminqueryCompanyList, departmentList, sysqueryByRoleId,companyList } = this.props.system;
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
    }, getsearchboxs = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectboxs = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, gettreeselectboxs = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }



    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        ...getsearchbox("roleName")
      },
      {
        title: '角色描述',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '资源类型',
        dataIndex: 'sourceType',
        key: 'sourceType',
        render: (text) => (<span>{text == 1 ? "PC端" : "移动端"}</span>),
        ...getselectbox("sourceType", [{ dicKey: "1", dicName: "PC端" }, { dicKey: "2", dicName: "移动端" }])
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          操作
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 10,
                roleName: "", //角色名
                sourceType: ""
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
            <a onClick={() => {
              this.setNewState("AdminprqueryAll", { roleId: record.id, sourceType: record.sourceType }, () => {
                this.setState({
                  treedata: this.props.system.AdminprqueryAll.nodeList,
                }, () => {
                  this.setState({
                    visible: true,
                    curitem: record,
                    checkedKeys: this.props.system.AdminprqueryAll.havepremIdList ? {
                      checked: this.props.system.AdminprqueryAll.havepremIdList,
                      halfChecked: []
                    } : [],
                    iftype: {
                      name: `给${record.roleName}添加权限`,
                      value: "star",
                      liziyuan: record.sourceType
                    }
                  })
                })
              })
            }}>角色授权</a>
            <Divider type="vertical"></Divider>
            <a onClick={() => {
              this.setNewState("queryUserByRoleId", { ...postDatas, roleId: record.id }, () => {
                this.setState({
                  visible: true,
                  postDatas: { ...postDatas, roleId: record.id },
                  curitem: record,
                  iftype: {
                    name: `拥有${record.roleName}的人员列表`,
                    value: "staff",
                  }
                })
              })
            }}>人员</a>
            {
              record.sourceType == 2 ? null : <span>
                <Divider type="vertical"></Divider>
                <a onClick={() => {
                  this.setNewState("sysqueryByRoleId", { roleId: record.id }, () => {
                    let haveIds = this.props.system.sysqueryByRoleId[0].haveIds;
                    this.setState({
                      curitem: record,
                      selectedRowKeys:haveIds,
                      iftype: {
                        name: `关联公司权限`,
                        value: "companies",
                      }
                    },()=>{
                      this.setState({
                        visible: true,
                      })
                    })
                  })
                }}>公司</a></span>
            }
            {
              record.sourceType == 2 || record.roleType == 4 ? null : <span>
                <Divider type="vertical"></Divider>
                <a onClick={() => {
                  this.setState({
                    fv: true,
                    iftype: {
                      name: "修改角色",
                      value: "edit"
                    },
                    curitem: record,
                    fields: {
                      sourceType: {
                        value: record.sourceType,
                        type: "select",
                        title: "资源类型",
                        keys: "sourceType",
                        requires: true,
                        disabled: true,
                        option: [
                          {
                            id: 1,
                            name: "PC端"
                          }, {
                            id: 2,
                            name: "移动端"
                          }
                        ]
                      },
                      roleName: {
                        value: record.roleName,
                        type: "input",
                        title: "角色名称",
                        keys: "roleName",
                        requires: true
                      },
                      remark: {
                        value: record.remark,
                        type: "textarea",
                        title: "角色描述",
                        keys: "remark",
                        requires: false
                      }
                    },
                  })
                }}>修改</a>
                <Divider type="vertical"></Divider>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottom"
                  title={"确认删除该角色？"}
                  onConfirm={() => {
                    this.setNewState("AdmindeleteById", { id: record.id }, () => {
                      let total = this.props.system.AdminqueryList.total,
                        page = this.props.system.AdminqueryList.pageNum;
                      if ((total - 1) % 10 == 0) {
                        page = page - 1
                      }

                      this.setState({
                        postData: { ...this.state.postData, pageIndex: page }
                      }, () => {
                        this.setNewState("AdminqueryList", postData, () => {
                          message.success("删除成功！");
                        });
                      })
                    })
                  }}>
                  <a style={{ color: "#ff4800" }}>删除</a>
                </Popconfirm>
              </span>
            }

          </div>)

        }
      },


    ]

    const columnes = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        ...getsearchboxs('userName'),
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (text) => (<span>{text == 1 ? "男" : "女"}</span>)
      },
      {
        title: '账号',
        dataIndex: 'accountName',
        key: 'accountName',
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getsearchboxs('shopName'),
      },
      {
        title: '组织',
        dataIndex: 'companyName',
        key: 'companyName',
        ...getselectboxs("companyId",companyList?companyList.map((item)=>{
          return {
            dicName:item.companyName,
            dicKey:item.id
          }
        }):[])
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        ...getsearchboxs('departmentName'),
      },
      {
        title: '职责',
        dataIndex: 'jobTitle',
        key: 'jobTitle',
        ...getsearchboxs("jobTitle")
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          班次
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postDatas: {
                ...postDatas,
                pageIndex: 1,
                pageSize: 10,
                userName: "",//string 姓名
                departmentName: "",//long 部门id
                shopName:"",
                companyId:"",
                jobTitle: ""//string 职责
              }
            }, () => {
              this.setNewState("queryUserByRoleId", this.state.postDatas)
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4,marginLeft:8 }} />
            重置
        </a>
        </span>,
        dataIndex: 'shiftName',
        key: 'shiftName',
      },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("AdminqueryList", this.state.postData);
      })
    }
    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("queryUserByRoleId", this.state.postDatas);
      })
    }

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

    const rowSelection = {
      selectedRowKeys:this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearchs} postData={this.state.postDatas}></SearchBox>
        <Card title='角色列表' extra={<Button onClick={() => {
          this.setState({
            iftype: {
              name: "新增角色",
              value: "add"
            },
            fv: true
          })
        }}>新增角色</Button>}>
          <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: AdminqueryList.pageNum ? AdminqueryList.pageNum : 1,
              total: AdminqueryList.total ? parseInt(AdminqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={AdminqueryList.list ? AdminqueryList.list : []}
          >
          </Table>

          {
            fields &&
            <CreateForm
              fields={fields}
              iftype={iftype}
              onChange={this.handleFormChange}
              wrappedComponentRef={this.saveFormRef}
              visible={fv}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
          }
          <Modal
            title={iftype.name}
            style={{ top: 40 }}
            width={iftype.value == "star" ? 600 : "98%"}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancels}
            footer={
              iftype.value == "star" || iftype.value == "companies" ?
                [<Button onClick={this.handleCancels}>取消</Button>, <Button type="primary" onClick={this.handleOk}>提交</Button>] : null
            }
          >
            {
              iftype.value == "star" ?
                <Tree
                  checkable
                  checkStrictly
                  defaultExpandAll={true}
                  checkedKeys={this.state.checkedKeys}
                  onCheck={this.onCheck}
                >
                  {loop(this.state.treedata ? this.state.treedata : [])}
                </Tree> :
                iftype.value == "companies" ?
                  <div>
                    <Table bordered
                      size={"middle"}
                      rowKey="id"
                      dataSource={sysqueryByRoleId}
                      columns={[
                        {
                          title: '公司编号',
                          dataIndex: 'companyCode',
                          key: 'companyCode',
                        },
                        {
                          title: '公司名称',
                          dataIndex: 'companyName',
                          key: 'companyName',
                        },
                        {
                          title: '联系电话',
                          dataIndex: 'telephone',
                          key: 'telephone',
                        },
                      ]}
                      pagination={false}
                      rowSelection={rowSelection}
                      
                    ></Table>
                  </div>
                  :
                  <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
                    loading={this.props.submitting}
                    pagination={{ showTotal:total=>`共${total}条`, // 分页
                      size: "small",
                      pageSize: 10,
                      showQuickJumper: true,
                      current: queryUserByRoleId.pageNum ? queryUserByRoleId.pageNum : 1,
                      total: queryUserByRoleId.total ? parseInt(queryUserByRoleId.total) : 0,
                      onChange: pageChanges,
                    }}
                    rowKey='id'
                    columns={columnes}
                    dataSource={queryUserByRoleId.list ? queryUserByRoleId.list : []}
                  >
                  </Table>
            }




          </Modal>


        </Card>
      </div>
    )
  }


}

export default Character



