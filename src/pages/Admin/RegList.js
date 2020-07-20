import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Radio
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import { spawn } from 'child_process';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ admin, loading }) => ({
  admin,
  submitting: loading.effects['admin/sysqueryList'],
}))
class RegList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        "applyNo": "", // 工单号
        "telephone": "", // 手机
        "mail": "", // 邮箱
        "contant": "", // 联系人
        "companyName": "", // 公司名
        "companyAddress": "" // 公司地址
      },
      postUrl: "sysqueryList",
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



  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { sysqueryList } = this.props.admin;

    const columns = [
      {
        title: '工单号',
        dataIndex: 'applyNo',
        key: 'applyNo',
      },
      {
        title: '公司名',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (<span style={{ color: text == "0" ? "#666" : text == 1 ? "#398dcd" : text == 2 ? "#ff5000" : "transparent" }}>{text == "0" ? "待审批" : text == 1 ? "审批通过" : text == 2 ? "审批未通过" : ""}</span>)
      },
      {
        title: '公司编号',
        dataIndex: 'companyCode',
        key: 'companyCode',
      },

      {
        title: '公司地址',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
      },
      {
        title: '联系人',
        dataIndex: 'contant',
        key: 'contant',
      },
      {
        title: '手机',
        dataIndex: 'telephone',
        key: 'telephone',
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
          return (record.status == 1 ? "已通过" : <div>
            <a onClick={() => {
              this.setState({
                fv: true,
                curitem: record,
                iftype: {
                  name: `审批${record.companyName}`,
                  value: "sh"
                }
              })
            }}>审批</a>
          </div>)

        }
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("sysqueryList", this.state.postData);
      })
    }

    return (
      <div>
        <Card title='注册列表' >
          <Table bordered size="middle" 
            scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: sysqueryList.pageNum ? sysqueryList.pageNum : 1,
              total: sysqueryList.total ? parseInt(sysqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={sysqueryList.list ? sysqueryList.list : []}
          >
          </Table>
          <Modal
            title={iftype.name}
            visible={fv}
            onCancel={() => { this.setState({ 
                  fv: false,
                  isPass:undefined,
                  remark:undefined }) }}
            onOk={() => {
              let arr = [0, 1];
              if (arr.indexOf(this.state.isPass) == -1) {
                message.warn("请选择审批结果");
                return
              }
              let postData = {
                id: curitem.id,
                applyNo: curitem.applyNo,
                isPass: this.state.isPass,
                remark: this.state.remark
              }
              this.setState({
                fv: false,
                isPass: undefined,
                remark: undefined
              }, () => {
                this.setNewState("syssave", postData, () => {
                  this.resetData();

                })
              })
            }}
            okText="提交"
            cancelText="取消"
          >
            <p>审批结果：</p>
            <Radio.Group onChange={(e) => {
              let val = e.target.value;
              this.setState({
                isPass: val
              })
            }} value={this.state.isPass}>
              <Radio value={0}>通过</Radio>
              <Radio value={1}>不通过</Radio>
            </Radio.Group>
            {
              this.state.isPass == 1 && <div style={{marginTop:16}}>
                <p>审批意见：</p>
                <Input.TextArea onChange={(e) => {
                  let val = e.target.value;
                  this.setState({
                    remark: val
                  })
                }} value={this.state.remark}>
                </Input.TextArea>
              </div>
            }



          </Modal>

        </Card>
      </div>
    )
  }


}

export default RegList



