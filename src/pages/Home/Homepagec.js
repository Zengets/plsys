/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Row, Col, Card, Tooltip, Button, Empty, message } from 'antd';
import { connect } from 'dva';
import { ChartCard, WaterWave, Pie } from '@/components/Charts';
import ReactEcharts from "echarts-for-react";
import { subscribeToTimer } from '@/utils/subscribeToTimer';
import UserCheck from './UserCheck'
@connect(({ home, loading }) => ({
  home,
  submitting: loading.effects['home/queryHome'],
}))
class Homepage extends Component {
  constructor(props) {
    super(props)
    this.t = null;
    this.state = {
      a: 0,
      b: 0,
      c: 0,
      timestamp: 'no timestamp yet'
    }
    subscribeToTimer((err, timestamp) => this.setState({
      timestamp
    }));
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

  componentDidMount() {
    this.setNewState("queryHome", null)
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.state.timestamp !== nextState.timestamp) {
      message.success(this.state.timestamp)
    }
  }

  render() {
    return <div>1</div>
  }
}

export default Homepage;
