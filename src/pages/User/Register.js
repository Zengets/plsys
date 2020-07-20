import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import {
  Form, Input, Button, Select,
  Row, Col, Popover, Progress, Tabs, Icon, DatePicker, Upload, Alert, Table, Card, Modal, message
} from 'antd';
import styles from './Register.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;


@connect(({ regist }) => ({
  regist,
}))
class Register extends Component {
  state = {
    visible: false,
    key: { val: "", id: "" },
    imageUrl: "",
    activeKey: "1",
    searchval: ""
  };

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'regist/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { key } = this.state;

        if (key.val == "") {
          for (let i in values) {
            if (!values[i]) {
              values[i] = ""
            }
          }
          this.setNewState("submit", values, () => {
            form.resetFields();
            Modal.info({
              title: '提交成功，请等待审批!',
              content: (
                <div>
                  <p>{`您的工单号为：${this.props.regist.fakeRegister.data.applyNo}，工单号可用来查询审批进度`}</p>
                </div>
              ),
              
            });
          })
        } else {
          for (let i in values) {
            if (!values[i]) {
              values[i] = ""
            }
          }
          values.id = key.id;
          this.setNewState("updateApply", values, () => {
            let _it = this;
            _it.setNewState("getApplyInfo", { applyNo: _it.state.searchval })
            form.resetFields();

            Modal.info({
              title: '修改成功，请等待审批!',
              content: '如需注册新公司，请点击上方"修改信息"标题',
              onOk() {

              },
            });
          })


        }

      }
    });
  };



  handleCancel = () => {
    this.setState({
      visible: false
    })
  }


  render() {
    const { form, submitting, regist, dispatch } = this.props;
    const { getFieldDecorator } = form;
    const { activeKey, imageUrl, key, searchval } = this.state;
    const { code, getApplyInfo, getApplyInfoList } = regist;
    function disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    }
    return (
      <div className={styles.main}>
        <p className={styles.sildetitle} style={{marginTop:-64}}><span>公司注册</span>
         <Link className={styles.login} to="/user/login" style={{ color: "#fff" }}>
            <FormattedMessage id="app.register.sign-in" />
          </Link></p>
        <Tabs
          key="1254"
          tabBarGutter={4}
          onTabClick={(keys) => {
            let _it = this;
            if (key.val == "edit" && keys == 1) {
              Modal.confirm({
                title: '是否以当前信息注册?',
                content: '点击确定后注册将会新增注册记录',
                okText: "确定",
                cancelText: "取消",
                onOk() {
                  _it.setState({ key: { val: "", id: "" } })
                },
                onCancel() {
                  console.log('Cancel');
                },
              })
            }
          }}
          activeKey={activeKey}
          onChange={(activeKey) => { this.setState({ activeKey }) }}
          style={{ maxWidth: "95%", width: 600, margin: "0 auto" }}>
          <TabPane 
            key="1"
            style={{ maxWidth: "100%" }} 
            tab={<span style={{ color: "#fff" }}>
            <Icon type="user-add" />{this.state.key.val == "edit" ? "修改信息" : "立即注册"}</span>}>
            <div style={{
              maxWidth: "100%", height: 500, padding: "0 20px", overflow: "auto", backgroundColor: "#fff", marginTop: 12, borderRadius: 4
            }}>
              <Form>
                <FormItem label="公司名称">
                  {
                    getFieldDecorator('companyName', {
                      rules: [
                        {
                          required: true,
                          message: "请输入公司名称！",
                        },
                      ],
                    })(
                      <Input size="large" placeholder='请输入公司名称' />
                    )}
                </FormItem>
                <FormItem label="联系人">
                  {getFieldDecorator('contant', {
                    rules: [
                      {
                        required: true,
                        message: "请输入联系人！",
                      },
                    ],
                  })(
                    <Input size="large" placeholder='请输入联系人' />
                  )}
                </FormItem>
                <FormItem label="手机号码">
                  <InputGroup compact>
                    {getFieldDecorator('telephone', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.phone-number.required' }),
                        },
                        {
                          pattern: /^\d{11}$/,
                          message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                      />
                    )}
                  </InputGroup>
                </FormItem>
                <FormItem label="公司编号">
                  {
                    getFieldDecorator('companyCode', {
                      rules: [
                        {
                          required: true,
                          message: "请输入公司编号！",
                        },
                      ],
                    })(
                      <Input size="large" placeholder='请输入自定义编号用于系统标识，此编号一旦输入不可更改。' />
                    )}
                </FormItem>
                <FormItem label="公司地址">
                  {getFieldDecorator('companyAddress', {
                    rules: [
                    ],
                  })(
                    <Input size="large" placeholder='请输入公司地址' />
                  )}
                </FormItem>

                <FormItem label="邮箱">
                  {getFieldDecorator('mail', {
                    rules: [
                      {
                        type: 'email',
                        message: formatMessage({ id: 'validation.email.wrong-format' }),
                      },
                      {
                        pattern: /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/,
                        message: "邮箱格式不正确",
                      }
                    ],
                  })(
                    <Input size="large" placeholder={formatMessage({ id: 'form.email.placeholder' })} />
                  )}
                </FormItem>
                <FormItem label="备注" style={{ marginBottom: 24 }}>
                  {getFieldDecorator('remark', {
                    rules: [
                    ],
                  })(
                    <Input.TextArea maxLength={500} rows={6} size="large" placeholder='请输入备注' />
                  )}
                </FormItem>
              </Form>
            </div>
            <div style={{ maxWidth: "100%", margin: "0 auto", marginTop: 20 }}>
              <Button
                size="large"
                loading={submitting}
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                onClick={this.handleSubmit}
              >
                提交
          </Button>
            </div>
          </TabPane>
          <TabPane 
          key="2" 
          tab={<span style={{ color: "#fff" }}><Icon type="align-left" />申请进度</span>}>
            <div style={{ maxWidth: "100%", height: 560, margin: "12px auto 0px auto", backgroundColor: "#fff", padding: 20, borderRadius: 4,overflow:'auto' }}>
              <p>请输入单号进行查询</p>
              <Input.Search placeholder="请输入单号进行查询！" value={searchval} onChange={(e) => {
                let val = e.target.value
                this.setState({
                  searchval: val
                }, () => {
                  this.setNewState("getApplyInfo", { applyNo: val }, () => {
                    if (this.props.regist.getApplyInfo == "") {
                      message.warn("没有查询到单号为" + val + "的工单")
                    }
                  })
                })

              }} style={{ margin: "0px 0px 24px 0px" }} />
              {
                getApplyInfo && <Card style={{ margin: "0px 0px 24px 0px" }} title="申请信息" extra={
                  <Button
                    style={{ dispaly: getApplyInfo.status == 0 ? "block" : "none" }}
                    onClick={() => {
                      this.setState({
                        activeKey: "1"
                      }, () => {
                        let resetData = {
                          companyName: getApplyInfo.companyName,
                          companyCode: getApplyInfo.companyCode,
                          companyAddress: getApplyInfo.companyAddress,
                          contant: getApplyInfo.contant,
                          telephone: getApplyInfo.telephone,
                          mail: getApplyInfo.mail,
                          remark: getApplyInfo.remark,
                        }
                        this.setState({
                          key: {
                            val: "edit",
                            id: getApplyInfo.id
                          }
                        })
                        for (var i in resetData) {
                          if (!resetData[i]) {
                            resetData[i] = ""
                          }
                        }
                        this.props.form.setFieldsValue(resetData);
                      });

                    }}>修改</Button>
                }>
                  <div className={styles.indep}>
                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>状态:</span>
                      <span>{getApplyInfo.status == 0 ? "待审批" :
                        getApplyInfo.status == 1 ? "通过" : "不通过"}</span>
                    </p>
                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>工单号:</span>
                      <span>{getApplyInfo.applyNo}</span>
                    </p>
                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>公司名称:</span>
                      <span>{getApplyInfo.companyName}</span>
                    </p>
                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>公司地址:</span>
                      <span>{getApplyInfo.companyAddress}</span>
                    </p>

                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>联系人:</span>
                      <span>{getApplyInfo.contant}</span>
                    </p>
                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>手机:</span>
                      <span>{getApplyInfo.telephone}</span>
                    </p>
                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>邮箱:</span>
                      <span>{getApplyInfo.mail}</span>
                    </p>

                    <p>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block" }}>备注:</span>
                      <span>{getApplyInfo.remark}</span>
                    </p>
                    <div style={{ display: "block" }}>
                      <span style={{ width: 100, textAlign: "right", paddingRight: 10, display: "block", marginBottom: 12 }}>审批记录:</span>
                      <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }}
                        dataSource={getApplyInfoList ? getApplyInfoList : []}
                        columns={[
                          {
                            title: '审批状态',
                            dataIndex: 'status',
                            key: 'status',
                            render: (text) => (<span>{text == "1" ? "已审批" : "待审批"}</span>)
                          },
                          {
                            title: '是否通过',
                            dataIndex: 'isPass',
                            key: 'isPass',
                            render: (text) => (<span>{text == "0" ? "通过" : text == "1" ? "不通过" : ""}</span>)
                          },
                          {
                            title: '处理人',
                            dataIndex: 'auditUserName',
                            key: 'auditUserName',
                          },
                          {
                            title: '处理时间',
                            dataIndex: 'auditTime',
                            key: 'auditTime',
                          },
                          {
                            title: '审批意见',
                            dataIndex: 'remark',
                            key: 'remark',
                          },
                        ]}
                      >
                      </Table>
                    </div>

                  </div>
                </Card>

              }
              {
                !getApplyInfo && <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }} ></Table>
              }
            </div>
          </TabPane>
          <Modal title={this.state.key.name} visible={this.state.visible} footer={null}
            onCancel={this.handleCancel}>
            <img style={{ width: '100%', height: "auto", cursor: "pointer" }}
              src={this.state.key.url} alt=""
              onError={(e) => { e.target.src = './images/default.png' }} />
          </Modal>
        </Tabs>
      </div>
    );
  }
}
Register = Form.create()(Register)
export default Register;
