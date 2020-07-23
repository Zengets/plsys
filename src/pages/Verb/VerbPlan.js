import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Switch
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
import SearchBox from '@/components/SearchBox'
import Abload from '@/components/Abload'
import { render } from './../../app';
import check from './../../components/Authorized/CheckPermissions';
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/verbqueryList'],
}))
class VerbPlan extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
    ]
    this.columnes = [
      {
        title: '保养项目',
        dataIndex: 'maintainItem',
        key: 'maintainItem',
      },
      {
        title: '保养内容',
        dataIndex: 'maintainContent',
        key: 'maintainContent',
      },
      {
        title: '费用(元)',
        dataIndex: 'maintainCost',
        key: 'maintainCost',
        width: 120,
        render: (text, record) => {
          let vals = this.state.fields.maintainItemRelList.value ? this.state.fields.maintainItemRelList.value : [], res,
            values = this.state.fields.maintainItemRelList.submit ? this.state.fields.maintainItemRelList.submit : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.equipmentMaintainItemId == record.id) {
              res = item.maintainCost
            }
          })

          if (vals.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return <Input value={res} onChange={(e) => {
              let val = e.target.value;
              let newvalues = values.map((item, i) => {
                if (item.equipmentMaintainItemId == record.id) {
                  item.maintainCost = val
                }
                return item
              })
              fields.maintainItemRelList.submit = newvalues
              this.setState({
                fields
              })
            }} />
          }

        }
      },
    ]
    this.state = {
      ifshow: false,
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
        "pageIndex": 1,    //第几页
        "pageSize": 10,     //每页大小
        "maintainPlanType": "",    //保养类型
        "maintainPlanNo": "",    //计划编号
        "equipmentName": ""      //设备名称
      },
      postDatac: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        maintainItem: "",
        id: ""
      },
      postDataz: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        equipmentNo: "",//编号
        equipmentName: "",//设备名
        positionNo: "",//位置编号
        equipmentTypeId: "",//类型
      },
      postUrl: "verbqueryList",
      curitem: {}





    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'verb/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }
  setNewStates(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicmodel/' + type,
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
    this.setNewState('deviceTypequeryTreeList', null);
  }

 

  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };
    if (name == "maintainItemRelList") {//输入内容
      let Inarr = fields[name].submit ? fields[name].submit.map((item) => {
        return item.equipmentMaintainItemId
      }) : []

      function getval(key) {
        let results = ""
        fields[name].submit ? fields[name].submit.map((item) => {
          if (item.equipmentMaintainItemId == key) {
            results = item.maintainCost
          }
        }) : null

        return results
      }

      let submit = selectval.map((item) => {
        if (Inarr.indexOf(item) == -1) {
          return {
            "equipmentMaintainItemId": item,
            "maintainCost": undefined
          }
        } else {
          return {
            "equipmentMaintainItemId": item,
            "maintainCost": getval(item)
          }
        }

      })
      fields[name] = { ...fields[name], value: selectval, submit };
    }


    this.setState({
      fields
    })
  }


  //表单改变
  handleFormChange = (changedFields) => {
    let fields = this.state.fields, obj;
    const form = this.formRef.props.form;
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
          if (i == "maintainItemRelList") {
            this.onSelectChange(fields[i].value, i)
          }
          if (i == "companyId") {
            this.setState({ postDatac: { ...this.state.postDatac, companyId: obj.value } }, () => {
              this.setNewStates("verbqueryItemForAdd", this.state.postDatac)
            });
            this.setState({ postDataz: { ...this.state.postDataz, companyId: obj.value } }, () => {
              this.setNewStates("queryUseListByComId", this.state.postDataz)
            });
          }

          if (i == "planType") {
            if (obj.value == "0") {
              fields.maintainPeriod.requires = true;
              fields.maintainPeriod.hides = false;
              fields.maintainPlanType.hides = false;
              fields.maintainPlanType.option = this.props.verb.maintainPlanTypePeriod.map((item) => {
                return {
                  name: item.dicName,
                  id: item.dicKey
                }
              });
            } else {
              fields.maintainPeriod.requires = false;
              fields.maintainPeriod.hides = true;
              fields.maintainPlanType.hides = false;
              fields.maintainPlanType.option = this.props.verb.maintainPlanTypeOnce.map((item) => {
                return {
                  name: item.dicName,
                  id: item.dicKey
                }
              });
            }
          }
          this.setState({
            fields: fields,
          })
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
      curitem = this.props.verb[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {//companyList
        companyId: {
          value: undefined,
          type: "select",
          title: "选择公司",
          keys: "companyId",
          requires: true,
          col: { span: 24 },
          option: this.props.verb.companyList && this.props.verb.companyList.map((item) => {
            return {
              id: item.id,
              name: item.companyName
            }
          })
        },
        maintainItemRelList: {
          value: undefined,
          type: "table",
          title: "保养项目",
          keys: "maintainItemRelList",
          requires: true,
          columns: this.columnes,
          dataSource: "verbqueryItemForAdd",
          hides: false,
          dv: "id",
          lb: "maintainItem",
          submit: []
        },
        equipmentIds: {
          value: [],
          type: "table",
          title: "选择设备",
          keys: "equipmentIds",
          requires: true,
          columns: this.columns,
          dataSource: "queryUseListByComId",
          hides: false,
          dv: "id",
          lb: "equipmentName"
        },
        planMaintainDate: {
          value: undefined,
          type: "datepicker",
          title: "计划开始时间",
          keys: "planMaintainDate",
          requires: true,
          col: { span: 24 }
        },
        planType: {
          value: undefined,
          type: "select",
          title: "计划类型",
          keys: "planType",
          requires: true,
          option: this.props.verb.planType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        maintainPeriod: {
          value: null,
          type: "inputnumber",
          title: "保养周期(天)",
          keys: "maintainPeriod",
          requires: false
        },
        maintainPlanType: {
          value: undefined,
          type: "select",
          title: "保养类型",
          keys: "maintainPlanType",
          requires: true,
          hides: true
        },

        maintainHours: {
          value: undefined,
          type: "inputnumber",
          title: "保养用时(小时)",
          keys: "maintainHours",
          requires: true,
        },
      }
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype, fields } = this.state;
    let submit = fields.maintainItemRelList.submit;
    message.destroy();
    if (submit.length == 0) {
      message.warn("请选择保养项目")
      return
    }


    form.validateFields((err, values) => {

      for (let i in values) {
        if (!values[i]) {
          values[i] = ""
        } else if (i == "planMaintainDate") {
          values[i] = moment(values[i]).format("YYYY-MM-DD");
        }
      }

      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id, maintainItemRelList: submit };
        delete postData.equipmentIds;
        this.setNewState("verbupdate", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values, maintainItemRelList: submit };
        this.setNewState("verbsave", postData, () => {
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

  handleSearchc = (selectedKeys, dataIndex) => {
    let postUrl = "verbqueryItemForAdd"
    this.setState({ postDatac: { ...this.state.postDatac, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDatac)
    });
  };
  handleSearchz = (selectedKeys, dataIndex) => {
    let postUrl = "queryUseListByComId"
    this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDataz)
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

  onRefz = (ref) => {
    this.childz = ref;
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, ifshow } = this.state,
      { verbqueryList, maintainPlanTypeOnce, maintainPlanTypePeriod, planType, verbqueryByMaintainPlanNo, deviceTypequeryTreeList } = this.props.verb;
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
    }, getsearchboxc = (key) => {
      if (this.childc) {
        return this.childc.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getsearchboxz = (key) => {
      if (this.childz) {
        return this.childz.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxz = (key, option) => {
      if (this.childz) {
        return this.childz.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    };

    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchboxz("equipmentNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchboxz("equipmentName")
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchboxz("positionNo")
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectboxz('equipmentTypeId', deviceTypequeryTreeList),
      },
    ]


    this.columnes = [
      {
        title: '保养项目',
        dataIndex: 'maintainItem',
        key: 'maintainItem',
        width: 200,
        ...getsearchboxc("maintainItem")
      },
      {
        title: '保养内容',
        dataIndex: 'maintainContent',
        key: 'maintainContent',
      },
      {
        title: '费用(元)',
        width: 120,
        dataIndex: 'maintainCost',
        key: 'maintainCost',
        render: (text, record) => {
          let vals = this.state.fields.maintainItemRelList.value ? this.state.fields.maintainItemRelList.value : [], res,
            values = this.state.fields.maintainItemRelList.submit ? this.state.fields.maintainItemRelList.submit : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.equipmentMaintainItemId == record.id) {
              res = item.maintainCost
            }
          })

          if (vals.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return <Input value={res} onChange={(e) => {
              let val = e.target.value;
              let newvalues = values.map((item, i) => {
                if (item.equipmentMaintainItemId == record.id) {
                  item.maintainCost = val
                }
                return item
              })
              fields.maintainItemRelList.submit = newvalues
              this.setState({
                fields
              })
            }} />
          }

        }
      },
    ]

    const columns = [
      {
        title: '公司',
        dataIndex: 'companyName',
        key: 'companyName',
        ...getselectbox('companyId', this.props.verb.companyList && this.props.verb.companyList.map((item) => {
          return {
            dicName: item.companyName,
            dicKey: item.id
          }
        }))
      },
      {
        title: '计划编号',
        dataIndex: 'maintainPlanNo',
        key: 'maintainPlanNo',
        ...getsearchbox('maintainPlanNo')
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName')
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo')
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox('positionNo')
      },

      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        ...getsearchbox('equipmentModel')
      },
      {
        title: '保养类型',
        dataIndex: 'maintainPlanTypeName',
        key: 'maintainPlanTypeName',
        ...getselectbox('maintainPlanType', maintainPlanTypePeriod.concat(maintainPlanTypeOnce))
      },
      {
        title: '计划类型',
        dataIndex: 'planTypeName',
        key: 'planTypeName',
      },
      {
        title: '周期(天)',
        dataIndex: 'maintainPeriod',
        key: 'maintainPeriod',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        ...getselectbox("status", [
          {
            dicKey: "1",
            dicName: "启用"
          },
          {
            dicKey: "2",
            dicName: "停用"
          },
          {
            dicKey: "3",
            dicName: "待执行"
          },
          {
            dicKey: "4",
            dicName: "执行中"
          },
          {
            dicKey: "5",
            dicName: "已结束"
          },
        ]),
        render: (text, record) => <div>
          {
            record.planType == "0" ? <Switch checkedChildren="启用" unCheckedChildren="停用" checked={text == "1" ? true : false} onChange={(check) => {
              this.setNewState("isUse", { status: check ? "1" : "2", id: record.id }, () => {
                this.resetData()
              })

            }} /> :
              <span>{
                text == "1" ? "启用" :
                  text == "2" ? "停用" :
                    text == "3" ? "待执行" :
                      text == "4" ? "执行中" :
                        text == "5" ? "已结束" : ""
              }</span>
          }

        </div>
      },
      {
        title: '计划开始时间',
        dataIndex: 'planMaintainDate',
        key: 'planMaintainDate',
      },
      {
        title: '下次保养时间',
        dataIndex: 'nextMaintainDate',
        key: 'nextMaintainDate',
      },
      {
        title: '保养用时(小时)',
        dataIndex: 'maintainHours',
        key: 'maintainHours',
      },
      {
        title: '总费用(元)',
        dataIndex: 'totalBudget',
        key: 'totalBudget',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          备注
      <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                "pageIndex": 1,    //第几页
                "pageSize": 10,     //每页大小
                "maintainPlanType": "",    //保养类型
                "maintainPlanNo": "",    //计划编号
                "equipmentName": "",      //设备名称
                "positionNo": "",
                "equipmentModel": "",
                "equipmentNo": ""
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
          </a>
        </span>,
        dataIndex: 'remark',
        key: 'remark',
      },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("verbqueryList", this.state.postData);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearchc} postData={this.state.postDatac}></SearchBox>

        <Card title='保养计划列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Abload reload={() => {
              this.resetData()
            }} data={null} postName="uploadequipmentMaintainPlan" left={0} filePath="http://www.plszems.com/download/保养计划导入模板.xlsx"></Abload>
            <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
            <a onClick={() => {
              this.setState({
                ifshow: !ifshow
              })
            }}>{ifshow ? "取消" : "新增"}</a>
            {
              curitem.id && <div style={{ display: "flex", alignItems: "center" }}>
                <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
                <a onClick={() => {
                  this.setNewStates("verbqueryItemForAdd", {
                    "pageIndex": 1,                          //(int)页码
                    "pageSize": 10,                           //(int)条数
                    "id": curitem.id,
                    "maintainItem": "",
                    "companyId": curitem.companyId
                  }, () => {
                    this.setNewState("verbqueryMaintainItem", { id: curitem.id }, () => {
                      let { verbqueryMaintainItem } = this.props.verb
                      this.setState({
                        postDatac: {
                          "pageIndex": 1,                          //(int)页码
                          "pageSize": 10,                           //(int)条数
                          "id": curitem.id,
                          "maintainItem": "",
                          "companyId": curitem.companyId
                        },
                        fv: true,
                        iftype: {
                          name: "修改保养计划",
                          value: "edit"
                        },
                        curitem: curitem,
                        fields: {
                          companyId: {
                            value: curitem.companyId,
                            type: "select",
                            title: "选择公司",
                            keys: "companyId",
                            requires: true,
                            disabled: true,
                            col: { span: 24 },
                            option: this.props.verb.companyList && this.props.verb.companyList.map((item) => {
                              return {
                                id: item.id,
                                name: item.companyName
                              }
                            })
                          },
                          maintainItemRelList: {
                            value: verbqueryMaintainItem.map((item) => { return item.equipmentMaintainItemId }),
                            type: "table",
                            title: "保养项目",
                            keys: "maintainItemRelList",
                            requires: true,
                            columns: this.columnes,
                            dataSource: "verbqueryItemForAdd",
                            hides: false,
                            dv: "id",
                            col: { span: 24 },
                            lb: "maintainItem",
                            submit: verbqueryMaintainItem.map((item) => {
                              return {
                                "equipmentMaintainItemId": item.equipmentMaintainItemId,
                                "maintainCost": item.maintainCost
                              }
                            })
                          },
                          planType: {
                            value: curitem.planType,
                            type: "select",
                            title: "计划类型",
                            keys: "planType",
                            requires: true,
                            disabled: true,
                            option: this.props.verb.planType.map((item) => {
                              return {
                                name: item.dicName,
                                id: item.dicKey
                              }
                            })
                          },
                          maintainPeriod: {
                            value: curitem.maintainPeriod,
                            type: "inputnumber",
                            title: "保养周期(天)",
                            keys: "maintainPeriod",
                            requires: curitem.planType == 0,
                            hides: curitem.planType == 1
                          },
                          maintainPlanType: {
                            value: curitem.maintainPlanType,
                            type: "select",
                            title: "保养类型",
                            keys: "maintainPlanType",
                            requires: true,
                            option: curitem.planType == "1" ? this.props.verb.maintainPlanTypeOnce.map((item) => {
                              return {
                                name: item.dicName,
                                id: item.dicKey
                              }
                            }) : this.props.verb.maintainPlanTypePeriod.map((item) => {
                              return {
                                name: item.dicName,
                                id: item.dicKey
                              }
                            })
                          },
                          planMaintainDate: {
                            value: curitem.planMaintainDate ? moment(curitem.planMaintainDate) : undefined,
                            type: "datepicker",
                            title: "计划开始时间",
                            keys: "planMaintainDate",
                            requires: true,
                          },
                          maintainHours: {
                            value: curitem.maintainHours,
                            type: "inputnumber",
                            title: "保养用时(小时)",
                            keys: "maintainHours",
                            requires: true,
                          },
                        }
                      })

                    })
                  })
                }}>修改</a>
                <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottom"
                  title={"确认删除该计划？"}
                  onConfirm={() => {
                    this.setNewState("verbdeleteById", { id: curitem.id }, () => {
                      let total = this.props.verb.verbqueryList.total,
                        page = this.props.verb.verbqueryList.pageNum;
                      if ((total - 1) % 10 == 0) {
                        page = page - 1
                      }
                      this.setState({
                        postData: { ...this.state.postData, pageIndex: page }
                      }, () => {
                        this.setNewState("verbqueryList", postData, () => {
                          message.success("删除成功！");
                        });
                      })
                    })
                  }}>
                  <a style={{ color: "#ff4800" }}>删除</a>
                </Popconfirm>
              </div>
            }
            <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认生成任务？"}
              onConfirm={() => {
                this.setNewState("createMaintainTask", this.state.postData, () => {
                  message.success("操作成功!");
                  this.resetData();
                })
              }}>
              <a>生成任务</a>
            </Popconfirm>
            <Divider type='vertical' style={{ marginTop: 3 }}></Divider>
            <a onClick={() => {
              message.loading("正在导出文件...")
            }} href={`/rs/equipmentMaintainPlan/export`} target="_blank">
              导出保养项
            </a>
          </div>
        }>
          <Row gutter={24} >
            <Col span={12} style={{ backgroundColor: ifshow ? "#f0f0f0" : "transparent", padding: ifshow ? "12px" : 0, height: ifshow ? 56 : 0, opacity: ifshow ? 1 : 0, cursor: "default", overflow: "hidden", transition: "all 0.4s" }}>
              <Button style={{ width: "100%" }} type="primary" onClick={() => {
                this.setState({
                  iftype: {
                    name: "新增保养计划",
                    value: "add"
                  },
                  fv: true
                })
              }}>普通新增</Button>
            </Col>
            <Col span={12} style={{ backgroundColor: ifshow ? "#f0f0f0" : "transparent", padding: ifshow ? "12px" : 0, height: ifshow ? 56 : 0, opacity: ifshow ? 1 : 0, cursor: "default", display: "flex", alignItems: "center", overflow: "hidden", transition: "all 0.4s" }}>
              <Button style={{ width: "100%" }} type="default" onClick={() => {
                if (!curitem.maintainPlanNo) {
                  message.warn("请先选中需要复制的项")
                  return
                }
                this.setNewState("verbqueryByMaintainPlanNo", { maintainPlanNo: curitem.maintainPlanNo }, () => {
                  let record = this.props.verb.verbqueryByMaintainPlanNo;
                  if (record) {
                    this.setState({ postDatac: { ...this.state.postDatac, companyId: curitem.companyId, id: curitem.id } }, () => {
                      this.setNewStates("verbqueryItemForAdd", this.state.postDatac, () => {
                        this.setNewState("verbqueryMaintainItem", { id: record.id }, () => {
                          let { verbqueryMaintainItem } = this.props.verb;
                          this.setState({ postDataz: { ...this.state.postDataz, companyId: curitem.companyId } }, () => {
                            this.setNewStates("queryUseListByComId", this.state.postDataz)
                          });
                          this.setState({
                            fv: true,
                            iftype: {
                              name: "新增保养计划",
                              value: "add"
                            },
                            curitem: record,
                            fields: {
                              companyId: {
                                value: curitem.companyId,
                                type: "select",
                                title: "选择公司",
                                keys: "companyId",
                                requires: true,
                                disabled: true,
                                col: { span: 24 },
                                option: this.props.verb.companyList && this.props.verb.companyList.map((item) => {
                                  return {
                                    id: item.id,
                                    name: item.companyName
                                  }
                                })
                              },
                              maintainItemRelList: {
                                value: verbqueryMaintainItem.map((item) => { return item.equipmentMaintainItemId }),
                                type: "table",
                                title: "保养项目",
                                keys: "maintainItemRelList",
                                requires: true,
                                columns: this.columnes,
                                dataSource: "verbqueryItemForAdd",
                                hides: false,
                                dv: "id",
                                lb: "maintainItem",
                                submit: verbqueryMaintainItem.map((item) => {
                                  return {
                                    "equipmentMaintainItemId": item.equipmentMaintainItemId,
                                    "maintainCost": item.maintainCost
                                  }
                                })
                              },
                              equipmentIds: {
                                value: [],
                                type: "table",
                                title: "选择设备",
                                keys: "equipmentIds",
                                requires: true,
                                columns: this.columns,
                                dataSource: "queryUseListByComId",
                                hides: false,
                                dv: "id",
                                lb: "equipmentName"
                              },
                              planMaintainDate: {
                                value: record.planMaintainDate ? moment(record.planMaintainDate) : undefined,
                                type: "datepicker",
                                title: "计划开始时间",
                                keys: "planMaintainDate",
                                requires: true,
                                col: { span: 24 }
                              },
                              planType: {
                                value: record.planType,
                                type: "select",
                                title: "计划类型",
                                keys: "planType",
                                requires: true,
                                option: this.props.verb.planType.map((item) => {
                                  return {
                                    name: item.dicName,
                                    id: item.dicKey
                                  }
                                })
                              },
                              maintainPeriod: {
                                value: record.maintainPeriod,
                                type: "inputnumber",
                                title: "保养周期(天)",
                                keys: "maintainPeriod",
                                requires: false,
                                requires: curitem.planType == 0,
                                hides: curitem.planType == 1
                              },
                              maintainPlanType: {
                                value: record.maintainPlanType,
                                type: "select",
                                title: "保养类型",
                                keys: "maintainPlanType",
                                requires: true,
                                option: record.planType == "1" ?
                                  this.props.verb.maintainPlanTypeOnce.map((item) => {
                                    return {
                                      name: item.dicName,
                                      id: item.dicKey
                                    }
                                  }) :
                                  this.props.verb.maintainPlanTypePeriod.map((item) => {
                                    return {
                                      name: item.dicName,
                                      id: item.dicKey
                                    }
                                  })
                              },

                              maintainHours: {
                                value: record.maintainHours,
                                type: "inputnumber",
                                title: "保养用时(小时)",
                                keys: "maintainHours",
                                requires: true,
                              },
                            }
                          })

                        })
                      })
                    });




                  }
                })


              }}>复制新增</Button>
            </Col>
          </Row>
          <Table bordered size="middle" scroll={{ x: 1600, y: "59vh" }}
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
              current: verbqueryList.pageNum ? verbqueryList.pageNum : 1,
              total: verbqueryList.total ? parseInt(verbqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={verbqueryList.list ? verbqueryList.list : []}
          >
          </Table>

          {
            fv && <CreateForm
              tableUrl={[{
                url: "queryUseListByComId",
                post: this.state.postDataz
              }, {
                url: "verbqueryItemForAdd",
                post: this.state.postDatac
              }]}/*配置页面表格数据*/
              width={"98%"}
              fields={this.state.fields}
              col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }}
              iftype={iftype}
              onChange={this.handleFormChange}
              wrappedComponentRef={this.saveFormRef}
              visible={fv}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
              onRef={this.onRefs}
              onSelectChange={this.onSelectChange}
            />
          }


        </Card>
      </div>
    )
  }


}

export default VerbPlan



