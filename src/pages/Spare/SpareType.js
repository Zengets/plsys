import React, { Component } from 'react';
import moment from 'moment';
import {
  Icon, Upload, Table, Divider, Card, Form, Button, Input, Row, Col, Tree, Modal, Skeleton,
  message, Popconfirm, Tooltip, Select, DatePicker, InputNumber, Dropdown, Menu
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import white from '../../assets/white.jpg';
import Link from 'umi/link';
import Abload from '@/components/Abload';
import SearchBox from '@/components/SearchBox'


const confirm = Modal.confirm;
const { TreeNode } = Tree;
const Search = Input.Search;
const Option = Select.Option;
const gData = [];

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
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

@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/sparequeryList'],
  submittings: loading.effects['spare/sparequeryTreeList'],
}))
class SpareList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primary: true,
      collspan: true,
      iftype: { name: '', val: '' },
      curitemz: {},
      expandedKeys: [],
      searchValue: '',
      curtitle: '',
      curitem: {},
      ifshow: false,
      addstr: '',
      addkey: '',
      gData: gData,
      show: false,
      postData: {
        "pageIndex": 1,                          //(int)页码
        "pageSize": 10,                           //(int)条数
        "sparePartsName": "",                     // 配件名称
        "warnNoticeUserId": "",                   // 预警通知人
        "sparePartsTypeId": "",                   // 配件类型主键
      },
      postUrl: "sparequeryList"
    };
  }

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch, spare } = this.props;
    dispatch({
      type: 'spare/' + type,
      payload: value,
    }).then(key => {
      if (key) {
        fn ? fn(key) : null;
      }
    });
  }
  resetData() {
    this.setNewState(this.state.postUrl, this.state.postData)
  }

  componentDidMount() {
    this.setNewState('sparequeryTreeList', null, () => {
      this.setState({
        gData: this.getConvert(),
      });
    });
    this.setNewState('sparequeryList', this.state.postData);
  }

  getConvert() {
    let { sparequeryTreeList } = this.props.spare;
    let mostData = [
      {
        key: '0',
        title: '全部',
        children: sparequeryTreeList,
      },
    ];
    return mostData;
  }

  //展开
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      gData: this.getConvert(),
      autoExpandParent: false,
    });
  };
  //选中
  chooseed = (selectedKeys, info) => {
    let current = {};
    const dataLists = [];
    const generateLists = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataLists.push({ key, title: node.title,parentKey:node.parentKey });
        if (node.children) {
          generateLists(node.children);
        }
      }
    };
    generateLists(this.getConvert());
    dataLists.map(item => {
      if (item.key == selectedKeys) {
        current = item;
      }
    });

    if (selectedKeys != '') {
      this.setState({
        curtitle: current.title,
        curitem: current,
        show: true,
      });
      if (info.node.props.children) {
        this.setState({
          ifshow: false,
        });
      } else {
        this.setState({
          ifshow: true,
        });
      }
    } else {
      this.setState({
        show: false,
        ifshow: false,
      });
    }
  };
  //查询
  onChange = e => {
    const value = e.target.value;
    //*reset datalists*//
    const dataLists = [];
    const generateLists = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataLists.push({ key, title: node.title });
        if (node.children) {
          generateLists(node.children, node.key);
        }
      }
    };
    generateLists(this.getConvert());
    const expandedKeys = dataLists.map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, this.getConvert());
      }
      return null;
    })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    console.log(expandedKeys);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  //修改标题
  onSubmit() {
    let { curitem, curtitle } = this.state,
    postData = {
      sparePatrsTypeName: curtitle,
      id: curitem.key,
      parentId:curitem.parentKey
    };
    console.log(curitem)
    if (!curtitle) {
      message.warn('请输入标题名称修改');
      return;
    }
    this.setNewState('spareTreesave', postData, () => {
      this.setNewState('sparequeryTreeList', null, () => {
        this.setState({
          gData: this.getConvert(),
        });
        message.success('修改成功!');
        this.resetData()
      });
    });
  }

  //删除节点************************************
  onDelete() {
    let _it = this;
    confirm({
      title: '确认删除?',
      okType: 'danger',
      content: '是否删除改配件类型',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        let { curitem } = _it.state,
          postData = {
            id: curitem.key,
          };
        _it.setNewState('spareTreedeleteById', postData, () => {
          _it.setNewState('sparequeryTreeList', null, () => {
            _it.setState({
              gData: _it.getConvert(),
            });
            message.success('删除' + curitem.title + '成功！');
            _it.resetData()
            _it.setState({
              autoExpandParent: true,
              show: false,
            });
          });
        });
      },
      onCancel() { },
    });
  }

  //新增节点
  addChildren() {
    let { curitem, addstr } = this.state,
      postData = {
        sparePatrsTypeName: addstr,
        parentId: curitem.key ? curitem.key : '',
      };
    if (!addstr) {
      message.warn('请输入标题名称后新增...');
      return;
    }

    this.setNewState('spareTreesave', postData, () => {
      this.setNewState('sparequeryTreeList', null, () => {
        this.setState({
          gData: this.getConvert(),
          addstr: ""
        });
        message.success('新增' + addstr + '成功!');
        this.resetData()
      });
    });
  }




  render() {
    const { searchValue, curtitle, ifshow, curitem, curitemz,
      addstr, addkey, expandedKeys, autoExpandParent, show,
      iftype, primary, collspan, postData
    } = this.state,{ sparequeryTreeList, sparequeryList, sparePartsTypeList, search, userList } = this.props.spare;



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
            <TreeNode key={item.key} title={title} icon={<Icon type="edit" />}>
              {loop(item.children)}
            </TreeNode>
          );
        } else {
          return <TreeNode key={item.key} title={title} icon={<Icon type="edit" />} />;
        }
      });




    return (
      <div>
        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col
             span={24}
              style={{ transition: 'all 0.4s' }}
            >
              <Card
                bordered={false}
                style={{ borderRadius: 0 }}
                title={<p style={{ padding: '4px 0', margin: 0 }}>配件类型管理</p>}
                extra={
                  <Tooltip placement="bottom" title={'收起配件类型管理'}>
                    <Icon
                      type="vertical-right"
                      onClick={() => {
                        this.setState({
                          collspan: false,
                        });
                      }}
                    />
                  </Tooltip>
                }
              >
                <Row>
                  <Col span={24} style={{ padding: 0, paddingBottom: 12 }}>
                    <div>
                      <Row
                        style={
                          show
                            ? {
                              marginBottom: 18,
                              paddingBottom: 18,
                              borderBottom: '#f0f0f0 solid 1px',
                            }
                            : {}
                        }
                      >
                        <Search placeholder="请输入配件名称..." onChange={this.onChange} />
                      </Row>
                      {show ? (
                        <div>
                          <h2
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-end',
                              marginBottom: 16,
                            }}
                          >
                            <span>操作</span>
                          </h2>
                          {curitem.key && curitem.key != 0 ? (
                            <Row gutter={24} style={{ margin: 0, marginTop: 12, padding: 0 }}>
                              <Col
                                xl={16}
                                lg={16}
                                md={16}
                                sm={16}
                                xs={16}
                                style={{ paddingLeft: 0, marginLeft: 0 }}
                              >
                                <Input
                                  type="text"
                                  value={curtitle}
                                  onChange={e => {
                                    this.setState({
                                      curtitle: e.target.value,
                                    });
                                  }}
                                  placeholder="修改名称"
                                />
                              </Col>
                              <Col
                                xl={8}
                                lg={8}
                                md={8}
                                sm={8}
                                xs={8}
                                style={{ padding: 0, marginRight: 0 }}
                              >
                                <Button
                                  style={{ width: '100%', minWidth: 92 }}
                                  type="primary"
                                  icon="edit"
                                  onClick={() => this.onSubmit()}
                                >
                                  修改
                                </Button>
                              </Col>
                            </Row>
                          ) : null}
                          <Row gutter={24} style={{ margin: 0, marginTop: 12, padding: 0 }}>
                            <Col
                              xl={16}
                              lg={16}
                              md={16}
                              sm={16}
                              xs={16}
                              style={{ paddingLeft: 0, marginLeft: 0 }}
                            >
                              <Input
                                type="text"
                                value={addstr}
                                onChange={e => {
                                  this.setState({
                                    addstr: e.target.value,
                                  });
                                }}
                                placeholder="请输入名称"
                              />
                            </Col>
                            <Col
                              xl={8}
                              lg={8}
                              md={8}
                              sm={8}
                              xs={8}
                              style={{ padding: 0, marginRight: 0 }}
                            >
                              <Button
                                style={{ width: '100%', minWidth: 92 }}
                                type="default"
                                icon="file-add"
                                onClick={() => this.addChildren()}
                              >
                                新增
                              </Button>
                            </Col>
                          </Row>
                          <Row
                            gutter={24}
                            style={{
                              margin: 0,
                              marginTop: 12,
                              padding: 0,
                              display: ifshow ? 'flex' : 'none',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <Col
                              xl={8}
                              lg={8}
                              md={8}
                              sm={8}
                              xs={8}
                              style={{ margin: 0, padding: 0 }}
                            >
                              <Button
                                style={{ width: '100%', minWidth: 92 }}
                                type="danger"
                                icon="delete"
                                onClick={() => this.onDelete()}
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                    </div>
                  </Col>
                  <Col span={24} style={{ overflow: 'hidden' }}>
                    <Skeleton active={true} loading={this.props.submittings}>
                      <Tree.DirectoryTree
                        showIcon={false}
                        onSelect={this.chooseed}
                        showIcon
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        showIcon
                      >
                        {loop(this.state.gData)}
                      </Tree.DirectoryTree>
                    </Skeleton>
                  </Col>
                </Row>
              </Card>
            </Col>
        </Row>
        </div>


      </div>
    );
  }
}

SpareList = Form.create('yangzige')(SpareList);

export default SpareList;