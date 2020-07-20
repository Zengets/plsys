import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import AES from "crypto-js/aes";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";
import Utf8 from "crypto-js/enc-utf8";
import moment from 'moment';


const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login,menu, loading }) => ({
  login,
  menu,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;

    let timestamp = moment().valueOf().toString()+"acb";
    let newtimestamp = AES.encrypt(timestamp,Utf8.parse('NANGAODEAESKEY--'), {
      mode: ECB,
      padding: Pkcs7
    }).toString();

    let password = AES.encrypt(values.password,Utf8.parse(timestamp),{
      mode: ECB,
      padding: Pkcs7
    }).toString()

    values.password = password;
    values.encryptKey = newtimestamp;

    // var bytes  = AES.decrypt(newtimestamp,'NANGAODEAESKEY--',{
    //   mode: ECB,
    //   padding: Pkcs7
    // }).toString(Utf8);
    
    // console.log(bytes);

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values
        },
      });
    }
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
        type: 'menu/resetMenu',
    });
  }

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <div style={{width:58,height:58,overflow:"visible",position:"relative"}}>
            <img alt="logo" className={styles.logo} src="./images/logo.png" />
            <img className={styles.half} src='./images/half.png'></img>
          </div>
          
          <span className={styles.title}>中船重工 · 鹏力塑造</span>
        </div>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="accountName"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <Link className={styles.register} to="/user/forgot">
             <FormattedMessage id="app.login.forgot-password" />
            </Link>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
