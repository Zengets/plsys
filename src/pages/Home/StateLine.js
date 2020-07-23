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
  submitting: loading.effects['home/queryEquipChartLine'],
  submittings: loading.effects['home/queryEquipChartByCompanyIdLine'],
}))
class StateLine extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/' + type,
      payload: values,
    }).then(res => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  resetData() {
    this.setNewState('queryEquipChartLine');
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
    let val = '';
    switch (text) {
      case '待机':
        val = '0';
        break;
      case '运行中':
        val = '1';
        break;
      case '故障':
        val = '2';
        break;
      case '维修中':
        val = '3';
        break;
      case '流转中':
        val = '4';
        break;
      case '报废':
        val = '5';
        break;
    }
    return val;
  }
  jumpUrl = name => {
    if (name == '报废') {
      return;
    }
    router.push({
      pathname: '/yxt/devices/devicetzlists',
      query: {
        name: this.getVal(name),
        isMain: 1,
      },
    });
  };

  render() {
    let { totals, lists, queryShopsEquipChartLine } = this.props.home,
      { } = this.state,
      {
        equipmentCount,
        turnOnRate,
        equipStatusChart,
        name,
        dayPlanTurnOnCount,
        dayActualTurnOnCount,
        dayActualTurnOnRate,
        nightPlanTurnOnCount,
        nightActualTurnOnCount,
        nightActualTurnOnRate,
      } = totals;
    function getcolor(text) {
      let color = '';
      switch (text) {
        case '待机':
          color = '#999';
          break;
        case '运行中':
          color = 'green';
          break;
        case '故障':
          color = '#ff5000';
          break;
        case '维修中':
          color = '#398dcd';
          break;
        case ' 流转中':
          color = '#398dcd';
          break;
        case '报废':
          color = '#ff2100';
          break;
      }
      return color;
    }
    let col = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 6,
      xxl: 6,
    },
      cols = {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 18,
        xxl: 18,
      },
      colc = {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 8,
        xxl: 8,
      },
      cold = {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 24,
        xxl: 12,
      },
      coles = {
        xs: 24,
        sm: 24,
        md: 12,
        lg: 12,
        xl: 12,
        xxl: 12,
      };
    let getallNum = (arr, val) => {
      let total = 0;
      arr
        ? arr.map(item => {
          total += item[val];
        })
        : null;
      return total == 0 ? 1 : total;
    };

    return (
      <Spin spinning={this.props.submitting && this.props.submittings} tip="数据加载中...">
        <Drawer
          width={'88%'}
          title="横向对比"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Row gutter={12}>
            {queryShopsEquipChartLine && queryShopsEquipChartLine.length > 0 ? (
              queryShopsEquipChartLine.map((item, i) => (
                <Col style={{ marginBottom: 12 }} {...colc} key={i}>
                  <Card
                    title={
                      <span title={item.name + '(' + item.companyName + ')'}>
                        {item.name + '(' + item.companyName + ')'}
                      </span>
                    }
                  >
                    <Row>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="产线总数"
                          value={item.equipmentCount}
                          prefix={<Icon type="desktop" />}
                        />
                      </Col>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="开机率"
                          value={item.turnOnRate}
                          prefix={<Icon type="stock" />}
                          suffix="%"
                        />
                      </Col>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="白天计划开线数"
                          value={item.dayPlanTurnOnCount}
                          prefix={<Icon type="file" />}
                          suffix="台"
                        />
                      </Col>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="白天实际开线数"
                          value={item.dayActualTurnOnCount}
                          prefix={<Icon type="bulb" />}
                          suffix="台"
                        />
                      </Col>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="白天实际开线率"
                          value={item.dayActualTurnOnRate}
                          prefix={<Icon type="bar-chart" />}
                          suffix="%"
                        />
                      </Col>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="夜班计划开线数"
                          value={item.nightPlanTurnOnCount}
                          prefix={<Icon type="file" />}
                          suffix="台"
                        />
                      </Col>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="夜班实际开线数"
                          value={item.nightActualTurnOnCount}
                          prefix={<Icon type="bulb" />}
                          suffix="台"
                        />
                      </Col>
                      <Col {...coles} style={{ padding: 6 }}>
                        <Statistic
                          title="夜班实际开线率"
                          value={item.nightActualTurnOnRate}
                          prefix={<Icon type="bar-chart" />}
                          suffix="%"
                        />
                      </Col>
                    </Row>
                    <div style={{ marginTop: 12 }}>
                      {item.equipStatusChart
                        ? item.equipStatusChart.map((now, i) => {
                          return (
                            <li
                              className={styles.hoverables}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                              key={i}
                            >
                              <span style={{ color: getcolor(now.name) }}>
                                {' '}
                                <i style={{ padding: 2, color: getcolor(now.name) }} /> {now.name}
                              </span>
                              <span style={{ color: getcolor(now.name) }}>{now.value} 台</span>{' '}
                              <div
                                className={styles.bacline}
                                style={{
                                  width: `${parseFloat(
                                    (now.value * 100) / getallNum(item.equipStatusChart, 'value')
                                  )}%`,
                                  backgroundColor: getcolor(now.name),
                                  opacity: 0.4,
                                }}
                              />
                            </li>
                          );
                        })
                        : null}
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
                <Empty />
              )}
          </Row>
        </Drawer>
        <Row gutter={12}>
          <Col {...col}>
            <Card title={<a>{name}</a>}>
              <Row>
                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="当前产线总数"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#f2637b', fontSize: 16 }}>
                          {equipmentCount ? parseInt(equipmentCount) : 0}
                        </a>{' '}
                        台
                      </span>
                    )}
                  />
                </Col>
                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="产线开机率"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#2997ff', fontSize: 16 }}>
                          {turnOnRate ? parseFloat(turnOnRate).toFixed(2) : 0}
                        </a>{' '}
                        %
                      </span>
                    )}
                  />
                </Col>
                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="白班计划开线数"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#2997ff', fontSize: 16 }}>
                          {dayPlanTurnOnCount ? dayPlanTurnOnCount : 0}
                        </a>{' '}
                        台
                      </span>
                    )}
                  />
                </Col>
                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="夜班计划开线数"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#2997ff', fontSize: 16 }}>
                          {nightPlanTurnOnCount ? nightPlanTurnOnCount : 0}
                        </a>{' '}
                        台
                      </span>
                    )}
                  />
                </Col>
                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="白班实际开线数"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#2997ff', fontSize: 16 }}>
                          {dayActualTurnOnCount ? dayActualTurnOnCount : 0}
                        </a>{' '}
                        台
                      </span>
                    )}
                  />
                </Col>
                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="
                    夜班实际开线数"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#2997ff', fontSize: 16 }}>
                          {nightActualTurnOnCount ? nightActualTurnOnCount : 0}
                        </a>{' '}
                        台
                      </span>
                    )}
                  />
                </Col>
                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="白班实际开线率"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#2997ff', fontSize: 16 }}>
                          {dayActualTurnOnRate ? dayActualTurnOnRate : 0}
                        </a>{' '}
                        %
                      </span>
                    )}
                  />
                </Col>


                <Col {...cold} style={{ margin: '12px 0px' }}>
                  <ChartCard
                    bordered={false}
                    title="夜班实际开线率"
                    total={() => (
                      <span style={{ fontSize: 18 }}>
                        <a style={{ color: '#2997ff', fontSize: 16 }}>
                          {nightActualTurnOnRate ? nightActualTurnOnRate : 0}
                        </a>{' '}
                        %
                      </span>
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card
                    style={{ padding: 0, margin: 0 }}
                    title={<span style={{ paddingLeft: 12 }}>开关机状态</span>}
                    extra={<span style={{ padding: '0px 12px' }}>数量</span>}
                  >
                    {equipStatusChart
                      ? equipStatusChart.map((item, i) => {
                        return (
                          <li
                            className={styles.hoverables}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                            key={i}
                            onClick={() => {
                              this.jumpUrl(item.name);
                            }}
                          >
                            <span style={{ color: getcolor(item.name) }}>
                              <i style={{ padding: 2, color: getcolor(item.name) }} /> {item.name}
                            </span>
                            <span style={{ color: getcolor(item.name) }}>{item.value}</span>
                            <div
                              className={styles.bacline}
                              style={{
                                width: `${parseFloat(
                                  (item.value * 100) / getallNum(equipStatusChart, 'value')
                                )}%`,
                                backgroundColor: getcolor(item.name),
                                opacity: 0.5,
                              }}
                            />
                          </li>
                        );
                      })
                      : null}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col {...cols}>
            <Card
              title={'详情'}
              extra={
                lists.length > 0 ? (
                  lists[0].id ? null : (
                    <a
                      onClick={() => {
                        this.resetData();
                      }}
                    >
                      查看汇总
                    </a>
                  )
                ) : (
                    <a
                      onClick={() => {
                        this.resetData();
                      }}
                    >
                      查看汇总
                    </a>
                  )
              }
            >
              {lists && lists.length > 0 ? (
                lists.map((item, i) => (
                  <Col {...colc} key={i} style={{ marginBottom: 12 }}>
                    <Card
                      title={<span title={item.name}>{item.name}</span>}
                      extra={
                        item.id ? (
                          <a
                            onClick={() => {
                              item.id
                                ? this.setNewState('queryEquipChartByCompanyIdLine', {
                                  companyId: item.id,
                                })
                                : null;
                            }}
                          >
                            查看详情
                          </a>
                        ) : (
                            <a
                              onClick={() => {
                                this.setState(
                                  {
                                    visible: true,
                                  },
                                  () => {
                                    this.setNewState(
                                      'queryShopsEquipChartLine',
                                      { shopName: item.name },
                                      () => {
                                        console.log(queryShopsEquipChartLine);
                                      }
                                    );
                                  }
                                );
                              }}
                            >
                              横向对比
                            </a>
                          )
                      }
                    >
                      <Row>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="产线总数"
                            value={item.equipmentCount}
                            prefix={<Icon type="desktop" />}
                          />
                        </Col>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="开机率"
                            value={item.turnOnRate}
                            prefix={<Icon type="stock" />}
                            suffix="%"
                          />
                        </Col>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="白班计划开线数"
                            value={item.dayPlanTurnOnCount}
                            prefix={<Icon type="file" />}
                            suffix="台"
                          />
                        </Col>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="白班实际开线数"
                            value={item.dayActualTurnOnCount}
                            prefix={<Icon type="bulb" />}
                            suffix="台"
                          />
                        </Col>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="白班实际开线率"
                            value={item.dayActualTurnOnRate}
                            prefix={<Icon type="bar-chart" />}
                            suffix="%"
                          />
                        </Col>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="夜班计划开线数"
                            value={item.nightPlanTurnOnCount}
                            prefix={<Icon type="file" />}
                            suffix="台"
                          />
                        </Col>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="夜班实际开线数"
                            value={item.nightActualTurnOnCount}
                            prefix={<Icon type="bulb" />}
                            suffix="台"
                          />
                        </Col>
                        <Col {...coles} style={{ padding: 6 }}>
                          <Statistic
                            title="夜班实际开线率"
                            value={item.nightActualTurnOnRate}
                            prefix={<Icon type="bar-chart" />}
                            suffix="%"
                          />
                        </Col>
                      </Row>
                      <div style={{ marginTop: 12 }}>
                        {item.equipStatusChart
                          ? item.equipStatusChart.map((now, i) => {
                            return (
                              <li
                                className={styles.hoverables}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                                key={i}
                              >
                                <span style={{ color: getcolor(now.name) }}>
                                  {' '}
                                  <i style={{ padding: 2, color: getcolor(now.name) }} />{' '}
                                  {now.name}
                                </span>
                                <span style={{ color: getcolor(now.name) }}>{now.value} 台</span>{' '}
                                <div
                                  className={styles.bacline}
                                  style={{
                                    width: `${parseFloat(
                                      (now.value * 100) /
                                      getallNum(item.equipStatusChart, 'value')
                                    )}%`,
                                    backgroundColor: getcolor(now.name),
                                    opacity: 0.4,
                                  }}
                                />
                              </li>
                            );
                          })
                          : null}
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                  <Empty />
                )}
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default StateLine;
