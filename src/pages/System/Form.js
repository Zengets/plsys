/**
 * Created by 11485 on 2019/2/25.
 */
import { Tree, Input, Icon, Button, Row, Col, message, Select, Modal, Tabs, Skeleton, Card, Alert, Tag } from 'antd';
import React, { Component } from 'react';
import styles from './style.less';
import { connect } from 'dva';
const TabPane = Tabs.TabPane;
const { TreeNode } = Tree;
const Search = Input.Search;
const Option = Select.Option;
const gData = [];
const confirm = Modal.confirm;

let h = document.body.clientHeight;
const getParentKey = (key, system) => {
  let parentKey;
  for (let i = 0; i < system.length; i++) {
    const node = system[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/AdminqueryAll'],
}))
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData: [],
      dData: [],
      open: true
    }
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e, val) => {
    let value;
    if (e) {
      value = e.target.value
    } else {
      value = val
    }
    const dataLists = [];
    const generateLists = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataLists.push({ key, title: node.title });
        if (node.children) {
          generateLists(node.children, node.key);
        }
      }
    };
    generateLists(this.state.gData);

    const expandedKeys = dataLists
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, this.state.gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
      open: expandedKeys.length == 0
    });
  };


  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }




  componentDidMount() {
    this.setNewState("AdminqueryAll", null, () => {
      this.setState({
        gData: this.props.system.AdminqueryAll,
        dData: this.props.system.AdminqueryAllmb,
      })
    });
  }


  render() {
    const { searchValue, expandedKeys, autoExpandParent, gData, dData, open } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });

    return (
      <div>
        <div className={styles.container}>

          <Skeleton active loading={this.props.submitting} >
            <Card active title={"系统权限"}>
              <Row gutter={24} style={{ backgroundColor: "#999" }}>
                <Col span={24} style={{ paddingRight: 0, marginRight: 0, backgroundColor: "#fff", minHeight: 200, paddingTop: 18 }}>
                  <Search placeholder="按名称查询" onChange={this.onChange} />
                  <Row gutter={24}>
                    <Col span={12}>
                      <p style={{margin:0,marginTop:20,padding:"12px 8px",color:"#fff",backgroundColor:"#737373",display:"block"}}><Icon type="arrow-down" /> PC端权限 <a style={{ cursor: "pointer",float:"right",color:"#fff",paddingRight:4 }} onClick={() => {
                    if (open) {
                      this.onChange(null, "")
                    } else {
                      this.onChange(null, "-100")
                    }
                  }}>{open ? "展开" : "收起"}</a></p>
                      <Tree
                        defaultExpandAll={true}
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                      >
                        {loop(gData)}
                      </Tree>
                    </Col>
                    <Col span={12}>
                      <p style={{margin:0,marginTop:20,padding:"12px 8px",color:"#fff",backgroundColor:"#737373",display:"block"}}><Icon type="arrow-down" /> 移动端权限</p>
                      <Tree
                      >
                        {loop(dData)}
                      </Tree>
                    </Col>

                  </Row>




                </Col>
              </Row>

            </Card>
          </Skeleton>
        </div>
      </div >
    );
  }
}

export default Form

