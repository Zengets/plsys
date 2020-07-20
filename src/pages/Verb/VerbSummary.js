import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card,DatePicker
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox'
import Abload from '@/components/Abload';
import moment from 'moment';
import { render } from './../../app';
import router from 'umi/router';



const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/queryMaintainPool'],
}))
class VerbSummary extends React.Component {

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
        poolMonth: moment().format("YYYY-MM")
      },
      postUrl: "queryMaintainPool",
      curitem: {}
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'verb/' + type,
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
      { queryMaintainPool, companyList } = this.props.verb;
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
        title: '公司',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '保养计划',
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: '已保养数',
        dataIndex: 'bill',
        key: 'bill',
        render:(text,record)=><a onClick={()=>{
          router.push({
            pathname:"/yxt/verb/verbmissionsee",
            query:{
              poolMonth:this.state.postData.poolMonth,
              companyId:record.companyId
            }  
          })
        }} style={{color:"red"}}>{text}</a>
      },
      {
        title: '未保养数',
        dataIndex: 'toBill',
        key: 'toBill',
        render:(text,record)=><a onClick={()=>{
          router.push({
            pathname:"/yxt/verb/verbmission",
            query:{
              poolMonth:this.state.postData.poolMonth,
              companyId:record.companyId
            }  
          })
        }} style={{color:"red"}}>{text}</a>
      },
      {
        title: '完成率',
        dataIndex: 'rate',
        key: 'rate',
        render:(text)=><span>{text}%</span>
      }
    ]

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='保养汇总' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <DatePicker.MonthPicker 
              value={moment(postData.poolMonth)}
              onChange={(value)=>{
                this.setState({
                  postData:{
                    ...postData,
                    poolMonth:value?moment(value).format('YYYY-MM'):moment().format('YYYY-MM')
                  }
                },()=>{
                  this.resetData()
                })
              }}
            />
          </div>
        }>
          <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
            loading={this.props.submitting}
            pagination={false}
            rowKey='id'
            columns={columns}
            dataSource={queryMaintainPool ? queryMaintainPool : []}
          >
          </Table>
        </Card>
      </div>
    )
  }


}

export default VerbSummary



