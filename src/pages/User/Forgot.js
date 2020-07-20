import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress, Menu, Dropdown, message, Steps } from 'antd';
import styles from './Register.less';
import moment from 'moment';
import AES from "crypto-js/aes";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";
import Utf8 from "crypto-js/enc-utf8";
const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ regist, loading }) => ({
  regist,
  submitting: loading.effects['regist/submit'],
}))
@Form.create()
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      loadings: false,
      count: 0,
      confirmDirty: false,
      visible: false,
      help: '',
      prefix: '86',
    };
  }


  onGetCaptcha = (nowcount) => {
    let count = nowcount ? nowcount : 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      localStorage.setItem("sendCode", count);
      if (count < 1) {
        clearInterval(this.interval);
        localStorage.removeItem("sendCode");
        localStorage.removeItem("LASTID");
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch } = this.props;
    dispatch({
      type: 'regist/' + type,
      payload: value
    }).then((res) => {
      if(res){
        fn ? fn() : null
      }else{
        clearInterval(this.interval);
        this.setState({
          count: 0,
          loadings:false
        })
      }
    });
  }



  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };


  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };





  //是否提交

  next = () => {
    const current = this.state.current;
    this.handleSubmit(current)
  }



  handleSubmit = (current) => {
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        if (current == 0) {
          this.setNewState("compairCode",{id:this.props.regist.sendCode.id,code:values.verificationCode}, () => {
            this.setState({ current: current + 1 });
          })
        } else {
          let timestamp = moment().valueOf().toString()+"acb";

          let newtimestamp = AES.encrypt(timestamp,Utf8.parse('NANGAODEAESKEY--'), {
            mode: ECB,
            padding: Pkcs7
          }).toString();
      
          let newPassword = AES.encrypt(values.newPassword,Utf8.parse(timestamp),{
            mode: ECB,
            padding: Pkcs7
          }).toString()

          this.setNewState("updatePassword", {
            newPassword:newPassword,
            encryptKey:newtimestamp,
            id:this.props.regist.sendCode.id}, () => {
            message.success(`您的密码修改成功，新密码为${values.newPassword}`, 3);
            window.history.go(-1)
          })
        }




      }
    });
  };



  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { count, prefix, help, visible, loadings, current
    } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => {
            let accountName = getFieldsValue().accountName;
            if (!accountName) {
              message.warn("请先输入账号...");
              return
            }
            this.setState({
              loadings: true
            })
            let postData = {
              sendType: "1",
              accountName: accountName
            }
            this.setNewState("sendCode", postData, () => {
              localStorage.setItem("LASTID", accountName)
              this.onGetCaptcha()
              this.setState({
                loadings: false
              })
            })
          }}>
            发送短信
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => {
            let accountName = getFieldsValue().accountName;
            if (!accountName) {
              message.warn("请先输入账号...");
              return
            }
            this.setState({
              loadings: true
            })
            let postData = {
              sendType: "2",
              accountName: accountName
            }
            this.setNewState("sendCode", postData, () => {
              localStorage.setItem("LASTID", accountName)
              this.onGetCaptcha()
              this.setState({
                loadings: false
              })
            })
          }}>
            发送邮件
          </a>
        </Menu.Item>
      </Menu>
    );
    const steps = [
      {
        title: <span style={{ color: "#fff" }}>获取验证码</span>,
      },
      {
        title: <span style={{ color: "#fff" }}>重置密码</span>,
      },
    ];
    return (
      <div className={styles.main} style={{ width: 600 }}>
        <p className={styles.sildetitle} style={{ margin: 0, marginBottom: 32, marginTop: -96 }}>
          <FormattedMessage id="app.login.forgot-password" />
          <Link className={styles.login} style={{ textAlign: "right", fontSize: 16 }} to="/user/login">
            <FormattedMessage id="app.register.sign-in" />
          </Link>
        </p>
        <Steps current={current} style={{ marginBottom: 24 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form onSubmit={this.handleSubmit}>
          {
            current == 0 && <div>
              <FormItem style={{ marginBottom: 18 }}>
                {getFieldDecorator('accountName', {
                  rules: [{
                    required: true,
                    message: "请输入账号",
                  }
                  ],
                })(
                  <Input
                    size="large"
                    type="text"
                    placeholder="请输入账号"
                    onChange={(e) => {
                      let nowcount = localStorage.getItem("sendCode"),
                        lastid = localStorage.getItem("LASTID");
                      if (lastid == e.target.value) {
                        this.onGetCaptcha(nowcount);
                      } else {
                        clearInterval(this.interval);
                        this.setState({
                          count: 0
                        })
                      }
                    }}
                  />
                )}

              </FormItem>
              <FormItem style={{ marginBottom: 18 }}>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('verificationCode', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'validation.verification-code.required' }),
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    {
                      count ?
                        <Button
                          type="primary"
                          style={{color:"#ededed",borderColor:"#ededed"}}
                          ghost
                          size="large"
                          disabled={count}
                          className={styles.getCaptcha}
                        >
                          {count
                            ? `${count} s`
                            : formatMessage({ id: 'app.register.get-verification-code' })}
                        </Button> :
                        <Dropdown overlay={menu} placement="bottomLeft">
                          <Button
                            type="primary"
                            ghost
                            style={{color:"#ededed",borderColor:"#ededed"}}
                            loading={loadings}
                            size="large"
                            disabled={count}
                            className={styles.getCaptcha}
                          >
                            {count
                              ? `${count} s`
                              : formatMessage({ id: 'app.register.get-verification-code' })}
                          </Button>
                        </Dropdown>
                    }

                  </Col>
                </Row>
              </FormItem>

            </div>
          }

          {
            current == 1 && <div>
              <FormItem help={help} style={{ marginBottom: 18 }}>
                <Popover
                  getPopupContainer={node => node.parentNode}
                  content={
                    <div style={{ padding: '4px 0' }}>
                      {passwordStatusMap[this.getPasswordStatus()]}
                      {this.renderPasswordProgress()}
                      <div style={{ marginTop: 10 }}>
                        <FormattedMessage id="validation.password.strength.msg" />
                      </div>
                    </div>
                  }
                  overlayStyle={{ width: 240 }}
                  placement="right"
                  visible={visible}
                >
                  {getFieldDecorator('newPassword', {
                    rules: [
                      {
                        validator: this.checkPassword,
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      type="password"
                      placeholder={formatMessage({ id: 'form.password.placeholder' })}
                    />
                  )}
                </Popover>
              </FormItem>
              <FormItem style={{ marginBottom: 18 }}>
                {getFieldDecorator('confirmPassword', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.confirm-password.required' }),
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                  />
                )}
              </FormItem>
            </div>
          }
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              onClick={this.next}
            >
              {current == 0 ? "下一步" : "提交"}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
