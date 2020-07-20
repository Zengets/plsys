import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, DatePicker, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Popover, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import moment from 'moment';
import AbViewer from '@/components/AbViewer';



@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/fatequeryListOfEquipment'],
}))
class CheckHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      vs: false,
      postData: {
        pageIndex: 1,
        pageSize: 10,
        equipmentId: props.match.params.id,
        pointCheckYear: "",
        pointCheckMonth: "",
      },
      postUrl: "fatequeryListOfEquipment",
      curitem: {}
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
    this.setNewState(postUrl, postData)
  }

  componentDidMount() {
    this.resetData()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setState({
        postData: {
          pageIndex: 1,
          pageSize: 10,
          equipmentId: nextProps.match.params.id,
          pointCheckYear: "",
          pointCheckMonth: "",
        }
      }, () => {
        this.setNewState(this.state.postUrl, this.state.postData)
      })
    }
  }


  render() {
    let { fatequeryListOfEquipment } = this.props.check, { vs } = this.state;

    const content = (part2) => (
      <div className={styles.limitdiv}>
        {
          part2.periodType == 0 ?
            <p>点检日期：<span>{part2.pointCheckItemDate}</span></p> :
            <p>当前周期：<span>第{part2.weekNum}周</span></p>
        }
        <p>点检时间：<span>{part2.pointCheckTime}</span></p>
        <p>点 检 人 ：<span>{part2.pointCheckUserName}</span></p>
        <p>点检状态：<span style={{ color: part2.pointCheckItemResultType == null ? "#999" : part2.pointCheckItemResultType == 0 ? "#398dcd" : "#ff2100" }}>{part2.pointCheckItemResultType == null ? "待执行" : part2.pointCheckItemResultType == 0 ? "执行正常" : "执行异常"}</span></p>
        {/* <p>正常参考：<span>{part2.normalReference}</span></p> */}
        <p>异常现象：<span>{part2.exceptionRecord}</span></p>
      </div>
    );

    const contents = () => (
      <div style={{ margin: "-4px -6px" }}>
        <DatePicker.MonthPicker value={this.state.postData.pointCheckYear ?
          moment(this.state.postData.pointCheckYear + "-" + this.state.postData.pointCheckMonth)
          : undefined} onChange={(val) => {
            let res = val ? moment(val).format("YYYY-MM").split("-") : [null, null];
            this.setState({
              postData: {
                ...this.state.postData,
                pointCheckYear: res[0],
                pointCheckMonth: res[1]
              }
            }, () => {
              this.resetData()
            })

          }} />
      </div>

    )

    const renderPart2 = (part1, part2) => {
      if (part2) {
        return part2.map((item, i) => {
          return <Popover key={i} placement="bottom" content={content(item)} title={part1.pointCheckItem}>
            <div style={{ minWidth: 24, height: 24, lineHeight: "24px", backgroundColor: item.pointCheckItemResultType == null ? "#999" : item.pointCheckItemResultType == 0 ? "#398dcd" : "#ff2100", marginRight: 2, marginBottom: 2, textAlign: "center", cursor: "pointer", width: 24, color: "#fff" }} >
              {
                part1.periodType == 0 ?
                  item.pointCheckItemDate ? item.pointCheckItemDate.substring(item.pointCheckItemDate.length - 2) : "" :
                  item.weekNum

              }</div></Popover>
        })
      } else {
        return <div>暂无</div>
      }


    }

    const renderDom = (item, i) => {
      let part1 = item.item, part2 = item.days;
      return (
        <Row gutter={24} key={i} style={{ padding: "10px 0", borderBottom: "#f0f0f0 solid 1px" }} className={styles.hoverable}>
          <Col span={2}>
            <a>{part1.pointCheckYear}年{part1.pointCheckMonth}月</a>
          </Col>
          <Col span={2}>
            <span>{part1.pointCheckItem}</span>
          </Col>
          <Col span={2}>
            <span>{part1.periodTypeName}</span>
          </Col>
          <Col span={18} style={{ display: "flex", flexWrap: "wrap" }}>
            {renderPart2(part1, part2)}
          </Col>
        </Row>
      )
    }

    function bodyparse(vals) {
      let val = JSON.parse(JSON.stringify(vals))
      delete val.pageSize;
      delete val.pageIndex;
      let res = ''
      for (let key in val) {
        let value = val[key] ? val[key] : ''

        res += `&${key}=${value}`;
      }
      return res.substr(1)
    }

    return (<div>
      <div className={styles.setTab}>
        <Card title={this.props.match.params.name ? <span><a>{this.props.match.params.name}</a>的点检历史</span> : "点检历史记录"} extra={
          <span style={{ textAlign: "right" }}>
            <a onClick={() => {
              message.loading("正在导出文件...")
            }} href={`/rs/equipmentPointCheckTask/exportExcelOfMonth?${bodyparse(this.state.postData)}`} target="_blank">
              导出点检详情
            </a>
          </span>
        }>
          <div style={{ padding: "0 10px" }}>
            <Row gutter={24} style={{ padding: "10px 0", backgroundColor: "#f0f0f0" }}>
              <Col span={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>点检时间</span>
                <Popover placement="bottom" content={contents()} trigger="click">
                  <Icon style={{ color: this.state.postData.pointCheckYear ? "rgb(24, 144, 255)" : "#ff2100", fontSize: 12 }} type="caret-down" />
                </Popover>
              </Col>
              <Col span={2}>
                <span>点检项目</span>
              </Col>
              <Col span={2}>
                <span>点检周期</span>
              </Col>
              <Col span={18}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                  <span style={{ width: 68 }}>
                    点检内容
                  </span>
                  {/* <i style={{ width: 16, height: 16, margin: "0 4px 0px 8px", backgroundColor: "#999", display: "block" }}></i>
                  待执行 */}
                  <i style={{ width: 16, height: 16, margin: "0 4px 0px 8px", backgroundColor: "#398dcd", display: "block" }}></i>
                  执行正常
                  <i style={{ width: 16, height: 16, margin: "0 4px 0px 8px", backgroundColor: "#ff2100", display: "block" }}></i>
                  执行异常
                </div>

              </Col>
            </Row>
            {
              fatequeryListOfEquipment.length != 0 ?
                fatequeryListOfEquipment.map((item, i) => {
                  return renderDom(item, i)
                }) : <Empty style={{ margin: 42 }}></Empty>
            }
          </div>




        </Card>
      </div>


    </div>)
  }

}

export default CheckHistory



