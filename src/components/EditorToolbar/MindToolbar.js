import React from 'react';
import { Divider } from 'antd';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';

const FlowToolbar = () => {
  return (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton command="undo" text="撤销"/>
      <ToolbarButton command="redo" text='重做'/>
      <Divider type="vertical" />
      <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
      <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
      <ToolbarButton command="autoZoom" icon="fit-map" text="适应界面" />
      <ToolbarButton command="resetZoom" icon="actual-size" text="真实大小" />
      <Divider type="vertical" />
      <ToolbarButton command="append" text="主题" />
      <ToolbarButton command="appendChild" icon="append-child" text="子主题" />
      <Divider type="vertical" />
      <ToolbarButton command="collapse" text="折叠" />
      <ToolbarButton command="expand" text="取消折叠" />
    </Toolbar>
  );
};

export default FlowToolbar;
