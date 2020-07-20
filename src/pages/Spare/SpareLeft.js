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
  submitting: loading.effects['spare/spareRecordqueryList'],
}))
class SpareLeft extends React.Component {

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
        "sparePartsNo": "", // 配件料号
        "sparePartsName": "", // 配件名称
        "ioType": "", // 操作类型：0：入库，1：出库
        "dealStartTime": "",
        "dealEndTime": ""
      },
      postUrl: "spareRecordqueryList",
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

    })
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
      { spareRecordqueryList, userList } = this.props.spare;
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
        title: '操作类型',
        dataIndex: 'ioTypeName',
        key: 'ioTypeName',
        width:110,
        ...getselectbox('ioType',[{dicKey:"0",dicName:"入库"},{dicKey:"1",dicName:"出库"}])
      },
      // {
      //   title: '操作后数量',
      //   dataIndex: 'currentStock',
      //   key: 'currentStock',
      // },
      // {
      //   title: '操作前总数',
      //   dataIndex: 'beforeStock',
      //   key: 'beforeStock',
      // },
      {
        title: '操作数量',
        dataIndex: 'batchCount',
        key: 'batchCount',
      },
      {
        title: '操作人',
        dataIndex: 'dealUserName',
        key: 'dealUserName',
      },
      {
        title: '操作时间',
        dataIndex: 'dealTime',
        key: 'dealTime',
        ...getdaterangebox("dealStartTime", "dealEndTime")
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          相关单号
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "sparePartsNo": "", // 配件料号
                "sparePartsName": "", // 配件名称
                "ioType": "", // 操作类型：0：入库，1：出库
                "dealStartTime": "",
                "dealEndTime": ""
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4,marginLeft:8 }} />
            重置
        </a>
        </span>,
        dataIndex: 'recordNo',
        key: 'recordNo',
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("spareRecordqueryList", this.state.postData);
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
        <Card title='配件库存记录'>
         <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: spareRecordqueryList.pageNum ? spareRecordqueryList.pageNum : 1,
              total: spareRecordqueryList.total ? parseInt(spareRecordqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={spareRecordqueryList.list ? spareRecordqueryList.list : []}
          >
          </Table>


        </Card>
      </div>
    )
  }


}

export default SpareLeft



