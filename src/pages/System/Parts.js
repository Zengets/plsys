import {
  Table, Tree, Divider, Row, Col, Icon, Select, Alert, Popconfirm, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';


const { TreeNode } = Tree;


@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/partsqueryList'],
}))
class Parts extends React.Component {

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
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
      },
      postUrl: "partsqueryList",
      curitem: {}
    }
  }

  onCheck = (checkedKeys, info) => {
    message.destroy();
    if (this.state.iftype.liziyuan == 2) {
      message.warn("移动端无法操作")
    } else {
      this.setState({ checkedKeys });
    }

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
    this.setState({
      fv: false,
      curitem:{},
      fields: {
        departmentId: {
          value: null,
          type: "treeselect",
          title: "选择部门",
          keys: "departmentId",
          requires: false,
          option: this.props.system.nodeList
        },
        shopName: {
          value: null,
          type: "input",
          title: "产品线名称",
          keys: "shopName",
          requires: true,
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
        let postData = { ...values, id: curitem.id,companyId:curitem.companyId };
        this.setNewState("partssave", postData, () => {
          message.success("修改成功！");
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values,companyId:curitem.companyId };
        this.setNewState("partssave", postData, () => {
          message.success("新增成功！");
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
      { partsqueryList, nodeList } = this.props.system;
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
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }



    const columns = [
      {
        title: '公司名称',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '部门名称',
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return record.id ? null : (<a
            onClick={(e) => {
              e.stopPropagation()
              this.setState({
                iftype: {
                  name: "新增产品线",
                  value: "add"
                },
                fv: true,
                curitem:record
              })
            }}
          >新增</a>)
        }
      },
    ]



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

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (!curitem.id) {
        return curitem.companyId === record.companyId
      } else if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }

      return null;
    };
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='产品线列表' extra={
          <div>
            {
              curitem.id && <span>
                <a onClick={() => {
                  this.setState({
                    iftype: {
                      name: "修改" + curitem.shopName,
                      value: "edit"
                    },
                    fields: {
                      departmentId: {
                        value: curitem.departmentId,
                        type: "treeselect",
                        title: "选择部门",
                        keys: "departmentId",
                        requires: false,
                        option: this.props.system.nodeList
                      },
                      shopName: {
                        value: curitem.shopName,
                        type: "input",
                        title: "产品线名称",
                        keys: "shopName",
                        requires: true,
                      },
                 
                    },
                  }, () => {
                    this.setState({
                      fv: true
                    })
                  })
                }}>修改</a>
                <Divider type="vertical"></Divider>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottom"
                  title={"确认删除该产品线？"}
                  onConfirm={() => {
                    this.setNewState("partsdeleteById", { id: curitem.id }, () => {
                      this.resetData();
                      message.success("删除成功！");
                    })
                  }}>
                  <a style={{ color: "#ff4800" }}>删除</a>
                </Popconfirm>
              </span>

            }


          </div>
        }>
          <Table bordered size="middle"
            expandRowByClick
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            scroll={{ x: 800, y: "59vh" }}
            loading={this.props.submitting}
            pagination={false}
            rowKey='id'
            columns={columns}
            dataSource={partsqueryList ? partsqueryList : []}
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

        </Card>
      </div>
    )
  }


}

export default Parts



