import React from 'react';
import { Card } from 'antd';
import { NodePanel, CanvasPanel, DetailPanel } from 'gg-editor';
import DetailForm from './DetailForm';
import styles from './index.less';

const MindDetailPanel = () => {
  return (
    <DetailPanel className={styles.detailPanel}>
      <NodePanel>
        <DetailForm type="node" text="节点"/>
      </NodePanel>
      <CanvasPanel>
        <Card type="inner" size="small" title="面板" bordered={false} />
      </CanvasPanel>
    </DetailPanel>
  );
};

export default MindDetailPanel;
