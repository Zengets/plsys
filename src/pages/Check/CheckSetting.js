import {
  Table, Icon,
  Popconfirm, Divider,
  message, Card, Modal
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import Link from 'umi/link'
import Abload from '@/components/Abload';
//checkSqueryList,checkSsave,checkSdeleteById,checkssave,checksdeleteById,checksqueryList
@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/checkSqueryList'],
  submittings: loading.effects['check/checksqueryList'],
  checkSsave: loading.effects['check/checkSsave'],
  checkssave: loading.effects['check/checkssave'],
}))
class CheckSetting extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
    ]
    this.state = {
      expandedRowKeys: [],
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: undefined,
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 10,
        equipmentName: "",
        equipmentNo: "",
        equipmentModel: ""
      },
      postUrl: "checkSqueryList",
      postDatas: {
        "pageIndex": "1",  //---------------当前页码(必传)
        "pageSize": "10",  //---------------每页条数(必传)
        "equipmentId": ""
      },
      postDataz: {
        pageIndex: 1,    //第几页
        pageSize: 10,     //每页大小
        equipmentNo: "",//编号
        equipmentName: "",//设备名
        positionNo: "",//位置编号
        equipmentTypeId: "",//类型
      },
      curitem: {},
    }
  }


  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'check/' + type,
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
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel()
    })
  }

  componentWillMount() {
    this.resetData();
    this.setNewState('deviceTypequeryTreeList', null);
  }


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
  /* */
  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };
    this.setState({
      fields
    })
  }
  /*关闭*/
  handleCancel = () => {
    let curitem = this.state.curitem;
    if (this.state.curitem.id) {
      curitem = this.props.check[this.state.postUrl].page.list.filter((item) => { return item.id == curitem.id })[0]
    }
    this.setState({
      fv: false,
      curitem: curitem ? curitem : {},
      fields: {
        equipmentIds: {
          value: undefined,
          type: "table",
          title: "选择设备",
          keys: "equipmentIds",
          requires: true,
          columns: this.columns,
          dataSource: "queryPageList",
          hides: false,
          dv: "id",
          lb: "equipmentName"
        },

      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype,curitemz } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("checkSsave", postData, () => {
          message.success("新增成功！");
          this.resetData();
        });
      } else if (iftype.value == "itemadd") {
        let postData = { ...values, equipmentId: curitem.id };
        this.setNewState("checkssave", postData, () => {
          message.success("新增成功！");
          this.handleCancel();
          this.getChildTable(curitem, true);
        });
      }else if(iftype.value == "itemedit"){
        let postData = { ...values, equipmentId: curitem.id,id:curitemz.id };
        this.setNewState("checkssave", postData, () => {
          message.success("修改成功！");
          this.handleCancel();
          this.getChildTable(curitem, true);
        });
      }

    });
  }


  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  handleSearchz = (selectedKeys, dataIndex) => {
    let postUrl = "queryPageList"
    this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDataz)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }

  onRefz = (ref) => {
    this.childz = ref;
  }

  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
      postDatas: {
        equipmentId: record.id,
        pageIndex: 1,
        pageSize: 10,
      },
      curitem: record
    }, () => {
      this.setNewState("checksqueryList", this.state.postDatas)
    })
  }


  render() {
    let { postData, postDatas, expandedRowKeys, fv, fields, iftype, curitem } = this.state,
      { checkSqueryList: { page }, checksqueryList, deviceTypequeryTreeList, periodType, roleList,search } = this.props.check;


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
    }, col = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 6,
      xxl: 6
    }, getsearchboxz = (key) => {
      if (this.childz) {
        return this.childz.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxz = (key, option) => {
      if (this.childz) {
        return this.childz.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    };
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchboxz("equipmentNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchboxz("equipmentName")
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchboxz("positionNo")
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectboxz('equipmentTypeId', deviceTypequeryTreeList),
      },
    ]

    const columns = [
      {
        title: '编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo')
      },
      {
        title: '名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName')
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox('positionNo')
      },
      {
        title: '类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectbox('equipmentTypeId', search.equipmentTypeTreeList?search.equipmentTypeTreeList:[]),
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        key: 'statusName',
        ...getselectbox('status', search.equipmentStatusList),
        render: (text, record) => <a style={{
          color: record.status == 0 ? "green" :
            record.status == 1 ? "#398dcd" :
              record.status == 2 ? "#999" :
                record.status == 5 ? "#ff5000" :
                  "lightred"
        }}>{text}</a>
      },
      {
        title: '型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        ...getsearchbox('equipmentModel')
      },
      {
        title: '所在部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        ...gettreeselectbox('departmentId', search.departmentDataList ? search.departmentDataList: [])
      },
      {
        title: '产品线',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox('shopId',search.shopList?search.shopList.map((item)=>{
          return {
            dicName:item.shopName,
            dicKey:item.id
          }
        }):null)
      },
      {
        title: '保管负责人',
        dataIndex: 'keepUserName',
        key: 'keepUserName',
        ...getsearchbox('keepUserName')
      },
      {
        title:"点检历史",
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => <Link to={`/yxt/check/checksetting/checkhistory/${record.id}/${record.equipmentName}`}>查看点检历史</Link>
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          二维码
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1, //(int)页码
                pageSize: 10, //(int)条数
                equipmentNo:"",
                equipmentName:"",
                positionNo:"",
                equipmentTypeId:"",
                status:"",
                equipmentModel:"",
                departmentId:"",
                shopId:"",
                isMain:""
              } //(int)部门id}
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4,marginLeft:8 }} />
            重置
          </a>
        </span>,
        dataIndex: 'qrCodeUrl',
        key: 'qrCodeUrl',
        render: (text, record) => (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览${record.equipmentName}的二维码`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),
            
          });
        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
      }
    ];

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("checkSqueryList", this.state.postData);
      })
    }, pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("checksqueryList", this.state.postDatas);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    let renderAdd = (record) => {
      let column = [
        {
          title: '点检项',
          dataIndex: 'pointCheckItem',
          key: 'pointCheckItem',
        },
        {
          title: '负责角色',
          dataIndex: 'roleName',
          key: 'roleName',
        },
        {
          title: '方法/标准',
          dataIndex: 'methodStandard',
          key: 'methodStandard',
        },
        {
          title: '周期',
          dataIndex: 'periodTypeName',
          key: 'periodTypeName',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
        },
        {
          title:"操作",
          dataIndex:"action",
          key:"action",
          render:(text,record)=><span>
            <a onClick={()=>{
              this.setState({
                fields: {
                  pointCheckItem: {
                    value: record.pointCheckItem,
                    type: "input",
                    title: "点检项",
                    keys: "pointCheckItem",
                    requires: true
                  },
                  roleId: {
                    value: record.roleId,
                    type: "select",
                    title: "负责角色",
                    keys: "roleId",
                    requires: true,
                    option: roleList ? roleList.map((item) => {
                      return {
                        name: item.roleName,
                        id: item.id
                      }
                    }) : null
                  },
                  methodStandard: {
                    value: record.methodStandard,
                    type: "input",
                    title: "方法/标准",
                    keys: "methodStandard",
                    requires: true
                  },
                  periodType: {
                    value: record.periodType,
                    type: "select",
                    title: "周期",
                    keys: "periodType",
                    requires: true,
                    option: periodType ? periodType.map((item) => {
                      return {
                        name: item.dicName,
                        id: item.dicKey
                      }
                    }) : null
                  },
                  remark: {
                    value: record.remark,
                    type: "textarea",
                    title: "备注",
                    keys: "remark",
                    requires: false
                  },
                },
                fv: true,
                curitemz:record,
                iftype: {
                  name: `修改${curitem.equipmentName}下的点检项`,
                  value: "itemedit"
                }
              })
            }}>修改</a>
            <Divider type='vertical'></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该点检项？"}
              onConfirm={() => {
                this.setNewState("checksdeleteById", { id: record.id }, () => {
                  let total = checksqueryList.total,
                    page = checksqueryList.pageNum;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }
                  this.setState({
                    postDatas: { ...this.state.postDatas, pageIndex: page }
                  }, () => {
                    this.getChildTable(record, true);
                    message.success("删除成功！");
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </span>
        }
      ]


      return <Table bordered
        size="middle"
        loading={this.props.submittings}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 10,
          showQuickJumper: true,
          current: checksqueryList.pageNum ? checksqueryList.pageNum : 1,
          total: checksqueryList.total ? parseInt(checksqueryList.total) : 0,
          onChange: pageChanges,
        }}
        rowKey='id'
        columns={column}
        dataSource={checksqueryList.list ? checksqueryList.list : []}
      >
      </Table>


    }
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>

        <Card title='点检计划' extra={<div style={{ display: "flex" }}>
          {/* <span style={{ cursor: "pointer" }} onClick={() => {
            this.setState({
              iftype: {
                name: "新增点检",
                value: "add"
              },
            }, () => {
              this.setState({
                fv: true
              })
            })
          }}>新增</span> */}

          <div style={{ display: curitem.id ? "flex" : "none", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                fields: {
                  pointCheckItem: {
                    value: null,
                    type: "input",
                    title: "点检项",
                    keys: "pointCheckItem",
                    requires: true
                  },
                  roleId: {
                    value: null,
                    type: "select",
                    title: "负责角色",
                    keys: "roleId",
                    requires: true,
                    option: roleList ? roleList.map((item) => {
                      return {
                        name: item.roleName,
                        id: item.id
                      }
                    }) : null
                  },
                  methodStandard: {
                    value: null,
                    type: "input",
                    title: "方法/标准",
                    keys: "methodStandard",
                    requires: true
                  },
                  periodType: {
                    value: null,
                    type: "select",
                    title: "周期",
                    keys: "periodType",
                    requires: true,
                    option: periodType ? periodType.map((item) => {
                      return {
                        name: item.dicName,
                        id: item.dicKey
                      }
                    }) : null
                  },
                  remark: {
                    value: null,
                    type: "textarea",
                    title: "备注",
                    keys: "remark",
                    requires: false
                  },
                },
                fv: true,
                iftype: {
                  name: `新增${curitem.equipmentName}下的点检项`,
                  value: "itemadd"
                }
              })
            }}>新增点检项</a>
            <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottom"
              title={"确认删除该点检？"}
              onConfirm={() => {
                this.setNewState("checkSdeleteById", { id: curitem.id }, () => {
                  let checkSqueryList = this.props.check.checkSqueryList.page;
                  let total = checkSqueryList?checkSqueryList.total:1,
                    page = checkSqueryList?checkSqueryList.pageNum:1;
                  if ((total - 1) % 10 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("checkSqueryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
            <Divider type="vertical" style={{ marginTop: 6 }}></Divider>
          </div>
          <Abload reload={() => {
            this.resetData()
          }} postName="uploadequipmentPointCheckPlan"  filePath="http://www.plszems.com/download/点检计划导入模板.xlsx"></Abload>
           <Divider type='vertical' style={{ marginTop: 3 }}></Divider>
            <a onClick={() => {
              message.loading("正在导出文件...")
            }} href={`/rs/equipmentPointCheckItem/export`} target="_blank">
               导出点检项
            </a>
        </div>
        }>
          <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            expandRowByClick
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: page ? page.pageNum : 1,
              total: page ? parseInt(page.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={page ? page.list : []}
            expandedRowRender={record => renderAdd(record)}
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
          >
          </Table>

          <CreateForm
            tableUrl={[{
              url: "queryPageList",
              post: this.state.postDataz
            }]}/*配置页面表格数据*/
            width={800}
            fields={this.state.fields}
            iftype={iftype}
            confirmLoading={iftype.value == "itemadd" ? this.props.checkssave : this.props.checkSsave}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            onSelectChange={this.onSelectChange}
          />


        </Card>
      </div>
    )
  }


}

export default CheckSetting



