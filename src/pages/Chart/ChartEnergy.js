import React, { Component } from 'react';
import moment from 'moment';
import {
  Card, Button, Row, Col, Tree, Tabs,
  Select, DatePicker, TreeSelect, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import ReactEcharts from "echarts-for-react";
import Company from './../System/Company';
import CompanyList from './../System/CompanyList';
const { TreeNode } = TreeSelect;
const Option = Select.Option;
const { TabPane } = Tabs;

@connect(({ chart, loading }) => ({
  chart,
  submitting: loading.effects['chart/Energychart'],
}))
class ChartEnergy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: {
        "companyId": undefined,//公司id
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

  resetData(ifs) {
    this.setNewState('Energychart', this.state.postData,()=>{
      if(ifs){
        let { Energychart, companyList } = this.props.chart;
        this.setState({
          postData:{
            ...this.state.postData,
            "companyId":companyList[0].id
          }
        })


      }

    });

  }

  componentDidMount() {
    this.resetData(true)
  }





  getOption(itemz) {
    let allData = itemz.value;
    let res = {}


    let xData = allData[0] ? allData[0].value.map((item, i) => {
      return item.month
    }) : null,
      getSerise = allData.map((item, i) => {
        return {
          name: item.year,
          type: 'bar',
          data: item.value,
          label: {
            normal: {
              formatter: '{c}',
              show: true
            },
          },
        }

      })




    res = {
      title: {
        text: itemz.key,
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
        data: ["占比"],
        left: "center",
      },
      xAxis: [
        {
          type: 'category',
          name: "月份",
          data: xData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: "度数",
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: getSerise
    }
    return res

  }




  render() {
    const { postData } = this.state,
      { Energychart, companyList } = this.props.chart;

    let colc = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8
    }

    return (
      <div>
        <div className={styles.container}>
          <Card title="电表统计">
            <Row style={{ backgroundColor: '#ffffff', marginBottom: 12 }}>
              <Col style={{ marginBottom: 12 }}>
                <Select style={{ width: "100%" }} placeholder="选择组织" allowClear
                  value={postData.companyId} onChange={(value) => {
                    this.setState({
                      postData: {
                        ...postData,
                        companyId: value
                      }
                    }, () => {
                      this.resetData()
                    })

                  }}>
                  {
                    companyList.map((item, i) => {
                      return <Option key={i} value={item.id}>{item.companyName}</Option>
                    })
                  }
                </Select>

              </Col>


            </Row>
            <Row gutter={12}>
              {
                Energychart&&Energychart.length>0 ?
                  Energychart.map((item, i) => {
                    return <Col {...colc} key={i} style={{ marginBottom: 12 }}>
                      <Card title={item.key}>
                        <Tabs defaultActiveKey="0">
                          {
                            item.value.map((ztem, n) => {
                              return <TabPane tab={ztem.key} key={n}>
                                <ReactEcharts style={{ height: 500, marginTop: 12 }} option={this.getOption(ztem)}></ReactEcharts>
                              </TabPane>
                            })
                          }
                        </Tabs>
                      </Card>
                    </Col>
                  }) : <Empty style={{marginTop:18}}></Empty>  
              }
            </Row>

          </Card>

        </div>

      </div>
    );
  }
}


export default ChartEnergy;
