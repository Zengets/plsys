import {
  Table,
  Tree,
  Divider,
  Row,
  Col,
  Icon,
  Select,
  Alert,
  Popconfirm,
  message,
  Card,
  Modal,
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import CreateForm from '@/components/CreateForm';
import SearchBox from '@/components/SearchBox';
import moment from 'moment';
import styles from './index.less';

const { TreeNode } = Tree,
  { Option } = Select;

@connect(({ produce, loading }) => ({
  produce,
  submitting: loading.effects['produce/excqueryList'],
}))
class Child extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedKeys: {
        checked: [],
        halfChecked: [],
      },
      iftype: {
        name: '',
        value: '',
      },
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
        planMonth: '', // 日期
        shopId: '', // 产品线主键
        companyId: '', //公司主键
        pageIndex: 1, // 第一页
        pageSize: 10, // 每页十条
      },
      postUrl: 'excqueryList',
      curitem: {},
    };
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'produce/' + type,
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
    this.props.onRef(this);
  }

  outputCur() {
    let { postUrl, postData } = this.state;
    this.setNewState(
      'aexportFileCheck',
      {
        shopId: postData.shopId,
        companyId: postData.companyId,
        planMonth: postData.planMonth,
      },
      () => {
        message.loading('正在导出文件...');
        window.open(
          `/rs/shopMonthFinishReport/exportFile?shopId=${
            postData.shopId ? postData.shopId : ''
          }&companyId=${postData.companyId ? postData.companyId : ''}&planMonth=${
            postData.planMonth ? postData.planMonth : ''
          }`
        );
      }
    );
  }

  //表单改变
  handleFormChange = changedFields => {
    let fields = this.state.fields,
      obj;
    for (let i in changedFields) {
      obj = changedFields[i];
    }
    if (obj) {
      for (let i in fields) {
        if (i == obj.name) {
          fields[i].value = obj.value;
          fields[i].name = obj.name;
          fields[i].dirty = obj.dirty;
          fields[i].errors = obj.errors;
          fields[i].touched = obj.touched;
          fields[i].validating = obj.validating;
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

  /*关闭*/
  handleCancel = () => {
    this.setState({
      fv: false,
      curitem: {},
      fields: {},
    });
  };

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (iftype.value == 'edit') {
        let postData = { ...values, id: curitem.id, companyId: curitem.companyId };
        this.setNewState('partssave', postData, () => {
          message.success('修改成功！');
          this.resetData();
        });
      } else if (iftype.value == 'add') {
        let postData = { ...values, companyId: curitem.companyId };
        this.setNewState('partssave', postData, () => {
          message.success('新增成功！');
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }
    });
  };

  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState(
      { postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : '' } },
      () => {
        this.setNewState(postUrl, this.state.postData);
      }
    );
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { excqueryList, queryByShopIdAndPlanMonth, sysCompanyList, shopList } = this.props.produce;

    let getsearchbox = key => {
        if (this.child) {
          return this.child.getColumnSearchProps(key);
        } else {
          return null;
        }
      },
      getselectbox = (key, option) => {
        if (this.child) {
          return this.child.getColumnSelectProps(key, option);
        } else {
          return null;
        }
      },
      gettreeselectbox = (key, option) => {
        if (this.child) {
          return this.child.getColumnTreeSelectProps(key, option);
        } else {
          return null;
        }
      };

    const columns = [
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '订单计划(万支)',
        dataIndex: 'orderQuantity',
        key: 'orderQuantity',
      },
      {
        title: '订单计划完成率(%)',
        dataIndex: 'orderFinishRate',
        key: 'orderFinishRate',
        render: text => <span>{text ? `${text}%` : ''}</span>,
      },
      {
        title: '计划开线',
        dataIndex: 'planLines',
        key: 'planLines',
      },
      {
        title: '实际开线',
        dataIndex: 'actualLines',
        key: 'actualLines',
      },
      {
        title: '开机率(%)',
        dataIndex: 'lineRate',
        key: 'lineRate',
        render: text => <span>{text ? `${text}%` : ''}</span>,
      },
      {
        title: '累计完成量(万支)',
        dataIndex: 'totalFinishQuantity',
        key: 'totalFinishQuantity',
      },
      {
        title: '生产计划完成率(%)',
        dataIndex: 'totalFinishRate',
        key: 'totalFinishRate',
        render: text => <span>{text ? `${text}%` : ''}</span>,
      },
      {
        title: '核实废料(kg)',
        dataIndex: 'rejectQuantity',
        key: 'rejectQuantity',
      },
      {
        title: '产品重量(kg)',
        dataIndex: 'rejectRateDenominator',
        key: 'rejectRateDenominator',
      },
      {
        title: '废品率(%)',
        dataIndex: 'rejectRate',
        key: 'rejectRate',
        render: text => <span>{text ? `${text}%` : ''}</span>,
      },
      {
        title: '计划标准工时(小时)',
        dataIndex: 'planSimpleHours',
        key: 'planSimpleHours',
      },
      {
        title: '实际标准工时(小时)',
        dataIndex: 'actualSimpleHours',
        key: 'actualSimpleHours',
      },
      {
        title: '实际工时(小时)',
        dataIndex: 'actualHours',
        key: 'actualHours',
      },
      {
        title: '人效比(%)',
        dataIndex: 'manRate',
        key: 'manRate',
        render: text => <span>{text ? `${text}%` : '0%'}</span>,
      },
      {
        title: '计划准确率(%)',
        dataIndex: 'planExactRate',
        key: 'planExactRate',
        render: text => <span>{text ? `${text}%` : '0%'}</span>,
      },
    ];

    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} />;
      });

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (!curitem.id) {
        return curitem.companyId === record.companyId;
      } else if (curitem && curitem.id === record.id) {
        return 'selectedRow';
      }

      return null;
    };
    let pageChange = page => {
      this.setState(
        {
          postData: { ...this.state.postData, pageIndex: page },
        },
        () => {
          this.setNewState('excqueryList', this.state.postData);
        }
      );
    };

    return (
      <div className={styles.rightrender}>
        <SearchBox
          onRef={this.onRef}
          handleSearch={this.handleSearch}
          postData={this.state.postData}
        />
        <Card
          title="订单计划"
          extra={
            <div>
              <label>选择日期：</label>
              <DatePicker.MonthPicker
                allowClear={false}
                value={postData.planMonth ? moment(postData.planMonth) : undefined}
                onChange={value => {
                  this.setState(
                    {
                      postData: {
                        ...postData,
                        planMonth: moment(value).format('YYYY-MM'),
                      },
                    },
                    () => {
                      this.resetData();
                    }
                  );
                }}
              />
              <Divider type="vertical" />
              <label>选择组织：</label>
              <Select
                style={{ width: 160 }}
                value={postData.companyId}
                onChange={val => {
                  this.setState(
                    {
                      postData: {
                        ...postData,
                        companyId: val,
                        shopId: '',
                      },
                    },
                    () => {
                      this.setNewState('queryOfCompany', { companyId: val }, () => {});
                      this.resetData();
                    }
                  );
                }}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                allowClear
              >
                {sysCompanyList &&
                  sysCompanyList.map((item, i) => {
                    return (
                      <Option title={item.companyName} key={i} value={item.id}>
                        {item.companyName}
                      </Option>
                    );
                  })}
              </Select>
              <Divider type="vertical" />

              <label>选择产品线：</label>
              <Select
                style={{ width: 220 }}
                value={postData.shopId}
                onChange={val => {
                  this.setState(
                    {
                      postData: {
                        ...postData,
                        shopId: val,
                      },
                    },
                    () => {
                      this.resetData();
                    }
                  );
                }}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                allowClear
              >
                {shopList &&
                  shopList.map((item, i) => {
                    return (
                      <Option title={item.shopName} key={i} value={item.id}>
                        {item.shopName}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          }
        >
          <Table
            bordered
            size="middle"
            expandRowByClick
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            scroll={{ x: 1980, y: '59vh' }}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: 'small',
              pageSize: 10,
              showQuickJumper: true,
              current: excqueryList.pageNum ? excqueryList.pageNum : 1,
              total: excqueryList.total ? parseInt(excqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey="id"
            columns={columns}
            dataSource={excqueryList ? excqueryList.list : []}
          />
          {fields && (
            <CreateForm
              fields={fields}
              iftype={iftype}
              onChange={this.handleFormChange}
              wrappedComponentRef={this.saveFormRef}
              visible={fv}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
          )}
        </Card>
      </div>
    );
  }
}

export default Child;
