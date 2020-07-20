/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Row, Col, Card, Tooltip, Button, Menu, Empty, message, Input, Pagination, Tag, Table, Divider, Badge, Statistic, Drawer, Dropdown, Collapse, Checkbox, PageHeader, DatePicker, Select, Tabs, Modal, Popconfirm } from 'antd';
import { connect } from 'dva';
import { ChartCard, WaterWave, Pie } from '@/components/Charts';
import moment from 'moment';
import AbEditor from '@/components/AbEditor'
import UserCheck from './UserCheck'
import router from 'umi/router';
import AbReply from '@/components/AbReply';

//import { subscribeToTimer } from '@/utils/subscribeToTimer';
const { Panel } = Collapse;
const { TabPane } = Tabs;
let Search = Input.Search, Option = Select.Option;
const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};

function MergeArray(arr1, arr2) {
  var _arr = new Array();
  for (var i = 0; i < arr1.length; i++) {
    _arr.push(arr1[i]);
  }
  for (var i = 0; i < arr2.length; i++) {
    var flag = true;
    for (var j = 0; j < arr1.length; j++) {
      if (arr2[i] == arr1[j]) {
        flag = false;
        break;
      }
    }
    if (flag) {
      _arr.push(arr2[i]);
    }
  }
  return _arr;
}
@connect(({ home, publicmodel, loading }) => ({
  home,
  publicmodel,
  submitting: loading.effects['home/queryHome'],
}))
class Homepage extends Component {
  constructor(props) {
    super(props)
    this.t = null;
    this.columns = [
      {
        title: '任务执行状态',
        dataIndex: 'statusName',
        key: 'statusName',
      },
      {
        title: '执行人',
        dataIndex: 'executeUserName',
        key: 'executeUserName',
      },
      {
        title: '执行人公司',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '执行人部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
      {
        title: "验收人名",
        dataIndex: 'auditUserName',
        key: 'auditUserName',
      },
      {
        title: "验收时间",
        dataIndex: 'auditTime',
        key: 'auditTime',
      },
      {
        title: "验收结果",
        dataIndex: 'auditStatusName',
        key: 'auditStatusName',
      },
    ]

    this.state = {
      flag: "1",
      fv: false,
      key: "1",
      settitle: "",
      curitem: null,
      ifs: "",
      timestamp: 'no timestamp yet',
      iftypes: "all",
      iftype: "mine",
      postDate: {
        "pageIndex": 1,
        "pageSize": 9,
        "assignmentTitle": "",//任务标题
        "status": ''
      },
      postDate1: {
        "pageIndex": 1,
        "pageSize": 9,
        "assignmentTitle": "",//任务标题
        "status": ''
      },
      postUrl: "queryMyList",
      person: {
        cj: [],
        cs: [],
        css: [],
      },
      postDates: {
        "pageIndex": 1,
        "pageSize": 9,
        "announcementTitle": "",   //---------公告标题
        "publishUserName": ""      //---------发布人名
      },
      postDates1: {
        "pageIndex": 1,
        "pageSize": 9,
        "announcementTitle": "",   //---------公告标题
        "publishUserName": ""      //---------发布人名
      },
      postUrls: "GGqueryList",
      auditStatus: undefined,
      postData: {
        "pageIndex": 1,
        "pageSize": 8,
        "knowledgeBaseName": ""
      },
      postDatas: {
        "pageIndex": 1,
        "pageSize": 8,
        "knowledgeBaseName": ""
      },
      postDatac: {
        "pageIndex": 1,
        "pageSize": 8,
        "knowledgeBaseName": ""
      },
      postDataz: {
        "pageIndex": 1,
        "pageSize": 9,
        "knowledgeBaseName": ""
      },
      visible: false,
      postPubData: {
        equipmentKnowledgeBaseId: "",
        pageIndex: 1,
        pageSize: 9,
        equipmentId: ""
      },
      sendMission: {
        "assignmentTitle": "",//任务标题(必填)
        "assignmentContent": "",//任务内容(必填)
        "closeDate": "",//截至日期(必填)
        "executeUserIdList": [],//执行人id集合(必填)
        "remark": ""//备注(非必填)
      },
      sendGG: {
        "announcementTitle": "",        //--------公告标题(必填)
        "announcementContent": "",     //--------公告内容(必填)
      }
    }
    // subscribeToTimer((err, timestamp) => this.setState({
    //   timestamp
    // }));
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  setNewStates(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicmodel/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  resetData() {
    let { postData, postDatas,postDatac, postDataz, postDates, postUrls } = this.state;
    this.getFirstData("");
    this.setNewState("queryUrlList");//链接
    this.setNewState("queryTaskCount");//任务
    this.setNewState("querySystem", postData);
    this.setNewState("queryOther", postDatac);

    this.setNewState("queryKnowledge", postDatas);
    this.setNewState("queryRepair", postDataz);
    this.getSecondData("");
  }


  componentDidMount() {
    this.resetData();
    this.t = setInterval(() => {
      this.setState({
        timestamp: moment()
      })
    }, 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.t);
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.visible ?
      document.body.style.overflow = "hidden" :
      document.body.style.overflow = "auto"
  }



  searchVal(value, url, post, key) {
    this.setState({
      [post]: {
        ...this.state[post],
        [key]: value
      }
    }, () => {
      this.setNewState(url, this.state[post])
    })
  }

  //知识库点击事件
  renderRowClick(item, key) {
    if (key) {
      this.setState({
        curitem: item,
        name: "留言板",
        can: key,
      }, () => {
        this.setState({
          fv: true
        })
      })
    } else {
      this.setState({
        settitle: item.knowledgeBaseName,
        curitem: item,
        postPubData: {
          ...this.state.postPubData,
          equipmentKnowledgeBaseId: item.id,
          equipmentId: item.equipmentId
        },
      }, () => {
        this.setNewState("deviceknchildqueryList", this.state.postPubData, () => {
          this.setState({
            visible: true,
            ifs: "45",
          })
        })
      })
    }


  }
  //drawer close
  onClose = () => {
    let _it = this;
    if (this.state.ifs == "1" || this.state.ifs == "11" || this.state.ifs == "2") {
      Modal.confirm({
        title: "是否取消编辑",
        content: "取消编辑后无法保存已填写的内容",
        onOk: () => {
          _it.setState({
            visible: false,
          }, () => {
            _it.resetData()
          });
        },
        okText: "是",
        cancelText: "否"
      })
    } else {
      _it.setState({
        visible: false,
      }, () => {
        _it.resetData()
      });
    }
  };

  //1格的查询方法
  getFirstData(key) {
    let { postUrl, postDate, postDate1, iftype } = this.state;
    if (iftype == "mine") {
      let postes = key ? { ...postDate, status: key } : { ...postDate }
      this.setNewState(postUrl, postes)
    } else if (iftype == "public") {
      //maybe change
      let postes = key ? { ...postDate1, status: key } : { ...postDate1 }
      this.setNewState(postUrl, postes)
    }
  }


  getSecondData() {
    let { postUrls, postDates, postDates1, iftypes } = this.state;
    if (iftypes == "all") {
      this.setNewState(postUrls, postDates)
    } else if (iftypes == "my") {
      //maybe change
      this.setNewState(postUrls, postDates1)
    }
  }

  onRefer = (ref) => {
    this.edtorchild = ref;
  }
  onRef = (ref) => {
    this.child = ref;
  }
  onRefs = (ref) => {
    this.childs = ref;
  }
  onRefc = (ref) => {
    this.childc = ref;
  }

  setNewValue = (val) => {
    if (this.state.key == "1") {
      this.setState({
        person: {
          ...this.state.person,
          cj: val
        },
      }, () => { console.log(this.state.person) })
    } else if (this.state.key == "2") {
      this.setState({
        person: {
          ...this.state.person,
          cs: val
        },
      }, () => { console.log(this.state.person) })
    } else {
      this.setState({
        person: {
          ...this.state.person,
          css: val
        },
      }, () => { console.log(this.state.person) })
    }
  }

  render() {
    let { queryUrlList, queryTaskCount, querySystem,queryOther, queryKnowledge, queryRepair, deviceknchildqueryList, queryMyList, GGqueryList, fqueryDetaila, fqueryDetailb } = this.props.home, { ifs, settitle, curitem, sendMission, sendGG, iftype, auditStatus, person, key } = this.state;
    let col = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 6, xxl: 4,
    }, cols = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 9, xxl: 10,
    }, colc = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12,
    }

    function showTotal(total) {
      return `共 ${total} 条`;
    }


    //搜索框封装
    let searchBox = (url, post, key) => {
      return <Search key={url} placeholder="搜索..." allowClear onSearch={(value) => this.searchVal(value, url, post, key)}></Search>
    }
    //时间格式化
    let getTime = (time) => {
      let a = moment(), b = moment(time), c = a.diff(b); // 86400000
      return c > 60 * 60 * 1000 ? time : moment(time).fromNow();
    }, getIfs = (time) => {
      let a = moment(), b = moment(time), c = a.diff(b); // 86400000
      return c > 60 * 60 * 1000
    }

    //工作任务list

    let renderMission = (item, i) => {
      return <div key={i}>
        <Row onClick={() => {
          let pour = iftype == "mine" ? "fqueryDetaila" : iftype == "public" ? "fqueryDetailb" : null,
            postl = iftype == "mine" ? { id: item.id } : iftype == "public" ? {
              id: item.id, "pageIndex": 1,
              "pageSize": 9,
            } : null;
          this.setState({
            ifs: iftype == "mine" ? "1a" : iftype == "public" ? "1b" : null,
            settitle: "任务详情",
            curitem: item
          }, () => {
            this.setNewState(pour, postl, () => {
              this.setState({
                visible: true,
                auditStatus: iftype == "mine" ? this.props.home.fqueryDetaila.myWork.auditStatus ? this.props.home.fqueryDetaila.myWork.auditStatus.toString() : "" : ""
              })
            })
          })
        }} className={getIfs(item.createTime) ? styles.rows : styles.redrows} style={{ display: "flex", alignItems: "center", padding: "8px 4px 8px 4px", marginTop: -1 }}>
          <span>{item.statusName}</span>
          <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
          <span style={{ color: item.assignmentType == "1" ? "#f50" : "green" }}>{item.assignmentTypeName}</span>
          <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
          <Tooltip placement="bottomLeft" title={item.assignmentTitle}>
            <span className={styles.oneline}>
              {item.assignmentTitle}
            </span>
          </Tooltip>
          <span title={item.createTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.createTime)}</span>
          {
            item.status == 0 && this.state.iftype == "public" ?
              <div onClick={(e) => {
                e.stopPropagation()
              }}>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottom"
                  title={"确认删除该任务？"}
                  onConfirm={() => {
                    this.setNewState("missiondeleteById", { id: item.id }, () => {
                      message.success("删除成功！");
                      this.getFirstData();
                    })
                  }}>
                  <Icon style={{ color: "#ff4800", paddingLeft: 12 }} type="close"></Icon>
                </Popconfirm>
              </div>
              :
              null
          }

        </Row>
        <Divider dashed style={{ margin: 0 }}></Divider>
      </div>
    }

