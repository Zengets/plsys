/**
 * Created by 11485 on 2019/4/9.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  message, Divider, Modal, Button, Row, Col, Icon,
  Upload, Alert, Tag, Spin,notification 
} from 'antd';

@connect(({ publicmodel,loading }) => ({
  publicmodel,
  loading
}))
class Abload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      result: ""
    }

  }

  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicmodel/' + type,
      payload: values
    }).then(() => {
      fn ? fn() : null;
    });
  }

  //取消
  handleCancel = () => {
    this.setState({
      visible: false,
      result: "",
      curfile: null
    })
  }

  onPreview() {
    let file = this.state.curfile;
    let fileName = file.name;
    let URL = window.URL || window.webkitURL;
    let objectUrl = URL.createObjectURL(file);
    if (fileName) {
      var a = document.createElement('a')
      if (typeof a.download === 'undefined') {
        window.location = objectUrl
      } else {
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    }
  }

  render() {
    let { visible, result } = this.state,
      { col, postName, left, filePath, reload,loading } = this.props;
    return (
      <div style={{ paddingLeft: left, justifyContent: "space-between", display: "flex" }}>
        <a style={{ flex: 1, marginRight: 12, maxWidth: 88 }} onClick={() => {
          this.setState({
            visible: true
          })
        }}>
          批量导入
        </a>
        <a style={{ flex: 1, maxWidth: 88, color: "#ff2100" }} onClick={() => {
          window.open(filePath)
        }}>
          下载模板
        </a>
        <Modal
          style={{ maxWidth: '90%' }}
          visible={visible}
          title="批量导入"
          onCancel={this.handleCancel}
          footer={null}
        >
          {
            visible && <div>
              <Spin spinning={loading.effects[`publicmodel/${postName}`]?true:false} tip="文件写入中,您可以进行其他操作...">
                <Upload.Dragger
                  accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  beforeUpload={(file) => {
                    this.setState({
                      result: ""
                    })
                    let ifUp = file.name.indexOf("xls") < 0 && file.name.indexOf("xlsx") < 0
                    if (ifUp) {
                      message.error("请上传表格!")
                    }
                    return !ifUp
                  }}
                  showUploadList={false}
                  customRequest={(file) => {
                    var formData = new FormData();
                    var fileField = file.file;
                    formData.append('excelfile', fileField);
                    
                    this.setNewState( this.props.postName , formData ,()=>{
                      let result = this.props.publicmodel.code;
                      this.props.reload();
                      this.setState({
                        result: result.dataList ? result.dataList : null,
                        curfile: fileField
                      })

                    })

                  }}

                >

                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">
                    上传excel表格请点击或拖拽文件至此区域
                  </p>
                  <p className="ant-upload-hint">
                    仅支持单个文件上传...
              </p>
                </Upload.Dragger>
              </Spin>
              {this.state.curfile ?
                <a style={{ marginTop: 12, display: "block" }} onClick={() => { this.onPreview() }}>{this.state.curfile.name}</a> : null
              }
            </div>
          }


        </Modal>


      </div>
    );
  }
}

export default Abload;
