import {
  Table, Input, Popconfirm, Form, Modal, Tree, Button, Row, Col, Icon, Select, Popover, Tag, message, Card, InputNumber, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
const { Meta } = Card;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

@connect(({ device, loading }) => ({
  device,
}))
class DeviceRepair extends React.Component {
  constructor(props) {
    super(props);
    this.columnes = [
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
        title: '配件数量',
        dataIndex: 'availableStock',
        key: 'availableStock',
      },
      {
        title: '消耗数量',
        dataIndex: 'availableStocks',
        key: 'availableStocks',
        render: (text, record) => {
          let vals = this.state.fields.spare.value ? this.state.fields.spare.value : [], res,
            values = this.state.fields.spare.submit ? this.state.fields.spare.submit : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.userSparePartsId == record.id) {
              res = item.consumeCount
            }
          })

          if (vals.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return <InputNumber min={1} max={record.availableStock} value={res} onChange={(val) => {
              let newvalues = values.map((item, i) => {
                if (item.userSparePartsId == record.id) {
                  item.consumeCount = val
                }
                return item
              })
              fields.spare.submit = newvalues
              this.setState({
                fields
              })
            }} />
          }

        }
      },
    ]
    this.state = {
      collspan: false,
      step: 0,
      fv: false,
      curid: "",
      iftype: {
        name: "",
        value: ""
      }
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }
  resetData(fn) {
    this.setNewState("queryByEquipmentId", { id: this.props.match.params.id }, () => {
      fn ? fn() : null
    });
    this.setNewState("queryAllRepair", { id: this.props.match.params.id });
  }

  componentDidMount() {
    this.resetData()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setNewState("queryByEquipmentId", { id: nextProps.match.params.id })
      this.setNewState("queryAllRepair", { id: nextProps.match.params.id });
    }
  }

  /*--表单操作 --*/
  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };

    if (name == "spare") {//输入内容
      let Inarr = fields[name].submit ? fields[name].submit.map((item) => {
        return item.userSparePartsId
      }) : []

      function getval(key) {
        let results = ""
        fields[name].submit ? fields[name].submit.map((item) => {
          if (item.userSparePartsId == key) {
            results = item.consumeCount
          }
        }) : null
        return results
      }

      let submit = selectval.map((item) => {
        if (Inarr.indexOf(item) == -1) {
          return {
            "userSparePartsId": item,
            "consumeCount": undefined
          }
        } else {
          return {
            "userSparePartsId": item,
            "consumeCount": getval(item)
          }
        }

      })
      fields[name] = { ...fields[name], value: selectval, submit };
    }
    this.setState({
      fields
    })
  }


  //表单改变
  handleFormChange = (changedFields) => {
    let fields = this.state.fields, obj;
    let { repairConfirm } = this.props.device
    let confirmRoleType = repairConfirm.confirmRoleType;
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
          if (i == "spare") {
            this.onSelectChange(fields[i].value, i)
          }
          if (i == "mainType") {
            this.setNewState("getChildren", {
              id: obj.value
            }, () => {
              fields.faultType.value = null;
              fields.faultType.option = this.props.device.getChildren ? this.props.device.getChildren.map((item) => {
                return {
                  name: item.faultPhenomenon,
                  id: item.id
                }
              }) : [];
            })
          }
          //applyRepairUser5sConfirm,pqcQualityConfirm!confirmIsPass verifyUserList
          if (i == "applyRepairUser5sConfirm" || i == "pqcQualityConfirm") {
            fields.confirmIsPass.hides = false;
            fields.confirmIsPass.value = obj.value == "0" && i == "pqcQualityConfirm" ? "2" : fields.confirmIsPass.value;
            fields.confirmIsPass.disabled = obj.value == "0" && i == "pqcQualityConfirm"
          }
          if(i=="applyType"){
            this.setNewState("getDetailByDicId",{dicKey:obj.value},()=>{
              let {getDetailByDicId} = this.props.device;
              this.state.fields.applyPhenomenon.option = getDetailByDicId.map((item)=>{
                return {
                  name:item.dicName,
                  id:item.dicKey
                }
              });
            })
          }
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
    this.setState({
      fv: false,
      fields: {
      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, step, iftype, curid, fields } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      for (let i in values) {
        if (!values[i]) {
          values[i] = ''
        } else {
          if (i == "faultTime") {
            values[i] = moment(values[i]).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      }
      if (step == 4) {
        let faultPicUrl = "";
        if (values.faultPicUrl.length > 0) {
          let last = values.faultPicUrl[values.faultPicUrl.length - 1];
          if (last.response) {
            faultPicUrl = last.response.data.dataList[0]
          }
        }
        let postData = { ...values, faultPicUrl: faultPicUrl, equipmentId: curid, status: 1 };
        this.setNewState("repair", postData, () => {
          message.success("报修成功！");
          console.log(this.props.match.params.ifs)

          if(this.props.match.params.ifs){
            console.log(this.props.match.params.ifs)
            this.setNewState("checkRepairAfter",{id:this.props.match.params.ifs,handleId:this.props.device.checkRepairAfter})
          }
          this.setState({ fv: false });
          this.resetData();
        });
      } else if (step == 1) {
        let postData = { ...values, id: curid, status: 2 };
        this.setNewState("repair", postData, () => {
          this.setState({ fv: false });
          this.resetData();
          message.success("开始维修成功！");
        });
      } else if (step == 2) {
        delete values.mainType;
        let postData = { ...values, spare: fields.spare.submit, id: curid, status: 3 };
        this.setNewState("repair", postData, () => {
          this.setState({ fv: false });
          this.resetData();
          message.success("完成维修成功！");
        });
      } else if (step == 3) {
        let postData = { ...values, id: curid, status: 4 };
        this.setNewState("repair", postData, () => {
          this.setState({ fv: false });
          this.resetData();
          message.success("操作成功！");
        });
      }
    });
  }

  getOption(ls, name, id) {
    let res = this.props.device[ls];
    let result = res.map((item) => {
      return {
        name: name ? item[name] : item.dicName,
        id: id ? item[id] : item.dicKey
      }
    })
    return result
  }

  toNext = (id, step, can) => {
    if (!can) {
      message.warn("不可操作当前步骤！")
      return
    }
    let { confirmUserList, repairConfirm , applyTypeList , getDetailByDicId } = this.props.device
    let confirmRoleType = repairConfirm.confirmRoleType;

    let fields = {};
    switch (step) {
      case 4:
        let userList = this.props.device.queryAllRepair ? this.props.device.queryAllRepair.map((item, i) => {
          return {
            name: item.userName+" - "+item.shiftName,
            id: item.id
          }
        }) : [];

        fields = {
          repairUserId: {
            value: null,
            type: "select",
            title: "维修人",
            keys: "repairUserId",
            requires: true,
            option: userList
          },

          applyType:{
            value: null,
            type: "select",
            title: "报修类型",
            keys: "applyType",
            requires: true,
            option: applyTypeList.map((item)=>{
              return {
                name:item.dicName,
                id:item.dicKey
              }
            })
          },

          applyPhenomenon: {
            value: null,
            type: "select",
            title: "报修现象",
            keys: "applyPhenomenon",
            requires: true,
          },
          // faultTime: {
          //   value: null,
          //   type: "datepicker",
          //   title: "故障时间",
          //   keys: "faultTime",
          //   showTime: true,
          //   disabledDate: (current) => {
          //     // Can not select days before today and today
          //     return current && current > moment().endOf('day');
          //   },
          //   disabledDateTime: () => {
          //     let h = new Date().getHours() + 1,
          //       m = new Date().getMinutes() + 1,
          //       s = new Date().getSeconds() + 1;

          //     return {
          //       disabledHours: () => range(0, 24).splice(h, 24),
          //       disabledMinutes: () => range(m, 60),
          //       disabledSeconds: () => range(s, 60),
          //     };
          //   },
          //   requires: true,
          // },
          faultDesc: {
            value: null,
            type: "textarea",
            title: "故障描述",
            keys: "faultDesc",
            requires: false,
          },
          faultPicUrl: {
            value: null,
            type: "upload",
            title: "故障图片",
            uploadtype: "image",
            multiple: false,
            keys: "faultPicUrl",
            requires: false,
          }
        }
        this.setState({
          fv: true,
          iftype: {
            name: "设备报修",
            value: "repair"
          }
        })
        break
      case 1:
        fields = {
          repairIsPowerOff: {
            value: "0",
            type: "select",
            title: "是否关机维修",
            keys: "repairIsPowerOff",
            requires: true,
            option: [{ name: "关机", id: "1" }, { name: "不关机", id: "0" }],
          }
        }
        this.setState({
          fv: true,
          iftype: {
            name: "开始维修",
            value: "repair"
          }
        })
        break

      case 2:
        fields = {
          faultClassify: {
            value: null,
            type: "select",
            title: "故障类型",
            keys: "faultClassify",
            requires: true,
            option: this.getOption("faultClassifyList")
          },
          mainType: {
            value: null,
            type: "select",
            title: "故障名称",
            keys: "mainType",
            requires: true,
            option: this.getOption("faultTypeList", "faultName", "id"),
          },
          faultType: {
            value: null,
            type: "select",
            title: "故障现象",
            keys: "faultType",
            requires: true,
            option: this.props.device.getChildren ? this.props.device.getChildren.map((item) => {
              return {
                name: item.faultPhenomenon,
                id: item.id
              }
            }) : []
          },
          repairType: {
            value: null,
            type: "select",
            title: "维修类型",
            keys: "repairType",
            requires: true,
            option: this.getOption("repairTypeList")
          },
          faultLevel: {
            value: null,
            type: "select",
            title: "故障等级",
            keys: "faultLevel",
            requires: true,
            option: this.getOption("faultLevelList")
          },
          repairUserConfirmBox: {
            value: null,
            type: "select",
            title: "工具箱确认",
            keys: "repairUserConfirmBox",
            requires: true,
            option: [{ name: "通过", id: "1" }, { name: "不通过", id: "0" }]
          },
          faultReason: {
            value: null,
            type: "select",
            title: "故障原因",
            keys: "faultReason",
            requires: true,
            option: this.getOption("faultReasonList")
          },
          repairContent: {
            value: null,
            type: "input",
            title: "维修内容",
            keys: "repairContent",
            requires: true
          },
          verifyUserList: {
            value: [],
            type: "select",
            title: "验证人",
            keys: "verifyUserList",
            multiple: true,
            requires: true,
            option: confirmUserList ? confirmUserList.map((item) => {
              return {
                name: item.userName,
                id: item.userId
              }
            }) : [],
          },
          spare: {
            value: undefined,
            type: "table",
            title: "消耗配件",
            keys: "spare",
            requires: false,
            columns: this.columnes,
            dataSource: "pairqueryPageByUserId",
            dv: "id",
            col: { span: 24 },
            lb: "sparePartsName",
            submit: []
          },
        }

        this.setState({
          fv: true,
          iftype: {
            name: "完成维修",
            value: "repair"
          }
        })
        break

      case 3:
        console.log(confirmRoleType)
        fields = {
          applyRepairUser5sConfirm: {
            value: null,
            type: "select",
            title: "5S确认",
            keys: "applyRepairUser5sConfirm",
            requires: true,
            option: [{
              name: "通过",
              id: "1"
            }, {
              name: "不通过",
              id: "0"
            }],
            hides: confirmRoleType != "1" && confirmRoleType != "3"
          },
          pqcQualityConfirm: {
            value: null,
            type: "select",
            title: "品质确认",
            keys: "pqcQualityConfirm",
            requires: true,
            option: [{
              name: "通过",
              id: "1"
            }, {
              name: "不通过",
              id: "0"
            }],
            hides: confirmRoleType != "2" && confirmRoleType != "3"
          },
          confirmIsPass: {
            value: null,
            type: "select",
            title: "验证结果",
            keys: "confirmIsPass",
            requires: true,
            option: [{
              name: "通过",
              id: "1"
            }, {
              name: "不通过",
              id: "2"
            }],
            hides: !(confirmRoleType != "2" && confirmRoleType != "1")
          },

          confirmDesc: {
            value: null,
            type: "textarea",
            title: "说明",
            keys: "confirmDesc",
            requires: true,
          }
        }
        this.setState({
          fv: true,
          iftype: {
            name: "维修验证",
            value: "repaircheck"
          }
        })
        break
    }
    this.setState({
      fields,
      step,
      curid: id
    })

  }

  render() {
    let { collspan, fields, iftype, fv } = this.state,
      { queryByEquipmentId, repairs, queryAllRepair, repairConfirm, confirmDetails } = this.props.device;
    let record = queryByEquipmentId;

    const content = (
      <div>
        <img style={{ width: "200px", height: "auto", margin: "20px 0px" }} src={record.qrCodeUrl} onError={(e) => { e.target.src = './images/default.png' }} />
      </div>
    );
    const contents = (
      <div className={styles.limitdiv}>
        <p>设备编号：<span>{record.equipmentNo}</span></p>
        <p>设备位置号：<span>{record.positionNo}</span></p>
        <p>设备名称：<span>{record.equipmentName}</span></p>
        <p>设备型号：<span>{record.equipmentModel}</span></p>
        <p>设备类型：<span>{record.equipmentTypeName}</span></p>
        <p>所在部门：<span>{record.departmentName}</span></p>
        <p>能<i style={{ opacity: 0 }}>所在</i>耗：<span>{record.energyConsumption} kw</span></p>
        <p>价<i style={{ opacity: 0 }}>所在</i>值：<span>{record.equipmentWorth} 万元</span></p>
      </div>
    );

    let col = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: collspan ? 14 : 24,
      xl: collspan ? 15 : 24,
      xxl: collspan ? 16 : 24
    }, cols = {
      xs: collspan ? 24 : 0,
      sm: collspan ? 24 : 0,
      md: collspan ? 24 : 0,
      lg: collspan ? 10 : 0,
      xl: collspan ? 9 : 0,
      xxl: collspan ? 8 : 0
    }
    return (
      <div>
        <div style={{ padding: "0 6px" }}>
          <Row gutter={24}>
            <Col {...col} style={{ padding: 6 }}>
              <Card
                title={<span>设备<span style={{ color: "#398dcd" }}>{record.equipmentName}</span>的信息</span>}
                extra={<Button onClick={() => {
                  this.setState({
                    collspan: !collspan
                  })
                }}>{collspan ? "隐藏" : "展示"}维修信息</Button>}
              >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Card
                    hoverable
                    style={{ width: 400, marginTop: 12 }}
                    title="设备详情"
                    extra={repairs.status == "6"?
                      <Button type='danger' onClick={() => {
                        let _it = this;
                        Modal.confirm({
                          title: '审批撤销申请?',
                          content: <div style={{display:"flex",marginTop:20,alignItems:"center"}}>
                            <p style={{margin:0}}>是否通过:</p> 
                            <Select style={{flex:1,marginLeft:8}}
                             showSearch
                             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                             onChange={(val)=>{
                                _it.setState({
                                  recallAuditIsPass:val
                                })
                              }}>
                              <Option value="1">通过</Option>
                              <Option value="0">不通过</Option>
                            </Select>  
                          </div>,
                          okText: "审批",
                          cancelText: "取消",
                          onOk() {
                            if(!_it.state.recallAuditIsPass){
                              message.warn("请选择审批结果！");
                              return
                            }
                            _it.setNewState("stopRepair", { id: record.repairId, recallAuditIsPass:_it.state.recallAuditIsPass }, () => {
                              _it.resetData();
                              _it.setState({
                                recallAuditIsPass:undefined
                              })
                            })
                          },
                          onCancel() {
                          },
                        })
                      }}>审批</Button>
                      :<Button type='danger' style={{ display: record.repairStatus == 1 ? "block" : "none" }} onClick={() => {
                      let _it = this;
                      Modal.confirm({
                        title: '申请撤销该维修流程?',
                        content: <div style={{display:"flex",marginTop:20,alignItems:"center"}}>
                          <p style={{margin:0}}>撤销原因:</p> 
                          <Select style={{flex:1,marginLeft:8}}
                           showSearch
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                           onChange={(val)=>{
                              _it.setState({
                                preSend:val
                              })
                            }}>
                            {
                              this.props.device.recallReasonList&&
                              this.props.device.recallReasonList.map((item,i)=>(<Option key={i} value={item.dicKey}>{item.dicName}</Option>))
                            }  
                          </Select>  
                        </div>,
                        okText: "撤销",
                        cancelText: "取消",
                        onOk() {
                          if(!_it.state.preSend){
                            message.warn("请填写撤销原因！");
                            return
                          }
                          _it.setNewState("stopRepair", { id: record.repairId, recallReason:_it.state.preSend }, () => {
                            _it.resetData();
                            _it.setState({
                              preSend:undefined
                            })
                          })
                        },
                        onCancel() {
                        },
                      })
                    }}>撤销申请</Button>}
                    cover={
                      <Popover placement="leftTop" content={content} title="设备二维码">
                        <img onClick={() => {
                          Modal.info({
                            maskClosable: true,
                            width:800,
                            title: `预览${record.equipmentName}的图片`,
                            okText: "关闭",
                            content: (
                              <div style={{ width: "100%" }}>
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={record.pictureUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                              </div>
                            ),
                            
                          });
                        }} src={record.pictureUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                        </Popover>}
                  >
                    <Popover placement="rightBottom" content={contents} title="设备详情">
                      <Meta title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <a>{record.equipmentName}</a>
                        <span style={{
                          color: record.status == 2 ? "#ff2100" :
                            record.status == 3 ? "#ff5000" :
                              record.status == 5 ? "#999" :
                                record.status == 1 || record.status == 0 ? "green" : "#398dcd"
                        }}>{record.statusName}</span>
                      </div>}
                        description={
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>编号：{record.equipmentNo}</span>
                            <span>型号：{record.equipmentModel}</span>
                          </div>
                        } />
                    </Popover>
                  </Card>
                  <ul className={styles.baoxiubox}>
                    <li>
                      <div className={record.repairStatus == 4 ? styles.cur : null} onClick={() => {
                        this.toNext(record.id, 4, record.repairStatus == 4)
                      }}>
                        <img src="./images/baoxiu.png" alt="" />
                        <img src="./images/baoxiu2.png" alt="" />
                      </div>
                      <p>设备报修</p>
                    </li>
                    <li>
                      <div className={record.repairStatus == 1 ? styles.cur : null} onClick={() => {
                        this.toNext(record.repairId, 1, record.repairStatus == 1)
                      }}>
                        <img src="./images/weixiu.png" alt="" />
                        <img src="./images/weixiu2.png" alt="" />
                      </div>
                      <p>开始维修</p>
                    </li>
                    <li>
                      <div className={record.repairStatus == 2 ? styles.cur : null} onClick={() => {
                        this.toNext(record.repairId, 2, record.repairStatus == 2)
                      }}>
                        <img src="./images/wancheng.png" alt="" />
                        <img src="./images/wancheng2.png" alt="" />
                      </div>
                      <p>完成维修</p>
                    </li>
                    <li>
                      <div className={record.repairStatus == 3 ? styles.cur : null} onClick={() => {
                        this.toNext(record.repairId, 3, record.repairStatus == 3)
                      }}>
                        <img src="./images/yanzheng.png" alt="" />
                        <img src="./images/yanzheng2.png" alt="" />
                      </div>
                      <p>维修验证</p>
                    </li>
                  </ul>

                </div>


              </Card>
            </Col>
            <Col {...cols} style={{ padding: 6 }}>
              <Card title={<span style={{ padding: "4px 0px", display: "block" }}>设备<span style={{ color: "#398dcd" }}>{record.equipmentName}</span>的维修信息</span>}>
                {
                  repairs.id ?
                    <div className={styles.limitdivc}>
                      <p>
                        <span>故障图片</span>
                        <img onClick={() => {
                          Modal.info({
                            maskClosable: true,
                            title: `预览`,
                            okText: "关闭",
                            content: (
                              <div style={{ width: "100%" }}>
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={repairs.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                              </div>
                            ),
                            
                          });
                        }} style={{ width: 30, height: 30, marginLeft: 8, cursor: "pointer" }} src={repairs.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                      </p>
                      <p>
                        <span>故障等级</span>
                        <span>{repairs.faultLevelName}</span>
                      </p>
                      <p>
                        <span>故障类型</span>
                        <span>{repairs.faultClassifyName}</span>
                      </p>
                      <p>
                        <span>故障名称</span>
                        <span>{repairs.faultTypeName}</span>
                      </p>
                      <p>
                        <span>故障现象</span>
                        <span>{repairs.faultPhenomenon}</span>
                      </p>
                      <p>
                        <span>故障时间</span>
                        <span>{repairs.faultTime}</span>
                      </p>
                      <p>
                        <span>故障描述</span>
                        <span>{repairs.faultDesc}</span>
                      </p>
                      <p>
                        <span>故障原因</span>
                        <span>{repairs.faultReasonName}</span>
                      </p>
                      <p>
                        <span>报修人</span>
                        <span>{repairs.applyRepairUserName}</span>
                      </p>
                      <p>
                        <span>班次</span>
                        <span>{repairs.shiftName}</span>
                      </p>
                      <p>
                        <span>报修时间</span>
                        <span>{repairs.applyRepairTime}</span>
                      </p>
                      <p>
                        <span>维修类型</span>
                        <span>{repairs.repairTypeName}</span>
                      </p>
                      <p>
                        <span>维修人名</span>
                        <span>{repairs.repairUserName}</span>
                      </p>
                      <p>
                        <span>维修状态</span>
                        <span>{repairs.statusName}</span>
                      </p>
                      <p>
                        <span>维修内容</span>
                        <span>{repairs.repairContent}</span>
                      </p>
                      <p>
                        <span>维修开始时间</span>
                        <span>{repairs.repairStartTime}</span>
                      </p>
                      <p>
                        <span>维修结束时间</span>
                        <span>{repairs.repairEndTime}</span>
                      </p>
                      <p>
                        <span>工具箱确认</span>
                        <span>{repairs.repairUserConfirmBox == "0" ? "不通过" : repairs.repairUserConfirmBox == "1" ? "通过" : ""}</span>
                      </p>

                      <p>
                        <span>验证人名</span>
                        <span>{repairs.confirmUserName}</span>
                      </p>
                      <p>
                        <span>验证详情</span>
                        <span>
                          <Tag color="#f50" onClick={() => {
                            this.resetData(() => {
                              Modal.info({
                                width: 1000,
                                title: "验证详情",
                                okText: "知道了",
                                content: (
                                  <Table bordered dataSource={confirmDetails}
                                    pagination={false}
                                    columns={[
                                      {
                                        title: '验证人姓名',
                                        dataIndex: 'confirmUserName',
                                        key: 'confirmUserName',
                                      },
                                      {
                                        title: '状态',
                                        dataIndex: 'statusName',
                                        key: 'statusName',
                                      },
                                      {
                                        title: '验证时间',
                                        dataIndex: 'confirmTime',
                                        key: 'confirmTime',
                                      },
                                      {
                                        title: '验证结果',
                                        dataIndex: 'confirmResult',
                                        key: 'confirmResult',
                                      },
                                      {
                                        title: '5S验证/品质验证',
                                        dataIndex: 'confirmRoleType',
                                        key: 'confirmRoleType',
                                        render: (text, record) => <span>{
                                          text == "1" ?
                                            record.applyRepairUser5sConfirm == "0" ? "5S验证 不通过" : record.applyRepairUser5sConfirm == "1" ? "5S验证 通过" : ""
                                            :
                                            record.pqcQualityConfirm == "0" ? "品质验证 不通过" : record.pqcQualityConfirm == "1" ? "品质验证 通过" : ""}</span>
                                      },
                                      {
                                        title: '描述',
                                        dataIndex: 'confirmDesc',
                                        key: 'confirmDesc',
                                      },
                                    ]}>
                                  </Table>
                                )

                              })
                            })
                          }}>展开</Tag>
                        </span>
                      </p>


                    </div> :
                    <Empty style={{ height: 430, display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }} />
                }

              </Card>
            </Col>
          </Row>
        </div>
        <CreateForm
          tableUrl={[{
            url: "pairqueryPageByUserId",
            post: {
              "pageIndex": 1,
              "pageSize": 10,
            }
          }]}
          fields={this.state.fields}
          iftype={iftype}
          onChange={this.handleFormChange}
          wrappedComponentRef={this.saveFormRef}
          visible={fv}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          onSelectChange={this.onSelectChange}
        />

      </div>
    )
  }


}

export default DeviceRepair



