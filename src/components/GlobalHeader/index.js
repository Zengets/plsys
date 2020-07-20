import React, { PureComponent } from 'react';
import { Icon, Tabs, Button, Menu, Dropdown } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import { connect } from 'dva';
import router from 'umi/router';
const { TabPane } = Tabs;

@connect(({ menu }) => ({
  menu,
}))
class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch, device } = this.props;
    dispatch({
      type: 'menu/' + type,
      payload: value,
    }).then(key => {
      if (key) {
        fn ? fn(key) : null;
      }
    });
  }

  render() {
    const { collapsed, isMobile, logo, menu } = this.props;
    let { curMenuList, curMenu } = menu;
    let activeKey;
    curMenuList.map((item, i) => {
      if (item.pathname == curMenu) {
        activeKey = i.toString()
      }
    })

    const menus = (item, i) => (
      <Menu>
        <Menu.Item key="1" onClick={() => {
          this.setNewState("deleteMenu", {
            pathname: item.pathname,
            i
          }, () => {
            router.replace(this.props.menu.curMenu)
          })
        }}>关闭</Menu.Item>
        <Menu.Item key="2" onClick={() => {
          let leftMenu = curMenuList.filter((item, i) => {
            return parseInt(activeKey) < i || parseInt(activeKey) == i
          })
          this.setNewState("setMenuList", leftMenu);
        }}>关闭左侧</Menu.Item>
        <Menu.Item key="3" onClick={() => {
          let leftMenu = curMenuList.filter((item, i) => {
            return parseInt(activeKey) > i || parseInt(activeKey) == i
          })
          this.setNewState("setMenuList", leftMenu);
        }}>关闭右侧</Menu.Item>
        <Menu.Item key="4" onClick={() => {
          let leftMenu = curMenuList.filter((item, i) => {
            return parseInt(activeKey) == i
          })
          this.setNewState("setMenuList", leftMenu);


        }}>关闭其他</Menu.Item>
        <Menu.Item key="5" onClick={() => {
          this.setNewState("resetMenu", null, () => {
            router.replace("/home")
          })
        }}>全部关闭</Menu.Item>

      </Menu>
    );

    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        {isMobile && (
          <span className={styles.trigger} onClick={this.toggle}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
        )}
        <div className={styles.setabs} style={{ display: "flex", alignItems: "flex-start" }}>
          {
            !isMobile && <Tabs
              tabBarExtraContent={curMenuList.length > 0 ? <a style={{ height: 65, display: "flex", justifyContent: "center", alignItems: "center", margin: "0 0 0 12px", color: "#ff5000", borderRight: "#f0f0f0 solid 4px", paddingRight: 20 }} onClick={() => {
                this.setNewState("resetMenu", null, () => {
                  router.replace("/home")
                })
              }}><Icon type="reload" style={{ marginRight: 8 }} /> 清空</a> : null}
              tabBarStyle={{ border: "none" }}
              style={{ flex: 1, marginLeft: 12 }}
              hideAdd
              animated={false}
              activeKey={activeKey}
              type="line"
              onChange={() => { }}>
              {
                curMenuList ?
                  curMenuList.map((item, i) => {
                    return (
                      <TabPane
                        tab={
                          <Dropdown overlay={menus(item, i)} trigger={['contextMenu']} onVisibleChange={()=>{
                            router.replace(item.pathname)
                          }}>
                            <span>
                              <i style={{ marginLeft: 12, fontStyle: "normal" }} onClick={() => {
                                router.replace(item.pathname)
                              }}>{item.cname} </i>
                              <Icon style={{ marginLeft: 12 }} type="close" onClick={() => {
                                this.setNewState("deleteMenu", {
                                  pathname: item.pathname,
                                  i
                                }, () => {
                                  router.replace(this.props.menu.curMenu)
                                })
                              }} />
                            </span>
                          </Dropdown>}
                        key={i.toString()}
                        closable={true}>
                      </TabPane>
                    )
                  }) : null
              }

            </Tabs>

          }
          <RightContent style={{ width: "100px" }} {...this.props} />
        </div>

      </div>
    );
  }
}
export default GlobalHeader