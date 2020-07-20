import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import DeviceGoChild from './DeviceGoChild/DeviceGoChild';
import { Card, Row, Col, Modal } from 'antd';
import router from 'umi/router'
const { TabPane } = Tabs;


@connect(({ approval, menu, publicmodel, loading }) => ({
  approval,
  menu,
  publicmodel,
  submitting: loading.effects['approval/queryApprovalTypeCount'],
}))

class AllApproval extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.publicmodel.key)
    this.state = {
      key: props.publicmodel.key ? props.publicmodel.key : '1',
      show: true,
      postData: {
        status: props.publicmodel.key ? props.publicmodel.key : '1'
      },
      postUrl: "queryApprovalTypeCount",
      imgurl: "all0.png",
      curtitle: "调拨流程"
    }
  }

  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'approval/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }


  resetData() {
    let { postUrl, postData, key } = this.state;
    this.setState({
      postData: {
        status: key
      }
    }, () => {
      this.setNewState(postUrl, this.state.postData)
    })
  }

  componentDidMount() {
    this.resetData()
  }

  render() {
    let { show, key } = this.state, { queryApprovalTypeCount } = this.props.approval;
    let callback = (key) => {
      this.setState({ key }, () => {
        this.resetData()
      })
    }, color = ["#1296db", "#5bcddb", "#d81e06","#1b7aff", "#58c55d", "#6457a8", "#ff2100","#1286db","#13227a"],
      routerList = ["/approval/devicegoa", "/approval/devicegob", "/approval/devicegoc", "/yxt/repair/repairlist", "/approval/spareget", "/approval/weiwai", "/approval/noticeapproval","/approval/sparebuy",'/yxt/verb/verbmission'],routerLists = ["/approval/devicegoa", "/approval/devicegob", "/approval/devicegoc", "/yxt/repair/repairhistory", "/approval/spareget", "/approval/weiwai", "/approval/noticeapproval","/approval/sparebuy"],
      col = {
        xs: 12, sm: 12, md: 12, lg: 12, xl: 8, xxl: 6
      }


    let renderCard = (item, i) => {
      return <Col onMouseEnter={() => {
        this.setState({
          imgurl: `all${i}.png`,
          curtitle: item.name
        })
      }} {...col} key={i} style={{ marginBottom: 12 }} onClick={() => {
        item.value != 0 ?
          router.push({
            pathname:key=="1"?routerList[i]:routerLists[i],
            query:{
              isCurrentUserAudit:i==4?"1":"",
              isCurrentUserConfirm:i==8?"1":"",
            }  
          }) : null
      }}>
        <Card
          hoverable
          style={{ width: "100%" }}
          cover={<div style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection:"column", alignItems: "center", padding: "24px 0px 0px 0px" }}>
            <span style={{ fontSize: 16, color: "#333",paddingBottom:12 }}>{item.name} </span>
            <img alt="example" style={{ width: "32%" }} src={`./images/all${i}.svg`} /></div>}
        >
          <p style={{ margin: 0,marginTop:-20, display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <span>{key == "1" ? "待审批" : "已审批"} <i style={{ color: color[i], fontSize: 48, fontWeight: "bolder" }}>{item.value}</i> 个</span>
          </p>


        </Card>
      </Col>
    }

    let renderList = () => (
      <div style={{ width: "100%", overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
        <div style={{ width: show ? 500 : 0, transition: "all 0.4s",marginBottom:12,overflow:"hidden" }}>
          <p style={{ margin: "12px 0", fontSize: 18 }}>{this.state.curtitle ? this.state.curtitle : ""}的流程图</p>
          <div
            onClick={() => {
              Modal.info({
                maskClosable: true,
                width: "68%",
                style: { top: 20 },
                title: `预览${this.state.curtitle}流程图`,
                okText: "关闭",
                content: (
                  <div style={{ width: "100%" }}>
                    <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={`./images/${this.state.imgurl}`} onError={(e) => { e.target.src = './images/default.png' }} />
                  </div>
                ),

              });
            }}
            className={styles.bacimg} style={{ backgroundImage: `url(${`./images/${this.state.imgurl}`})` }}>
          </div>


        </div>

        <Row gutter={12} style={{ flex: 1 }}>
          {
            queryApprovalTypeCount &&
            queryApprovalTypeCount.map((item, i) => {
              return renderCard(item, i)
            })
          }
        </Row>
      </div>
    )


    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <PageHeader title={<span style={{ paddingLeft: 14 }}>我的审批</span>} style={{ margin: 0 }}>
          <Tabs defaultActiveKey={key} onChange={callback} style={{ marginTop: -12 }} tabBarExtraContent={<a onClick={() => {
            this.setState({
              show: !show
            })
          }}>{show ? "隐藏" : "显示"}流程图</a>}>
            <TabPane tab="待审批" key="1">
              {
                renderList()
              }
            </TabPane>
            <TabPane tab="已审批" key="2">
              {
                renderList()
              }
            </TabPane>
          </Tabs>






        </PageHeader>

      </div>
    )
  }


}

export default AllApproval



