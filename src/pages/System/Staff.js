import {
  Table, Input, InputNumber,
  Popconfirm, Form, Divider,
  Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Checkbox
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import Abload from '@/components/Abload';
import SearchBox from '@/components/SearchBox';
import moment from 'moment';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/AdminuserqueryList'],
}))
class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        userName: "",//string 姓名
        departmentId: "",//long 部门id
        jobTitle: ""//string 职位
      },
      postUrl: "AdminuserqueryList",
      curitem: {},
      visible: false
    }
  }

  handleOk = e => {
    let { iftype,alldelete } = this.state;
    if (iftype.value == "alldelete") {
      if(!alldelete){
        message.error("请输入用户名后删除...");
        return
      }
       this.setNewState("deleteBatch", {
        accountName: alldelete,
      }, () => {
        message.success("删除成功");
        this.setState({
          visible: false,
          alldelete:""
        });
      })

    } else {
      this.setNewState("Admincasave", {
        userId: this.state.curitem.id,
        roleIds: this.state.checkedValues
      }, () => {
        message.success("操作成功");
        this.setState({
          visible: false,
        });
      })
    }


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
          if (i == "companyId") {
            fields.departmentId.value = undefined;
            fields.shopId.value = undefined;
            fields.parentId.value = undefined;
            this.setNewState("queryCondition", { companyId: obj.value }, () => {
              let { shiftList, userList, shopList, departmentLists } = this.props.system;
              fields.departmentId.option = departmentLists;
              fields.shopId.option = shopList.map((item) => {
                return {
                  name: item.shopName,
                  id: item.id
                }
              });
              fields.parentId.option = userList.map((item) => {
                return {
                  name: item.userName + "-" + item.accountName,
                  id: item.id
                }
              });
              this.setState({
                fields: fields,
              })
            })
          }
          if (i == "departmentId") {
            fields.isDepartmentHead.hides = !obj.value
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
      curitem = this.props.system[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        userName: {
          value: null,
          type: "input",
          title: "姓名",
          keys: "userName",
          requires: true
        },
        accountName: {
          value: null,
          type: "input",
          title: "用户名",
          keys: "accountName",
          requires: true
        },
        gender: {
          value: null,
          type: "select",
          title: "性别",
          keys: "gender",
          requires: true,
          option: [
            {
              id: 1,
              name: "男"
            },
            {
              id: 2,
              name: "女"
            }
          ]
        },
        telephone: {
          value: null,
          type: "input",
          title: "联系电话",
          keys: "telephone",
          requires: true
        },
        companyId: {
          value: null,
          type: "select",
          title: "组织",
          keys: "companyId",
          requires: false,
          option: this.props.system.companyList ? this.props.system.companyList.map((item) => {
            return {
              name: item.companyName,
              id: item.id
            }
          }) : []
        },
        departmentId: {
          value: null,
          type: "treeselect",
          title: "部门",
          keys: "departmentId",
          requires: false,
          option: this.props.system.departmentLists ? this.props.system.departmentLists : []
        },
        isDepartmentHead: {
          value: "0",
          type: "select",
          title: "部门负责人",
          keys: "isDepartmentHead",
          requires: false,
          hides: true,
          option: [
            {
              id: "0",
              name: "否"
            }, {
              id: "1",
              name: "是"
            }
          ]
        },
        roleId: {
          value: null,
          type: "select",
          title: "角色",
          keys: "roleId",
          requires: false,
          option: this.props.system.roleList.map((item) => {
            return {
              name: item.roleName,
              id: item.id
            }
          })
        },
        shopId: {
          value: null,
          type: "select",
          title: "产品线",
          keys: "shopId",
          requires: false,
          option: this.props.system.shopList.map((item) => {
            return {
              name: item.shopName,
              id: item.id
            }
          })
        },
        parentId: {
          value: null,
          type: "select",
          title: "直属领导",
          keys: "parentId",
          requires: false,
          option: this.props.system.userLists.map((item) => {
            return {
              name: item.userName + "-" + item.accountName,
              id: item.id
            }
          })
        },
        shiftId: {
          value: null,
          type: "select",
          title: "班次",
          keys: "shiftId",
          requires: false,
          option: this.props.system.shiftList.map((item) => {
            return {
              name: item.shiftName,
              id: item.id
            }
          })
        },
        academicCareer: {
          value: null,
          type: "input",
          title: "学历",
          keys: "academicCareer",
          requires: false
        },
        university: {
          value: null,
          type: "input",
          title: "毕业院校",
          keys: "university",
          requires: false
        },
        major: {
          value: null,
          type: "input",
          title: "专业",
          keys: "major",
          requires: false
        },
        mailNo: {
          value: null,
          type: "input",
          title: "邮箱",
          keys: "mailNo",
          requires: false
        },
        workAge: {
          value: null,
          type: "inputnumber",
          title: "工龄",
          keys: "workAge",
          requires: false
        },
        nativePlace: {
          value: null,
          type: "input",
          title: "籍贯",
          keys: "nativePlace",
          requires: false
        },
        address: {
          value: null,
          type: "input",
          title: "住址",
          keys: "address",
          requires: false
        },
        hireDate: {
          value: null,
          type: "datepicker",
          title: "入职时间",
          keys: "hireDate",
          requires: false
        },
        jobNum: {
          value: null,
          type: "input",
          title: "工号",
          keys: "jobNum",
          requires: false
        },
        jobTitle: {
          value: null,
          type: "input",
          title: "职位",
          keys: "jobTitle",
          requires: false,
        },
        duty: {
          value: null,
          type: "textarea",
          title: "职责",
          keys: "duty",
          requires: false,
          col: { span: 24 }
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
      values.hireDate = values.hireDate ? moment(values.hireDate).format("YYYY-MM-DD") : null;
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("Adminusersave", postData, () => {
          message.success("修改成功！");
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("Adminusersave", postData, () => {
          message.success("新增成功！");
          this.resetData();
        });
      } else {
        //ELSE TO DO
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

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { AdminuserqueryList, AdminqueryCompanyList, departmentList, shopList, shopLists, ZNList } = this.props.system;

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
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        ...getsearchbox('userName'),
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (text) => (<span>{text == 1 ? "男" : "女"}</span>)
      },
      {
        title: '用户名',
        dataIndex: 'accountName',
        key: 'accountName',
        ...getsearchbox("accountName")
      },
      {
        title: '部门负责人',
        dataIndex: 'isDepartmentHead',
        key: 'isDepartmentHead',
        render: (text) => <span style={{ color: text == "1" ? "red" : "#666" }}>{text == "1" ? "是" : ""}</span>
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: '邮箱',
        dataIndex: 'mailNo',
        key: 'mailNo',
      },
      {
        title: '班次',
        dataIndex: 'shiftName',
        key: 'shiftName',
      },
      {
        title: '组织',
        dataIndex: 'companyName',
        key: 'companyName',
        ...getselectbox("companyId", ZNList ? ZNList.map(item => {
          return {
            dicName: item.companyName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        ...getsearchbox("departmentName")
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getsearchbox("shopName")
      },
      {
        title: '直属领导',
        dataIndex: 'parentName',
        key: 'parentName',
        ...getsearchbox('parentName'),
      },
      {
        title: '职位',
        dataIndex: 'jobTitle',
        key: 'jobTitle',
        ...getsearchbox("jobTitle")
      },
      {
        title: '工号',
        dataIndex: 'jobNum',
        key: 'jobNum',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          重置密码
        <a style={{ color: "#f50" }} onClick={(e) => {
            e.stopPropagation()
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 10,
                userName: "",//string 姓名
                accountName: "",
                companyId: "",
                departmentId: "",//long 部门id
                shopId: "",
                parentName: "",
                jobTitle: "",//string 职位
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
        </a>
        </span>,
        dataIndex: 'reset',
        key: 'reset',
        width:165,
        render: (text, record) => <Popconfirm
          okText="确认"
          cancelText="取消"
          placement="bottom"
          title={"确认重置密码？"}
          onConfirm={() => {
            this.setNewState("restPassword", { id: record.accountId }, () => {
              this.setNewState("AdminuserqueryList", postData, () => {
                message.success(record.userName + this.props.system.code.data);
              });
            })
          }}>
          <a style={{ color: "#ff4800" }} onClick={(e) => {
            e.stopPropagation()
          }}>重置密码</a>
        </Popconfirm>
      },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("AdminuserqueryList", this.state.postData);
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

      return <div>
        <p>
          <span>职责: </span><span>{record.duty}</span>
        </p>
        <p>
          <span>工龄: </span><span>{record.workAge}</span>
        </p>
        <p>
          <span>住址: </span><span>{record.address}</span>
        </p>
        <p>
          <span>籍贯: </span><span>{record.nativePlace}</span>
        </p>
        <p>
          <span>入职时间: </span><span>{record.hireDate}</span>
        </p>
        <p>
          <span>学历: </span><span>{record.academicCareer}</span>
        </p>
        <p>
          <span>毕业院校: </span><span>{record.university}</span>
        </p>
        <p>
          <span>专业: </span><span>{record.major}</span>
        </p>

      </div>


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
        <Card title='用户列表' extra={<div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ cursor: "pointer" }} onClick={() => {
            this.setState({
              iftype: {
                name: "新增用户",
                value: "add"
              },
            }, () => {
              this.setState({
                fv: true
              })
            })
          }}>新增</span>
          <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
          <a onClick={() => {
            this.setState({
              visible: true,
              iftype: {
                name: "批量删除",
                value: "alldelete"
              }
            })
          }}>批量删除</a>
          <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
          <div style={{ display: curitem.id ? "flex" : "none", alignItems: "center", marginRight: 12 }}>
            <a onClick={() => {
              this.setNewState("AdmincaqueryAll", { userId: curitem.id }, () => {
                let res = this.props.system.AdmincaqueryAll,
                  respc = res.PC ? res.PC.map((item) => {
                    return {
                      label: item.roleName,
                      value: item.id
                    }
                  }) : [],
                  pco = res.PC ? res.PC.map((item) => {
                    return item.id
                  }) : [],
                  resyd = res.YD ? res.YD.map((item) => {
                    return {
                      label: item.roleName,
                      value: item.id
                    }
                  }) : [],
                  ydo = res.PC ? res.YD.map((item) => {
                    return item.id
                  }) : [];

                this.setState({
                  plainOptions: {
                    yd: resyd,
                    pc: respc
                  },
                  checkedValues: res.PC[0].haveRoleIdList ? res.PC[0].haveRoleIdList : [],
                  iftype: {
                    name: `给${curitem.accountName}分配角色`,
                    value: "star"
                  }
                }, () => {
                  this.setState({
                    pcData: this.state.checkedValues && this.state.checkedValues.filter((item, i) => { return pco.indexOf(item) != -1 }),
                    ydData: this.state.checkedValues && this.state.checkedValues.filter((item, i) => { return ydo.indexOf(item) != -1 }),
                    visible: true,
                  })
                })

              })
            }}>用户角色配置</a>
            <Divider type="vertical"></Divider>
            <a onClick={() => {
              let editfield = (arrs) => {
                return {
                  userName: {
                    ...fields.userName,
                    value: curitem.userName,
                  },
                  accountName: {
                    ...fields.accountName,
                    value: curitem.accountName,
                    disabled: true
                  },
                  gender: {
                    ...fields.gender,
                    value: curitem.gender,
                  },
                  telephone: {
                    ...fields.telephone,
                    value: curitem.telephone,
                  },
                  companyId: {
                    ...fields.companyId,
                    value: curitem.companyId,
                  },
                  departmentId: {
                    ...fields.departmentId,
                    value: curitem.departmentId,
                    option: this.props.system.departmentLists ? this.props.system.departmentLists : []
                  },
                  isDepartmentHead: {
                    ...fields.isDepartmentHead,
                    value: curitem.isDepartmentHead == "1" ? curitem.isDepartmentHead.toString() : "0",
                    hides: !curitem.departmentId
                  },
                  shopId: {
                    ...fields.shopId,
                    value: curitem.shopId,
                    option: this.props.system.shopList.map((item) => {
                      return {
                        name: item.shopName,
                        id: item.id
                      }
                    })
                  },
                  parentId: {
                    ...fields.parentId,
                    value: curitem.parentId,
                    option: arrs.map((item) => {
                      return {
                        name: item.userName + "-" + item.accountName,
                        id: item.id
                      }
                    })
                  },

                  shiftId: {
                    ...fields.shiftId,
                    value: curitem.shiftId,
                    option: this.props.system.shiftList.map((item) => {
                      return {
                        name: item.shiftName,
                        id: item.id
                      }
                    })
                  },
                  academicCareer: {
                    ...fields.academicCareer,
                    value: curitem.academicCareer,
                  },
                  university: {
                    ...fields.university,
                    value: curitem.university,
                  },
                  major: {
                    ...fields.major,
                    value: curitem.major,
                  },
                  mailNo: {
                    ...fields.mailNo,
                    value: curitem.mailNo,
                  },
                  workAge: {
                    ...fields.workAge,
                    value: curitem.workAge,
                  },
                  nativePlace: {
                    ...fields.nativePlace,
                    value: curitem.nativePlace,
                  },
                  address: {
                    ...fields.address,
                    value: curitem.address,
                  },
                  hireDate: {
                    ...fields.hireDate,
                    value: curitem.hireDate ? moment(curitem.hireDate) : undefined,
                  },
                  jobNum: {
                    ...fields.jobNum,
                    value: curitem.jobNum,
                  },
                  jobTitle: {
                    ...fields.jobTitle,
                    value: curitem.jobTitle,
                  },
                  duty: {
                    ...fields.duty,
                    value: curitem.duty,
                  }
                }
              }
              curitem.companyId ?
                this.setNewState("queryCondition", { companyId: curitem.companyId }, () => {
                  this.setState({
                    fields: editfield(this.props.system.userList),
                  }, () => {
                    this.setState({
                      fv: true,
                      iftype: {
                        name: "修改用户",
                        value: "edit"
                      },
                    })
                  })
                }) :
                this.setState({
                  fields: editfield(this.props.system.userLists),
                }, () => {
                  this.setState({
                    fv: true,
                    iftype: {
                      name: "修改用户",
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
              title={"确认删除该用户？"}
              onConfirm={() => {
                this.setNewState("AdminuserdeleteById", { id: curitem.id }, () => {
                  let total = this.props.system.AdminuserqueryList.total,
                    page = this.props.system.AdminuserqueryList.pageNum;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("AdminuserqueryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </div>
          <Abload reload={() => this.resetData()} data={null} postName="uploadsysUser" left={0} filePath="http://www.plszems.com/download/人员导入模板.xlsx"></Abload>
          <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
          <a onClick={() => {
            message.loading("正在导出文件...")
          }} href={`/rs/sysUser/exportFile?${bodyparse(this.state.postData)}`} target="_blank">导出用户</a>
        </div>
        }>
          <Table bordered size="middle" scroll={{ x: 1460, y: "59vh" }}
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
              current: AdminuserqueryList.pageNum ? AdminuserqueryList.pageNum : 1,
              total: AdminuserqueryList.total ? parseInt(AdminuserqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={AdminuserqueryList.list ? AdminuserqueryList.list : []}
            expandedRowRender={record => renderAdd(record)}

          >
          </Table>

          <CreateForm
            width={800}
            fields={this.state.fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            col={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />

          <Modal
            style={{ maxWidth: "90%" }}
            width={"90%"}
            title={iftype.name}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancels}
          >
            {
              iftype.value == "alldelete" ?
                <div>
                  <p>批量删除人员，请输入需要删除人员的用户名以逗号 <span style={{ paddingLeft: 12, paddingRight: 12 }}> , </span>隔开</p>
                  <Input.TextArea
                    rows={8}
                    allowClear={true}
                    value={this.state.alldelete}
                    onChange={(e) => {
                      this.setState({
                        alldelete: e.target.value
                      })
                    }}
                  >
                  </Input.TextArea>
                </div>
                : <div>
                  <Search placeholder="搜索名称全程，选中需要选择的角色" style={{ marginBottom: 12 }} onSearch={(val) => {
                    let alldata = this.state.plainOptions.yd.concat(this.state.plainOptions.pc);
                    let arr = alldata.filter((item) => {
                      return item.label == val
                    }).map((item) => { return item.value })

                    let vals = this.state.checkedValues.concat(arr);

                    function unique1(arr) {
                      var hash = [];
                      for (var i = 0; i < arr.length; i++) {
                        if (hash.indexOf(arr[i]) == -1) {
                          hash.push(arr[i]);
                        }
                      }
                      return hash;
                    }

                    this.setState({
                      checkedValues: unique1(vals)
                    }, () => {
                      console.log(this.state.checkedValues)
                    })

                  }}></Search>

                  <Row gutter={24}>
                    <Col span={12}>
                      <p style={{ borderBottom: "#f0f0f0 dashed 1px", color: "#13c2c2" }}>PC端</p>
                      <Checkbox.Group
                        value={this.state.checkedValues}
                        onChange={(val) => this.onChange(val, "1")} >
                        <Row>
                          {
                            this.state.plainOptions ?
                              this.state.plainOptions.pc.map((item, i) => {
                                return <Col {...col} key={i}>
                                  <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>

                              }) : null
                          }
                        </Row>
                      </Checkbox.Group>
                    </Col>
                    <Col span={12}>
                      <p style={{ borderBottom: "#f0f0f0 dashed 1px", color: "#13c2c2" }}>移动</p>
                      <Checkbox.Group
                        value={this.state.checkedValues}
                        options={this.state.plainOptions ? this.state.plainOptions.yd : []}
                        onChange={(val) => this.onChange(val, "2")} />
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

export default Staff



