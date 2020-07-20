/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Spin, Input, Collapse, Checkbox, PageHeader, Card, message } from 'antd';
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
  submitting: loading.effects['home/queryHome'],
}))
class UserCheck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fate: false,
      companygroup: [{ userid: "", name: "" }],
      usergroup: [],
      allUser: [],
      allDatas: [],
      opclist: [],
      cursearch: [],
      opblist: [],
      checkedValue: props.checkedValue,
      searchval: undefined,
      post: {
        userName: ""
      },
      selectKey: "",
      selectKeyArr: []
    }
    this.props.onRef(this);
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

  componentWillReceiveProps(nextProps) {
    if (this.props.title !== nextProps.title || this.props.checkedValue !== nextProps.checkedValue) {
      this.setState({
        checkedValue: nextProps.checkedValue,
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.checkedValue !== nextState.checkedValue) {
      this.props.setNewValue(nextState.checkedValue);
    }
  }

  resetEmpty() {
    this.setState({
      cursearch: [],
      searchval: undefined
    })
  }


  resetData() {
    this.setNewState("queryMessage", this.state.post, () => {
      let allData = this.props.home.queryMessage, companygroup = [], usergroup = [], allUser = [], allDatas = [];
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
              usergroup.push({
                name: parent.companyName + item.departName,
                ids: [],
                userid: item.user ? item.user.map((user) => { return user.id }) : []
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

        this.setState({
          selectKeyArr: allUser,
          companygroup,
          usergroup,
          allUser,
          allDatas,
        }, () => {
          this.setState({
            fate: true
          })
        })
      }
    });
  }

  componentDidMount() {
    this.resetData();
  }





  checkAll(e) {
    let check = e.target.checked;
    if (check) {
      let usergroup = this.state.usergroup.map((em) => {
        em.ids = em.userid
        return em
      })
      this.setState({
        checkedValue: this.state.allUser,
        usergroup
      })
    }
    else {
      let usergroup = this.state.usergroup.map((em) => {
        em.ids = []
        return em
      })
      this.setState({
        checkedValue: [],
        usergroup
      })
    }
  }



  render() {
    let { queryMessage } = this.props.home,
      { checkedValue, companygroup, usergroup, allUser, allDatas, fate, post, opclist, opblist, cursearch, searchval, selectKey } = this.state;


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
    let genExtra = (user, key, name,shopList) => {
      return <div style={{ width: "100%", display: "flex", alignItems: "center", flexWrap: "wrap", padding: "0px 0px 12px 12px" }}>
        <a style={{ userSelect: "none", cursor: "pointer", padding: "0px 4px", color: selectKey == (key + "-1") ? "red" : "#999" }} onClick={(e) => {
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
            selectKeyArr: selectKeyArrs,
            selectKey: key + "-1"
          })
        }}> 全部 </a>
        <a style={{ userSelect: "none", cursor: "pointer", padding: "0px 4px", marginRight: 8, color: selectKey == (key + "-2") ? "red" : "#999" }} onClick={(e) => {
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
            selectKeyArr: selectKeyArrs,
            selectKey: key + "-2"
          })
        }}> 部门负责人 </a>
        {
          shopList.map((item, i) => (<a key={i} style={{ whiteSpace: "nowrap", userSelect: "none", cursor: "pointer", padding: "0px 4px", color: selectKey == (key + i) ? "red" : "#999" }} onClick={(e) => {
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
      <Spin spinning={!fate} tip="数据加载中...">
        {fate ?
          <Card
            title={<Input.Search value={searchval} onChange={(e) => {
              this.setState({
                searchval: e.target.value
              })
            }} style={{ maxWidth: 180 }} placeholder="输入姓名查找..." onSearch={(val) => {
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
                  cursearch: all.map((inx) => { return inx.name }),
                })
              }

            }}></Input.Search>}
            extra={[
              <Checkbox
                checked={checkedValue.length == allUser.length}
                onChange={(e) => {
                  this.checkAll(e)
                }}>全选</Checkbox>
            ]}
          >
            {
              checkedValue.map((item,i)=>{
                return <a style={{padding:"0 12px 8px 0px",whiteSpace:"nowrap"}} key={i}>{allDatas.filter((kia)=>{ return kia.id==item})[0].name}<Icon
                onClick={()=>{
                  this.setState({
                    checkedValue:checkedValue.filter((ioa)=>{return ioa!=item})
                  })
                }}
                type="close" style={{color:"red"}}/></a>
              })
            }
            <Collapse bordered={false} activeKey={opclist} onChange={(e) => {
              this.setState({
                opclist: e
              })
            }}>
              {
                queryMessage ?
                  queryMessage.map((parent, i) => (
                    <Panel key={i.toString()} header={parent.companyName} extra={
                      <div onClick={event => {
                        event.stopPropagation();
                      }}><Checkbox checked={getState(companygroup.filter((z) => { return z.name == parent.companyName })[0] ?
                        companygroup.filter((z) => { return z.name == parent.companyName })[0] : []
                      )} onChange={(e) => {
                        let check = e.target.checked;
                        let allData = companygroup.filter((z) => { return z.name == parent.companyName })[0].userid;
                        if (check) {
                          let usergroup = this.state.usergroup.map((em) => {
                            if (em.name.indexOf(parent.companyName) != -1) {
                              em.ids = em.userid
                            }
                            return em
                          })

                          this.setState({
                            checkedValue: MergeArray(allData, checkedValue),
                            usergroup
                          })
                        } else {
                          let usergroup = this.state.usergroup.map((em) => {
                            if (em.name.indexOf(parent.companyName) != -1) {
                              em.ids = []
                            }
                            return em
                          })
                          this.setState({
                            checkedValue: checkedValue.filter((lo) => { return allData.indexOf(lo) == -1 }),
                            usergroup
                          })
                        }
                      }}>全选</Checkbox>
                      </div>}>
                      <Collapse
                        bordered={false}
                        onChange={(e) => {
                          this.setState({
                            opblist: e
                          })
                        }}
                        activeKey={opblist}
                        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                      >
                        {
                          parent.maps ?
                            parent.maps.map((item, j) => (
                              <Panel header={`${item.departName}(${item.user.length})人`} key={i.toString() + j.toString()} style={customPanelStyle} extra={<div style={{ display: "flex", alignItems: "center" }} onClick={event => {
                                event.stopPropagation();
                              }}>
                                <Checkbox
                                  style={{ width: 60 }}
                                  checked={getState(this.state.usergroup.filter((z) => { return z.name == parent.companyName + item.departName })[0])} onChange={(e) => {
                                    let check = e.target.checked,
                                      name = parent.companyName + item.departName,
                                      allData = this.state.usergroup.filter((z) => { return z.name == name })[0].userid
                                    if (check) {
                                      let usergroup = this.state.usergroup.map((ja) => {
                                        if (ja.name == name) {
                                          ja.ids = allData
                                        }
                                        return ja
                                      })
                                      this.setState({
                                        checkedValue: MergeArray(allData, checkedValue),
                                        usergroup
                                      })
                                    } else {
                                      let usergroup = this.state.usergroup.map((ja) => {
                                        if (ja.name == name) {
                                          ja.ids = []
                                        }
                                        return ja
                                      })
                                      this.setState({
                                        checkedValue: this.state.checkedValue.filter((lo) => { return allData.indexOf(lo) == -1 }),
                                        usergroup
                                      })
                                    }
                                  }}>全选</Checkbox></div>}>
                                {
                                  item.show && genExtra(item.user ? item.user : [], i.toString() + j.toString(), parent.companyName + item.departName,item.shopList)
                                }
                                <div style={{ overflow: "hidden", padding: "0px 0px 12px 12px" }}>
                                  <Checkbox.Group
                                    value={this.state.checkedValue}
                                    name="allcheck"
                                    onChange={(checkedValues) => {
                                      let newgroup = this.state.usergroup.map((index) => {
                                        if (index.name == parent.companyName + item.departName) {
                                          index.ids = checkedValues
                                        }
                                        return index
                                      }), checkedValue = [];
                                      newgroup.map((ki) => {
                                        ki.ids.map((ik) => {
                                          checkedValue.push(ik)
                                        })
                                      })
                                      this.setState({
                                        usergroup: newgroup,
                                        checkedValue
                                      })
                                    }}
                                  >
                                    {
                                      item.user.map((user, s) => (
                                        <div key={s} style={{
                                          width: 120, float: "left",
                                          marginBottom: 12,
                                          display: this.state.selectKeyArr.filter((ms) => {
                                            return ms.indexOf(user.id) != -1
                                          }).length > 0 ? "block" : "none"
                                        }}>
                                          <Checkbox key={s} value={user.id}><span style={{
                                            color: cursearch.filter((ms) => {
                                              return ms.indexOf(user.userName) != -1
                                            }).length > 0 ? "green": 
                                            user.isOnline == 0?
                                            "red"
                                            : "#666"
                                          }}>{user.userName}</span></Checkbox>
                                        </div>
                                      ))
                                    }

                                  </Checkbox.Group>
                                </div>

                              </Panel>
                            )) : null
                        }

                      </Collapse>



                    </Panel>
                  )) : null

              }

            </Collapse>
          </Card>
          : <div style={{ width: "100%", height: 100 }}>

          </div>

        }

      </Spin>
    );
  }
}

export default UserCheck;
