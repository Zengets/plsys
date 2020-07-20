import {
  Tabs, PageHeader
} from 'antd';
import styles from './Homepage.less';
import StateDevice from './StateDevice';
import StateLine from './StateLine';

const { TabPane } = Tabs;
class State extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "1",
    }
  }



  render() {
    let { key } = this.state;

    let callback = (key) => {
      this.setState({ key })
    }


    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <PageHeader title={<span style={{ paddingLeft: 14 }}>设备 / 产线 状态统计</span>}>
          <Tabs defaultActiveKey="1" onChange={callback} style={{ marginTop: -12 }}>
            <TabPane tab="产线状态" key="1">
              <StateLine></StateLine>
            </TabPane>
            <TabPane tab="设备状态" key="2">
              <StateDevice></StateDevice>
            </TabPane>

          </Tabs>
        </PageHeader>
      </div>
    )
  }


}

export default State



