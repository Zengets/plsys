/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Card, Spin, Divider, Statistic, Row, Col, Empty, Drawer } from 'antd';
import { connect } from 'dva';
import { ChartCard, WaterWave, Pie } from '@/components/Charts';
import router from 'umi/router';


@connect(({ home, loading }) => ({
  home,
  submitting: loading.effects['home/queryEquipChart'],
  submittings: loading.effects['home/queryEquipChartByCompanyId'],
}))
class StateDevice extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  resetData() {
    this.setNewState("queryEquipChart")
  }

  componentDidMount() {
    this.resetData();
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  getVal(text) {
    let val = "";
    switch (text) {
      case "待机":
        val = "0"
        break;
      case "运行中":
        val = "1"
        break;
      case "故障":
        val = "2"
        break;
      case "维修中":
        val = "3"
        break;
      case "流转中":
        val = "4"
        break;
      case "报废":
        val = "5"
        break;
    }
    return val
  }

  jumpUrl = (name) =>{
    if(name=="报废"){
      return
    }
    router.push({
      pathname:"/yxt/devices/devicetzlists",
      query:{
        name:this.getVal(name)
      }
    })

  }


  render() {
    let { total, list, queryShopsEquipChart } = this.props.home,
      { } = this.state,
      { equipmentCount, turnOnRate, equipStatusChart, name } = total;
    function getcolor(text) {
      let color = "";
      switch (text) {
        case "待机":
          color = "#999"
          break;
        case "运行中":
          color = "green"
          break;
        case "故障":
          color = "#ff5000"
          break;
        case "维修中":
          color = "#398dcd"
          break;
        case " 流转中":
          color = "#398dcd"
          break;
        case "报废":
          color = "#ff2100"
          break;
      }
      return color
    }
    let col = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 6, xxl: 6,
    }, cols = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 18, xxl: 18,
    }, colc = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8,
    }
    let getallNum = (arr, val) => {
      let total = 0;
      arr ?
        arr.map((item) => {
          total += item[val]
        }) : null
      return total == 0 ? 1 : total
    }

    return (
      <Spin spinning={this.props.submitting&&this.props.submittings} tip="数据加载中...">
        <Drawer
          width={"88%"}
          title="横向对比"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Row gutter={12}>
            {
              queryShopsEquipChart && queryShopsEquipChart.length > 0 ?
                queryShopsEquipChart.map((item, i) => (
                  <Col style={{marginBottom:12}} {...colc} key={i}>
                    <Card title={<span title={item.name + "(" + item.companyName + ")"}>{item.name + "(" + item.companyName + ")"}</span>} >
                      <Row>
                        <Col span={12}>
                          <Statistic title="设备总数" value={item.equipmentCount} prefix={<Icon type="desktop" />} />
                        </Col>
                        <Col span={12}>
                          <Statistic title="开机率" value={item.turnOnRate} prefix={<Icon type="stock" />} suffix="%" />
                        </Col>
                      </Row>
                      <div style={{ marginTop: 12 }}>
                        {
                          item.equipStatusChart ? item.equipStatusChart.map((now, i) => {
                            return <li className={styles.hoverables} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} key={i}><span style={{ color: getcolor(now.name) }}> <i style={{ padding: 2, color: getcolor(now.name) }}></i> {now.name}</span><span style={{ color: getcolor(now.name) }}>{now.value} 台</span> <div className={styles.bacline} style={{ width: `${parseFloat(now.value * 100 / getallNum(item.equipStatusChart, "value"))}%`, backgroundColor: getcolor(now.name), opacity: 0.4 }}></div></li>
                          }) : null
                        }

                      </div>

                    </Card>
                  </Col>
                )) : <Empty></Empty>
            }
          </Row>

        </Drawer>
        <Row gutter={12}>
          <Col {...col}>
            <Card title={<a>{name}</a>}>
              <Row>
                <Col>
                  <Card hoverable >
                    <ChartCard
                      bordered={false}
                      title="当前设备总数"
                      avatar={
                        <img
                          style={{ width: 56, height: 56 }}
                          src="./images/device.png"
                          alt="indicator"
                        />
                      }
                      total={() => <span><a style={{ color: "#f2637b" }}>{equipmentCount ? parseInt(equipmentCount) : 0}</a> 台</span>}
                    />
                  </Card>
                </Col>
                <Col style={{ margin: "12px 0px" }}>
                  <Card hoverable>
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <ChartCard
                        bordered={false}
                        title="设备开机率"
                        avatar={
                          turnOnRate ?
                            <WaterWave style={{ borderRadius: "50%" }} height={56} title="设备开机率" percent={turnOnRate ? parseFloat(turnOnRate) : 0} />
                            : null
                        }
                        total={() => <span><a style={{ color: "#2997ff" }}>{turnOnRate ? parseFloat(turnOnRate).toFixed(2) : 0}</a> %</span>}
                      />
                    </div>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ padding: 0, margin: 0 }} title={<span style={{ paddingLeft: 12 }}>开关机状态</span>} extra={<span style={{ padding: "0px 12px" }}>数量</span>}>
                    {
                      equipStatusChart ? equipStatusChart.map((item, i) => {
                        return <li className={styles.hoverables} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} key={i} onClick={()=>{
                          this.jumpUrl(item.name)
                        }}>
                          <span style={{ color: getcolor(item.name) }}> <i style={{ padding: 2, color: getcolor(item.name) }}></i> {item.name}</span><span style={{ color: getcolor(item.name) }}>{item.value}</span> <div className={styles.bacline} style={{ width: `${parseFloat(item.value * 100 / getallNum(equipStatusChart, "value"))}%`, backgroundColor: getcolor(item.name), opacity: 0.5 }}></div></li>
                      }) : null
                    }
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col {...cols}>
            <Card title={"详情"} extra={list.length > 0 ?
              list[0].id ? null :
                <a onClick={() => {
                  this.resetData();
                }}>查看汇总</a> :
              <a onClick={() => {
                this.resetData();
              }}>查看汇总</a>}>
              {
                list && list.length > 0 ?
                  list.map((item, i) => (
                    <Col {...colc} key={i} style={{marginBottom:12}}>
                      <Card title={<span style={{width:"100%"}} title={item.name}>{item.name}</span>} extra={item.id ? <a onClick={() => {
                        item.id ?
                          this.setNewState("queryEquipChartByCompanyId", { companyId: item.id }) :
                          null

                      }}>查看详情</a> : <a onClick={() => {
                        this.setState({
                          visible: true
                        }, () => {
                          this.setNewState("queryShopsEquipChart", { shopName: item.name }, () => {
                            console.log(queryShopsEquipChart)
                          })

                        })
                      }}>横向对比</a>}>
                        <Row>
                          <Col span={12}>
                            <Statistic title="设备总数" value={item.equipmentCount} prefix={<Icon type="desktop" />} />
                          </Col>
                          <Col span={12}>
                            <Statistic title="开机率" value={item.turnOnRate} prefix={<Icon type="stock" />} suffix="%" />
                          </Col>
                        </Row>
                        <div style={{ marginTop: 12 }}>
                          {
                            item.equipStatusChart ? item.equipStatusChart.map((now, i) => {
                              return <li className={styles.hoverables} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} key={i}><span style={{ color: getcolor(now.name) }}> <i style={{ padding: 2, color: getcolor(now.name) }}></i> {now.name}</span><span style={{ color: getcolor(now.name) }}>{now.value} 台</span> <div className={styles.bacline} style={{ width: `${parseFloat(now.value * 100 / getallNum(item.equipStatusChart, "value"))}%`, backgroundColor: getcolor(now.name), opacity: 0.4 }}></div></li>
                            }) : null
                          }

                        </div>

                      </Card>
                    </Col>
                  )) : <Empty></Empty>
              }





            </Card>

          </Col>
        </Row>
      </Spin>
    );
  }
}

export default StateDevice;
