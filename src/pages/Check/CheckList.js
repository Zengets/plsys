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

//checkstatistics,checkmainDetails

@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/checkstatistics'],
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
        pointCheckItemDate: "",
      },
      postUrl: "checkstatistics",
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




  render() {
    let { postData, expandedRowKeys, fv, fields, iftype, curitem } = this.state,
      { checkstatistics, checkmainDetails, periodType, roleList, search } = this.props.check;


    let getdatebox = (key, disableddate) => {
      if (this.child) {
        return this.child.getColumnDateProps(key, disableddate)
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
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        ...getdatebox('pointCheckItemDate')
      },
      {
        title: '设备数量',
        dataIndex: 'equipmentNum',
        key: 'equipmentNum',
      },
      {
        title: '已点检',
        dataIndex: 'pointCheckedNum',
        key: 'pointCheckedNum',
      },
      {
        title: '未点检',
        dataIndex: 'notPointCheckedNum',
        key: 'notPointCheckedNum',
      },
      {
        title: '执行比率',
        dataIndex: 'rate',
        key: 'rate',
      }

    ];

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("checkstatistics", this.state.postData);
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
          title: '产品线',
          dataIndex: 'shopName',
          key: 'shopName',
        },
        {
          title: '设备数量',
          dataIndex: 'equipmentNum',
          key: 'equipmentNum',
        },
        {
          title: '已点检',
          dataIndex: 'pointCheckedNum',
          key: 'pointCheckedNum',
          render: (text, records) => {
            return <a onClick={() => {
              this.setNewState("queryByIdList", records.pointCheckedEquipmentIdList, () => {
                let _it = this;
                function renderTable() {
                  return <Table
                    scroll={{ x: 1100 }}
                    columns={[
                      {
                        title: '编号',
                        dataIndex: 'equipmentNo',
                        key: 'equipmentNo',
                      },
                      {
                        title: '主设备',
                        dataIndex: 'isMain',
                        key: 'isMain',
                        render: (text) => <span style={{ color: text == "1" ? "red" : text == "0" ? "#666" : "green" }}>{text == "1" ? "是" : text == "0" ? "" : "公共设施"}</span>,
                      },
                      {
                        title: '名称',
                        dataIndex: 'equipmentName',
                        key: 'equipmentName',
                      },
                      {
                        title: '位置号',
                        dataIndex: 'positionNo',
                        key: 'positionNo',
                      },
                      {
                        title: '类型',
                        dataIndex: 'equipmentTypeName',
                        key: 'equipmentTypeName',
                      },
                      {
                        title: '状态',
                        dataIndex: 'statusName',
                        key: 'statusName',
                        render: (text, record) => <a style={{
                          color: record.status == 0 ? "green" :
                            record.status == 1 ? "#398dcd" :
                              record.status == 2 ? "#999" :
                                record.status == 5 ? "#ff5000" :
                                  "lightred"
                        }}>{text}</a>
                      },
                      {
                        title: '型号',
                        dataIndex: 'equipmentModel',
                        key: 'equipmentModel',
                      },
                      {
                        title: '所在公司',
                        dataIndex: 'companyName',
                        key: 'companyName',
                      },
                      {
                        title: '所在部门',
                        dataIndex: 'departmentName',
                        key: 'departmentName',
                      },
                      {
                        title: '产品线',
                        dataIndex: 'shopName',
                        key: 'shopName',
                      },
                      {
                        title: '保管负责人',
                        dataIndex: 'keepUserName',
                        key: 'keepUserName',
                      },
                      {
                        title: "二维码",
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
                        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
                      }
                    ]}
                    dataSource={_it.props.check.queryByIdList}
                    bordered
                    size="middle"
                    rowKey="id"
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 10,
                    }}
                  />
                }
                Modal.info({
                  title: "设备列表",
                  width: 1200,
                  maskClosable:true,
                  style: { maxWidth: '95%', top: 20 },
                  content: renderTable()
                })
              })
            }}>{text}</a>
          }
        },
        {
          title: '未点检',
          dataIndex: 'notPointCheckedNum',
          key: 'notPointCheckedNum',
          render: (text, records) => {
            return <a onClick={() => {
              this.setNewState("queryByIdList", records.notPointCheckedEquipmentIdList, () => {
                let _it = this;
                function renderTable() {
                  return <Table
                    scroll={{ x: 1100 }}
                    columns={[
                      {
                        title: '编号',
                        dataIndex: 'equipmentNo',
                        key: 'equipmentNo',
                      },
                      {
                        title: '主设备',
                        dataIndex: 'isMain',
                        key: 'isMain',
                        render: (text) => <span style={{ color: text == "1" ? "red" : text == "0" ? "#666" : "green" }}>{text == "1" ? "是" : text == "0" ? "" : "公共设施"}</span>,
                      },
                      {
                        title: '名称',
                        dataIndex: 'equipmentName',
                        key: 'equipmentName',
                      },
                      {
                        title: '位置号',
                        dataIndex: 'positionNo',
                        key: 'positionNo',
                      },
                      {
                        title: '类型',
                        dataIndex: 'equipmentTypeName',
                        key: 'equipmentTypeName',
                      },
                      {
                        title: '状态',
                        dataIndex: 'statusName',
                        key: 'statusName',
                        render: (text, record) => <a style={{
                          color: record.status == 0 ? "green" :
                            record.status == 1 ? "#398dcd" :
                              record.status == 2 ? "#999" :
                                record.status == 5 ? "#ff5000" :
                                  "lightred"
                        }}>{text}</a>
                      },
                      {
                        title: '型号',
                        dataIndex: 'equipmentModel',
                        key: 'equipmentModel',
                      },
                      {
                        title: '所在公司',
                        dataIndex: 'companyName',
                        key: 'companyName',
                      },
                      {
                        title: '所在部门',
                        dataIndex: 'departmentName',
                        key: 'departmentName',
                      },
                      {
                        title: '产品线',
                        dataIndex: 'shopName',
                        key: 'shopName',
                      },
                      {
                        title: '保管负责人',
                        dataIndex: 'keepUserName',
                        key: 'keepUserName',
                      },
                      {
                        title: "二维码",
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
                        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
                      }
                    ]}
                    dataSource={_it.props.check.queryByIdList}
                    bordered
                    size="middle"
                    rowKey="id"
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 10,
                      showQuickJumper: true,
                    }}
                  />
                }
                Modal.info({
                  title: "设备列表",
                  width: 1200,
                  maskClosable:true,
                  style: { maxWidth: '95%', top: 20 },
                  content: renderTable()
                })
              })
            }}>{text}</a>
          }
        },
        {
          title: '执行比率',
          dataIndex: 'rate',
          key: 'rate',
        }

      ];


      return <Table bordered
        size="middle"
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 10,
        }}
        rowKey='id'
        columns={column}
        dataSource={record.shopList ? record.shopList : []}
      >
      </Table>
    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

        <Card title='点检汇总'>
          <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
            expandRowByClick
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
            }}
            rowKey='id'
            columns={columns}
            dataSource={checkstatistics ? checkstatistics : []}
            expandedRowRender={renderAdd}
          >
          </Table>



        </Card>
      </div>
    )
  }


}

export default CheckSetting



