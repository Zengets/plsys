import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import WeiWaiChild from './WeiWaiChild/WeiWaiChild';
import Draw from './Drawer'
const { TabPane } = Tabs;


@connect(({ approval, menu, publicmodel, loading }) => ({
  approval,
  menu,
  publicmodel,
  submitting: loading.effects['approval/goqueryList'],
}))

class WeiWai extends React.Component {
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
      key:"1",
      show:false,
    }
  }



  render() {

    let { show,key } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }


    return (
      <div style={{ backgroundColor: "#fff", padding: 12}}>
         <Draw
          visible={show}
          title="委外维修审批流程图"
          imgurl="./images/all5.png"
          onClose={() => {
            this.setState({
              show: false
            })
          }}
        >
        </Draw>
        <PageHeader title={<span style={{paddingLeft:14}}>委外维修审批列表</span>} style={{margin: 0 }}>
          <Tabs defaultActiveKey="1" onChange={callback} style={{marginTop:-12}}>
            <TabPane tab="待审批" key="1">
              {
                this.state.key=="1"&&<WeiWaiChild postData={{status:"0"}}></WeiWaiChild>
              }
            </TabPane>
            <TabPane tab="已审批" key="2">
            {
                this.state.key=="2"&&<WeiWaiChild postData={{status:"2"}}></WeiWaiChild>
              }
            </TabPane>
            <TabPane tab="确认返回" key="3">
            {
                this.state.key=="3"&&<WeiWaiChild postData={{status:"3"}}></WeiWaiChild>
              }
            </TabPane>
          </Tabs>


        </PageHeader>

      </div>
    )
  }


}

export default WeiWai



