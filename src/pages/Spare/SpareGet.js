import {
  Radio,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Divider,
  Modal,
  Tree,
  Button,
  Row,
  Col,
  Icon,
  Select,
  Alert,
  Tag,
  message,
  Card,
  Dropdown,
  Menu,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from '@/components/CreateForm';
import SearchBox from '@/components/SearchBox';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;

@connect(({ spare, publicmodel, loading }) => ({
  spare,
  publicmodel,
  submitting: loading.effects['spare/getqueryList'],
}))
class SpareGet extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '配件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '配件价值',
        dataIndex: 'sparePartsValue',
        key: 'sparePartsValue',
        render: text => <span>{text}元</span>,
      },
      {
        title: '配件类型名称',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '可用库存',
        dataIndex: 'availableStock',
        key: 'availableStock',
      },
      {
        title: '数量',
        dataIndex: 'nums',
        key: 'nums',
        render: (text, record) => {
          let vals = this.state.fields.saprePartsApplyDetailList.value
              ? this.state.fields.saprePartsApplyDetailList.value
              : [],
            res,
            values = this.state.fields.saprePartsApplyDetailList.submit
              ? this.state.fields.saprePartsApplyDetailList.submit
              : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.sparePartsId == record.sparePartsId) {
              res = item.applyCount;
            }
          });
          if (vals.indexOf(record.sparePartsId) == -1) {
            return '请选择';
          } else {
            return (
              <InputNumber
                min={1}
                max={10000}
                value={res}
                onChange={val => {
                  let newvalues = values.map((item, i) => {
                    if (item.sparePartsId == record.sparePartsId) {
                      item.applyCount = val;
                    }
                    return item;
                  });
                  fields.saprePartsApplyDetailList.submit = newvalues;
                  this.setState({
                    fields,
                  });
                }}
              />
            );
          }
        },
      },
    ];
    this.columnes = [
      {
        title: '配件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '配件价值',
        dataIndex: 'sparePartsValue',
        key: 'sparePartsValue',
        render: text => <span>{text}元</span>,
      },
      {
        title: '配件类型名称',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '申请数量',
        dataIndex: 'applyCount',
        key: 'applyCount',
      },
    ];

    this.state = {
      visible: false,
      iftype: {
        name: '',
        value: '',
      },
      postDatac: {
        pageIndex: 1, // 第1页*
        pageSize: 10, // 每页10条*
        applyType: 0,
        sparePartsTypeId: '',
        sparePartsNo: '',
      },
      fv: false,
      fields: {
        applyType: {
          value: 0,
          type: 'select',
          title: '申请类型',
          keys: 'applyType',
          requires: true,
          option: [{ name: '预申领', id: 0 }, { name: '回冲入库', id: 1 }],
        },
        saprePartsApplyDetailList: {
          value: undefined,
          type: 'table',
          title: '申请配件',
          keys: 'saprePartsApplyDetailList',
          requires: true,
          columns: this.columns,
          dataSource: 'outqueryList',
          col: { span: 24 },
          dv: 'sparePartsId',
          lb: 'sparePartsName',
          submit: [],
        },

        remark: {
          value: null,
          type: 'textarea',
          title: '备注',
          keys: 'remark',
          requires: false,
        },
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        taskNo: '', //  申请单号
        applyUserName: '',
        auditUserName: '',
        status: '',
        applyType: '', // 申请类型： 0：预申领，1：回冲入库
      },
      postUrl: 'getqueryList',
      curitem: {},
      postDatas: {
        sparePartsApplyId: '',
        pageIndex: 1,
        pageSize: 10,
      },
    };
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'spare/' + type,
      payload: values,
    }).then(res => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  setNewStates(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicmodel/' + type,
      payload: values,
    }).then(res => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel();
    });
  }

  componentDidMount() {
    this.resetData();
  }

  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };

    if (name == 'saprePartsApplyDetailList') {
      //输入内容
      let Inarr = fields[name].submit
        ? fields[name].submit.map(item => {
            return item.sparePartsId;
          })
        : [];

      function getval(key) {
        let results = '';
        fields[name].submit
          ? fields[name].submit.map(item => {
              if (item.sparePartsId == key) {
                results = item.applyCount;
              }
            })
          : null;

        return results;
      }

      let submit = selectval.map(item => {
        if (Inarr.indexOf(item) == -1) {
          return {
            sparePartsId: item,
            applyCount: undefined,
          };
        } else {
          return {
            sparePartsId: item,
            applyCount: getval(item),
          };
        }
      });
      fields[name] = { ...fields[name], value: selectval, submit };
    }

    this.setState({
      fields,
    });
  };

  //表单改变
  handleFormChange = changedFields => {
    let fields = this.state.fields,
      obj;
    for (let i in changedFields) {
      obj = changedFields[i];
    }

    if (obj) {
      if (obj.name == 'applyType') {
        this.setState(
          {
            postDatac: {
              ...this.state.postDatac,
              applyType: obj.value,
            },
          },
          () => {
            this.child.changedData('outqueryList', this.state.postDatac, 0);
          }
        );
      }
      for (let i in fields) {
        if (i == obj.name) {
          fields[i].value = obj.value;
          fields[i].name = obj.name;
          fields[i].dirty = obj.dirty;
          fields[i].errors = obj.errors;
          fields[i].touched = obj.touched;
          fields[i].validating = obj.validating;
          if (i == 'saprePartsApplyDetailList') {
            this.onSelectChange(fields[i].value, i);
          }
        }
      }
      this.setState({
        fields: fields,
      });
    }
  };

  /*绑定form*/
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  onRef = ref => {
    this.child = ref;
  };

  /*关闭*/
  handleCancel = () => {
    this.setState({
      fv: false,
      fields: {
        applyType: {
          value: 0,
          type: 'select',
          title: '申请类型',
          keys: 'applyType',
          requires: true,
          option: [{ name: '预申领', id: 0 }, { name: '回冲入库', id: 1 }],
        },
        saprePartsApplyDetailList: {
          value: undefined,
          type: 'table',
          title: '申请配件',
          keys: 'saprePartsApplyDetailList',
          requires: true,
          columns: this.columns,
          dataSource: 'outqueryList',
          col: { span: 24 },
          dv: 'sparePartsId',
          lb: 'sparePartsName',
          submit: [],
        },
        remark: {
          value: null,
          type: 'textarea',
          title: '备注',
          keys: 'remark',
          requires: false,
        },
      },
    });
  };

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype } = this.state;
    let submit = this.state.fields.saprePartsApplyDetailList.submit;
    if (submit.length == 0) {
      message.warn('请选择配件');
      return;
    }
    let arrs = submit.filter(item => {
      return !item.applyCount;
    });
    if (arrs.length > 0) {
      message.warn('请完善配件数量');
      return;
    }

    form.validateFields((err, values) => {
      if (err) {
        message.warn('请补全必填项');
        return;
      }
      values.saprePartsApplyDetailList = this.state.fields.saprePartsApplyDetailList.submit;
      let postData = { ...values };
      this.setNewState('getsave', postData, () => {
        message.success('新增成功！');
        this.resetData();
      });
    });
  };

  handleSearch = (selectedKeys, dataIndex, end) => {
    if (end) {
      let start = dataIndex;
      let { postUrl } = this.state;
      this.setState(
        {
          postData: {
            ...this.state.postData,
            [start]: selectedKeys[0] ? selectedKeys[0] : '',
            [end]: selectedKeys[1] ? selectedKeys[1] : '',
          },
        },
        () => {
          this.setNewState(postUrl, this.state.postData);
        }
      );
    } else {
      let { postUrl } = this.state;
      this.setState(
        {
          postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : '' },
        },
        () => {
          this.setNewState(postUrl, this.state.postData);
        }
      );
    }
  };

  handleSearchc = (selectedKeys, dataIndex, end) => {
    let postUrl = 'outqueryList';
    if (end) {
      let start = dataIndex;
      this.setState(
        {
          postDatac: {
            ...this.state.postDatac,
            [start]: selectedKeys[0] ? selectedKeys[0] : '',
            [end]: selectedKeys[1] ? selectedKeys[1] : '',
          },
        },
        () => {
          this.setNewStates(postUrl, this.state.postDatac);
        }
      );
    } else {
      this.setState(
        {
          postDatac: {
            ...this.state.postDatac,
            [dataIndex]: selectedKeys[0] ? selectedKeys[0] : '',
          },
        },
        () => {
          this.setNewStates(postUrl, this.state.postDatac);
        }
      );
    }
  };

  onRefs = ref => {
    this.childs = ref;
  };

  onRefc = ref => {
    this.childc = ref;
  };

  render() {
    let { postData, postDatac, postUrl, fv, fields, iftype, curitem } = this.state,
      { getqueryList, userList, getqueryListAndApplyInfo, sparePartsApply } = this.props.spare;

    let getsearchbox = key => {
        if (this.childs) {
          return this.childs.getColumnSearchProps(key);
        } else {
          return null;
        }
      },
      getselectbox = (key, option) => {
        if (this.childs) {
          return this.childs.getColumnSelectProps(key, option);
        } else {
          return null;
        }
      },
      getdaterangebox = (start, end) => {
        if (this.childs) {
          return this.childs.getColumnRangeProps(start, end);
        } else {
          return null;
        }
      },
      getsearchboxc = key => {
        if (this.childc) {
          return this.childc.getColumnSearchProps(key);
        } else {
          return null;
        }
      },
      gettreeselectboxc = (key, option) => {
        if (this.childc) {
          return this.childc.getColumnTreeSelectProps(key, option);
        } else {
          return null;
        }
      };

    const columns = [
      {
        title: '申请单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ...getsearchbox('taskNo'),
      },
      {
        title: '申请人',
        dataIndex: 'applyUserName',
        key: 'applyUserName',
        ...getsearchbox('applyUserName'),
      },
      {
        title: '申请类型',
        dataIndex: 'applyTypeName',
        key: 'applyTypeName',
        width: 110,
        ...getselectbox('applyType', [
          { dicKey: '0', dicName: '预申领' },
          { dicKey: '1', dicName: '回冲入库' },
        ]),
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
      },
      {
        title: '申请说明',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '配件总价值(元)',
        dataIndex: 'totalSparePartsValue',
        key: 'totalSparePartsValue',
      },
      {
        title: '审批人',
        dataIndex: 'auditUserName',
        key: 'auditUserName',
        ...getsearchbox('auditUserName'),
      },
      {
        title: '审批结果',
        dataIndex: 'auditResultTypeName',
        key: 'auditResultTypeName',
      },
      {
        title: '审批意见',
        dataIndex: 'auditOpinion',
        key: 'auditOpinion',
      },
      {
        title: '审批时间',
        dataIndex: 'auditTime',
        key: 'auditTime',
      },
      {
        title: '审批状态',
        dataIndex: 'status',
        key: 'status',
        ...getselectbox('status', [
          { dicKey: '0', dicName: '待审批' },
          { dicKey: '1', dicName: '审批通过' },
          { dicKey: '2', dicName: '审批未通过' },
          { dicKey: '3', dicName: '撤回' },
        ]),
        render: (text, record) => {
          let name =
              text == 0
                ? '待审批'
                : text == 1
                ? '审批通过'
                : text == 2
                ? '审批未通过'
                : text == 3
                ? '撤回'
                : '',
            color =
              text == 0
                ? '#666'
                : text == 1
                ? 'green'
                : text == 2
                ? '#ff2100'
                : text == 3
                ? '#f50'
                : '';
          return <span style={{ color: color }}>{name}</span>;
        },
      },
      {
        title: (
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            查看详情
            <a
              style={{ color: '#f50' }}
              onClick={() => {
                this.setState(
                  {
                    postData: {
                      ...postData,
                      taskNo: '', //  申请单号
                      applyUserName: '',
                      auditUserName: '',
                      status: '',
                      applyType: '', // 申请类型： 0：预申领，1：回冲入库
                    },
                  },
                  () => {
                    this.resetData();
                  }
                );
              }}
            >
              <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
              重置
            </a>
          </span>
        ),
        dataIndex: 'action',
        key: 'action',
        width: 180,
        render: (text, record) => {
          return (
            <div>
              <a
                onClick={() => {
                  this.setNewState(
                    'getqueryListAndApplyInfo',
                    { ...this.state.postDatas, sparePartsApplyId: record.id, pageIndex: 1 },
                    () => {
                      this.setState({
                        postDatas: { ...this.state.postDatas, sparePartsApplyId: record.id },
                        visible: true,
                        curitem: record,
                        iftype: {
                          name: `查看单号：${record.taskNo}的详情`,
                          value: 'tosee',
                        },
                      });
                    }
                  );
                }}
              >
                查看
              </a>
            </div>
          );
        },
      },
    ];

    this.columns = [
      {
        title: '配件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
        ...getsearchboxc('sparePartsNo'),
      },
      {
        title: '配件价值',
        dataIndex: 'sparePartsValue',
        key: 'sparePartsValue',
        render: text => <span>{text}元</span>,
      },
      {
        title: '配件类型名称',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
        ...gettreeselectboxc(
          'sparePartsTypeId',
          this.props.publicmodel.dataList ? this.props.publicmodel.dataList : []
        ),
      },
      {
        title: '可用库存',
        dataIndex: 'availableStock',
        key: 'availableStock',
      },
      {
        title: '数量',
        dataIndex: 'nums',
        key: 'nums',
        render: (text, record) => {
          let vals = this.state.fields.saprePartsApplyDetailList.value
              ? this.state.fields.saprePartsApplyDetailList.value
              : [],
            res,
            values = this.state.fields.saprePartsApplyDetailList.submit
              ? this.state.fields.saprePartsApplyDetailList.submit
              : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.sparePartsId == record.sparePartsId) {
              res = item.applyCount;
            }
          });
          if (vals.indexOf(record.sparePartsId) == -1) {
            return '请选择';
          } else {
            return (
              <InputNumber
                min={1}
                max={10000}
                value={res}
                onChange={val => {
                  let newvalues = values.map((item, i) => {
                    if (item.sparePartsId == record.sparePartsId) {
                      item.applyCount = val;
                    }
                    return item;
                  });
                  fields.saprePartsApplyDetailList.submit = newvalues;
                  this.setState({
                    fields,
                  });
                }}
              />
            );
          }
        },
      },
    ];

    let pageChange = page => {
      this.setState(
        {
          postData: { ...this.state.postData, pageIndex: page },
        },
        () => {
          this.setNewState('getqueryList', this.state.postData);
        }
      );
    };

    let pageChanges = page => {
      this.setState(
        {
          postDatas: { ...this.state.postDatas, pageIndex: page },
        },
        () => {
          this.setNewState('getqueryListAndApplyInfo', this.state.postDatas);
        }
      );
    };

    let renderDetail = () => {
      return (
        <div>
          <Card title="申请单信息">
            <div className={styles.limitdivs}>
              <Row gutter={24}>
                <Col span={12}>
                  <p>
                    <span>申请单号: </span>
                    <span> {sparePartsApply.taskNo}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>申请人: </span>
                    <span> {sparePartsApply.applyUserName}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>申请时间: </span>
                    <span> {sparePartsApply.applyTime}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>申请类型: </span>
                    <span> {sparePartsApply.applyTypeName}</span>
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <span>配件总价值(元): </span>
                    <span> {sparePartsApply.totalSparePartsValue}元</span>
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <span>申请说明: </span>
                    <span> {sparePartsApply.remark}</span>
                  </p>
                </Col>
                <Col span={24} style={{ borderTop: '#F0F0F0 dashed 1px', paddingTop: 18 }}>
                  <p>
                    <span style={{ color: '#f50' }}>申请配件列表: </span>
                  </p>
                  <Table
                    bordered
                    size="middle"
                    scroll={{ x: 1200, y: '59vh' }}
                    dataSource={getqueryListAndApplyInfo ? getqueryListAndApplyInfo.list : []}
                    columns={this.columnes}
                    rowKey="id"
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: 'small',
                      pageSize: 10,
                      showQuickJumper: true,
                      current: getqueryListAndApplyInfo.pageNum
                        ? getqueryListAndApplyInfo.pageNum
                        : 1,
                      total: getqueryListAndApplyInfo.total
                        ? parseInt(getqueryListAndApplyInfo.total)
                        : 0,
                      onChange: pageChanges,
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Card>
          {iftype.value == 'todeal' && (
            <Card title={this.state.iftype.name} style={{ marginTop: 24 }}>
              <Row gutter={24}>
                <Col span={24} style={{ display: 'flex' }}>
                  <p style={{ width: 64 }}>审批结果</p>
                  <div style={{ marginLeft: 10, flex: 1 }}>
                    <Radio.Group
                      onChange={e => {
                        this.setState({
                          radio: e.target.value,
                        });
                      }}
                    >
                      <Radio value={0}>通过</Radio>
                      <Radio value={1}>未通过</Radio>
                    </Radio.Group>
                  </div>
                </Col>
                <Col span={24} style={{ display: 'flex' }}>
                  <p style={{ width: 64 }}>审批意见</p>
                  <div style={{ marginLeft: 10, flex: 1 }}>
                    <Input.TextArea
                      style={{ width: '100%' }}
                      onChange={e => {
                        this.setState({
                          textarea: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          )}
        </div>
      );
    };
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return 'selectedRow';
      }
      return null;
    };

    //sparePartsApplyAuditList
    const expandedRowRender = record => {
      const columnss = [
        {
          title: '名称',
          dataIndex: 'auditUserName',
          key: 'auditUserName',
        },
        {
          title: '审批时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
        },
        {
          title: '审批状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
          render: text => (
            <span
              style={{
                color:
                  text == 0
                    ? '#666'
                    : text == 1
                    ? '#ff2100'
                    : text == 2
                    ? 'green'
                    : text == 3
                    ? '#f50'
                    : '',
              }}
            >
              {text == '0' ? '未审批' : text == '1' ? '待审批' : text == '2' ? '已审批' : ''}
            </span>
          ),
        },
        {
          title: '审批结果',
          dataIndex: 'auditResultTypeName',
          key: 'auditResultTypeName',
          render: text => (
            <span style={{ color: text == '不通过' ? '#ff2100' : 'green' }}>{text}</span>
          ),
        },
        {
          title: '审批意见',
          dataIndex: 'auditOpinion',
          key: 'auditOpinion',
        },
      ];
      return (
        <Table
          bordered
          size="middle"
          columns={columnss}
          dataSource={record.sparePartsApplyAuditList}
          pagination={false}
        />
      );
    };

    return (
      <div>
        <SearchBox
          onRef={this.onRefs}
          handleSearch={this.handleSearch}
          postData={this.state.postData}
        />
        <SearchBox
          onRef={this.onRefc}
          handleSearch={this.handleSearchc}
          postData={this.state.postDatac}
        />

        <Card
          title="配件申请列表"
          extra={
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <a
                onClick={() => {
                  this.setState({
                    iftype: {
                      name: '新增配件申请',
                      value: 'add',
                    },
                    fv: true,
                  });
                }}
              >
                新增
              </a>
              {curitem.id ? (
                curitem.status == 0 ? (
                  <span>
                    <Divider type="vertical" />
                    <a
                      onClick={() => {
                        this.setNewState(
                          'getqueryListAndApplyInfo',
                          { ...this.state.postDatas, sparePartsApplyId: curitem.id, pageIndex: 1 },
                          () => {
                            this.setState({
                              postDatas: { ...this.state.postDatas, sparePartsApplyId: curitem.id },
                              visible: true,
                              curitem: curitem,
                              iftype: {
                                name: `审批单号：${curitem.taskNo}`,
                                value: 'todeal',
                              },
                            });
                          }
                        );
                      }}
                    >
                      审批
                    </a>
                    <Divider type="vertical" />
                    <Popconfirm
                      okText="确认"
                      cancelText="取消"
                      placement="bottom"
                      title={'确认撤回该申请？'}
                      onConfirm={() => {
                        this.setNewState('getrecall', { id: curitem.id }, () => {
                          let total = this.props.spare.getqueryList.total,
                            page = this.props.spare.getqueryList.pageNum;
                          if ((total - 1) % 10 == 0) {
                            page = page - 1;
                          }

                          this.setState(
                            {
                              postData: { ...this.state.postData, pageIndex: page },
                            },
                            () => {
                              this.setNewState('getqueryList', postData, () => {
                                message.success('撤回成功！');
                              });
                            }
                          );
                        });
                      }}
                    >
                      <a style={{ color: '#ff4800' }}>撤回</a>
                    </Popconfirm>
                  </span>
                ) : null
              ) : null}
            </div>
          }
        >
          <Table
            bordered
            size="middle"
            scroll={{ x: 1500, y: '59vh' }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: 'small',
              pageSize: 10,
              showQuickJumper: true,
              current: getqueryList.pageNum ? getqueryList.pageNum : 1,
              total: getqueryList.total ? parseInt(getqueryList.total) : 0,
              onChange: pageChange,
            }}
            expandRowByClick
            expandedRowRender={expandedRowRender}
            rowKey="id"
            columns={columns}
            dataSource={getqueryList.list ? getqueryList.list : []}
          />
          <Modal
            width={800}
            style={{ top: 12 }}
            visible={this.state.visible}
            title={iftype.name}
            onCancel={() => {
              this.setState({ visible: false });
            }}
            footer={
              iftype.value == 'tosee'
                ? null
                : [
                    <Button
                      key="back"
                      onClick={() => {
                        this.setState({ visible: false });
                      }}
                    >
                      取消
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      onClick={() => {
                        if ([0, 1].indexOf(this.state.radio) == -1) {
                          message.warn('请选择审批结果');
                          return;
                        }
                        if (!this.state.textarea) {
                          message.warn('请填写审批意见');
                          return;
                        }
                        this.setNewState(
                          'getaudit',
                          {
                            id: curitem.id, // 配件申请主键*
                            auditResultType: this.state.radio, // 审批结果*，0：通过，1：未通过
                            auditOpinion: this.state.textarea, // 审批意见(未通过时必填)
                          },
                          () => {
                            message.success('操作成功');
                            this.resetData();
                            this.setState({
                              radio: null,
                              textarea: null,
                              visible: false,
                            });
                          }
                        );
                      }}
                    >
                      确定
                    </Button>,
                  ]
            }
          >
            {renderDetail()}
          </Modal>
          <CreateForm
            width={700}
            tableUrl={[
              {
                url: 'outqueryList',
                post: postDatac,
              },
            ]} /*配置页面表格数据*/
            fields={this.state.fields}
            iftype={iftype}
            col={{ span: 24 }}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            onRef={this.onRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            onSelectChange={this.onSelectChange}
          />
        </Card>
      </div>
    );
  }
}

export default SpareGet;
