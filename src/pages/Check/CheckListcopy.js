import {
  Table, Icon,
  Popconfirm, Divider,
  message, Card, Modal
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import Link from 'umi/link'
import Abload from '@/components/Abload';

//checkmainList,checkmainDetails

@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/checkmainList'],
  submittings: loading.effects['check/checkmainDetails'],
}))
class CheckSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: undefined,
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        equipmentName: "",
        equipmentNo: "",
        pointCheckUserName: "",    //-------------------点检人
        startDate: "",       //------------点检日期搜索
        endDate: ""        //------------点检日期搜索
      },
      postUrl: "checkmainList",
      postDatas: {
        "pageIndex": "1",  //---------------当前页码(必传)
        "pageSize": "10",  //---------------每页条数(必传)
        "equipmentId": ""
      },
      curitem: {},
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
    })
  }

  componentDidMount() {
    this.resetData();
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



  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
      postDatas: {
        equipmentPointCheckItemDayTaskId: record.id,
        fromTable: record.fromTable,
      },
      curitem: record
    }, () => {
      this.setNewState("checkmainDetails", this.state.postDatas)
    })
  }


  render() {
    let { postData, postDatas, expandedRowKeys, fv, fields, iftype, curitem } = this.state,
      { checkmainList, checkmainDetails, periodType, roleList, search } = this.props.check;


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
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, col = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 6,
      xxl: 6
    }, getdaterangebox = (start, end) => {
      if (this.child) {
        return this.child.getColumnRangeProps(start, end)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: '编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo')
      },
      {
        title: '名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName')
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox('positionNo')
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
      },
      {
        title: '点检人',
        dataIndex: 'pointCheckUserName',
        key: 'pointCheckUserName',
        ...getsearchbox('pointCheckUserName')
      },
      {
        title: '点检日期',
        dataIndex: 'pointCheckItemDate',
        key: 'pointCheckItemDate',
        ...getdaterangebox("startDate", "endDate")
      }

    ];

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("checkmainList", this.state.postData);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    let renderAdd = (record) => {
      let column = [
        {
          title: '点检项',
          dataIndex: 'pointCheckItem',
          key: 'pointCheckItem',
        },
        {
          title: '正常参考',
          dataIndex: 'normalReference',
          key: 'normalReference',
        },
        {
          title: '点检结果',
          dataIndex: 'pointCheckItemResultTypeName',
          key: 'pointCheckItemResultTypeName',
        },
        {
          title: '异常记录',
          dataIndex: 'exceptionRecord',
          key: 'exceptionRecord',
        },
        {
          title: '周期类型',
          dataIndex: 'periodTypeName',
          key: 'periodTypeName',
        }
      ]


      return <Table bordered
        size="middle"
        loading={this.props.submittings}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 10,
          showQuickJumper: true,
        }}
        rowKey='id'
        columns={column}
        dataSource={checkmainDetails ? checkmainDetails : []}
      >
      </Table>


    }
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

        <Card title='点检计划'>
          <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            expandRowByClick
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: checkmainList ? checkmainList.pageNum : 1,
              total: checkmainList ? parseInt(checkmainList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={checkmainList ? checkmainList.list : []}
            expandedRowRender={record => renderAdd(record)}
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
          >
          </Table>



        </Card>
      </div>
    )
  }


}

export default CheckSetting



