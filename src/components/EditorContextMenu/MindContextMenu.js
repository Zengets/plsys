import React from 'react';
import { NodeMenu, CanvasMenu, ContextMenu } from 'gg-editor';
import MenuItem from './MenuItem';
import styles from './index.less';

const MindContextMenu = () => {
  return (
    <ContextMenu className={styles.contextMenu}>
      <NodeMenu>
        <MenuItem command="append" text="主题" />
        <MenuItem command="appendChild" icon="append-child" text="子主题" />
        <MenuItem command="collapse" text="折叠" />
        <MenuItem command="expand" text="取消折叠" />
        <MenuItem command="delete"  text="删除"/>
      </NodeMenu>
      <CanvasMenu>
        <MenuItem command="undo" text="撤销"/>
        <MenuItem command="redo" text="重做"/>
      </CanvasMenu>
    </ContextMenu>
  );
};

export default MindContextMenu;
