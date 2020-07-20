import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message,Modal,Input,Icon } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import AES from "crypto-js/aes";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";
import Utf8 from "crypto-js/enc-utf8";
import moment from 'moment';

const { Header } = Layout;
@connect(({ user,login, global, setting, loading }) => ({
  login,
  currentUser: user.currentUser,
  user:user,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  loadedAllNotices: global.loadedAllNotices,
  notices: global.notices,
  setting,
}))
class HeaderView extends Component {
  state = {
    visible: true,
    visibles: false,
    oldpwd:'',
    newpwd:"",
    surepwd:""
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    let Island = localStorage.getItem("Island"),
      _it = this;
    if(Island == "0"){
      Modal.confirm({
        title: '修改密码?',
        content: '您的密码为安全等级较低，是否修改密码？',
        okText:"修改",
        cancelText:"取消",
        onOk() {
          _it.setState({
            visibles:true
          })
        },
        onCancel() {
        },
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      this.setState({
        visibles:true
      })
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  /*modal*/
  handleOk = (e) => {
    if(this.state.newpwd.length<6||this.state.newpwd.length>16){
      message.warn("密码长度为6-16位")
      return
    }
    if(this.state.newpwd != this.state.surepwd){
      message.warn("两次密码不一致，请重新输入")
      return
    }
    let timestamp = moment().valueOf().toString()+"acb";

    let newtimestamp = AES.encrypt(timestamp,Utf8.parse('NANGAODEAESKEY--'), {
      mode: ECB,
      padding: Pkcs7
    }).toString();

    let newPassword = AES.encrypt(this.state.newpwd,Utf8.parse(timestamp),{
      mode: ECB,
      padding: Pkcs7
    }).toString(),
    password = AES.encrypt(this.state.oldpwd,Utf8.parse(timestamp),{
      mode: ECB,
      padding: Pkcs7
    }).toString()

    let { dispatch } = this.props,
      postData = {
        password,
        newPassword,
        encryptKey:newtimestamp
      };
    dispatch({
      type: 'user/changePwd',
      payload:postData
    }).then(()=>{
      this.setState({
        visibles: false,
      });
      dispatch({
        type: 'login/logout',
      });
      message.success("修改密码成功，新密码为"+this.state.newpwd,3)
    })

  }

  handleCancel = (e) => {
    this.setState({
      visibles: false,
    });
  }

  onChange(key,val){
    if(key==0){
      this.setState({
        oldpwd:val
      })
    }else if(key==1){
      this.setState({
        newpwd:val
      })
    }else{
      this.setState({
        surepwd:val
      })
    }


  }
  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible,oldpwd,
      newpwd,surepwd } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    return (
      <div>
        <Animate component="" transitionName="fade">
          {HeaderDom}
        </Animate>
        <Modal
          title="修改密码"
          visible={this.state.visibles}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p style={{margin:"0 0 12px 0px"}}>请输入原密码</p>
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={(e)=>this.onChange(0,e.target.value)}
            placeholder="请输入原密码"
            value={oldpwd}
            allowClear
          />
          <p style={{margin:"12px 0px"}}>请输入新密码</p>
          <Input
            type="password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={(e)=>this.onChange(1,e.target.value)}
            placeholder="请输入新密码"
            value={newpwd}
            allowClear
          />
          <p style={{margin:"12px 0px"}}>确认新密码</p>
          <Input
            type="password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={(e)=>this.onChange(2,e.target.value)}
            placeholder="确认新密码"
            value={surepwd}
            allowClear
          />
        </Modal>
      </div>

    );
  }
}

export default HeaderView;
