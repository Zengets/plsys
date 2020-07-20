import React, { Component } from 'react';
import moment from 'moment';
import {
  Icon, Tabs, Table, Divider, Card, Form, Button, Input, Row, Col, Tree, Modal, Skeleton,
  message, Popconfirm, Tooltip, Select, DatePicker, InputNumber, Dropdown, Menu, Empty, TreeSelect
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import white from '../../assets/white.jpg';
import Link from 'umi/link';
import ReactEcharts from "echarts-for-react";

const { TabPane } = Tabs;
const confirm = Modal.confirm;
const { TreeNode } = TreeSelect;
const Search = Input.Search;
const Option = Select.Option;
const gData = [];

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

@connect(({ chart, loading }) => ({
  chart,
  submitting: loading.effects['chart/queryDiagram'],
  submittings: loading.effects['chart/deviceTypequeryTreeList'],
}))
class DeviceAnalyse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collspan: true,
      expandedKeys: [],
      searchValue: '',
      gData: gData,
      toshow: true,
      show: false,
      postData: {
        "pageIndex": 1,                      //(int)页码
        "pageSize": 10,                      //(int)条数
        "departmentId": undefined,//部门id
        "equipmentTypeId": undefined,//设备类型id
        "startTime": "",//开始时间
        "endTime": ""//结束时间
      },
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

  componentDidMount() {
    this.setNewState('deviceTypequeryTreeList', null);
    this.setNewState('queryDiagram', this.state.postData, () => {
      this.setState({
        show: true
      })
    });
  }





  getOption(value) {
    let allData = this.props.chart.queryDiagram;
    let res = {}

    if (!allData[value]) {
      return res
    }

    switch (value) {
      case "TOTALFAULTS":
        let xData = allData[value].map((item, i) => {
          return item.name
        }),
          yData = allData[value].map((item, i) => {
            return item.value
          })

        res = {
          title: {
            text: `设备故障总数`,
            subtext: '',
            x: '0',
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
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
          }, {
            type: 'slider'
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
            data: ["故障数"],
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
              name: "故障数",
              axisLabel: {
                formatter: '{value} 台'
              }
            }
          ],
          series: [
            {
              name: "故障数",
              type: 'bar',
              data: yData,
              label: {
                normal: {
                  formatter: '{c} 台',
                  show: true
                },
              },
            }
          ]
        }
        break;
      case "FAUITLEVEL":
        res = {
          title: {
            text: '故障等级-数量分布',
            subtext: '',
            x: 0,
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}个 ({d}%)"
          },
          series: [
            {
              name: '故障等级',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              radius: ['20%', '40%'],
              data: allData[value],
              label: {
                normal: {
                  formatter: '{b}: {c}个 ({d}%) ',
                  show: true
                },
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        break;
      case "FAUITTYPE":
        res = {
          title: {
            text: '维修类型-数量分布',
            subtext: '',
            x: 0,
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}个 ({d}%)"
          },
          series: [
            {
              name: '维修类型',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              radius: ['20%', '40%'],
              data: allData[value],
              label: {
                normal: {
                  formatter: '{b}: {c}个 ({d}%) ',
                  show: true
                },
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        break;
      case "FAUITLEVELTIME":
        let xDatas = allData[value].map((item, i) => {
          return item.name
        }),
        powerOffTime = allData[value].map((item, i) => {
          return item.powerOffTime
        }),
        responseTime = allData[value].map((item, i) => {
          return item.responseTime
        }),
        processTime = allData[value].map((item, i) => {
          return item.processTime
        }),
        confirmTime = allData[value].map((item, i) => {
          return item.confirmTime
        });

        res = {
          title: {
            text: `平均报修-维修-验证时间 级别表`,
            subtext: '',
            x: '0',
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
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
          }, {
            type: 'slider'
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
            data: ['停机时间',"报修时间", "维修时间", "验证时间"],
            left: "center",
          },
          xAxis: [
            {
              type: 'category',
              data: xDatas,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: "时间",
              axisLabel: {
                formatter: '{value} h'
              }
            }
          ],
          series: [
            {
              name: "停机时间",
              type: 'bar',
              data: powerOffTime,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
            {
              name: "报修时间",
              type: 'bar',
              data: responseTime,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
            {
              name: "维修时间",
              type: 'bar',
              data: processTime,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
            {
              name: "验证时间",
              type: 'bar',
              data: confirmTime,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
          ]
        }
        break
      case "FAUITTYPETIME":
        let xDataes = allData[value].map((item, i) => {
          return item.name
        }),
          powerOffTimes = allData[value].map((item, i) => {
            return item.powerOffTime
          }),
          responseTimes = allData[value].map((item, i) => {
            return item.responseTime
          }),
          processTimes = allData[value].map((item, i) => {
            return item.processTime
          }),
          confirmTimes = allData[value].map((item, i) => {
            return item.confirmTime
          });



        res = {
          title: {
            text: `平均报修-维修-验证时间 类型表`,
            subtext: '',
            x: '0',
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
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
          }, {
            type: 'slider'
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
            data: ["停机时间", "报修时间", "维修时间", "验证时间"],
            left: "center",
          },
          xAxis: [
            {
              type: 'category',
              data: xDataes,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: "时间",
              axisLabel: {
                formatter: '{value} h'
              }
            }
          ],
          series: [
            {
              name: "停机时间",
              type: 'bar',
              data: powerOffTimes,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
            {
              name: "报修时间",
              type: 'bar',
              data: responseTimes,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
            {
              name: "维修时间",
              type: 'bar',
              data: processTimes,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
            {
              name: "验证时间",
              type: 'bar',
              data: confirmTimes,
              label: {
                normal: {
                  formatter: '{c} h',
                  show: true
                },
              },
            },
          ]
        }
        break
      case "REPAIRLIST":
        let yDatac = allData[value].map((item, i) => {
          return item.userName
        }),
          xDatac = allData[value].map((item, i) => {
            return item.value
          })
        res = {
          title: {
            text: `维修工维修排行表`,
            subtext: '',
            x: '0',
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: false }
            }
          },
          legend: {
            data: ["维修人"],
            left: "center",
          },
          xAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} 个'
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              data: yDatac
            }
          ],
          series: [
            {
              name: "维修人",
              type: 'bar',
              data: xDatac,
              label: {
                normal: {
                  formatter: '{c} 个',
                  show: true
                },
              },
            },
          ]
        }
        break

    }

    return res

  }




  render() {
    const { searchValue, expandedKeys, autoExpandParent, collspan, postData } = this.state,
      { companyDepartList, queryDiagram, deviceTypequeryTreeList } = this.props.chart;

    const { getFieldDecorator } = this.props.form;

    function disabledDate(current) {
      return current && current > moment().add("day", -1).endOf('day');
    }

    const titlerender = () => (
      <div className={styles.pubheader}>
        <div>
          <h3 style={{ fontSize: 16, margin: 0, padding: 0 }}>
            {!collspan && (
              <Tooltip placement="bottomLeft" title={'展开设备类型管理'}>
                <Icon
                  type="vertical-left"
                  onClick={() => {
                    this.setState({
                      collspan: true,
                    });
                  }}
                />
              </Tooltip>
            )}{' '}
            &nbsp;设备故障/维修分析
            </h3>
        </div>
      </div>
    );

    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) {
          return (
            <TreeNode value={item.key} key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        } else {
          return <TreeNode value={item.key} key={item.key} title={title} />;
        }
      });

    let cols = {
      xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12
    }

    return (
      <div>
        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col
              xs={24}
              sm={24}
              md={24}
              style={{ borderLeft: "#ededed solid 1px" }}
            >
              <div>

                <Card bordered={false} title={titlerender()} >
                  <Row gutter={24}>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7} >
                      <TreeSelect placeholder="设备类型" allowClear style={{ width: "100%" }} value={postData.equipmentTypeId} onChange={(value) => {
                        this.setState({
                          postData: { ...this.state.postData, equipmentTypeId: value },
                        }, () => {
                          this.setNewState('queryDiagram', { ...this.state.postData, equipmentTypeId: value });
                        });
                      }}>
                        {loop(deviceTypequeryTreeList)}
                      </TreeSelect>
                    </Col>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7} >
                      <DatePicker.RangePicker style={{ width: "100%" }} value={postData.startTime ? [moment(postData.startTime), moment(postData.endTime)] : undefined}
                        onChange={val => {
                          this.setState(
                            {
                              postData: { ...postData, startTime: val[0] ? moment(val[0]).format("YYYY-MM-DD") : null, endTime: val[1] ? moment(val[1]).format("YYYY-MM-DD") : null, pageIndex: 1 },
                            },
                            () => {
                              this.setNewState('queryDiagram', this.state.postData);
                            },
                          );
                        }} />
                    </Col>

                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7} >
                      <TreeSelect placeholder="所在部门" allowClear style={{ width: "100%" }} value={postData.departmentId} onChange={(value) => {
                        this.setState({
                          postData: { ...this.state.postData, departmentId: value },
                        }, () => {
                          this.setNewState('queryDiagram', { ...this.state.postData, departmentId: value });
                        });
                      }}>
                        {loop(companyDepartList)}
                      </TreeSelect>


                    </Col>
                    <Col xs={24} sm={24} md={3} lg={3} xl={3} xxl={3} >
                      <Button style={{ width: "100%" }} onClick={() => {
                        this.setState({
                          postData: {
                            "pageIndex": 1,                      //(int)页码
                            "pageSize": 10,                      //(int)条数
                            "departmentId": "",//部门id
                            "equipmentTypeId": "",//设备类型id
                            "startTime": "",//开始时间
                            "endTime": ""//结束时间
                          }
                        }, () => {
                          this.setNewState('queryDiagram', this.state.postData);
                        })
                      }}>
                        重置
                          </Button>
                    </Col>
                  </Row>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="故障分析" key="1">
                      {
                        this.state.show && <Row gutter={24}>
                          <Col span={24} >
                            {
                              queryDiagram.TOTALFAULTS ?
                                <ReactEcharts option={this.getOption("TOTALFAULTS")}></ReactEcharts> :
                                <Empty style={{ margin: "12px 0px" }} description={
                                  <span>
                                    设备故障总数 - 暂无数据
                                </span>
                                } />
                            }

                          </Col>
                          <Col {...cols} >
                            {
                              queryDiagram.FAUITLEVEL ?
                                <ReactEcharts option={this.getOption("FAUITLEVEL")}></ReactEcharts> :
                                <Empty style={{ margin: "12px 0px" }} description={
                                  <span>
                                    故障等级数量分布图 - 暂无数据
                                </span>
                                } />
                            }

                          </Col>
                          <Col {...cols} >
                            {
                              queryDiagram.FAUITTYPE ?
                                <ReactEcharts option={this.getOption("FAUITTYPE")}></ReactEcharts> :
                                <Empty style={{ margin: "12px 0px" }} description={
                                  <span>
                                    维修类型数量分布图 - 暂无数据
                                </span>
                                } />
                            }

                          </Col>
                        </Row>
                      }


                    </TabPane>
                    <TabPane tab="维修分析" key="2">
                      {
                        this.state.show && <Row gutter={24}>
                          <Col span={24} >
                            {
                              queryDiagram.FAUITLEVELTIME ?
                                <ReactEcharts option={this.getOption("FAUITLEVELTIME")}></ReactEcharts> :
                                <Empty style={{ margin: "12px 0px" }} description={
                                  <span>
                                    平均响应/处理时间级别表 - 暂无数据
                                </span>
                                } />
                            }
                          </Col>
                          <Col span={24} >
                            {
                              queryDiagram.FAUITTYPETIME ?
                                <ReactEcharts option={this.getOption("FAUITTYPETIME")}></ReactEcharts> :
                                <Empty style={{ margin: "12px 0px" }} description={
                                  <span>
                                    平均响应/处理时间类型表 - 暂无数据
                                  </span>
                                } />
                            }

                          </Col>
                          <Col span={24} >
                            {
                              queryDiagram.REPAIRLIST ?
                                <ReactEcharts option={this.getOption("REPAIRLIST")}></ReactEcharts> :
                                <Empty style={{ margin: "12px 0px" }} description={
                                  <span>
                                    维修工维修排行表 - 暂无数据
                                  </span>
                                } />
                            }

                          </Col>
                        </Row>
                      }
                    </TabPane>
                  </Tabs>

                </Card>

              </div>
            </Col>
          </Row>
        </div>

      </div>
    );
  }
}

DeviceAnalyse = Form.create('yangziges')(DeviceAnalyse);

export default DeviceAnalyse;
