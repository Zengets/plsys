import React, { Component } from 'react';
import moment from 'moment';
import {
  Card, Button, Row, Col, Drawer, Tabs, Tag,
  Select, Divider, TreeSelect, Empty, Table, DatePicker
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import ReactEcharts from "echarts-for-react";
const { TreeNode } = TreeSelect;
const Option = Select.Option;
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const tagsFromServer = ['日', '周', '月', '季', '半年', '年'];

class ChartChild extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postData: {
        shiftId: "",
        productDate: ""
      }
    }
  }

  getOption(allData) {
    let res = {}
    let xData = allData.map((item, i) => {
      return item.name
    }), yData = allData.map((item, i) => {
      return item.value
    })

    res = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      dataZoom: [{
        type: 'inside'
      }],
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: false }
        }
      },
      legend: {
        data: ["占比"],
        left: "center",
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: "占比",
          axisLabel: {
            formatter: '{value} %'
          },
        }
      ],
      series: [
        {
          name: "占比",
          type: 'bar',
          data: yData,
          label: {
            normal: {
              formatter: '{c} %',
              show: true
            },
          },
          itemStyle: {
            normal: {
              color: "#405d97"
            }
          }
        }
      ]
    }
    return res

  }


  render() {
    let { data, keys, main, detail } = this.props;
    let colc = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 16, xxl: 16
    }, colcs = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8
    }
    return <div>
      {
        data && data.length > 0 ?
          <Row gutter={12}>
            <Col {...colc}>
              <Table bordered
                pagination={{
                  showTotal: total => `共${total}条`, // 分页
                  size: "small",
                  pageSize: 5,
                  showQuickJumper: true,
                }}
                columns={[
                  {
                    title: '产品线',
                    dataIndex: 'shopName',
                    key: 'shopName',
                  },
                  {
                    title: keys == "0" ? '实有机台数量' : "月可用机台次",
                    dataIndex: 'buddleNum',
                    key: 'buddleNum',
                  },
                  // planTurnOnNum计划开线数
                  // actualTurnOnNum实际开线数
                  {
                    title: '计划开线数',
                    dataIndex: 'planTurnOnNum',
                    key: 'planTurnOnNum',
                  },
                  {
                    title: '实际开线数',
                    dataIndex: 'actualTurnOnNum',
                    key: 'actualTurnOnNum',
                  },
                  {
                    title: '设备开启率(百分制)',
                    dataIndex: 'buddleRunningRate',
                    key: 'buddleRunningRate',
                    render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                  },
                  {
                    title: '理论总产能(万只)',
                    dataIndex: 'theoreticalCapacity',
                    key: 'theoreticalCapacity',
                  },
                  {
                    title: '实际产量(万只)',
                    dataIndex: 'actualProduction',
                    key: 'actualProduction',
                  },
                  {
                    title: '产能利用率(百分制)',
                    dataIndex: 'capacityUtilization',
                    key: 'capacityUtilization',
                    render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                  },

                  {
                    title: '稼动率(百分制)',
                    dataIndex: 'jia',
                    key: 'jia',
                    render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                  },
                  {
                    title: '单位时间产出(万只/小时)',
                    dataIndex: 'taktTime',
                    key: 'taktTime',
                  },
                  {
                    title: '产能效率（百分制）',
                    dataIndex: 'productivityEfficiency',
                    key: 'productivityEfficiency',
                    render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                  },
                ]}
                dataSource={main}
              />
            </Col>

            <Col {...colcs}>
              <ReactEcharts style={{ height: 500, marginTop: 12 }} option={this.getOption(data)}></ReactEcharts>
            </Col>
            <Col span={24}>
              <Table bordered
                pagination={{
                  showTotal: total => `共${total}条`, // 分页
                  size: "small",
                  pageSize: 8,
                  showQuickJumper: true,
                }}
                columns={keys == "0" ? [
                  {
                    title: '产品线',
                    dataIndex: 'shopName',
                    key: 'shopName',
                  },
                  {
                    title: '规格',
                    dataIndex: 'manufactureContent',
                    key: 'manufactureContent',
                  },
                  {
                    title: '计划开线数',
                    dataIndex: 'planTurnOnNum',
                    key: 'planTurnOnNum',
                  },
                  {
                    title: '实际开线数',
                    dataIndex: 'actualTurnOnNum',
                    key: 'actualTurnOnNum',
                  },
                  {
                    title: '计划时间(小时)',
                    dataIndex: 'planRunningHour',
                    key: 'planRunningHour',
                  },
                  {
                    title: '计划停机时间(小时)',
                    dataIndex: 'planStopHour',
                    key: 'planStopHour',
                  },
                  {
                    title: '非计划停机时间损失(小时)',
                    dataIndex: 'wasteHour',
                    key: 'wasteHour',
                  },
                  {
                    title: '当班实际生产时间(小时)',
                    dataIndex: 'workHour',
                    key: 'workHour',
                  },
                  {
                    title: '稼动率(百分制)',
                    dataIndex: 'jia',
                    key: 'jia',
                    render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                  },
                  {
                    title: '额定标准产能(万只)',
                    dataIndex: 'ratedStandardCapacity',
                    key: 'ratedStandardCapacity',
                    render: (text) => <span>{text ? `${text}` : "0"}</span>
                  },
                  {
                    title: '实际产量(万只)',
                    dataIndex: 'actualProduction',
                    key: 'actualProduction',
                  },
                  {
                    title: '单位时间产出(万只/小时)',
                    dataIndex: 'taktTime',
                    key: 'taktTime',
                  },
                  {
                    title: '产能效率（百分制）',
                    dataIndex: 'productivityEfficiency',
                    key: 'productivityEfficiency',
                    render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                  },
                ] : [
                    {
                      title: '产品线',
                      dataIndex: 'shopName',
                      key: 'shopName',
                    },
                    {
                      title: '规格',
                      dataIndex: 'manufactureContent',
                      key: 'manufactureContent',
                    },
                    {
                      title: '计划开线数',
                      dataIndex: 'planTurnOnNum',
                      key: 'planTurnOnNum',
                    },
                    {
                      title: '实际开线数',
                      dataIndex: 'actualTurnOnNum',
                      key: 'actualTurnOnNum',
                    },
                    {
                      title: '计划时间(小时)',
                      dataIndex: 'planRunningHour',
                      key: 'planRunningHour',
                    },
                    {
                      title: '计划停机时间(小时)',
                      dataIndex: 'planStopHour',
                      key: 'planStopHour',
                    },
                    {
                      title: '非计划停机时间损失(小时)',
                      dataIndex: 'wasteHour',
                      key: 'wasteHour',
                    },
                    {
                      title: '当月实际生产时间(小时)',
                      dataIndex: 'workHour',
                      key: 'workHour',
                    },
                    {
                      title: '平均每台次净生产时间(小时)',
                      dataIndex: 'averageWorkHour',
                      key: 'averageWorkHour',
                    },
                    {
                      title: '稼动率(百分制)',
                      dataIndex: 'jia',
                      key: 'jia',
                      render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                    },
                    {
                      title: '额定标准产能(万只)',
                      dataIndex: 'ratedStandardCapacity',
                      key: 'ratedStandardCapacity',
                    },
                    {
                      title: '实际产量(万只)',
                      dataIndex: 'actualProduction',
                      key: 'actualProduction',
                    },
                    {
                      title: '单位时间产出(万只/小时)',
                      dataIndex: 'taktTime',
                      key: 'taktTime',
                    },
                    {
                      title: '产能效率（百分制）',
                      dataIndex: 'productivityEfficiency',
                      key: 'productivityEfficiency',
                      render: (text) => <span>{text ? `${text}%` : "0%"}</span>
                    },
                  ]
                }
                dataSource={detail}
              />
            </Col>

          </Row>
          : <Empty style={{ marginTop: 18 }}></Empty>
      }
    </div>
  }


}


