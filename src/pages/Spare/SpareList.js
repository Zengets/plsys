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
import CreateForm from "@/components/CreateForm"


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
      fv: false,
      fields: {},
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
    this.setNewState('sparequeryTreeList', null);
    this.setNewState('sparequeryList', this.state.postData, () => {
      this.handleCancel()
    });
  }






  pageChange = page => {
    this.setState(
      {
        postData: { ...this.state.postData, pageIndex: page },
      },
      () => {
        this.setNewState('sparequeryList', this.state.postData);
      },
    );
  };

  //表单改变
  handleFormChange = (changedFields) => {
    let fields = this.state.fields, obj;
    for (let i in changedFields) {
      obj = changedFields[i]
    }
    if (obj) {
      for (let i in fields) {
        if (i == obj.name) {
          fields[i].value = obj.value
          fields[i].name = obj.name
          fields[i].dirty = obj.dirty
          fields[i].errors = obj.errors
          fields[i].touched = obj.touched
          fields[i].validating = obj.validating
        }
      }
      this.setState({
        fields: fields,
      })
    }

  }

  /*绑定form*/
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  /*关闭*/
  handleCancel = () => {
    let { sparequeryTreeList, sparequeryList, sparePartsTypeList, userList } = this.props.spare;
    let curitem = this.state.curitem;
    if (this.state.curitem.id) {
      curitem = this.props.spare[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
    }

    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        sparePartsName: {
          value: null,
          type: "input",
          title: "配件名称",
          keys: "sparePartsName",
          requires: true
        },
        sparePartsTypeId: {
          value: null,
          type: "select",
          title: "配件类型",
          keys: "sparePartsTypeId",
          requires: true,
          option: sparePartsTypeList ? sparePartsTypeList.map(item => {
            return {
              id: item.id,
              name: item.sparePatrsTypeName
            }
          }) : []
        },
        sparePartsNo: {
          value: null,
          type: "input",
          title: "配件料号",
          keys: "sparePartsNo",
          requires: true
        },
        spareUnit: {
          value: null,
          type: "input",
          title: "单位",
          keys: "spareUnit",
          requires: true
        },
        spareModel: {
          value: null,
          type: "input",
          title: "型号",
          keys: "spareModel",
          requires: false
        },
        spareSpec: {
          value: null,
          type: "input",
          title: "物料规格",
          keys: "spareSpec",
          requires: false
        },
        sparePartsValue: {
          value: null,
          type: "inputnumber",
          title: "配件价值(元)",
          keys: "sparePartsValue",
          requires: true
        },

      }
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { iftype, curitemz } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        for (let i in values) {
          if (!values[i]) {
            delete values[i];
          } else {
          }
        }
        if (this.state.iftype.val == 'add') {
          this.setNewState('sparesave', values, () => {
            this.setNewState('sparequeryList', this.state.postData, () => {
              message.success('新增成功');
              this.handleCancel();
            });
          });
        } else {
          this.setNewState('sparesave', { ...values, id: this.state.curitemz.id }, () => {
            this.setNewState('sparequeryList', this.state.postData, () => {
              message.success('修改成功');
              this.handleCancel();
            });
          });
        }
      }
    });
  }



  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }


  render() {
    const { searchValue, curtitle, ifshow, curitem, curitemz,
      addstr, addkey, expandedKeys, autoExpandParent, show,
      iftype, fields, fv, postData
    } = this.state,
      { sparequeryTreeList, sparequeryList, sparePartsTypeList, userList, queryBySparePartsNoList } = this.props.spare;
    const { getFieldDecorator } = this.props.form;

    let getsearchbox = (key) => {
      if (this.child) {
        return this.child.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option, lb, vl) => {
      if (this.child) {
        return this.child.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: '料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
        ...getsearchbox('sparePartsNo')
      },
      {
        title: '名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
        width: 110,
        ...getsearchbox('sparePartsName')
      },
      {
        title: '单位',
        dataIndex: 'spareUnit',
        key: 'spareUnit',
      },
      {
        title: '型号',
        dataIndex: 'spareModel',
        key: 'spareModel',
      },
      {
        title: '物料规格',
        dataIndex: 'spareSpec',
        key: 'spareSpec',
      },
      {
        title: '类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
        ...gettreeselectbox('sparePartsTypeId', sparequeryTreeList),
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          价值(元)
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "sparePartsNo":"",  // 料号
                "sparePartsName":"", //名称
                "sparePartsTypeId":"" // 类型主键
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
            重置
      </a>
        </span>,
        dataIndex: 'sparePartsValue',
        key: 'sparePartsValue',
      },
    ]
    let records = this.props.spare.spareRecordqueryList;
    const menu = (record) => (
      <div style={{ display: record.id ? "flex" : "none", alignItems: "center" }}>
        <a style={{ marginRight: 8 }} onClick={() => {
          this.setState(
            {
              iftype: {
                name: '修改' + record.sparePartsName + '信息',
                val: 'edit',
              },
              curitemz: record,
              fields: {
                sparePartsName: {
                  value: record.sparePartsName,
                  type: "input",
                  title: "配件名称",
                  keys: "sparePartsName",
                  requires: true
                },
                sparePartsTypeId: {
                  value: record.sparePartsTypeId,
                  type: "select",
                  title: "配件类型",
                  keys: "sparePartsTypeId",
                  requires: true,
                  option: sparePartsTypeList ? sparePartsTypeList.map(item => {
                    return {
                      id: item.id,
                      name: item.sparePatrsTypeName
                    }
                  }) : []
                },
                sparePartsNo: {
                  value: record.sparePartsNo,
                  type: "input",
                  title: "配件料号",
                  keys: "sparePartsNo",
                  requires: true
                },

                spareUnit: {
                  value: record.spareUnit,
                  type: "input",
                  title: "单位",
                  keys: "spareUnit",
                  requires: true
                },
                spareModel: {
                  value: record.spareModel,
                  type: "input",
                  title: "型号",
                  keys: "spareModel",
                  requires: false
                },
                spareSpec: {
                  value: record.spareSpec,
                  type: "input",
                  title: "物料规格",
                  keys: "spareSpec",
                  requires: false
                },
                sparePartsValue: {
                  value: record.sparePartsValue,
                  type: "inputnumber",
                  title: "配件价值(元)",
                  keys: "sparePartsValue",
                  requires: true
                },
              }
            },
            () => {
              this.setState({
                fv: true
              })
            },
          );
        }}>
          修改
        </a>
        <Popconfirm
          okText="确认"
          cancelText="取消"
          placement="bottom"
          title={"确认删除该配件？"}
          onConfirm={() => {
            this.setNewState("sparedeleteById", { id: record.id }, () => {
              let total = this.props.spare.sparequeryList.total,
                page = this.props.spare.sparequeryList.pageNum;
              if ((total - 1) % 10 == 0) {
                page = page - 1
              }

              this.setState({
                postData: { ...this.state.postData, pageIndex: page }
              }, () => {
                this.setNewState("sparequeryList", postData, () => {
                  message.success("删除成功！");
                });
              })
            })
          }}>
          <a style={{ color: "#ff4800" }}>删除</a>
        </Popconfirm>
        <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
        <a style={{ marginRight: 8 }} onClick={() => {
          let _it = this;
          Modal.confirm({
            title: `申请购买 ${record.sparePartsName}`,
            content: <div style={{ paddingTop: 12 }}>
              <Input.TextArea placeholder="请备注购买的规格" onChange={(e) => {
                _it.setState({
                  remark: e.target.value
                })
              }}
              />
            </div>,
            cancelText: "取消",
            okText: "申请",
            onOk() {
              let remark = _it.state.remark;
              if (!remark) {
                message.warn("请填写备注");
                return
              }
              _it.setNewState("buysave", {
                "spareId": record.id, // 配件主键*
                "remark": remark //备注
              }, () => {
                message.success("操作成功");
                _it.setState({
                  remark: ""
                })
              })
            },
            onCancel() { },
          })
        }}>
          申请购买
        </a>
        <a style={{ marginRight: 8 }} onClick={() => {
          this.setNewState("spareRecordqueryList", { pageIndex: 1, pageSize: 10, id: record.id }, () => {
            this.setState({
              iftype: {
                name: `${record.sparePartsName} 的库存记录`,
                val: "tosee"
              },
              visible: true,
              curitemz: record
            })
          })
        }}>
          配件库存记录
          </a>
      </div>
    );


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


    const titlerender = () => (
      <div className={styles.pubheader}>
        <h3 style={{ fontSize: 16, margin: 0, padding: 0 }}>
          配件库存列表
          </h3>
      </div>
    );

    const extrarender = width => (
      <div className={styles.pubextra} style={{ flex: 1, justifyContent: "flex-end", display: 'flex', alignItems: "center" }}>
        <a
          style={{ marginRight: 8 }}
          onClick={() => {
            this.setState(
              {
                iftype: {
                  ...iftype,
                  val: 'add',
                  name: '新增配件',
                },
              },
              () => {
                this.setState({
                  fv: true
                })
              },
            );
          }}
        >
          新增
          </a>
        {
          menu(curitem)
        }
        <Abload reload={() => this.resetData()} data={null} postName="uploadspareParts" left={0} filePath="http://www.plszems.com/download/配件导入模板.xlsx"></Abload>


      </div>
    );
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };



    const expandedRowRender = () => {
      const columnss = [
        {
          title: '公司名称',
          dataIndex: 'companyName',
          key: 'companyName'
        },
        {
          title: '仓库名',
          dataIndex: 'warehouse',
          key: 'warehouse'
        },
        {
          title: '库存数量',
          dataIndex: 'availableStock',
          key: 'availableStock'
        },

      ];
      return <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }} columns={columnss} dataSource={queryBySparePartsNoList} pagination={false} />;
    };




    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col
              span={24}
              style={{ borderLeft: "#f0f0f0 solid 1px" }}
            >
              <div>
                <Card bordered={false} title={titlerender()} extra={extrarender()}>
                  <div
                    style={{
                      overflowX: 'hidden',
                      overflowY: 'auto',
                    }}
                  >
                    <Table bordered size="middle"
                      expandedRowKeys={this.state.curkeys ? this.state.curkeys : []}
                      onExpand={(expanded, record) => {
                        this.setState({ curitem: expanded ? record : [], curkeys: expanded ? [record.id] : [] }, () => {
                          expanded
                            &&
                            this.setNewState("queryBySparePartsNoList", {
                              sparePartsNo: record.sparePartsNo
                            }, () => {


                            })



                        });
                      }}
                      expandedRowRender={expandedRowRender}
                      expandRowByClick={true}
                      scroll={{ x: 1200, y: "59vh" }}
                      onRow={record => {
                        return {
                          onClick: event => {
                            this.setState({ curitem: record });
                          }, // 点击行
                        };
                      }}
                      rowClassName={(record, index) => rowClassNameFn(record, index)}
                      columns={columns}
                      loading={this.props.submitting}
                      rowKey="id"
                      dataSource={sparequeryList.list}
                      pagination={{
                        showTotal: total => `共${total}条`,
                        // 分页
                        size: 'small',
                        showQuickJumper: true,
                        pageSize: 10,
                        current: sparequeryList.pageNum ? sparequeryList.pageNum : 1,
                        total: sparequeryList.total ? parseInt(sparequeryList.total) : 0,
                        onChange: this.pageChange,
                      }}
                    />
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          style={{ top: 20 }}
          width={"90%"}
          visible={this.state.visible}
          title={iftype.name}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
          footer={null}
        >
          <div>
            <Table bordered size="middle"
              scroll={{ x: 1200, y: "59vh" }}
              dataSource={records ? records.list : []}
              rowKey="id"
              pagination={{
                showTotal: total => `共${total}条`,
                size: 'small',
                showQuickJumper: true,
                pageSize: 10,
                current: records.pageNum ? records.pageNum : 1,
                total: records.total ? parseInt(records.total) : 0,
                onChange: (page) => {
                  this.setNewState("spareRecordqueryList", { pageIndex: page, pageSize: 10, id: curitemz.id })
                },
              }}
              columns={[
                {
                  title: '料号',
                  dataIndex: 'sparePartsNo',
                  key: 'sparePartsNo',
                },
                {
                  title: '配件名称',
                  dataIndex: 'sparePartsName',
                  key: 'sparePartsName',
                },
                {
                  title: '配件类型',
                  dataIndex: 'sparePartsTypeName',
                  key: 'sparePartsTypeName',
                },
                {
                  title: '操作类型',
                  dataIndex: 'ioTypeName',
                  key: 'ioTypeName',
                },
                {
                  title: '操作后数量',
                  dataIndex: 'currentStock',
                  key: 'currentStock',
                },
                {
                  title: '操作前总数',
                  dataIndex: 'beforeStock',
                  key: 'beforeStock',
                },
                {
                  title: '操作数量',
                  dataIndex: 'batchCount',
                  key: 'batchCount',
                },
                {
                  title: '操作人',
                  dataIndex: 'dealUserName',
                  key: 'dealUserName',
                },
                {
                  title: '操作时间',
                  dataIndex: 'dealTime',
                  key: 'dealTime',
                },
                {
                  title: '备注',
                  dataIndex: 'remark',
                  key: 'remark',
                },
                {
                  title: '相关单号',
                  dataIndex: 'recordNo',
                  key: 'recordNo',
                },
              ]}></Table>
          </div>
        </Modal>
        <CreateForm
          fields={fields}
          iftype={iftype}
          onChange={this.handleFormChange}
          wrappedComponentRef={this.saveFormRef}
          visible={fv}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />


      </div>
    );
  }
}

SpareList = Form.create('yangzige')(SpareList);

export default SpareList;
