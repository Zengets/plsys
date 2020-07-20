import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox'


@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/mdqueryList'],
}))
class DeviceModel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
      },
      /*初始化 main List */
      postData: {
        "pageIndex": 1,
        "pageSize": 10,
        "equipmentModel": "",//设备型号，筛选条件
        "equipmentName": ""//设备名称，筛选条件
      },
      postUrl: "mdqueryList",
      curitem: {}
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
    let { props } = this;
    let curitem = this.state.curitem;
    if (this.state.curitem.id) {
      curitem = this.props.device[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        equipmentModel: {
          value: null,
          type: "input",
          title: "设备型号",
          keys: "equipmentModel",
          requires: true
        },
        equipmentName: {
          value: null,
          type: "input",
          title: "设备名称",
          keys: "equipmentName",
          requires: true
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
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("mdsave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("mdsave", postData, () => {
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
      { mdqueryList } = this.props.device;
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
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox("equipmentName")
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        ...getsearchbox("equipmentModel")

      },
    ]

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("mdqueryList", this.state.postData);
      })
    }
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='设备型号列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增设备型号",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>

            <Divider style={{ display: curitem.id ? "block" : "none", marginTop: 6 }} type="vertical"></Divider>

            <a style={{ display: curitem.id ? "block" : "none" }} onClick={() => {
              this.setState({
                fv: true,
                iftype: {
                  name: "修改设备型号",
                  value: "edit"
                },
                curitem: curitem,
                fields: {
                  equipmentName: {
                    ...this.state.fields.equipmentName,
                    value: curitem.equipmentName,
                  },
                  equipmentModel: {
                    ...this.state.fields.equipmentModel,
                    value: curitem.equipmentModel,
                  },
                },
              })
            }}>修改</a>
            <Divider style={{ display: curitem.id ? "block" : "none", marginTop: 6 }} type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该设备型号？"}
              onConfirm={() => {
                this.setNewState("mddeleteById", { id: curitem.id }, () => {
                  let total = this.props.device.mdqueryList.total,
                    page = this.props.device.mdqueryList.pageNum;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }
                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.resetData()
                  })
                })
              }}>
              <a style={{ display: curitem.id ? "block" : "none", color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </div>
        }>
          <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
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
              current: mdqueryList.pageNum ? mdqueryList.pageNum : 1,
              total: mdqueryList.total ? parseInt(mdqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={mdqueryList.list ? mdqueryList.list : []}
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

export default DeviceModel