@connect(({ chart, loading }) => ({
  chart,
  submitting: loading.effects['chart/queryDailyReport'],
}))
class ChartChanne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "0",
      postData: {
        "companyId": undefined,
        "shiftId": undefined,//公司id
        "productDate": undefined
      },//日
      postDatas: {
        "companyId": undefined,
        "productDate": undefined
      },//月
    };
  }

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch, chart } = this.props;
    dispatch({
      type: 'chart/' + type,
      payload: value,
    }).then(key => {
      if (key) {
        fn ? fn(key) : null;
      }
    });
  }

  resetData(url, postData, ifs) {
    let post = JSON.parse(JSON.stringify(this.state[postData]));
    this.setNewState(url, post, () => {
      if (ifs) {
        let { shiftList, companyList } = this.props.chart;
        if (postData == "postData") {
          this.setState({
            postData: {
              ...this.state.postData,
              "companyId": companyList[0]&&companyList[0].id,
              "productDate":moment().add("day",-1).format("YYYY-MM-DD")
            }
          })
        } else {
          this.setState({
            postDatas: {
              ...this.state.postDatas,
              "companyId": companyList[0]&&companyList[0].id,
              "productDate":moment().format("YYYY-MM")
            }
          })
        }
      }
    });
  }


  componentDidMount() {
    this.resetData('queryMonthlyReport', 'postDatas', true);
    this.resetData('queryDailyReport', 'postData', true);
  }



  render() {
    const { postData, postDatas, key, title } = this.state,
      { mains, totals,main, total, detail,details, shiftList, companyList } = this.props.chart;

    let callback = (key) => {
      this.setState({ key }, () => {
        key == "0" ? this.resetData('queryDailyReport', 'postData') : this.resetData('queryMonthlyReport', 'postDatas')
      })
    }


    return (
      <div>
        <div className={styles.container}>
          <Card title="产能报表">
            <Row gutter={12} style={{ backgroundColor: '#ffffff', marginBottom: 12 }}>
              <Col span={8} style={{ marginBottom: 12 }}>
                <Select style={{ width: "100%" }} placeholder="选择公司" allowClear
                  value={key == "0" ? postData.companyId : postDatas.companyId} onChange={(value) => {
                    const post = key == "0" ? this.state.postData : this.state.postDatas;
                    const postName = key == "0" ? "postData" : "postDatas";
                    const url = key == "0" ? "queryDailyReport" : "queryMonthlyReport"
                    this.setState({
                      [postName]: {
                        ...post,
                        companyId: value
                      }
                    }, () => {
                      this.resetData(url, postName)
                    })
                  }}>
                  {
                    companyList.map((item, i) => {
                      return <Option key={i} value={item.id}>{item.companyName}</Option>
                    })
                  }
                </Select>
              </Col>

              <Col span={key == "0" ? 8 : 0} style={{ marginBottom: 12 }}>
                <Select style={{ width: "100%" }} placeholder="选择班次" allowClear
                  value={key == "0" ? postData.shiftId : postDatas.shiftId} onChange={(value) => {
                    const post = key == "0" ? this.state.postData : this.state.postDatas;
                    const postName = key == "0" ? "postData" : "postDatas";
                    const url = key == "0" ? "queryDailyReport" : "queryMonthlyReport"
                    this.setState({
                      [postName]: {
                        ...post,
                        shiftId: value
                      }
                    }, () => {
                      this.resetData(url, postName)
                    })
                  }}>
                  {
                    shiftList.map((item, i) => {
                      return <Option key={i} value={item.id}>{item.shiftName}</Option>
                    })
                  }
                </Select>
              </Col>
              <Col span={key == "0" ? 8 : 16} style={{ marginBottom: 12 }}>
                {
                  key == "0" ?
                    <DatePicker style={{ width: "100%" }} value={postData.productDate && moment(postData.productDate)}
                      onChange={val => {
                        const postName = "postData";
                        const url = "queryDailyReport";
                        const post = this.state.postData;
                        this.setState({
                          [postName]: {
                            ...post,
                            productDate: val ? moment(val).format("YYYY-MM-DD") : ''
                          }
                        }, () => {
                          this.resetData(url, postName)
                        },
                        );
                      }} /> :
                    <DatePicker.MonthPicker
                      style={{ width: "100%" }}
                      value={postDatas.productDate && moment(postDatas.productDate)}
                      onChange={val => {
                        const postName = "postDatas";
                        const url = "queryMonthlyReport"
                        const post = this.state.postDatas;
                        this.setState({
                          [postName]: {
                            ...post,
                            productDate: val ? moment(val).format("YYYY-MM") : ''
                          }
                        }, () => {
                          this.resetData(url, postName)
                        },
                        );
                      }} />
                }

              </Col>



            </Row>
            <Row>
              <Tabs defaultActiveKey="0" onChange={callback} style={{ marginTop: -12 }}>
                <TabPane tab="日报表" key="0">
                  {
                    this.state.key == "0" &&
                    <ChartChild keys={"0"} data={total} main={main} detail={detail}></ChartChild>
                  }
                </TabPane>
                <TabPane tab="月报表" key="1">
                  {
                    this.state.key == "1" &&
                    <ChartChild keys={"1"} data={totals} main={mains} detail={details}></ChartChild>
                  }
                </TabPane>
              </Tabs>

            </Row>

          </Card>

        </div>

      </div>
    );
  }
}


export default ChartChanne;
