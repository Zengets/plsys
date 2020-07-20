import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import SpareBuyChild from './SpareBuyChild';
import Draw from './Drawer'
const { TabPane } = Tabs;


@connect(({ approval, menu, publicmodel, loading }) => ({
  approval,
  menu,
  publicmodel,
  submitting: loading.effects['approval/goqueryList'],
}))

class SpareBuy extends React.Component {
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
      key: "0",
      show: false,
    }
  }



  render() {

    let { show, key } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }


    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <Draw
          visible={show}
          title="配件购买审批流程图"
          imgurl="./images/all5.png"
          onClose={() => {
            this.setState({
              show: false
            })
          }}
        >
        </Draw>
        <PageHeader title={<span style={{ paddingLeft: 14 }}>配件购买审批列表</span>} style={{ margin: 0 }}>
          <Tabs defaultActiveKey="0" onChange={callback} style={{ marginTop: -12 }}>
            <TabPane tab="待审批" key="0">
              {
                this.state.key == "0" && <SpareBuyChild postData={{ status: this.state.key }}></SpareBuyChild>
              }
            </TabPane>
            <TabPane tab="审批通过" key="1">
              {
                this.state.key == "1" && <SpareBuyChild postData={{ status: this.state.key }}></SpareBuyChild>
              }
            </TabPane>
            <TabPane tab="审批未通过" key="2">
              {
                this.state.key == "2" && <SpareBuyChild postData={{ status: this.state.key }}></SpareBuyChild>
              }
            </TabPane>
            <TabPane tab="撤回" key="3">
              {
                this.state.key == "3" && <SpareBuyChild postData={{ status: "3" }}></SpareBuyChild>
              }
            </TabPane>
          </Tabs>


        </PageHeader>

      </div>
    )
  }


}

export default SpareBuy



