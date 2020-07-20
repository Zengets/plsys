import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Radio, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;

//queryByCompanyId,adminupdate
@connect(({ admin, loading }) => ({
  admin,
  submitting: loading.effects['admin/queryByCompanyId'],
}))
class Company extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        "companyId": props.match.params.id,  //公司名称
      },
      postUrl: "queryByCompanyId",
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

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setState({
        postData:{
          pageIndex: 1,
          pageSize: 10,
          "companyId": nextProps.match.params.id,  //公司名称
        }
      },()=>{
        this.setNewState(this.state.postUrl,this.state.postData)
      })
    }
  }



  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { queryByCompanyId } = this.props.admin;

    const columns = [
        {
          title: '图片',
          dataIndex: 'pictureUrl',
          key: 'pictureUrl',
          render: (text, record) => (text ? <img onClick={() => {
            Modal.info({
              maskClosable: true,
              title: `预览${record.equipmentName}的图片`,
              okText: "关闭",
              content: (
                <div style={{ width: "100%" }}>
                  <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
                </div>
              ),
              
            });
          }} style={{ width: 30, height: 30 }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
        },
        {
          title: '设备编号',
          dataIndex: 'equipmentNo',
          key: 'equipmentNo',
        },
        {
          title: '设备类型',
          dataIndex: 'equipmentTypeName',
          key: 'equipmentTypeName',
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
          title: '所在部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
        },
        {
          title: '能耗',
          dataIndex: 'energyConsumption',
          key: 'energyConsumption',
        },
        {
          title: '价值(万元)',
          dataIndex: 'equipmentWorth',
          key: 'equipmentWorth',
        },
        {
          title: '状态',
          dataIndex: 'statusName',
          key: 'statusName',
        },
        {
          title: '二维码',
          dataIndex: 'qrCodeUrl',
          key: 'qrCodeUrl',
          render: (text, record) => (text ? <img onClick={() => {
            Modal.info({
              maskClosable: true,
              title: `预览${record.equipmentName}的二维码`,
              okText: "关闭",
              content: (
                <div style={{ width: "100%" }}>
                  <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
                </div>
              ),
              
            });
          }} style={{ width: 30, height: 30 }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
        },
      ];
  
    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("queryByCompanyId", this.state.postData);
      })
    }

    return (
      <div>
        <Card title={<span>公司<a style={{padding:"0 4px"}}>{this.props.match.params.company}</a>下的设备列表</span>} >
          <Table bordered size="middle" 
            scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: queryByCompanyId.pageNum ? queryByCompanyId.pageNum : 1,
              total: queryByCompanyId.total ? parseInt(queryByCompanyId.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={queryByCompanyId.list ? queryByCompanyId.list : []}
          >
          </Table>
        </Card>
      </div>
    )
  }


}

export default Company



