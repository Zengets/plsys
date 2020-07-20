import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/DonequeryList'],
}))
class SpareDone extends React.Component {
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
        "sparePartsNo": "", // 配件料号
        "equipmentNo": "" // 设备编号
      },
      postUrl: "DonequeryList",
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
    this.setNewState(postUrl, postData)
  }

  componentDidMount() {
    this.resetData()
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
      { DonequeryList } = this.props.spare;

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
        title: '数量',
        dataIndex: 'sparePartsNum',
        key: 'sparePartsNum',
      },
      {
        title: '总价值(元)',
        dataIndex: 'totalValue',
        key: 'totalValue',
        render:(text)=><span>{text}元</span>
      },

      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => <span>{text == 0 ? "启用" : "停用"}</span>,
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
        this.setNewState("DonequeryList", this.state.postData);
      })
    }

    return (
      <div>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='已完成配件更换计划列表'>
          <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}

            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: DonequeryList.pageNum ? DonequeryList.pageNum : 1,
              total: DonequeryList.total ? parseInt(DonequeryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={DonequeryList.list ? DonequeryList.list : []}
          >
          </Table>


        </Card>
      </div>
    )
  }


}

export default SpareDone



