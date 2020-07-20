
import React from 'react';
import {
  Icon, Upload, Table, Divider, Card, Form, Button, Input, Row, Col, Tree, Modal, Skeleton,
  message, Popconfirm, Tooltip, Select, DatePicker, InputNumber, Dropdown, Menu
} from 'antd';
import styles from './style.less';
import { connect } from 'dva';
const confirm = Modal.confirm;
const { TreeNode } = Tree;
const Search = Input.Search;
const Option = Select.Option;
const gData = [];
let h = document.body.clientHeight;

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

@connect(({ system, loading }) => ({
  system,
  submittings: loading.effects['system/jgqueryTreeList'],
}))
class Company extends React.Component {
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
      curtype:"",
      curitem: {},
      ifshow: false,
      addstr: '',
      addtype: '',
      gData: gData,
      show: false,
    }
  }

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch, system } = this.props;
    dispatch({
      type: 'system/' + type,
      payload: value,
    }).then(key => {
      if (key) {
        fn ? fn(key) : null;
      }
    });
  }
  componentDidMount() {
    this.setNewState('jgqueryTreeList', null, () => {
      this.setState({
        gData: this.getConvert(),
      });
    });
  }

  getConvert() {
    let { jgqueryTreeList } = this.props.system;
    return jgqueryTreeList;
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
        dataLists.push({ 
          key, 
          title: node.title,
          departmentType:node.departmentType,
          parentKey:node.parentKey,
          companyId:node.companyId
        });
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
    console.log(current)
    if (selectedKeys != '') {
      this.setState({
        curtitle: current.title,
        curtype:current.departmentType,
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
    let { curitem, curtitle,curtype } = this.state,
      postData = {
        departmentName: curtitle,
        departmentType:curtype,
        id: curitem.key,
        companyId:curitem.companyId
      };
    let arr=[0,1];  

    if (!curtitle|| arr.indexOf(curtype)==-1) {
      message.warn('请完善信息');
      return;
    }



    this.setNewState('jgsave', postData, () => {
      this.setNewState('jgqueryTreeList', null, () => {
        this.setState({
          gData: this.getConvert(),
        });
        message.success('修改成功!');
        this.setNewState('jgqueryTreeList', null, () => {
          this.setState({
            gData: this.getConvert(),
          });
        });
      });
    });
  }

  //删除节点************************************
  onDelete() {
    let _it = this;
    confirm({
      title: '确认删除?',
      okType: 'danger',
      content: '是否删除该组织架构',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        let { curitem } = _it.state,
          postData = {
            id: curitem.key,
          };
        _it.setNewState('jgdeleteById', postData, () => {
          _it.setNewState('jgqueryTreeList', null, () => {
            _it.setState({
              gData: _it.getConvert(),
            });
            message.success('删除' + curitem.title + '成功！');
            _it.setNewState('jgqueryTreeList', null, () => {
              _it.setState({
                gData: _it.getConvert(),
              });
            });
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
    let { curitem, addstr,addtype } = this.state,
      postData = {
        departmentName: addstr,
        departmentType: addtype,
        parentId: curitem.key ? curitem.key : '',
        companyId:curitem.companyId
      };
     let arr =[0,1] 
    if (!addstr||arr.indexOf(addtype)==-1) {
      message.warn('请完善信息');
      return;
    }

    this.setNewState('jgsave', postData, () => {
      this.setNewState('jgqueryTreeList', null, () => {
        this.setState({
          gData: this.getConvert(),
          addstr: "",
          addtype:""
        });
        message.success('新增' + addstr + '成功!');
        this.setNewState('jgqueryTreeList', null, () => {
          this.setState({
            gData: this.getConvert(),
          });
        });
      });
    });
  }

  render() {
    let { searchValue, curtitle, ifshow, curitem, curitemz,
      addstr, addtype, expandedKeys, autoExpandParent, show,
      iftype, primary, collspan, postData, imageUrl
    } = this.state;
    const loop = data => data.map(item => {
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
        <Card title="部门管理">
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
                  <Search placeholder="请输入组织架构名称..." onChange={this.onChange} />
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
                    { curitem.parentKey ? (
                      <Row gutter={24} style={{ margin: 0, marginTop: 12, padding: 0 }}>
                        <Col span={8}
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
                        <Col span={8}
                          style={{ paddingLeft: 0, marginLeft: 0 }}
                        >
                          <Select showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            style={{width:"100%"}}
                            allowClear
                            value={this.state.curtype}
                            onChange={val => {
                              this.setState({
                                curtype: val,
                              });
                            }}
                            placeholder="修改部门类型"
                          >
                            <Option value={0}>组织部门</Option>
                            <Option value={1}>底层组织</Option>
                          </Select>
                        </Col>

                        <Col span={8}
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
                      <Col span={8}
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

                      <Col span={8}
                        style={{ paddingLeft: 0, marginLeft: 0 }}
                      >
                        <Select showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          style={{width:"100%"}}
                          allowClear
                          value={addtype}
                          onChange={val => {
                            this.setState({
                              addtype: val,
                            });
                          }}
                          placeholder="添加部门类型"
                        >
                          <Option value={0}>组织部门</Option>
                          <Option value={1}>底层组织</Option>
                        </Select>
                      </Col>

                      <Col span={8}
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
            <Col span={24} style={{ height: h - 240, overflow: 'auto' }}>
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
      </div>
    );
  }

};

export default Company;