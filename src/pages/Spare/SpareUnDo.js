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
  submitting: loading.effects['spare/UndoqueryList'],
}))
class SpareUnDo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        roleName: {
          value: null,
          type: "input",
          title: "配件更换计划名称",
          keys: "roleName",
          requires: true
        },
        remark: {
          value: null,
          type: "textarea",
          title: "配件更换计划描述",
          keys: "remark",
          requires: false
        }
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        "status": null, // 状态：0：启用，1：停用
        "sparePartsNo": null, // 配件料号
        "equipmentNo": null // 设备编号
      },
      postUrl: "UndoqueryList",
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
      curitem = this.props.spare[this.state.postUrl].list.filter((item)=>{return item.id==curitem.id})[0]
    }
    this.setState({
      fv: false,
      curitem:curitem?curitem:{},
      fields: {
        roleName: {
          value: null,
          type: "input",
          title: "配件更换计划名称",
          keys: "roleName",
          requires: true
        },
        remark: {
          value: null,
          type: "textarea",
          title: "配件更换计划描述",
          keys: "remark",
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
      let postData = { ...values, id: curitem.id };
      this.setNewState("saveChangePerson", postData, () => {
        message.success("修改成功！");
        this.resetData();
      });

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

  onRefs = (ref) => {
    this.childs = ref;
  }


  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { UndoqueryList } = this.props.spare;

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
    }

    const columns = [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
      },
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
        ...getsearchbox('sparePartsNo')
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
        title: '执行人',
        dataIndex: 'planMaintainUserName',
        key: 'planMaintainUserName',
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("UndoqueryList", this.state.postData);
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
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='未完成配件更换计划列表' extra={
           <a style={{display:curitem.id?"block":"none"}} onClick={() => {
            this.setNewState("queryChangePerson", { equipmentId: curitem.equipimentId }, () => {
              this.setState({
                fv: true,
                iftype: {
                  name: "修改执行人",
                  value: "edit"
                },
                curitem: curitem,
                fields: {
                  planMaintainUserId: {
                    value: curitem.planMaintainUserId,
                    type: "select",
                    title: "执行人",
                    keys: "planMaintainUserId",
                    requires: true,
                    option: this.props.spare.queryChangePerson.map((item) => {
                      return {
                        name: item.userName,
                        id: item.userId
                      }
                    })
                  },
                },
              })
            })

          }}>修改执行人</a>
        }>
          <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: UndoqueryList.pageNum ? UndoqueryList.pageNum : 1,
              total: UndoqueryList.total ? parseInt(UndoqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={UndoqueryList.list ? UndoqueryList.list : []}
          >
          </Table>

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

        </Card>
      </div>
    )
  }


}

export default SpareUnDo



