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
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/checkqueryList'],
}))
class CheckPoint extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        pointCheckItem: {
          value: null,
          type: "input",
          title: "点检项目",
          keys: "pointCheckItem",
          requires: true
        },
        normalReference: {
          value: null,
          type: "input",
          title: "正常参考",
          keys: "normalReference",
          requires: false
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false
        }
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        pointCheckItem: "" //点检名
      },
      postUrl: "checkqueryList",
      curitem: {}
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'check/' + type,
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
      curitem = this.props.check[this.state.postUrl].list.filter((item)=>{return item.id==curitem.id})[0]
    }

    this.setState({
      fv: false,
      curitem:curitem?curitem:{},
      fields: {
        pointCheckItem: {
          value: null,
          type: "input",
          title: "点检项目",
          keys: "pointCheckItem",
          requires: true
        },
        normalReference: {
          value: null,
          type: "input",
          title: "正常参考",
          keys: "normalReference",
          requires: false
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
        this.setNewState("checksave", postData, () => {
          message.success("修改成功！");
          this.setState({ fv: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("checksave", postData, () => {
          message.success("新增成功！");
          this.setState({ fv: false });
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
      { checkqueryList } = this.props.check;
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
        title: '点检项目',
        dataIndex: 'pointCheckItem',
        key: 'pointCheckItem',
        ...getsearchbox("pointCheckItem")
      },
      {
        title: '正常参考',
        dataIndex: 'normalReference',
        key: 'normalReference',
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
        this.setNewState("checkqueryList", this.state.postData);
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
        <Card title='点检项' extra={curitem.id ?
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增点检",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>
            <Divider style={{marginTop:6}} type="vertical"></Divider>
            <a onClick={() => {
              this.setState({
                fv: true,
                iftype: {
                  name: "修改点检",
                  value: "edit"
                },
                curitem: curitem,
                fields: {
                  pointCheckItem: {
                    value: curitem.pointCheckItem,
                    type: "input",
                    title: "点检项目",
                    keys: "pointCheckItem",
                    requires: true
                  },
                  normalReference: {
                    value: curitem.normalReference,
                    type: "input",
                    title: "正常参考",
                    keys: "normalReference",
                    requires: false
                  },
                  remark: {
                    value: curitem.remark,
                    type: "textarea",
                    title: "备注",
                    keys: "remark",
                    requires: false
                  }
                },
              })
            }}>修改</a>
            <Divider style={{marginTop:6}} type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该点检项目？"}
              onConfirm={() => {
                this.setNewState("checkdeleteById", { id: curitem.id }, () => {
                  let total = this.props.check.checkqueryList.total,
                    page = this.props.check.checkqueryList.pageNum;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("checkqueryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>



          </div>
          : <a onClick={() => {
            this.setState({
              iftype: {
                name: "新增点检",
                value: "add"
              },
              fv: true
            })
          }}>新增</a>}>
          <Table bordered size="middle"
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: checkqueryList.pageNum ? checkqueryList.pageNum : 1,
              total: checkqueryList.total ? parseInt(checkqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={checkqueryList.list ? checkqueryList.list : []}
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

export default CheckPoint



