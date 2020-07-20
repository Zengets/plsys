import {
  Tabs, PageHeader, message
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import DeviceGoChild from './DeviceGoChild/DeviceGoChild';
import CreateForm from "@/components/CreateForm";
import moment from "moment";


const { TabPane } = Tabs;


@connect(({ device, menu, publicmodel, loading }) => ({
  device,
  menu,
  publicmodel,
  submitting: loading.effects['device/goqueryList'],
}))

class DeviceGo extends React.Component {
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
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
      },
      {
        title: '所在产品线',
        dataIndex: 'equipmentWorkshop',
        key: 'equipmentWorkshop',
      },
      {
        title: '能耗',
        dataIndex: 'energyConsumption',
        key: 'energyConsumption',
      },
      {
        title: '价值',
        dataIndex: 'equipmentWorth',
        key: 'equipmentWorth',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
      {
        title: '部门名称',
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
    ]
    this.state = {
      postpoint: {
        radio: "",
        textarea: ""
      },
      tablePost: {
        "pageIndex": 1,                          //(int)页码
        "pageSize": 10,
        "companyId": "",
        "shopId": "",                          //(int)条数
        "departmentId": ""    //(int)部门id
      },
      iftype: {
        name: "新增流转",
        value: "add"
      },
      curitem: {},
      fv: false,
      key: "1",
      postData: {
        "pageIndex": "1",
        "pageSize": "9",
        "taskNo": "",
        "approvalProcessType": "0",
        "applyUserId": "",
        "status": ""
      },
      postUrl: "goqueryList",
      fields: {}
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
    this.setNewState("cpyqueryAll")
  }

  componentDidMount() {
    this.resetData();
  }

  onSelectChange = (selectval) => {
    let { fields } = this.state;
    fields["equipmentId"] = { ...fields["equipmentId"], value: selectval };
    this.setState({
      fields
    })
  }

  gethides(name, key, defaults) {
    if (name == "allotReason" || name == "allotOutCompanyId" || name == "allotInCompanyId" || name == "allotOutDepartmentId" || name == "allotInDepartmentId" || name == "allotOutShopId" || name == "allotInShopId") {
      return key == 0
    } else if (
      name == "loanOutDate" ||
      name == "returnDate" ||
      name == "loanReason" ||
      name == "loanOutCompanyId" ||
      name == "loanInCompanyId" ||
      name == "loanOutDepartmentId" ||
      name == "loanInDepartmentId" ||
      name == "loanOutShopId" ||
      name == "loanInShopId") {
      return key == 2
    } else if (name == "scarpReason" || name == "scarpDeal" || name == "scarpDealUserId" || name == "telephone") {
      return key == 3
    } else {
      return !defaults
    }
  }
  tosetOption(key, val) {
    let departmentList = this.props.device.departmentLists,
      shopList = this.props.device.shopList.map((item) => {
        return {
          name: item.shopName,
          id: item.id
        }
      }),
      fields = this.state.fields;

    switch (key) {
      case "allotOutCompanyId":
        fields.allotOutDepartmentId.option = departmentList;
        fields.allotOutShopId.option = shopList;
        fields.allotOutDepartmentId.value = undefined;
        fields.allotOutShopId.value = undefined;
        this.resetChidTable("companyId", val)
        this.setState({
          fields
        })
        break;
      case "allotInCompanyId":
        fields.allotInDepartmentId.option = departmentList;
        fields.allotInShopId.option = shopList;
        fields.allotInDepartmentId.value = undefined;
        fields.allotInShopId.value = undefined;
        this.setState({
          fields
        })
        break;
      case "loanOutCompanyId":
        fields.loanOutDepartmentId.option = departmentList;
        fields.loanOutShopId.option = shopList;
        fields.loanOutDepartmentId.value = undefined;
        fields.loanOutShopId.value = undefined;
        this.resetChidTable("companyId", val)
        this.setState({
          fields
        })
        break;
      case "loanInCompanyId":
        fields.loanInDepartmentId.option = departmentList;
        fields.loanInShopId.option = shopList;
        fields.loanInDepartmentId.value = undefined;
        fields.loanInShopId.value = undefined;
        this.setState({
          fields
        })
        break;
    }

  }

  resetChidTable(key, value) {
    this.setState({
      tablePost: {
        ...this.state.tablePost,
        [key]: value
      }
    }, () => {
      this.childs.changedData("devicequeryList", {
        ...this.state.tablePost,
        [key]: value
      }, 0)
    })

  }

  //表单改变
  handleFormChange = (changedFields) => {
    let fields = this.state.fields, obj;
    const form = this.formRef.props.form;
    let approvalProcessType = form.getFieldsValue().approvalProcessType;
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
          if (i == "equipmentId") {
            fields[i].dirty = fields[i].value
          }
          if (i == "allotOutCompanyId" || i == "allotInCompanyId" || i == "loanOutCompanyId" || i == "loanInCompanyId") {
            this.setNewState("queryCondition", { companyId: obj.value }, () => {
              this.tosetOption(i, obj.value)
            })
          }
          if (i == "allotOutDepartmentId" || i == "loanOutDepartmentId") {
            this.resetChidTable("departmentId", obj.value)
          }
          if (i == "allotOutShopId" || i == "loanOutShopId") {
            this.resetChidTable("shopId", obj.value)
          }

        }
        fields[i].hides = !this.gethides(i, approvalProcessType, fields[i].hides);
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

  getOption(res) {
    let reses = this.props.device[res]
    let result = reses.map((item) => {
      if (res == "userList") {
        return {
          name: item.userName,
          id: item.id
        }
      } else if (res == "transferType") {
        return {
          name: item.dicName,
          id: item.dicKey
        }
      } else if (res == "departmentList") {
        return {
          name: item.departmentName,
          id: item.id
        }

      }
    })
    return result
  }

  /*关闭*/
  handleCancel = () => {
    let cpylist = this.props.device.cpyqueryAll.map((item) => {
      return {
        name: item.companyName,
        id: item.id
      }
    })
    this.setState({
      fv: false,
      fields: {
        approvalProcessType: {
          value: null,
          type: "select",
          title: "流转类型",
          keys: "approvalProcessType",
          requires: true,
          option: this.getOption("transferType"),
          hides: false,
        },
        allotReason: {
          value: null,
          type: "input",
          title: "调拨原因",
          keys: "allotReason",
          requires: true,
          hides: true,
        },
        allotOutCompanyId: {
          value: null,
          type: "select",
          title: "调拨出公司",
          keys: "allotOutCompanyId",
          requires: true,
          hides: true,
          option: cpylist
        },
        allotOutDepartmentId: {//adden
          value: null,
          type: "treeselect",
          title: "调拨出部门",
          keys: "allotOutDepartmentId",
          requires: true,
          hides: true,
        },
        allotOutShopId: {//adden
          value: null,
          type: "select",
          title: "调拨出产品线",
          keys: "allotOutShopId",
          requires: true,
          hides: true,
        },

        allotInCompanyId: {
          value: null,
          type: "select",
          title: "调拨进公司",
          keys: "allotInCompanyId",
          requires: true,
          hides: true,
          option: cpylist
        },
        allotInDepartmentId: {//adden
          value: null,
          type: "treeselect",
          title: "调拨进部门",
          keys: "allotInDepartmentId",
          requires: true,
          hides: true,
        },
        allotInShopId: {//adden
          value: null,
          type: "select",
          title: "调拨进产品线",
          keys: "allotInShopId",
          requires: true,
          hides: true,
        },
        loanReason: {
          value: null,
          type: "input",
          title: "借用原因",
          keys: "loanReason",
          requires: true,
          hides: true,
        },
        loanOutCompanyId: {
          value: null,
          type: "select",
          title: "借出公司",
          keys: "loanOutCompanyId",
          requires: true,
          option: cpylist,
          hides: true,
        },
        loanOutDepartmentId: {
          value: null,
          type: "treeselect",
          title: "借出部门",
          keys: "loanOutDepartmentId",
          requires: true,
          hides: true,
        },
        loanOutShopId: {
          value: null,
          type: "select",
          title: "借出产品线",
          keys: "loanOutShopId",
          requires: true,
          hides: true,
        },
        loanOutDate: {
          value: null,
          type: "datepicker",
          title: "借出日期",
          keys: "loanOutDate",
          requires: true,
          hides: true,
        },
        loanInCompanyId: {
          value: null,
          type: "select",
          title: "借入公司",
          keys: "loanInCompanyId",
          requires: true,
          option: cpylist,
          hides: true,
        },
        loanInDepartmentId: {
          value: null,
          type: "treeselect",
          title: "借入部门",
          keys: "loanInDepartmentId",
          requires: true,
          hides: true,
        },
        loanInShopId: {
          value: null,
          type: "select",
          title: "借入产品线",
          keys: "loanInShopId",
          requires: true,
          hides: true,
        },


        returnDate: {
          value: null,
          type: "datepicker",
          title: "归还日期",
          keys: "returnDate",
          requires: true,
          hides: true,
        },

        scarpReason: {
          value: null,
          type: "input",
          title: "报废原因",
          keys: "scarpReason",
          requires: true,
          hides: true,
        },
        scarpDeal: {
          value: null,
          type: "input",
          title: "报废处理",
          keys: "scarpDeal",
          requires: true,
          hides: true,
        },
        scarpDealUserId: {
          value: null,
          type: "select",
          title: "报废处理人",
          keys: "scarpDealUserId",
          requires: true,
          option: this.getOption("userList"),
          hides: true,
        },
        equipmentId: {
          value: undefined,
          type: "table",
          title: "设备",
          keys: "equipmentId",
          requires: true,
          col: { span: 24 },
          columns: this.columns,
          dataSource: "devicequeryList",
          checktype: "radio",
          hides: false,
          dv: "id",
          lb: "equipmentName"
        },
        attachUrl: {
          value: null,
          type: "upload",
          title: "附件",
          keys: "attachUrl",
          requires: false,
          uploadtype: "file",
          col: { span: 24 },
          hides: false,
        },

        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false,
          col: { span: 24 },
          hides: false,
        },
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

      for (let i in values) {
        if (!values[i]) {
          values[i] = ""
        } else if (i == "loanOutDate" || i == "returnDate") {
          values[i] = moment(values[i]).format("YYYY-MM-DD");
        } else if (i == "attachUrl") {
          let last = values.attachUrl[values.attachUrl.length - 1];
          if (last.response) {
            values.attachUrl = last.response.data.dataList[0] ? last.response.data.dataList[0] : ""
          } else {
            values.attachUrl = null
          }
        }
      }


      values.equipmentId = values.equipmentId[0];
      let postData = { ...values };
      this.setNewState("gosave", postData, () => {
        message.success("新增成功！");
        this.setState({ visibleform: false });
        this.resetData();
      });

    });
  }

  onRef = (ref) => {
    this.childs = ref;
  }

  render() {
    let { iftype, fields, fv } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }

    //0， 调拨 ，2， 借用 ，3， 报废 ，4， 验收
    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <PageHeader title={<span style={{ paddingLeft: 14 }}>流转审批列表</span>} style={{ margin: 0 }} extra={[<a onClick={() => {
          this.setState({
            fv: true
          })
        }}>新增</a>]}>
          <Tabs defaultActiveKey="1" onChange={callback} style={{ marginTop: -12 }}>
            <TabPane tab="调拨" key="1">
              {
                this.state.key == "1" &&
                <DeviceGoChild title={"调拨"} postData={{ approvalProcessType: "0" }}></DeviceGoChild>
              }
            </TabPane>
            <TabPane tab="借用" key="2">
              {
                this.state.key == "2" &&
                <DeviceGoChild title={"借用"} postData={{ approvalProcessType: "2" }}></DeviceGoChild>
              }
            </TabPane>
            <TabPane tab="报废" key="3">
              {
                this.state.key == "3" &&
                <DeviceGoChild title={"报废"} postData={{ approvalProcessType: "3" }}></DeviceGoChild>
              }
            </TabPane>
            <TabPane tab="验收" key="4">
              {
                this.state.key == "4" &&
                <DeviceGoChild title={"验收"} postData={{ approvalProcessType: "1" }}></DeviceGoChild>
              }
            </TabPane>
          </Tabs>
          <CreateForm
            onRef={this.onRef}
            tableUrl={[
              {
                url: "devicequeryList",
                post: this.state.tablePost
              }]} /*配置该页面表格数据 */
            width={800}
            col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 8 }}
            fields={this.state.fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            onSelectChange={this.onSelectChange}
          />

        </PageHeader>

      </div>
    )
  }


}

export default DeviceGo