    //通知公告list
    let renderNotice = (item, i) => {
      return <div key={i}>
        <Row onClick={() => {
          this.setState({
            settitle: "公告详情",
            curitem: item,
            ifs: "2re"
          }, () => {
            this.setState({
              visible: true,
            })
          })
        }} className={getIfs(item.publishTime) ? styles.rows : styles.redrows} style={{ display: "flex", alignItems: "center", padding: "8px 4px 8px 4px", marginTop: -1 }} >
          <Icon type="bell" />
          <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
          <Tooltip placement="bottomLeft" title={item.announcementTitle}>
            <span className={styles.oneline}>
              {item.announcementTitle}
            </span>
          </Tooltip>
          <span title={item.publishTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.publishTime)}</span>
        </Row>
        <Divider dashed style={{ margin: 0 }}></Divider>
      </div>
    }

    let renderFile = (item, i) => {
      return (<div key={i}>
        <Row onClick={() => {
          this.renderRowClick(item)
        }} key={i} className={getIfs(item.createTime) ? styles.rows : styles.redrows} style={{ padding: "8px 4px 8px 4px", marginTop: -1 }}>
          <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "transparent" }}>
            <span style={{ fontSize: 15 }} className={styles.oneline}>{item.knowledgeBaseName}</span>
            <span>{item.uploadUserName}</span>
          </Col>
          <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tooltip placement="bottomLeft" title={item.knowledgeBaseDescribe}>
              <span className={styles.oneline}>
                {item.knowledgeBaseDescribe ? item.knowledgeBaseDescribe : "暂无描述"}
              </span>
            </Tooltip>
            <span title={item.createTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.createTime)}</span>
          </Col>
        </Row>
        <Divider dashed style={{ margin: 0 }}></Divider>
      </div>)
    }

    let renderKnowledge = (item, i) => {
      return (<div key={i}>
        <Row key={i} onClick={() => {
          this.renderRowClick(item, "1")
        }} className={getIfs(item.createTime) ? styles.rows : styles.redrows} style={{ padding: "8px 4px 8px 4px", marginTop: -1 }}>
          <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15 }} className={styles.oneline}>{item.knowledgeBaseName}</span>
            <span>{item.uploadUserName}</span>
          </Col>
          <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tooltip placement="bottomLeft" title={item.knowledgeBaseDescribe}>
              <span className={styles.oneline}>
                {item.knowledgeBaseDescribe ? item.knowledgeBaseDescribe : "暂无描述"}
              </span>
            </Tooltip>
            <span title={item.createTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.createTime)}</span>
          </Col>
        </Row>
        <Divider dashed style={{ margin: 0 }}></Divider>
      </div>)
    }

    let pageconfig = (url, post, mainurl) => {
      return {
        showTotal: total => `共${total}条`, // 分页
        size: "small",
        pageSize: this.state[post].pageSize,
        showQuickJumper: true,
        current: this.props.home[url].pageNum ? this.props.home[url].pageNum : 1,
        total: this.props.home[url].total ? parseInt(this.props.home[url].total) : 0,
        onChange: (page) => pageChange(page, mainurl ? mainurl : url, post),
      }
    }

    let pageChange = (page, url, post) => {
      this.setState({
        [post]: { ...this.state[post], pageIndex: page }
      }, () => {
        this.setNewState(url, this.state[post]);
      })
    }
    //任务筛选下拉菜单
    const menu = (
      <Menu>
        <Menu.Item onClick={() => this.getFirstData("")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 全部 </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getFirstData("0")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 未完成 </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getFirstData("1")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 已完成 </div>
        </Menu.Item>
      </Menu>
    );

    const columnes = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
        
      },
      {
        title: '文件名(标题)',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
        render: (text, record) => {
          return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : { text })
        }
      },
      {
        title: '用途',
        dataIndex: 'purposeTypeName',
        key: 'purposeTypeName',
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
        
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '版本',
        dataIndex: 'knowledgeBaseVersion',
        key: 'knowledgeBaseVersion',
      },
      {
        title: '上传者',
        dataIndex: 'updateUserName',
        key: 'updateUserName',
      },


    ]



    let pageChanges = (page) => {
      this.setNewState("fqueryDetailb", { id: this.state.curitem.id, pageIndex: page, pageSize: 9 });
    }

    let callback = (key) => {
      this.setState({ key })
    }


    return (
      <div className={styles.Homepage}>
        <Drawer
          closable={true}
          destroyOnClose
          title={settitle ? settitle : "详情"}
          placement="right"
          width={"96%"}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {
            ifs == "45" ?
              <div>
                <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }} columns={columnes} dataSource={deviceknchildqueryList ? deviceknchildqueryList.list : []}
                  pagination={pageconfig("deviceknchildqueryList", "postPubData")}
                />
              </div>
              :
              ifs == "1" ?
                <div>
                  <PageHeader
                    ghost={false}
                    title={key == "1" ? <span style={{ color: "red" }}>* 选择任务承接人</span> : <a>选择抄送人</a>}
                  >
                    <Tabs defaultActiveKey="1" onChange={callback} tabBarExtraContent={<a onClick={() => {
                      if (key == "1") {
                        this.setState({
                          person: {
                            ...person,
                            cj: []
                          }
                        })
                        this.child.resetEmpty()
                      } else {
                        this.setState({
                          person: {
                            ...person,
                            cs: []
                          }
                        })
                        this.childs.resetEmpty()
                      }
                    }}>
                      清空
                      </a>}>
                      <TabPane tab={<a style={{ color: "red" }}>* 选择任务承接人</a>} key="1">
                        <UserCheck onRef={this.onRef} setNewValue={this.setNewValue} checkedValue={this.state.person.cj} title={key == "1" ? "选择任务承接人" : "选择抄送人"}></UserCheck>
                      </TabPane>
                      <TabPane tab="选择抄送人" key="2">
                        <UserCheck onRef={this.onRefs} key={"b"} setNewValue={this.setNewValue} checkedValue={this.state.person.cs} title={key == "1" ? "选择任务承接人" : "选择抄送人"}></UserCheck>
                      </TabPane>
                    </Tabs>
                  </PageHeader>
                  <PageHeader
                    ghost={false}
                    title={<span style={{ color: "red" }}>* 任务标题</span>}
                    subTitle="64字以内"
                  >
                    <Input value={sendMission.assignmentTitle} onChange={(e) => {
                      this.setState({
                        sendMission: { ...sendMission, assignmentTitle: e.target.value }
                      })
                    }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                  </PageHeader>
                  <PageHeader
                    ghost={false}
                    title={<span style={{ color: "red" }}>* 任务内容</span>}
                    subTitle='富文本编辑'
                  >
                    <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                      <AbEditor onRefer={this.onRefer} defaultValue={sendMission.assignmentContent} ></AbEditor>
                    </div>
                  </PageHeader>
                  <PageHeader
                    ghost={false}
                    title={<span style={{ color: "red" }}>* 截至日期</span>}
                    subTitle='任务截止日期'
                  >
                    <DatePicker disabledDate={(current) => {
                      return current && current < moment().add('day', -1);
                    }} value={sendMission.closeDate ? moment(sendMission.closeDate) : undefined} onChange={(value) => {
                      this.setState({
                        sendMission: { ...sendMission, closeDate: moment(value).format("YYYY-MM-DD") }
                      })
                    }} style={{ width: "100%" }} size='large'></DatePicker>
                  </PageHeader>
                  <PageHeader
                    ghost={false}
                    title="备注"
                    subTitle='该任务的注意事项'
                  >
                    <Input.TextArea value={sendMission.remark} onChange={(e) => {
                      this.setState({
                        sendMission: { ...sendMission, remark: e.target.value }
                      })
                    }} rows={6} style={{ width: "100%" }} size='large' placeholder="备注" />
                  </PageHeader>
                  <PageHeader>
                    <Button type='primary' onClick={() => {
                      let iko = 0, sendMission = this.state.sendMission;
                      sendMission.assignmentContent = this.edtorchild.submitContent()
                      sendMission.executeUserIdList = this.state.person.cj;
                      sendMission.sendUserIdList = this.state.person.cs;
                      for (let key in sendMission) {
                        if (key != "remark") {
                          if (!sendMission[key]) {
                            iko = 1;
                          }
                        }
                      }

                      if (iko == 1) {
                        message.error("除备注外都是必填项！");
                        return
                      }

                      this.setNewState("missionsave", { ...sendMission, assignmentType: "1" }, () => {
                        message.success("发布成功");
                        this.getFirstData()
                        this.setState({
                          visible: false,
                          sendMission: {
                            "assignmentTitle": "",//任务标题(必填)
                            "assignmentContent": "",//任务内容(必填)
                            "closeDate": "",//截至日期(必填)
                            "executeUserIdList": [],//执行人id集合(必填)
                            "sendUserIdList": [],
                            "remark": ""//备注(非必填)
                          },
                          person: {
                            cs: [],
                            cj: [],
                            css: []
                          },
                        })
                      })
                    }} style={{ width: "100%", marginTop: 8 }} size='large'>
                      提交
                  </Button>
                  </PageHeader>
                </div>
                :
                ifs == "11" ?
                  <div>
                    <PageHeader
                      ghost={false}
                      title={key == "1" ? <span style={{ color: "red" }}>* 选择任务承接人</span> : <a>选择抄送人</a>}
                      extra={<a onClick={() => {
                        this.setState({
                          person: {
                            ...person,
                            css: []
                          }
                        })
                        this.childc.resetEmpty()
                      }}>
                        清空
                        </a>}
                    >
                      <UserCheck onRef={this.onRefc} key={"c"} setNewValue={this.setNewValue} checkedValue={this.state.person.css} title={"选择抄送人"}></UserCheck>
                    </PageHeader>
                    <PageHeader
                      ghost={false}
                      title={<span style={{ color: "red" }}>* 任务标题</span>}
                      subTitle="64字以内"
                    >
                      <Input value={sendMission.assignmentTitle} onChange={(e) => {
                        this.setState({
                          sendMission: { ...sendMission, assignmentTitle: e.target.value }
                        })
                      }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                    </PageHeader>
                    <PageHeader
                      ghost={false}
                      title={<span style={{ color: "red" }}>* 任务内容</span>}
                      subTitle='富文本编辑'
                    >
                      <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                        <AbEditor onRefer={this.onRefer} defaultValue={sendMission.assignmentContent} ></AbEditor>
                      </div>
                    </PageHeader>
                    <PageHeader
                      ghost={false}
                      title="备注"
                      subTitle='该任务的注意事项'
                    >
                      <Input.TextArea value={sendMission.remark} onChange={(e) => {
                        this.setState({
                          sendMission: { ...sendMission, remark: e.target.value }
                        })
                      }} rows={6} style={{ width: "100%" }} size='large' placeholder="备注" />
                    </PageHeader>
                    <PageHeader>
                      <Button type='primary' onClick={() => {
                        let iko = 0, sendMission = this.state.sendMission;
                        sendMission.assignmentContent = this.edtorchild.submitContent()
                        sendMission.sendUserIdList = this.state.person.css;
                        delete sendMission.closeDate;
                        delete sendMission.executeUserIdList;
                        for (let key in sendMission) {
                          if (key != "remark") {
                            if (!sendMission[key]) {
                              iko = 1;
                            }
                          }
                        }

                        if (iko == 1) {
                          message.error("除备注外都是必填项！");
                          return
                        }

                        this.setNewState("missionsave", { ...sendMission, assignmentType: "2" }, () => {
                          message.success("发布成功");
                          this.getFirstData()
                          this.setState({
                            visible: false,
                            sendMission: {
                              "assignmentTitle": "",//任务标题(必填)
                              "assignmentContent": "",//任务内容(必填)
                              "closeDate": "",//截至日期(必填)
                              "executeUserIdList": [],//执行人id集合(必填)
                              "sendUserIdList": [],
                              "remark": ""//备注(非必填)
                            },
                            person: {
                              cs: [],
                              cj: [],
                              css: []
                            },
                          })
                        })
                      }} style={{ width: "100%", marginTop: 8 }} size='large'>
                        提交
                    </Button>
                    </PageHeader>
                  </div>
                  :
                  ifs == "2" ?
                    <div>
                      <PageHeader
                        ghost={false}
                        title={<span style={{ color: "red" }}>* 通知公告标题</span>}
                        subTitle="64字以内"
                      >
                        <Input value={sendGG.announcementTitle} onChange={(e) => {
                          this.setState({
                            sendGG: { ...sendGG, announcementTitle: e.target.value }
                          })
                        }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                      </PageHeader>
                      <PageHeader
                        ghost={false}
                        title={<span style={{ color: "red" }}>* 通知公告内容</span>}
                        subTitle='富文本编辑'
                      >
                        <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                          <AbEditor onRefer={this.onRefer} defaultValue={sendGG.announcementContent} ></AbEditor>
                        </div>
                      </PageHeader>
                      <PageHeader>
                        <Button type='primary' onClick={() => {
                          let iko = 0, sendGG = this.state.sendGG;
                          sendGG.announcementContent = this.edtorchild.submitContent();
                          for (let key in sendGG) {
                            if (!sendGG[key]) {
                              iko = 1;
                            }
                          }
                          if (iko == 1) {
                            message.error("标题/内容为必填项！");
                            return
                          }
                          this.setNewState("GGsave", sendGG, () => {
                            this.setState({
                              visible: false,
                              sendGG: {
                                announcementContent: '',
                                assignmentTitle: ''
                              },
                            }, () => {
                              this.resetData()
                            })
                          })
                        }} style={{ width: "100%", marginTop: 8 }} size='large'>
                          提交
                  </Button>
                      </PageHeader>

                    </div>
                    :
                    ifs == "2re" ?
                      <div>
                        <PageHeader
                          title={curitem.announcementTitle}
                          subTitle={"发布者：" + curitem.publishUserName + " | " + curitem.publishTime}
                        >
                          <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? curitem.announcementContent : null }}>
                          </div>
                        </PageHeader>
                      </div> :
                      ifs == "1a" ?
                        <div>
                          <PageHeader
                            title={fqueryDetaila.publish.assignmentTitle}
                            subTitle={`发布者：${fqueryDetaila.publish.publishUserName} | 发布时间：${fqueryDetaila.publish.publishTime} | 截止时间：${fqueryDetaila.publish.closeDate ? fqueryDetaila.publish.closeDate : ""} | 任务状态:${fqueryDetaila.myWork.statusName}`}
                          >
                            <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: fqueryDetaila.publish ? fqueryDetaila.publish.assignmentContent : null }}>
                            </div>
                            <p style={{ marginTop: 20, display: fqueryDetaila.publish.remark ? "block" : "none", color: "#999" }}>备注：{fqueryDetaila.publish.remark}</p>
                            <p style={{ marginTop: 20, color: "#999" }}>类型：{fqueryDetaila.publish.assignmentTypeName}</p>

                          </PageHeader>
                          {
                            fqueryDetaila.myWork.assignmentUserType == "1" ?
                              <div>
                                <PageHeader
                                  title={"执行内容"}
                                  subTitle={"填写任务执行内容"}
                                  extra={[<Button onClick={() => {
                                    if (!this.edtorchild.submitContent()) {
                                      message.error("请填写任务执行内容");
                                      return
                                    }
                                    this.setNewState("missionsubmit", {
                                      "id": fqueryDetaila.myWork.id,
                                      "executeContent": this.edtorchild.submitContent(),//执行内容(必填)
                                    }, () => {
                                      this.setNewState("fqueryDetaila", { id: fqueryDetaila.myWork.id }, () => {
                                        message.success("提交成功")
                                      })
                                    })
                                  }} disabled={fqueryDetaila.myWork.status != "1" && fqueryDetaila.myWork.status != "3"} type="primary">提交</Button>]}
                                >
                                  <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                                    <AbEditor onRefer={this.onRefer} defaultValue={fqueryDetaila.myWork.executeContent} ></AbEditor>
                                  </div>

                                </PageHeader>
                                <PageHeader
                                  title={"验收任务"}
                                  subTitle={"选择验收结果"}
                                  extra={[<Button onClick={() => {
                                    if (!this.state.auditStatus) {
                                      message.error("请选择验收结果");
                                      return
                                    }
                                    this.setNewState("missionaudit", {
                                      "id": fqueryDetaila.myWork.id,
                                      "auditStatus": this.state.auditStatus,//执行内容(必填)
                                    }, () => {
                                      this.setNewState("fqueryDetaila", { id: fqueryDetaila.myWork.id }, () => {
                                        message.success("验收成功")
                                      })
                                    })
                                  }} disabled={fqueryDetaila.myWork.status != "2"} type="primary">验收任务</Button>]}
                                >
                                  {
                                    <div>
                                      <Select value={auditStatus} style={{ width: "100%" }} placeholder="验收该任务是否通过" onChange={(val) => {
                                        this.setState({
                                          auditStatus: val
                                        })
                                      }}>
                                        <Option value="1">通过</Option>
                                        <Option value="2">不通过</Option>
                                      </Select>
                                      <p style={{ marginTop: 12 }}>验收人 ：{fqueryDetaila.myWork.auditUserName}</p>
                                      <p style={{ marginTop: 12 }}>验收时间 ：{fqueryDetaila.myWork.auditTime}</p>
                                    </div>
                                  }
                                </PageHeader>

                              </div>
                              : null
                          }

                        </div> :
                        ifs == "1b" ?
                          <div>
                            <PageHeader
                              title={curitem.assignmentTitle}
                              subTitle={`发布者：${curitem.publishUserName} | 发布时间：${curitem.publishTime} | 截止时间：${curitem.closeDate ? curitem.closeDate : ""} `}
                            >
                              <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? curitem.assignmentContent : null }}>
                              </div>
                              <p style={{ marginTop: 20, display: curitem.remark ? "block" : "none", color: "#999" }}>备注：{curitem.remark}</p>
                              <p style={{ marginTop: 20, color: "#999" }}>类型：{curitem.assignmentTypeName}</p>
                            </PageHeader>
                            <PageHeader
                              title="任务执行情况"
                              subTitle="分配给个人的任务执行情况"
                            >
                              <Table bordered size="middle"
                                expandedRowRender={record => <div>
                                  <p>任务执行内容：</p>
                                  <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? record.executeContent : null }}></div>
                                </div>
                                }
                                scroll={{ x: 1200, y: "59vh" }}
                                loading={this.props.submitting}
                                pagination={{
                                  showTotal: total => `共${total}条`, // 分页
                                  size: "small",
                                  pageSize: 9,
                                  showQuickJumper: true,
                                  current: fqueryDetailb.pageNum ? fqueryDetailb.pageNum : 1,
                                  total: fqueryDetailb.total ? parseInt(fqueryDetailb.total) : 0,
                                  onChange: pageChanges,
                                }}
                                rowKey='id'
                                columns={this.columns}
                                dataSource={fqueryDetailb.list ? fqueryDetailb.list : []}
                              >
                              </Table>
                            </PageHeader>
                          </div>
                          :
                          null
          }
        </Drawer>
        <Row gutter={12}>
          <Col {...cols} style={{ marginBottom: 12 }}>
            <Card hoverable title={<a style={{ padding: "4px 0px", display: "block" }}>工作任务</a>} extra={
              <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <a onClick={() => {
                    this.setState({
                      iftype: "mine",
                      postUrl: "queryMyList",
                    }, () => {
                      this.getFirstData("")
                    })
                  }} className={this.state.iftype == "mine" ? styles.current : ""} style={{ width: "60px", display: "block", textAlign: "center" }}>我的</a>
                </Dropdown>
                <Dropdown overlay={menu} trigger={['click']}>
                  <a onClick={() => {
                    this.setState({
                      iftype: "public",
                      postUrl: "fbqueryMyList"
                    }, () => {
                      this.getFirstData("")
                    })
                  }} className={this.state.iftype == "public" ? styles.current : ""}
                    style={{ margin: "0px 4px", width: "88px", display: "block", textAlign: "center" }}
                    icon="file-done">已发布</a>
                </Dropdown>
                {searchBox(this.state.postUrl, this.state.iftype == "public" ? "postDate1" : "postDate", "assignmentTitle")}
              </div>
            }
              actions={[
                <Button size="small" onClick={() => {
                  this.setState({
                    visible: true,
                    settitle: "发布任务工作",
                    ifs: "1",
                    key: "1",
                    sendMission: {
                      "assignmentTitle": "",//任务标题(必填)
                      "assignmentContent": "",//任务内容(必填)
                      "closeDate": "",//截至日期(必填)
                      "executeUserIdList": [],//执行人id集合(必填)
                      "sendUserIdList": [],
                      "remark": ""//备注(非必填)
                    },
                  })
                }} style={{ width: "100%", border: "none", backgroundColor: "transparent", boxShadow: "none" }} icon='edit'>发布任务</Button>,
                <Button size="small" onClick={() => {
                  this.setState({
                    visible: true,
                    settitle: "发布私信工作",
                    ifs: "11",
                    key: "-1",
                    sendMission: {
                      "assignmentTitle": "",//任务标题(必填)
                      "assignmentContent": "",//任务内容(必填)
                      "closeDate": "",//截至日期(必填)
                      "executeUserIdList": [],//执行人id集合(必填)
                      "sendUserIdList": [],
                      "remark": ""//备注(非必填)
                    },
                  })
                }} style={{ width: "100%", border: "none", backgroundColor: "transparent", boxShadow: "none" }} icon='edit'>发布私信</Button>


              ]}>
              <div style={{ height: 376, position: "relative" }}>
                {
                  queryMyList.list && queryMyList.list.length != 0 ?
                    queryMyList.list.map((item, i) => {
                      return renderMission(item, i)
                    }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: -2, right: 0 }}>
                  <Pagination {...pageconfig("queryMyList", this.state.iftype == "public" ? "postDate1" : "postDate", this.state.postUrl)} />
                </div>
              </div>
            </Card>
          
          
          
          </Col>
          <Col {...cols} style={{ marginBottom: 12 }}>
            <Card hoverable title={<a style={{ padding: "4px 0px", display: "block" }}>通知公告</a>} extra={
              <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <a onClick={() => {
                  this.setState({
                    iftypes: "all",
                    postUrls: "GGqueryList"
                  }, () => {
                    this.getSecondData("")
                  })
                }} className={this.state.iftypes == "all" ? styles.current : ""} style={{ width: "60px", display: "block", textAlign: "center" }}>全部</a>
                <a onClick={() => {
                  this.setState({
                    iftypes: "my",
                    postUrls: "querySendReview"
                  }, () => {
                    this.getSecondData("")
                  })
                }} className={this.state.iftypes == "my" ? styles.current : ""} style={{ margin: "0px 4px", width: "60px", display: "block", textAlign: "center" }} icon="file-done">我的</a>
                {searchBox(this.state.postUrls, this.state.iftypes == "my" ? "postDates1" : "postDates", "announcementTitle")}
              </div>

            } actions={[
              <Button size="small" onClick={() => {
                this.setState({
                  visible: true,
                  settitle: "发布通知公告",
                  ifs: "2"
                })
              }} style={{ width: "100%", border: "none", backgroundColor: "transparent", boxShadow: "none" }} icon='edit'>发布</Button>]}>
              <div style={{ height: 376, position: "relative" }}>
                {
                  GGqueryList.list && GGqueryList.list.length != 0 ?
                    GGqueryList.list.map((item, i) => {
                      return renderNotice(item, i)
                    }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: -2, right: 0 }}>
                  <Pagination {...pageconfig("GGqueryList", this.state.iftypes == "my" ? "postDates1" : "postDates", this.state.postUrls)} />
                </div>
              </div>
            </Card>
          </Col>
          <Col {...col} style={{ marginBottom: 12 }}>
            <Card title={<a style={{ padding: "4px 0px", display: "block" }}>个人中心</a>}>
              <Row>
                <Col span={24} onClick={() => {
                  this.setNewStates("quanbu", { key: "1" }, () => {
                    queryTaskCount.auditing == "0" ? null :
                      router.push("/approval/quanbu")
                  })
                }} style={{ cursor: "pointer" }}>
                  <Statistic title={<a style={{ color: "#398dcd" }}>待审批</a>} value={queryTaskCount.auditing ? queryTaskCount.auditing : 0} prefix={<Icon type="audit" />} valueStyle={{ color: '#398dcd' }} />
                  <Divider dashed style={{ margin: "13px 0px" }}>
                  </Divider>
                </Col>

                <Col span={24} onClick={() => { queryTaskCount.tally == "0" ? null : router.push("/yxt/check/checkmession/checkmymession/1") }} style={{ cursor: "pointer" }}>
                  <Statistic title={<a style={{ color: "#ff5000" }}>待点检</a>} value={queryTaskCount.tally ? queryTaskCount.tally : 0} prefix={<Icon type="file-search" />} valueStyle={{ color: '#ff5000' }} />
                  <Divider dashed style={{ margin: "13px 0px" }}></Divider>

                </Col>
                <Col span={24} onClick={() => { queryTaskCount.maintenance == "0" ? null : router.push("/yxt/verb/verbmission/verbmymission/1") }} style={{ cursor: "pointer" }}>
                  <Statistic title={<a style={{ color: "green" }}>待保养</a>} value={queryTaskCount.maintenance ? queryTaskCount.maintenance : 0} prefix={<Icon type="file-protect" />} valueStyle={{ color: 'green' }} />
                  <Divider dashed style={{ margin: "13px 0px" }}></Divider>
                </Col>
                <Col span={24} onClick={() => { queryTaskCount.repair == "0" ? null : router.push("/yxt/repair/repairlist/repairmylist/1") }} style={{ cursor: "pointer" }}>
                  <Statistic title={<a style={{ color: "#ec407a" }}>待维修</a>} value={queryTaskCount.repair ? queryTaskCount.repair : 0} prefix={<Icon type="tool" />} valueStyle={{ color: '#ec407a' }} />
                  <Divider dashed style={{ margin: "13px 0px" }}></Divider>

                </Col>
                <Col span={24} style={{ paddingBottom: 0 }} onClick={() => {
                  this.setNewStates("quanbu", { key: "2" }, () => {
                    router.push("/approval/quanbu")
                  })
                }} style={{ cursor: "pointer" }}>
                  <p>已审批</p>
                  <p><Icon style={{ fontSize: 20 }} type='file-done'></Icon></p>
                </Col>

              </Row>





            </Card>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col {...cols} style={{ marginBottom: 12 }}>
            <Card hoverable title={<a style={{ padding: "4px 0px", display: "block" }}>知识文件</a>} extra={this.state.flag == "1" ? searchBox("querySystem", "postData", "knowledgeBaseName") : this.state.flag == "2" ? searchBox("queryKnowledge", "postDatas", "knowledgeBaseName"):searchBox("queryOther", "postDatac", "knowledgeBaseName")}>
              <Tabs activeKey='1' activeKey={this.state.flag} onChange={(key) => {
                this.setState({
                  flag: key
                })
              }}>
                <TabPane tab={"制度文件"} key="1">
                  <div style={{ height: 512, position: "relative" }}>
                    {
                      querySystem.list && querySystem.list.length != 0 ?
                        querySystem.list.map((item, i) => {
                          return renderFile(item, i)
                        }) : <Empty style={{ paddingTop: 32 }}></Empty>
                    }
                    <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: 0, right: 0 }}>
                      <Pagination {...pageconfig("querySystem", "postData")} />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab={"知识园地"} key="2">
                  <div style={{ height: 512, position: "relative" }}>
                    {
                      queryKnowledge.list && queryKnowledge.list.length != 0 ?
                        queryKnowledge.list.map((item, i) => {
                          return renderFile(item, i)
                        }) : <Empty style={{ paddingTop: 32 }}></Empty>
                    }
                    <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: 0, right: 0 }}>
                      <Pagination {...pageconfig("queryKnowledge", "postDatas")} />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab={"其他"} key="3">
                  <div style={{ height: 512, position: "relative" }}>
                    {
                      queryOther.list && queryOther.list.length != 0 ?
                      queryOther.list.map((item, i) => {
                          return renderFile(item, i)
                        }) : <Empty style={{ paddingTop: 32 }}></Empty>
                    }
                    <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: 0, right: 0 }}>
                      <Pagination {...pageconfig("queryOther", "postDatac")} />
                    </div>
                  </div>
                </TabPane>


              </Tabs>



            </Card>
         
         
          </Col>
          <Col {...cols} style={{ marginBottom: 12 }}>
            <Card hoverable title={<a style={{ padding: "4px 0px", display: "block" }}>设备论坛</a>} extra={searchBox("queryRepair", "postDataz", "knowledgeBaseName")}>
              <div style={{ height: 572, position: "relative" }}>
                {
                  queryRepair.list && queryRepair.list.length != 0 ?
                    queryRepair.list.map((item, i) => {
                      return renderKnowledge(item, i)
                    }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: -2, right: 0 }}>
                  <Pagination {...pageconfig("queryRepair", "postDataz")} />
                </div>
              </div>

            </Card>
          </Col>
          <Col {...col} style={{ marginBottom: 12 }}>
            <Card title={<a style={{ padding: "4px 0px", display: "block" }}>链接</a>}>
              <Row style={{ height: 572, overflow: "auto", paddingTop: 11 }}>
                {
                  queryUrlList.map((item, i) => {
                    return <div key={i}>
                      <a target='_blank' href={item.dicDescription} className={styles.oneline} style={{ display: "block", width: "100%", color: "#333" }}><Icon type="link" /> {item.dicName} </a>
                      <Divider dashed style={{ margin: "13px 0px" }}></Divider>
                    </div>
                  })
                }

              </Row>
            </Card>
          </Col>
        </Row>
        <AbReply
          visible={this.state.fv}
          title={this.state.name ? this.state.name : ""}
          placement="right"
          width={"96%"}
          onClose={() => {
            this.setState({
              fv: false
            })
          }}
          curitem={this.state.curitem ? this.state.curitem : {}}
          destroyOnClose={true}
        >
          {
            this.state.can && <div className={styles.fatezr} style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p>
                  <span style={{ fontSize: 16 }}>
                    文件名(标题)
                  </span>
                  <Divider type='vertical' />
                  <a>
                    {curitem.knowledgeBaseName}
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <span style={{ fontSize: 16 }}>
                    设备型号
                  </span>
                  <Divider type='vertical' />
                  <a>
                    {curitem.equipmentModel}
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <span style={{ fontSize: 16 }}>
                    文件编号
                  </span>
                  <Divider type='vertical' />
                  <a>
                    {curitem.documentNo}
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <span style={{ fontSize: 16 }}>
                    描述
                  </span>
                  <Divider type='vertical' />
                  <a>
                    {curitem.knowledgeBaseDescribe}
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <span style={{ fontSize: 16 }}>
                    创建日期
                  </span>
                  <Divider type='vertical' />
                  <a>
                    {curitem.createTime}
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <span style={{ fontSize: 16 }}>
                    版本
                  </span>
                  <Divider type='vertical' />
                  <a>
                    {curitem.knowledgeBaseVersion}
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <span style={{ fontSize: 16 }}>
                    上传者
                  </span>
                  <Divider type='vertical' />
                  <a>
                    {curitem.updateUserName}
                  </a>
                </p>
              </div>
            </div>
          }
        </AbReply>
      </div>
    );
  }
}

export default Homepage;
