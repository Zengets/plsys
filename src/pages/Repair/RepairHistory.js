import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Divider,
  Modal,
  Tree,
  Button,
  Row,
  Col,
  Icon,
  Select,
  Alert,
  Tag,
  message,
  Card,
  DatePicker,
  Empty,
  PageHeader,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from '@/components/CreateForm';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import SearchBox from '@/components/SearchBox';
import AbViewer from '@/components/AbViewer';

@connect(({ repair, loading }) => ({
  repair,
  submitting: loading.effects['repair/hisToryqueryList'],
}))
class RepairHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vs: false,
      iftype: {
        name: '',
        value: '',
      },
      fv: false,
      fields: {
        repairUserId: {
          value: null,
          type: 'select',
          title: '当班维修工',
          keys: 'repairUserId',
          requires: true,
          option: this.props.repair.queryAllRepair.map(item => {
            return {
              name: item.userName,
              id: item.id,
            };
          }),
        },
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        faultType: '', //(int)故障名称
        repairType: '', //(int)维修类型
        repairUserName: '', //(String)维修人姓名
        startTime: '', //(String)开始时间
        endTime: '', //(String)结束时间
        isCurrentUserAudit: props.location.query.isCurrentUserAudit,
      },
      postUrl: 'hisToryqueryList',
      curitem: {},
    };
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'repair/' + type,
      payload: values,
    }).then(res => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {});
  }

  componentDidMount() {
    this.resetData();
  }

  handleSearch = (selectedKeys, dataIndex, end) => {
    let { postUrl } = this.state;
    if (dataIndex == 'companyId') {
      this.setState(
        {
          postData: {
            ...this.state.postData,
            [dataIndex]: selectedKeys[0],
            shopId: '',
          },
        },
        () => {
          this.setNewState(postUrl, this.state.postData);
          this.setNewState('queryCondition', { companyId: selectedKeys[0] }, () => {});
        }
      );
      return;
    }

    if (end) {
      let start = dataIndex;

      this.setState(
        {
          postData: {
            ...this.state.postData,
            [start]: selectedKeys[0] ? selectedKeys[0] : '',
            [end]: selectedKeys[1] ? selectedKeys[1] : '',
          },
        },
        () => {
          this.setNewState(postUrl, this.state.postData);
        }
      );
    } else {
      this.setState(
        {
          postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : '' },
        },
        () => {
          this.setNewState(postUrl, this.state.postData);
        }
      );
    }
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, vs } = this.state,
      {
        hisToryqueryList,
        repairTypeList,
        faultTypeList,
        chart,
        hisgetRepairDetail,
        dataList,
        confirmDetails,
        repairStatusList,
        shopList,
        companyList,
      } = this.props.repair;

    let getsearchbox = key => {
        if (this.child) {
          return this.child.getColumnSearchProps(key);
        } else {
          return null;
        }
      },
      getselectbox = (key, option) => {
        if (this.child) {
          return this.child.getColumnSelectProps(key, option);
        } else {
          return null;
        }
      },
      getdaterangebox = (start, end) => {
        if (this.child) {
          return this.child.getColumnRangeProps(start, end);
        } else {
          return null;
        }
      };

    const columns = [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ...getsearchbox('taskNo'),
      },
      {
        title: '故障时间',
        dataIndex: 'faultTime',
        key: 'faultTime',
        ...getdaterangebox('startTime', 'endTime'),
      },
      {
        title: '报修人',
        dataIndex: 'applyRepairUserName',
        key: 'applyRepairUserName',
      },
      {
        title: '班次',
        dataIndex: 'shiftName',
        key: 'shiftName',
      },
      {
        title: '维修人',
        dataIndex: 'repairUserName',
        key: 'repairUserName',
        ...getsearchbox('repairUserName'),
      },
      {
        title: '确认人',
        dataIndex: 'confirmUserName',
        key: 'confirmUserName',
      },
      {
        title: '故障名称',
        dataIndex: 'faultTypeName',
        key: 'faultTypeName',
        render: (text, record) => {
          return <span>{text}级</span>;
        },
        ...getsearchbox('faultTypeName'),
      },
      {
        title: '故障级别',
        dataIndex: 'faultLevelName',
        key: 'faultLevelName',
        render: text => <span>{text}</span>,
      },
      {
        title: '维修类型',
        width: 110,
        dataIndex: 'repairTypeName',
        key: 'repairTypeName',
        ...getselectbox('repairType', repairTypeList),
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo'),
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox('positionNo'),
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
      },
      {
        title: '公司',
        dataIndex: 'companyName',
        key: 'companyName',
        ...getselectbox(
          'companyId',
          companyList
            ? companyList.map(item => {
                return {
                  dicName: item.companyName,
                  dicKey: item.id,
                };
              })
            : []
        ),
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox(
          'shopId',
          shopList &&
            shopList.map(item => {
              return {
                dicName: item.shopName,
                dicKey: item.id,
              };
            })
        ),
      },
      {
        title: '维修状态',
        dataIndex: 'statusName',
        key: 'statusName',
        ...getselectbox('status', repairStatusList),
        render: text => (
          <span
            style={{
              color:
                text == '待维修'
                  ? '#666'
                  : text == '已完成'
                  ? 'green'
                  : text == '已撤销'
                  ? '#f50'
                  : '#000',
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: (
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            查看
            <a
              style={{ color: '#f50' }}
              onClick={() => {
                this.setState(
                  {
                    postData: {
                      ...postData,
                      faultType: '', //(int)故障名称
                      repairType: '', //(int)维修类型
                      repairUserName: '', //(String)维修人姓名
                      startTime: '', //(String)开始时间
                      endTime: '', //(String)结束时间
                      shopId: '',
                    },
                  },
                  () => {
                    this.resetData();
                  }
                );
              }}
            >
              <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
              重置
            </a>
          </span>
        ),
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <div>
              <a
                onClick={() => {
                  this.setNewState('hisgetRepairDetail', { id: record.id }, () => {
                    this.setState({
                      visible: true,
                      iftype: {
                        name: `工单号：${record.taskNo}`,
                        value: 'tosee',
                      },
                    });
                  });
                }}
              >
                查看详情
              </a>
            </div>
          );
        },
      },
    ];

    const columnes = [
      {
        title: '配件料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
      },
      {
        title: '配件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '配件类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '使用数量',
        dataIndex: 'consumeCount',
        key: 'consumeCount',
      },
    ];

    let pageChange = page => {
      this.setState(
        {
          postData: { ...this.state.postData, pageIndex: page },
        },
        () => {
          console.log(this.state.postData);
          this.setNewState('hisToryqueryList', this.state.postData);
        }
      );
    };

    const rowClassNameFn = (record, index) => {
        const { curitem } = this.state;
        if (curitem && curitem.id === record.id) {
          return 'selectedRow';
        }
        return null;
      },
      col = {
        xs: 24,
        sm: 24,
        md: 12,
        lg: 20,
        xl: 20,
        xxl: 20,
      },
      cols = {
        xs: 24,
        sm: 24,
        md: 12,
        lg: 4,
        xl: 4,
        xxl: 4,
      },
      coler = {
        xs: 24,
        sm: 24,
        md: 12,
        lg: 8,
        xl: 8,
        xxl: 8,
      };
    function bodyparse(vals) {
      let val = JSON.parse(JSON.stringify(vals));
      delete val.pageSize;
      delete val.pageIndex;
      let res = '';
      for (let key in val) {
        let value = val[key] ? val[key] : '';

        res += `&${key}=${value}`;
      }
      return res.substr(1);
    }
    return (
      <div>
        <Modal
          style={{ top: 30, maxWidth: '90%' }}
          width={1000}
          visible={this.state.visible}
          title={iftype.name}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <Card style={{ marginBottom: 12 }} title="设备信息">
            <div className={styles.limitdiv} style={{ position: 'relative' }}>
              <img
                className={
                  this.state.visible && hisgetRepairDetail.status == '4'
                    ? styles.readed
                    : styles.read
                }
                src="./images/readed.png"
                alt=""
              />
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>设备编号：</span>
                    <span>{hisgetRepairDetail.equipmentNo}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p style={{ marginBottom: 0 }}>
                    <span>设备位置号：</span>
                    <span>{hisgetRepairDetail.positionNo}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>设备名：</span>
                    <span>{hisgetRepairDetail.equipmentName}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>设备型号：</span>
                    <span>{hisgetRepairDetail.equipmentModel}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>产品线：</span>
                    <span>{hisgetRepairDetail.shopName}</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>

          <Card style={{ marginBottom: 12 }} title="报修信息">
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...col}>
                  <Row gutter={0}>
                    <Col {...coler}>
                      <p>
                        <span>报修人：</span>
                        <span>{hisgetRepairDetail.applyRepairUserName}</span>
                      </p>
                    </Col>
                    <Col {...coler}>
                      <p>
                        <span>班次：</span>
                        <span>{hisgetRepairDetail.shiftName}</span>
                      </p>
                    </Col>
                    <Col {...coler}>
                      <p>
                        <span>报修时间：</span>
                        <span>{hisgetRepairDetail.applyRepairTime}</span>
                      </p>
                    </Col>
                    <Col {...coler}>
                      <p>
                        <span>报修类型：</span>
                        <span>{hisgetRepairDetail.applyTypeName}</span>
                      </p>
                    </Col>
                    <Col {...coler}>
                      <p>
                        <span>报修现象：</span>
                        <span>{hisgetRepairDetail.applyPhenomenonName}</span>
                      </p>
                    </Col>
                    <Col span={24}>
                      <p>
                        <span>故障描述：</span>
                        <span>{hisgetRepairDetail.faultDesc}</span>
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col {...cols}>
                  <p>
                    <span>故障图片：</span>
                    <span>
                      <img
                        onClick={() => {
                          Modal.info({
                            maskClosable: true,
                            title: `预览`,
                            okText: '关闭',
                            content: (
                              <div style={{ width: '100%' }}>
                                <img
                                  style={{ width: '100%', height: 'auto', margin: '20px 0px' }}
                                  src={
                                    hisgetRepairDetail.faultPicUrl
                                      ? hisgetRepairDetail.faultPicUrl
                                      : './images/default.png'
                                  }
                                  onError={e => {
                                    e.target.src = './images/default.png';
                                  }}
                                />
                              </div>
                            ),
                          });
                        }}
                        style={{ width: 120, height: 120, cursor: 'pointer' }}
                        src={
                          hisgetRepairDetail.faultPicUrl
                            ? hisgetRepairDetail.faultPicUrl
                            : './images/default.png'
                        }
                        onError={e => {
                          e.target.src = './images/default.png';
                        }}
                      />
                    </span>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>

          <Card style={{ marginBottom: 12 }} title="故障信息">
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>故障类型：</span>
                    <span>{hisgetRepairDetail.faultClassifyName}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>故障名称：</span>
                    <span>{hisgetRepairDetail.faultTypeName}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>故障现象：</span>
                    <span>{hisgetRepairDetail.faultPhenomenon}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>故障等级：</span>
                    <span>{hisgetRepairDetail.faultLevelName}</span>
                  </p>
                </Col>

                <Col {...coler}>
                  <p>
                    <span>故障时间：</span>
                    <span>{hisgetRepairDetail.faultTime}</span>
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <span>故障原因：</span>
                    <span>{hisgetRepairDetail.faultReasonName}</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>

          <Card style={{ marginBottom: 12 }} title="维修信息">
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>维修人：</span>
                    <span>{hisgetRepairDetail.repairUserName}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>维修状态：</span>
                    <span>{hisgetRepairDetail.statusName}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>维修类型：</span>
                    <span>{hisgetRepairDetail.repairTypeName}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>是否停机维修：</span>
                    <span>{hisgetRepairDetail.repairIsPowerOff == '0' ? '不停机' : '停机'}</span>
                  </p>
                </Col>

                <Col {...coler}>
                  <p>
                    <span>维修开始时间：</span>
                    <span>{hisgetRepairDetail.repairStartTime}</span>
                  </p>
                </Col>

                <Col {...coler}>
                  <p>
                    <span>维修结束时间：</span>
                    <span>{hisgetRepairDetail.repairEndTime}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>工具箱确认：</span>
                    <span>
                      {hisgetRepairDetail.repairUserConfirmBox == '0'
                        ? '不通过'
                        : hisgetRepairDetail.repairUserConfirmBox == '1'
                        ? '通过'
                        : ''}
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>停机时长：</span>
                    <span>{hisgetRepairDetail.stopMin + '分钟'}</span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>维修时长：</span>
                    <span>
                      {hisgetRepairDetail.repairMin ? hisgetRepairDetail.repairMin + '分钟' : ''}
                    </span>
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <span>维修内容：</span>
                    <span>{hisgetRepairDetail.repairContent}</span>
                  </p>
                </Col>

                <Col span={24}>
                  <p>消耗的配件列表：</p>
                  <Table bordered size="middle" dataSource={dataList} columns={columnes} />
                </Col>
              </Row>
            </div>
          </Card>

          <Card style={{ marginBottom: 12 }} title="验证信息">
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Table
                  bordered
                  dataSource={confirmDetails}
                  pagination={false}
                  columns={[
                    {
                      title: '验证人姓名',
                      dataIndex: 'confirmUserName',
                      key: 'confirmUserName',
                    },
                    {
                      title: '状态',
                      dataIndex: 'statusName',
                      key: 'statusName',
                    },
                    {
                      title: '验证时间',
                      dataIndex: 'confirmTime',
                      key: 'confirmTime',
                    },
                    {
                      title: '验证结果',
                      dataIndex: 'confirmResult',
                      key: 'confirmResult',
                    },
                    {
                      title: '5S验证/品质验证',
                      dataIndex: 'confirmRoleType',
                      key: 'confirmRoleType',
                      render: (text, record) => (
                        <span>
                          {text == '1'
                            ? record.applyRepairUser5sConfirm == '0'
                              ? '5S验证 不通过'
                              : record.applyRepairUser5sConfirm == '1'
                              ? '5S验证 通过'
                              : ''
                            : record.pqcQualityConfirm == '0'
                            ? '品质验证 不通过'
                            : record.pqcQualityConfirm == '1'
                            ? '品质验证 通过'
                            : ''}
                        </span>
                      ),
                    },
                    {
                      title: '描述',
                      dataIndex: 'confirmDesc',
                      key: 'confirmDesc',
                    },
                  ]}
                />
              </Row>
            </div>
          </Card>
        </Modal>
        <AbViewer
          title="打印"
          visible={vs}
          onClose={() => {
            this.setState({
              vs: false,
            });
          }}
          type="docx"
          file={`/rs/equipmentRepairHis/export?id=${curitem.id}`}
        />
        <SearchBox
          onRef={this.onRef}
          handleSearch={this.handleSearch}
          postData={this.state.postData}
        />
        <Card
          title={
            this.props.location.query.isCurrentUserAudit == '1' ? '我的撤回审批' : '历史维修单列表'
          }
          extra={
            <span>
              <a
                style={{ display: curitem.id && curitem.status == '4' ? 'inline-block' : 'none' }}
                onClick={() => {
                  this.setState({
                    vs: true,
                  });
                }}
              >
                打印
              </a>
              <Divider
                style={{ display: curitem.id && curitem.status == '4' ? 'inline-block' : 'none' }}
                type="vertical"
              />
              <a
                onClick={() => {
                  message.loading('正在导出文件...');
                }}
                href={`/rs/equipmentRepairHis/exportExcel?${bodyparse(this.state.postData)}`}
                target="_blank"
              >
                导出详情
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  message.loading('正在导出文件...');
                }}
                href={`/rs/equipmentRepairHis/exportByIds?${bodyparse(this.state.postData)}`}
                target="_blank"
              >
                导出维修单
              </a>
            </span>
          }
        >
          <Table
            bordered
            size="middle"
            scroll={{ x: 1760, y: '59vh' }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: 'small',
              pageSize: 10,
              showQuickJumper: true,
              current: hisToryqueryList.pageNum ? hisToryqueryList.pageNum : 1,
              total: hisToryqueryList.total ? parseInt(hisToryqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey="id"
            columns={columns}
            dataSource={hisToryqueryList.list ? hisToryqueryList.list : []}
          />
        </Card>
      </div>
    );
  }
}

export default RepairHistory;
