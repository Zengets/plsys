import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SpareGetChild from './SpareGetChild/SpareGetChild';
import Draw from './Drawer'
const { TabPane } = Tabs;


@connect(({ approval, menu, publicmodel, loading }) => ({
  approval,
  menu,
  publicmodel,
  submitting: loading.effects['approval/goqueryList'],
}))

class SpareGet extends React.Component {
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
      show:false,
    }
  }



  render() {
    let { show,key } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }


    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <Draw
          visible={show}
          title="配件申请审批流程图"
          imgurl="./images/all4.png"
          onClose={() => {
            this.setState({
              show: false
            })
          }}
        >
        </Draw>
        <PageHeader title={<span style={{paddingLeft:14}}>配件申请审批列表</span>} style={{ margin: 0 }}>
          <Tabs defaultActiveKey="1" onChange={callback} style={{ marginTop: -12 }}>
            <TabPane tab="待审批" key="1">
              {
                this.state.key == "1" && <SpareGetChild postData={{ status: "0" }}></SpareGetChild>
              }
            </TabPane>
            <TabPane tab="已通过" key="2">
              {
                this.state.key == "2" && <SpareGetChild postData={{ status: "1" }}></SpareGetChild>
              }
            </TabPane>
            <TabPane tab="未通过" key="3">
              {
                this.state.key == "3" && <SpareGetChild postData={{ status: "2" }}></SpareGetChild>
              }
            </TabPane>
            <TabPane tab="撤回" key="4">
              {
                this.state.key == "4" && <SpareGetChild postData={{ status: "3" }}></SpareGetChild>
              }
            </TabPane>
          </Tabs>


        </PageHeader>

      </div>
    )
  }


}

export default SpareGet



