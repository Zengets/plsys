import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
/* <GlobalFooter
 links={[
 {
 key: 'Pro 首页',
 title: 'Pro 首页',
 href: 'https://pro.ant.design',
 blankTarget: true,
 },
 {
 key: 'github',
 title: <Icon type="github" />,
 href: 'https://github.com/ant-design/ant-design-pro',
 blankTarget: true,
 },
 {
 key: 'Ant Design',
 title: 'Ant Design',
 href: 'https://ant.design',
 blankTarget: true,
 },
 ]}
 copyright={
 <Fragment>
 Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
 </Fragment>
 }
 />*/
const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding:0,display:"flex",justifyContent:"center" }}>
    <div style={{textAlign:"center",marginBottom:12,opacity:0.6}}>
    Copyright <Icon type="copyright" /> 2019 中船重工· 鹏力塑造有限公司 版权所有 <br/>
    备案序号：苏ICP备12025462号 
    </div>
  </Footer>
);
export default FooterView;
