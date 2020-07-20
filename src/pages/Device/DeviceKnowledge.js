import {
  Tabs, PageHeader
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import DeviceKnowledgeChild from './DeviceKnowledgeChild'
const { TabPane } = Tabs;


@connect(({ device, menu, publicmodel, loading }) => ({
  device,
  menu,
  publicmodel,
  submitting: loading.effects['device/deviceknqueryList'],
}))

class DeviceKnowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curitem: {},
      fv: false,
      key: "0",
      postData: {
        "pageIndex": 1,
        "pageSize": 10,
        "equipmentId": "",             //(int)设备id
        "equipmentModel": "",                  //(String)设备型号
        "equipmentName": "",                //(String)设备名称
        "knowledgeBaseDescribe": "",     //(String)描述
        "knowledgeBaseName": "",       //(String)文件名(标题)称
        "purposeType": "0",                   //(String)用途key
        "secondPurposeType": ""
      },
      postDatas: {
        equipmentKnowledgeBaseId: "",
        pageIndex: 1,
        pageSize: 10,
        equipmentId: ""
      },
      postUrl: "deviceknqueryList",
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/' + type,
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


  render() {

    let { key } = this.state, { purposeTypeList } = this.props.device;

    let callback = (key) => {
      this.setState({ key })
    }


    return (
      <div style={{ backgroundColor: "#fff", padding: 12 }}>
        <PageHeader title={<span style={{ paddingLeft: 14 }}>知识文件</span>} style={{ margin: 0 }}>
          <Tabs defaultActiveKey={"0"} onChange={callback} style={{ marginTop: -12 }}>
            {
              purposeTypeList?
              purposeTypeList.map((item,i)=>{
                return <TabPane tab={item.dicName} key={item.dicKey}>
                {
                  this.state.key == item.dicKey &&
                  <DeviceKnowledgeChild title={item.dicName} purposeType={item.dicKey}></DeviceKnowledgeChild>
                }
                </TabPane>
              }):null
            }
          </Tabs>
        </PageHeader>

      </div>
    )
  }


}

export default DeviceKnowledge



