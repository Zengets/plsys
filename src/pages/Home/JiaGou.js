/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Card, Spin, Divider, Collapse, Checkbox, Input, message, Tag } from 'antd';
import { connect } from 'dva';

//import { subscribeToTimer } from '@/utils/subscribeToTimer';
const { Panel } = Collapse;
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
@connect(({ home, loading }) => ({
  home,
  submitting: loading.effects['home/queryMessage'],
}))
class JiaGou extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fate: false,
      opc: false,
      opb: false,
      opclist: [],
      opblist: [],
      companygroup: [{ userid: "", name: "" }],
      usergroup: [],
      allUser: [],
      searchval: undefined,
      checkedValue: [],
      allDatas: [],
      cursearch: [],
      selectKey: "",
      selectKeyArr: []
    }
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

  resetData() {
    this.setNewState("queryMessage", null, () => {
      let allData = this.props.home.queryMessage, companygroup = [], usergroup = [], allUser = [], allDatas = [],opblist=[];
      if (allData) {
        allData.map((parent, i) => {
          companygroup.push({
            name: parent.companyName,
            userid: parent.maps && parent.maps.map((item, i) => {
              return item.user.map((key) => {
                return key.id
              }).join(",")
            }).join(",").split(",").filter((item) => { return item != "" })
          })
          parent.maps &&
            parent.maps.map((item, j) => {
              if(item.departName=="组织负责人"||item.departName=="制造部负责人"){
                opblist.push(i.toString()+j.toString())
              }


              usergroup.push({
                name: parent.companyName + item.departName,
                ids: [],
                userid: item.user ? item.user.map((user) => { return user.id }) : [],
                userids: item.user ? item.user.map((user) => { return user.id }) : [],
              })
              item.user.map((key) => {
                allUser.push(key.id);
                allDatas.push({
                  id: key.id,
                  name: key.userName,
                  company: i.toString(),
                  group: i.toString() + j.toString()
                })
              })
            })
        })
        let arr = companygroup.map((item, i) => {
          return i.toString()
        })
        console.log(opblist)
        this.setState({
          selectKeyArr: allUser,
          companygroup,
          usergroup,
          allUser,
          allDatas,
          opc: false,
          opclist: [],
          opblist,
          fate: true
        })


      }



    });
  }

  componentDidMount() {
    this.resetData();
  }


  render() {
    let { queryMessage } = this.props.home,
      { checkedValue, companygroup, usergroup, allUser, fate, opb, opc, opclist, opblist, searchval, allDatas, cursearch, selectKey } = this.state;


    let getState = (arr) => {
      arr = arr.userid ? arr.userid : [];
      let keya = 0;
      if (checkedValue.length < arr.length) {
        return false
      } else {
        arr.map((item) => {
          if (checkedValue.indexOf(item) == -1) {
            keya = 1
          }
        })
        return keya == 0
      }
    }


    let getCompany = (name) => {
      if (companygroup.filter((item) => { return item.name == name })[0].userid) {
        return companygroup.filter((item) => { return item.name == name })[0].userid.length;
      } else {
        return null
      }
    }


    let genExtra = (user, key, name,shopList) => {
      return <div style={{ width:"100%",display:"flex",alignItems:"center",flexWrap:"wrap",padding:"0px 0px 12px 12px"}}>
        <a style={{ userSelect: "none", cursor: "pointer", padding: "0px 4px",color:selectKey == (key + "-1") ? "red" : "#999"  }} onClick={(e) => {
          e.stopPropagation();
          let selectKeyArrs = [],
            newgroup = usergroup.map((itemz, j) => {
              itemz.userids = itemz.userid
              return itemz
            })
          newgroup.map((itemc) => {
            itemc.userids.map((iol) => {
              selectKeyArrs.push(iol);
            })
          })
          if (opblist.indexOf(key) == -1) {
            opblist.push(key)
          }
          this.setState({
            opblist,
            selectKeyArr:selectKeyArrs,
            selectKey:key+"-1"
          })
        }}> 全部 </a>
         <a style={{ userSelect: "none", cursor: "pointer", padding: "0px 4px" ,color:selectKey == (key + "-2") ? "red" : "#999"}} onClick={(e) => {
          e.stopPropagation();
          let selectKeyArr = user.filter((itemz, j) => {
            return itemz.isDepartmentHead == 1
          }).map((ins) => { return ins.id }), selectKeyArrs = [];
          let newgroup = usergroup.map((itemz, j) => {
            if (itemz.name == name) {
              itemz.userids = selectKeyArr
            } else {
              itemz.userids = itemz.userid
            }
            return itemz
          })
          newgroup.map((itemc) => {
            itemc.userids.map((iol) => {
              selectKeyArrs.push(iol);
            })
          })
          if (opblist.indexOf(key) == -1) {
            opblist.push(key)
          }
          this.setState({
            opblist,
            selectKeyArr:selectKeyArrs,
            selectKey:key + "-2"
          })
        }}> 部门负责人 </a>
        {
          shopList.map((item, i) => (<a key={i} style={{ whiteSpace:"nowrap",userSelect: "none", cursor: "pointer", padding: "0px 4px", color: selectKey == (key + i) ? "red" : "#999" }} onClick={(e) => {
            e.stopPropagation();
            if (opblist.indexOf(key) == -1) {
              opblist.push(key)
            }
            let selectKeyArr = user.filter((itemz, j) => {
              return itemz.shopId == item.id
            }).map((ins) => { return ins.id }), selectKeyArrs = [];
            let newgroup = usergroup.map((itemz, j) => {
              if (itemz.name == name) {
                itemz.userids = selectKeyArr
              } else {
                itemz.userids = itemz.userid
              }
              return itemz
            })
            newgroup.map((itemc) => {
              itemc.userids.map((iol) => {
                selectKeyArrs.push(iol);
              })
            })

            this.setState({
              opblist,
              selectKeyArr: selectKeyArrs,
              selectKey: key + i
            })
          }}>{item.shopName}</a>))
        }
      </div>
    }

    return (
      <div>
        <Card title={<div style={{ display: 'flex', alignItems: "center" }}><a>组织架构</a> <Input.Search
          value={searchval} onChange={(e) => {
            this.setState({
              searchval: e.target.value
            })
          }} placeholder="输入姓名查找..." onSearch={(val) => {
            if (!val) {
              message.warn("请输入搜索内容");
              return
            }
            let searchPerson = allDatas.filter((item) => { return item.name.indexOf(val) != -1 }), all = [];
            if (searchPerson.length == 0) {
              this.setState({
                cursearch: [],
              })
              message.warn("没有查找到该人员...");
            } else {
              searchPerson.map((item) => {
                if (opclist.indexOf(item.company) == -1) {
                  opclist.push(item.company)
                }
                if (opblist.indexOf(item.group) == -1) {
                  opblist.push(item.group)
                }
                all.push({
                  id: item.id,
                  name: item.name
                })
              })
              this.setState({
                opclist,
                opblist,
                opc: opclist.length > 0,
                opb: opblist.length > 0,
                cursearch: all.map((inx) => { return inx.name }),
              })
            }

          }}

          style={{ flex: 1, maxWidth: 200, marginLeft: 12 }} /></div>} extra={
            <div>
              <a onClick={() => {
                this.setState({
                  opc: !opc
                }, () => {
                  if (this.state.opc) {
                    let arr = companygroup.map((item, i) => {
                      return i.toString()
                    })
                    this.setState({
                      opclist: arr
                    })
                  } else {
                    this.setState({
                      opclist: []
                    })
                  }
                })
              }}>
                {opc ? "收起" : "展开"}公司
                </a>
              <Divider type="vertical"></Divider>
              <a onClick={() => {
                this.setState({
                  opb: !opb
                }, () => {
                  let arr = [], arrs = [], arrc = [];
                  for (var i = 0; i < 100; i++) {
                    arrc.push(i.toString())
                  }
                  companygroup.map((item, i) => {
                    arr.push(i.toString())
                  })
                  arr.map((item) => {
                    arrc.map((items) => {
                      arrs.push(item + items)
                    })

                  })

                  if (this.state.opb) {
                    this.setState({
                      opblist: arrs,
                      opc: true,
                      opclist: arr
                    })
                  } else {
                    this.setState({
                      opblist: []
                    })
                  }
                })
              }}>
                {opb ? "收起" : "展开"}部门
                </a>

            </div>
          }>
          <Spin spinning={!fate} tip="数据加载中...">
            {
              fate ? <Collapse style={{ margin: -12 }} bordered={false} activeKey={opclist} onChange={(e) => {
                this.setState({
                  opclist: e
                })
              }}>
                {
                  queryMessage ?
                    queryMessage.map((parent, i) => (
                      <Panel header={<span>{parent.companyName}<a style={{ fontStyle: "italic", marginLeft: 12 }}>({getCompany(parent.companyName)})</a> 人</span>} key={i.toString()}>
                        <Collapse
                          onChange={(e) => {
                            this.setState({
                              opblist: e
                            })
                          }}
                          bordered={false}
                          activeKey={opblist}
                          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />

                          }
                        >
                          {
                            parent.maps ?
                              parent.maps.map((item, j) => (
                                <Panel
                                  header={<span>{item.departName}<a style={{ fontStyle: "italic", marginLeft: 12 }}>({item.user.length})</a> 人</span>}
                                  key={i.toString() + j.toString()}
                                  style={customPanelStyle}
                                >
                                  {item.show&&genExtra(item.user ? item.user : [], i.toString() + j.toString(), parent.companyName + item.departName,item.shopList)}
                                  <div style={{ overflow: "hidden", padding:"0px 0px 12px 12px" }}>
                                    {
                                      item.user.map((user, i) => (
                                        <div className={styles.hoverable} key={i}
                                          style={{
                                            color: cursearch.filter((ms) => {
                                              return ms.indexOf(user.userName) != -1
                                            }).length > 0 ? "green" 
                                            : 
                                            user.isOnline == 0?
                                            "red"
                                            :"#666",
                                            display: this.state.selectKeyArr.filter((ms) => {
                                              return ms.indexOf(user.id) != -1
                                            }).length > 0 ? "block" : "none",
                                            width: 120, float: "left", padding: "12px 0px", textAlign: "center"
                                          }}>
                                          {user.userName}
                                        </div>
                                      ))
                                    }
                                  </div>

                                </Panel>
                              )) : null
                          }
                        </Collapse>
                      </Panel>
                    )) : null

                }

              </Collapse>
                :
                <div style={{ minHeight: 400, width: "100%" }}>

                </div>
            }


          </Spin>
        </Card>


      </div>
    );
  }
}

export default JiaGou;
