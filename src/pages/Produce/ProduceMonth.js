import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import Child from './MonthProduceChild/Child';
import Childs from './MonthProduceChild/Childs';
import Abload from '@/components/Abload';


const { TabPane } = Tabs;


@connect(({ produce, publicmodel, loading }) => ({
  produce,
  publicmodel,
}))
class ProduceMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "1",
      show: false,
    }
  }

  resetData(){
      this.child&&this.child.resetData()
  }

  render() {

    let { show, key } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }


    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <PageHeader title={<span style={{ paddingLeft: 14 }}>月订单计划</span>} style={{ margin: 0 }}>
          <Tabs defaultActiveKey="1" onChange={callback} style={{ marginTop: -12 }} tabBarExtraContent={key == "2" ? <Abload reload={() => {
            this.resetData()
          }} postName="uploadproductMonthPlanDetail" filePath="http://www.plszems.com/download/月订单计划导入模板.xlsx"></Abload> : <></>}>
            <TabPane tab="公司计划" key="1">
              {
                this.state.key == "1" && <Child postData={{ status: "1" }}></Child>
              }
            </TabPane>
            <TabPane tab="组织计划" key="2">
              {
                this.state.key == "2" && <Childs postData={{ status: "2" }} onRef={(ref)=>{ this.child = ref}}></Childs>

              }
            </TabPane>
          </Tabs>


        </PageHeader>

      </div>
    )
  }


}

export default ProduceMonth



