import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import DeviceGoChild from './DeviceGoChild/DeviceGoChild';
import Draw from './Drawer'
const { TabPane } = Tabs;


@connect(({ approval, menu, publicmodel, loading }) => ({
  approval,
  menu,
  publicmodel,
  submitting: loading.effects['approval/goqueryList'],
}))

class DeviceGo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postpoint: {
        radio: "",
        textarea: ""
      },
      iftype: {
        name: "",
        value: ""
      },
      curitem: {},
      fv: false,
      key: "1",
      show: false,
    }
  }



  render() {

    let { show, key } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }
    let getName = () => {
      if (this.props.menu.curMenu.indexOf("devicegoa") != -1) {
        return "调拨审批"
      } else if (this.props.menu.curMenu.indexOf("devicegob") != -1) {
        return "借用审批"
      } else {
        return "报废审批"
      }
    }
    let getType = () => {
      if (this.props.menu.curMenu.indexOf("devicegoa") != -1) {
        return "0"
      } else if (this.props.menu.curMenu.indexOf("devicegob") != -1) {
        return "2"
      } else {
        return "3"
      }
    }

    //text == 0 ? "待审批" : text == 1 ? "审批中" : text == 2 ? "已审批" : text == 4 ? "撤回" : ""

    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <Draw
          visible={show}
          title={getName()+"流程图"}
          imgurl={
            getType() == "0" ? "./images/all0.png" :
              getType() == "2" ? "./images/all1.png" :
                "./images/all3.png"
          }
          onClose={() => {
            this.setState({
              show: false
            })
          }}
        >
        </Draw>
        <PageHeader title={<span style={{paddingLeft:14}}>{getName()}</span>} style={{ margin: 0 }}>
          <Tabs defaultActiveKey="1" onChange={callback} style={{ marginTop: -12 }} tabBarExtraContent={<a onClick={() => {
            this.setState({
              show: !show
            })
          }}>{show ? "隐藏" : "显示"}流程图</a>}>
            <TabPane tab="待审批" key="1">
              {
                this.state.key == "1" &&
                <DeviceGoChild title={getName()} postData={{ approvalProcessType: getType(), status: "0" }}></DeviceGoChild>
              }
            </TabPane>
            <TabPane tab="已审批" key="3">
              {
                this.state.key == "3" &&
                <DeviceGoChild title={getName()} postData={{ approvalProcessType: getType(), status: "2" }}></DeviceGoChild>
              }
            </TabPane>
          </Tabs>


        </PageHeader>

      </div>
    )
  }


}

export default DeviceGo



