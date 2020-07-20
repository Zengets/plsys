import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Radio, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import Link from 'umi/link';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;

//adminqueryList,adminupdate
@connect(({ admin, loading }) => ({
  admin,
  submitting: loading.effects['admin/adminqueryList'],
}))
class Company extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        companyCode: {
          value: null,
          type: "input",
          title: "公司编号",
          keys: "companyCode",
          requires: true,
          disabled: true
        },
        companyName: {
          value: null,
          type: "input",
          title: "公司名称",
          keys: "companyName",
          requires: true,
          disabled: true
        },
        contant: {
          value: null,
          type: "input",
          title: "联系人",
          keys: "contant",
          requires: true,
        },
        telephone: {
          value: null,
          type: "input",
          title: "手机",
          keys: "telephone",
          requires: true,
        },
        companyAddress: {
          value: null,
          type: "input",
          title: "公司地址",
          keys: "companyAddress",
          requires: false,
        },
        mail: {
          value: null,
          type: "input",
          title: "邮箱",
          keys: "mail",
          requires: false,
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
        "companyName": "",  //公司名称
        "companyCode": "",  //公司编号
        "companyAddress": "", //公司地址
        "contant": "", //联系人
        "telephone": "" //联系电话
      },
      postUrl: "adminqueryList",
      curitem: {}

    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/' + type,
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
    })
  }

  componentDidMount() {
    this.resetData()
  }

  
  handleSearch = (selectedKeys, dataIndex) => {
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } },() => {
      this.setNewState("adminqueryList", this.state.postData)
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input.Search
          allowClear
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`请输入查询内容...`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onSearch={() => this.handleSearch(selectedKeys, dataIndex)}
          style={{ width: 188, display: 'block' }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Tooltip title={this.state.postData[dataIndex] ? `查询条件:${this.state.postData[dataIndex]}` : null}>
          <Icon type="search" style={{ color: filtered ? '#1890ff' : "#ff2100" }} />
        </Tooltip>
      </span>

    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.focus());
      }
    },
  });


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
      curitem = this.props.admin[this.state.postUrl].list.filter((item)=>{return item.id==curitem.id})[0]
    }

    this.setState({
      fv: false,
      curitem:curitem?curitem:{},
      fields: {
        companyCode: {
          value: null,
          type: "input",
          title: "公司编号",
          keys: "companyCode",
          requires: true,
          disabled: true
        },
        companyName: {
          value: null,
          type: "input",
          title: "公司名称",
          keys: "companyName",
          requires: true,
          disabled: true
        },
        contant: {
          value: null,
          type: "input",
          title: "联系人",
          keys: "contant",
          requires: true,
        },
        telephone: {
          value: null,
          type: "input",
          title: "手机",
          keys: "telephone",
          requires: true,
        },
        companyAddress: {
          value: null,
          type: "input",
          title: "公司地址",
          keys: "companyAddress",
          requires: false,
        },
        mail: {
          value: null,
          type: "input",
          title: "邮箱",
          keys: "mail",
          requires: false,
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
      let postData = { ...values, id: curitem.id };
      this.setNewState("adminupdate", postData, () => {
        message.success("修改成功！");
        this.setState({ fv: false });
        this.resetData();
      });

    });
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { adminqueryList } = this.props.admin;

    const columns = [
      {
        title: '公司名',
        dataIndex: 'companyName',
        key: 'companyName',
        ...this.getColumnSearchProps('companyName'),
      },
      {
        title: '公司编号',
        dataIndex: 'companyCode',
        key: 'companyCode',
        ...this.getColumnSearchProps('companyCode'),
      },

      {
        title: '公司地址',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        ...this.getColumnSearchProps('companyAddress'),
      },
      {
        title: '联系人',
        dataIndex: 'contant',
        key: 'contant',
        ...this.getColumnSearchProps('contant'),
      },
      {
        title: '手机',
        dataIndex: 'telephone',
        key: 'telephone',
        ...this.getColumnSearchProps('telephone'),
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
          <span>
          <a onClick={() => {
            this.setState({
              fields: {
                companyCode: {
                  value: record.companyCode,
                  type: "input",
                  title: "公司编号",
                  keys: "companyCode",
                  requires: true,
                  disabled: true
                },
                companyName: {
                  value: record.companyName,
                  type: "input",
                  title: "公司名称",
                  keys: "companyName",
                  requires: true,
                  disabled: true
                },
                contant: {
                  value: record.contant,
                  type: "input",
                  title: "联系人",
                  keys: "contant",
                  requires: true,
                },
                telephone: {
                  value: record.telephone,
                  type: "input",
                  title: "手机",
                  keys: "telephone",
                  requires: true,
                },
                companyAddress: {
                  value: record.companyAddress,
                  type: "input",
                  title: "公司地址",
                  keys: "companyAddress",
                  requires: false,
                },
                mail: {
                  value: record.mail,
                  type: "input",
                  title: "邮箱",
                  keys: "mail",
                  requires: false,
                },
                remark: {
                  value: record.remark,
                  type: "textarea",
                  title: "备注",
                  keys: "remark",
                  requires: false
                }
              }
            }, () => {
              this.setState({
                fv: true,
                curitem: record,
                iftype: {
                  name: `编辑 ${record.companyName}`,
                  value: "edit"
                }
              })
            })

          }}>编辑</a>
          <Divider type="vertical"></Divider>
          <Link to={`/admin/company/devices/${record.id}/${record.companyName}`}>查看设备</Link> 
          </span>
          )

        }
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("adminqueryList", this.state.postData);
      })
    }

    return (
      <div>
        <Card title='公司列表' >
          <Table bordered size="middle" scroll={{x:1200,y:"59vh"}}
            scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: adminqueryList.pageNum ? adminqueryList.pageNum : 1,
              total: adminqueryList.total ? parseInt(adminqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={adminqueryList.list ? adminqueryList.list : []}
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

export default Company



