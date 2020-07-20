import React, { Component } from 'react';
import moment from 'moment';
import {
   Card, Button, Row, Col, Tree, Tag,
 Select, DatePicker, TreeSelect
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import ReactEcharts from "echarts-for-react";
//import AbEditor from '@/components/AbEditor'


const { TreeNode } = TreeSelect;
const Option = Select.Option;


@connect(({ chart, loading }) => ({
  chart,
  submitting: loading.effects['chart/querySTOP'],
}))
class ChartSTOP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: {
        "companyId": undefined,//公司id
        "departmentId": undefined,//部门id
        "shopId": undefined,//产品线id
        "shiftId":undefined,//班次id
        "startTime": "",//开始时间
        "endTime": ""//结束时间
      }
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

  resetData() {
    this.setNewState('querySTOP', this.state.postData);

  }

  componentDidMount() {
    this.resetData()
  }





  getOption() {
    let allData = this.props.chart.querySTOP;
    let res = {}


    let xData = allData.map((item, i) => {
      return item.date
    }), yData = allData.map((item, i) => {
      return item.value 
    })

    res = {
      title: {
        text: `停机时间图表`,
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
        data: ["时长"],
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
          name: "时长",
          axisLabel: {
            formatter: '{value} 分钟'
          }
        }
      ],
      series: [
        {
          name: "时长",
          type: 'bar',
          data: yData,
          label: {
            normal: {
              formatter: '{c} 分钟',
              show: true
            },
          },
        }
      ]
    }
    return res

  }



  // onRefer = (ref) => {
  //   this.edtorchild = ref;
  // }



  render() {
    const { postData } = this.state,
      { querySTOP, companyList, departmentList, shopList,shiftList } = this.props.chart;

    function disabledDate(current) {
      return current && current > moment().add("day", -1).endOf('day');
    }



    let cols = {
      xs: 24, sm: 24, md: 24, lg: 12, xl: 4, xxl: 4
    },  colsc = {
      xs: 24, sm: 24, md: 24, lg: 12, xl: 8, xxl: 8
    },
    colc = {
      xs: 24, sm: 24, md: 24, lg: 12, xl: 4, xxl: 4
    }


    const loop = data =>
      data.map(item => {
        const title = item.title;
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
    return (
      <div>
        <div className={styles.container}>
          <Card title="停机时间图表">
            <Row gutter={12} style={{ backgroundColor: '#ffffff', marginBottom: 12 }}>
              <Col {...colc} style={{marginBottom:12}}>
                <Select style={{ width: "100%" }} placeholder="选择公司" allowClear
                  value={postData.companyId} onChange={(value) => {
                    this.setState({
                      postData: {
                        ...postData,
                        companyId: value,
                        departmentId: undefined,
                        shopId: undefined,
                      }
                    }, () => {
                      this.setNewState("queryCondition", { companyId: value }, () => {
                        this.resetData();
                      })
                    })

                  }}>
                  {
                    companyList.map((item, i) => {
                      return <Option key={i} value={item.id}>{item.companyName}</Option>
                    })
                  }
                </Select>
              </Col>
              {/* <Col {...colc} style={{marginBottom:12}}>
                <TreeSelect placeholder="选择部门" allowClear style={{ width: "100%" }} value={postData.departmentId} onChange={(value) => {
                  this.setState({
                    postData: { ...this.state.postData, departmentId: value },
                  }, () => {
                    this.resetData()
                  });
                }}>
                  {loop(departmentList)}
                </TreeSelect>

              </Col> */}
              <Col {...colc} style={{marginBottom:12}}>
                <Select style={{ width: "100%" }} placeholder="选择产品线" allowClear
                  value={postData.shopId} onChange={(value) => {
                    this.setState({
                      postData: {
                        ...postData,
                        shopId: value
                      }
                    }, () => {
                      this.resetData()
                    })

                  }}>
                  {
                    shopList.map((item, i) => {
                      return <Option key={i} value={item.id}>{item.shopName}</Option>
                    })
                  }
                </Select>
              </Col>
              <Col {...colc} style={{marginBottom:12}}>
                <Select style={{ width: "100%" }} placeholder="选择班次" allowClear
                  value={postData.shiftId} onChange={(value) => {
                    this.setState({
                      postData: {
                        ...postData,
                        shiftId: value
                      }
                    }, () => {
                      this.resetData()
                    })
                  }}>
                  {
                    shiftList.map((item, i) => {
                      return <Option key={i} value={item.id}>{item.shiftName}</Option>
                    })
                  }
                </Select>
              </Col>

              <Col {...colsc}  style={{marginBottom:12}}>
                <DatePicker.RangePicker style={{ width: "100%" }} value={postData.startTime ? [moment(postData.startTime), moment(postData.endTime)] : undefined}
                  onChange={val => {
                    this.setState(
                      {
                        postData: { ...postData, startTime: val[0] ? moment(val[0]).format("YYYY-MM-DD") : null, endTime: val[1] ? moment(val[1]).format("YYYY-MM-DD") : null },
                      },
                      () => {
                        this.resetData()
                      },
                    );
                  }} />
              </Col>
              <Col {...colc}  style={{marginBottom:12}}>
                <Button style={{ width: "100%" }} onClick={() => {
                  this.setState({
                    postData: {
                      "companyId": undefined,//公司id
                      "departmentId": undefined,//部门id
                      "shopId": undefined,//产品线id
                      "startTime": "",//开始时间
                      "endTime": ""//结束时间
                    }
                  }, () => {
                    this.resetData()
                  })
                }}>
                  重置
               </Button>
              </Col>

            </Row>
            <Tag color="#398dcd" onClick={() => {
              let startTime = moment().add("day", -1).format("YYYY-MM-DD"),
                endTime = moment().add("day", -1).format("YYYY-MM-DD");
              this.setState({
                postData: {
                  ...postData,
                  startTime,
                  endTime
                }
              }, () => {
                this.resetData();
              })
            }}>近一天</Tag>
            <Tag color="#398dcd" onClick={() => {
              let startTime = moment().add("day", -7).format("YYYY-MM-DD"),
                endTime = moment().add("day", -1).format("YYYY-MM-DD");
              this.setState({
                postData: {
                  ...postData,
                  startTime,
                  endTime
                }
              }, () => {
                this.resetData();
              })
            }}>近一周</Tag>
            <Tag color="#398dcd" onClick={() => {
              let startTime = moment().add("day", -30).format("YYYY-MM-DD"),
                endTime = moment().add("day", -1).format("YYYY-MM-DD");
              this.setState({
                postData: {
                  ...postData,
                  startTime,
                  endTime
                }
              }, () => {
                this.resetData();
              })
            }}>近一月</Tag>
            <ReactEcharts style={{ height: 500, marginTop: 12 }} option={this.getOption()}></ReactEcharts>
          </Card>
          {/* <div style={{margin:20,border:"#ddd solid 1px",overflow:"hidden"}}>
            <AbEditor onRefer={this.onRefer} defaultValue={`<p>徐涛大傻逼</p>`} ></AbEditor>
          </div> */}
          
        </div>

      </div>
    );
  }
}


export default ChartSTOP;
