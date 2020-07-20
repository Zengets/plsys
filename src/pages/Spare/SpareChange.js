import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/SETqueryList'],
}))
class Character extends React.Component {

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
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      postDataz: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        equipmentNo: "",//编号
        equipmentName: "",//设备名
        positionNo: "",//位置编号
        equipmentTypeId: "",//类型
      },
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        "status": null, // 状态：0：启用，1：停用
        "sparePartsNo": null, // 配件料号
        "equipmentNo": null // 设备编号
      },
      postUrl: "SETqueryList",
      curitem: {}


    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'spare/' + type,
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
    this.setNewState('deviceTypequeryTreeList', null);
    this.setNewState("queryEquipmentAndSpareParts", null, () => {
      this.resetData();
    })
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
          if (i == "spareReplaceType") {
            if (obj.value == "0") {
              fields.replacePeriodHours.hides = false;
              fields.aheadHours.hides = false;
              fields.replacePeriodTimes.hides = true;
              fields.aheadTimes.hides = true
            } else if (obj.value == "1") {
              fields.replacePeriodHours.hides = true;
              fields.aheadHours.hides = true;
              fields.replacePeriodTimes.hides = false;
              fields.aheadTimes.hides = false
            } else if (obj.value == "2") {
              fields.replacePeriodHours.hides = false;
              fields.aheadHours.hides = false;
              fields.replacePeriodTimes.hides = false;
              fields.aheadTimes.hides = false
            } else {
              fields.replacePeriodHours.hides = true;
              fields.aheadHours.hides = true;
              fields.replacePeriodTimes.hides = true;
              fields.aheadTimes.hides = true
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
      curitem = this.props.spare[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        equipmentId: {
          value: undefined,
          type: "table",
          title: "选择设备",
          keys: "equipmentId",
          requires: true,
          columns: this.columns,
          dataSource: "queryPageList",
          hides: false,
          checktype: "radio",
          dv: "id",
          lb: "equipmentName"
        },
        sparePartsId: {
          value: null,
          type: "select",
          title: "选择配件",
          keys: "sparePartsId",
          requires: true,
          option: this.props.spare.sparePartsList.map((item, i) => {
            return { id: item.id, name: item.sparePartsName }
          })
        },
        spareReplaceType: {
          value: null,
          type: "select",
          title: "配件更换类型",
          keys: "spareReplaceType",
          requires: true,
          option: [
            { name: "时间", id: 0 },
            { name: "次数", id: 1 },
            { name: "时间和次数", id: 2 },
          ]
        },
        replacePeriodHours: {
          value: null,
          type: "inputnumber",
          title: "更换周期(小时)",
          keys: "replacePeriodHours",
          requires: true,
          hides: true,
        },
        aheadHours: {
          value: null,
          type: "inputnumber",
          title: "提前更换时间(小时)",
          keys: "aheadHours",
          requires: true,
          hides: true
        },
        replacePeriodTimes: {
          value: null,
          type: "inputnumber",
          title: "周期更换次数",
          keys: "replacePeriodTimes",
          requires: true,
          hides: true,
        },
        aheadTimes: {
          value: null,
          type: "inputnumber",
          title: "提前通知次数",
          keys: "aheadTimes",
          requires: true,
          hides: true
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false
        }
      },
    });
  }

  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };
    this.setState({
      fields
    })
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.equipmentId = values.equipmentId[0];
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("SETsave", postData, () => {
          message.success("修改成功！");
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("SETsave", postData, () => {
          message.success("新增成功！");
          this.resetData();
        });
      } else {
        //ELSE TO DO
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

  handleSearchz = (selectedKeys, dataIndex) => {
    let postUrl = "queryPageList"
    this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDataz)
    });
  };

  onRefs = (ref) => {
    this.childs = ref;
  }
  onRefz = (ref) => {
    this.childz = ref;
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { SETqueryList, deviceTypequeryTreeList } = this.props.spare;

    let getsearchbox = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnSelectProps(key, option)
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
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo')
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
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
      {
        title: '配件料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
        ...getsearchbox('sparePartsNo'),
      },
      {
        title: '配件名',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
        
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => <span>{text == 0 ? "启用" : "停用"}</span>,
        ...getselectbox("status", [{ dicKey: "0", dicName: "启用" }, { dicKey: "1", dicName: "停用" }])
      },
      {
        title: '周期运行时间',
        dataIndex: 'runHours',
        key: 'runHours',
        render: (text) => <span style={{display:text?"inline":"none"}}>{text}小时</span>
      },
      {
        title: '更换周期',
        dataIndex: 'replacePeriodHours',
        key: 'replacePeriodHours',
        render: (text) => <span style={{display:text?"inline":"none"}}>{text}小时</span>
      },
      {
        title: '提前更换时间',
        dataIndex: 'aheadHours',
        key: 'aheadHours',
        render: (text) => <span style={{display:text?"inline":"none"}}>{text}小时</span>
      }, 
       {
        title: '周期运行次数',
        dataIndex: 'runTimes',
        key: 'runTimes',
        render: (text) => <span style={{display:text?"inline":"none"}}>{text}次</span>
      },
      {
        title: '周期更换次数',
        dataIndex: 'replacePeriodTimes',
        key: 'replacePeriodTimes',
        render: (text) => <span style={{display:text?"inline":"none"}}>{text}次</span>
      },
      {
        title: '提前通知次数',
        dataIndex: 'aheadTimes',
        key: 'aheadTimes',
        render: (text) => <span style={{display:text?"inline":"none"}}>{text}次</span>
      },


      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("SETqueryList", this.state.postData);
      })
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };
    let menu = (record) => {
      return record.id ?
        <div>
          <Divider type="vertical"></Divider>
          <a onClick={() => {
            this.setState({
              fv: true,
              iftype: {
                name: "修改配件更换计划",
                value: "edit"
              },
              curitem: record,
              fields: {
                equipmentId: {
                  ...this.state.fields.equipmentId,
                  value: [record.equipmentId],
                },
                sparePartsId: {
                  ...this.state.fields.sparePartsId,
                  value: record.sparePartsId,
                },
                spareReplaceType:{
                  ...this.state.fields.spareReplaceType,
                  value: record.spareReplaceType,
                },
                replacePeriodHours: {
                  ...this.state.fields.replacePeriodHours,
                  value: record.replacePeriodHours,
                  hides: record.spareReplaceType=="1"
                },
                aheadHours: {
                  ...this.state.fields.aheadHours,
                  value: record.aheadHours,
                  hides: record.spareReplaceType=="1"
                },
                replacePeriodTimes: {
                  ...this.state.fields.replacePeriodTimes,
                  value: record.replacePeriodTimes,
                  hides: record.spareReplaceType=="0"
                },
                aheadTimes: {
                  ...this.state.fields.aheadTimes,
                  value: record.aheadTimes,
                  hides: record.spareReplaceType=="0"
                },
                remark: {
                  ...this.state.fields.remark,
                  value: record.remark,
                }
              },
            })
          }}>修改</a>
          <Divider type="vertical"></Divider>
          <Popconfirm
            okText="确认"
            cancelText="取消"
            placement="bottom"
            title={"确认删除该计划？"}
            onConfirm={() => {
              this.setNewState("SETdeleteById", { id: record.id }, () => {
                let total = this.props.spare.SETqueryList.total,
                  page = this.props.spare.SETqueryList.pageNum;
                if ((total - 1) % 10 == 0) {
                  page = page - 1
                }
                this.setState({
                  postData: { ...this.state.postData, pageIndex: page }
                }, () => {
                  this.setNewState("SETqueryList", postData, () => {
                    message.success("删除成功！");
                  });
                })
              })
            }}>
            <a style={{ color: "#ff4800" }}>删除</a>
          </Popconfirm>
        </div> : null

    }

    return (
      <div>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>

        <Card title='配件更换计划列表' extra={
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增配件更换计划",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>
            {menu(curitem)}

          </div>
        }>
          <Table bordered size="middle" scroll={{ x: 1600, y: "59vh" }}
            loading={this.props.submitting}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: SETqueryList.pageNum ? SETqueryList.pageNum : 1,
              total: SETqueryList.total ? parseInt(SETqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={SETqueryList.list ? SETqueryList.list : []}
          >
          </Table>

          <CreateForm
            width={1000}
            tableUrl={[{
              url: "queryPageList",
              post: this.state.postDataz
            }]}/*配置页面表格数据*/
            fields={fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            onSelectChange={this.onSelectChange}
          />

        </Card>
      </div>
    )
  }


}

export default Character



