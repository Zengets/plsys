import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
import SearchBox from '@/components/SearchBox'


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/spareUsequeryList'],
}))
class SpareUseage extends React.Component {

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
        "equipmentNo": "", // 设备编号
        "sparePartsNo": "", // 配件料号
        "sparePartsName": "", // 配件名称
        "startTime": "", // 使用时间(开始)
        "endTime": "", // 使用时间(结束)
        "sparePartsId": props.match.params.id ? props.match.params.id : "",
        "consumeUserId": props.match.params.userid ? props.match.params.userid : "",
      },
      postUrl: "spareUsequeryList",
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

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.userid != nextProps.match.params.userid) {
      this.setState({
        postData:{
          pageIndex: 1,
          pageSize: 10,
          "equipmentNo": "", // 设备编号
          "sparePartsNo": "", // 配件料号
          "sparePartsName": "", // 配件名称
          "startTime": "", // 使用时间(开始)
          "endTime": "", // 使用时间(结束)
          "sparePartsId": nextProps.match.params.id ? nextProps.match.params.id : "",
          "consumeUserId": nextProps.match.params.userid ? nextProps.match.params.userid : "",
        }
      },()=>{
        this.setNewState(this.state.postUrl,this.state.postData)
      })
    }
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

  onRef = (ref) => {
    this.child = ref;
  }



  render() {
    let { postData, postUrl, iftype, curitem } = this.state,
      { spareUsequeryList, userList } = this.props.spare;
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
    }, getdaterangebox = (start, end) => {
      if (this.child) {
        return this.child.getColumnRangeProps(start, end)
      } else {
        return null
      }
    }
    const columns = [
      {
        title: '料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
        width:80,
        ...getsearchbox('sparePartsNo')
      },
      {
        title: '配件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
        width:110,
         ...getsearchbox('sparePartsName')
      },
      {
        title: '配件类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '相关单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
      },
      {
        title: '使用类型',
        dataIndex: 'consumeTypeName',
        key: 'consumeTypeName',
      },
      {
        title: '使用设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width:130,
        ...getsearchbox('equipmentNo')
        
      },
      {
        title: '使用设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '使用人',
        dataIndex: 'consumeUserName',
        key: 'consumeUserName',
      },
      {
        title: '所使用时间',
        dataIndex: 'consumeTime',
        key: 'consumeTime',
        ...getdaterangebox("startTime", "endTime")
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          使用数量
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "equipmentNo": "", // 设备编号
                "sparePartsNo": "", // 配件料号
                "sparePartsName": "", // 配件名称
                "startTime": "", // 使用时间(开始)
                "endTime": "", // 使用时间(结束)
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4,marginLeft:8 }} />
            重置
        </a>
        </span>,
        width: 140,
        dataIndex: 'consumeCount',
        key: 'consumeCount',
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("spareUsequeryList", this.state.postData);
      })
    }
    let col = {
      xs: 24,
      sm: 24,
      md: 8,
      lg: 8,
      xl: 5,
      xxl: 5
    }, cols = {
      xs: 24,
      sm: 24,
      md: 16,
      lg: 16,
      xl: 4,
      xxl: 4
    }
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

        <Card title={this.props.match.params.name ? <span><a>{this.props.match.params.name}</a>的使用总览</span> : "配件使用总览"}>
         <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: spareUsequeryList.pageNum ? spareUsequeryList.pageNum : 1,
              total: spareUsequeryList.total ? parseInt(spareUsequeryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={spareUsequeryList.list ? spareUsequeryList.list : []}
          >
          </Table>


        </Card>
      </div>
    )
  }


}

export default SpareUseage



