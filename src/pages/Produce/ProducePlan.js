import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import Child from './PlanProduceChild/Child'
import Childs from './PlanProduceChild/Childs'
import Childc from './PlanProduceChild/Childc'

const { TabPane } = Tabs;


@connect(({ produce, publicmodel, loading }) => ({
  produce,
  publicmodel,
}))
class ProducePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "1",
      show: false,
    }
  }



  render() {

    let { show, key } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }

    let renderOutput = () => {
      if (this.state.key == "1") {
        return <a onClick={()=>{
          this.child.outputCur()
        }}>导出订单计划报表</a>

      } else if (this.state.key == "2") {
        return <a onClick={()=>{
          this.childs.outputCur()
        }}>导出生产计划报表</a>

      } else {
        return <a onClick={()=>{
          this.childc.outputCur()
        }}>导出生产日报表</a>

      }

    }


    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <PageHeader title={<span style={{ paddingLeft: 14 }}>生产报表</span>} style={{ margin: 0 }}>
          <Tabs defaultActiveKey="1" onChange={callback} style={{ marginTop: -12 }} tabBarExtraContent={renderOutput()}>
            <TabPane tab="订单计划报表" key="1">
              {
                this.state.key == "1" && <Child onRef={(ref)=>{ this.child = ref}} postData={{ status: "1" }}></Child>
              }
            </TabPane>
            <TabPane tab="生产计划报表" key="2">
              {
                this.state.key == "2" && <Childs onRef={(ref)=>{ this.childs = ref}} postData={{ status: "2" }}></Childs>
              }
            </TabPane>
            <TabPane tab="生产日报表" key="3">
              {
                this.state.key == "3" && <Childc onRef={(ref)=>{ this.childc = ref}} postData={{ status: "3" }}></Childc>
              }
            </TabPane>

          </Tabs>


        </PageHeader>

      </div>
    )
  }


}

export default ProducePlan



