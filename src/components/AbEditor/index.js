import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import moment from 'moment';
import { ContentUtils } from 'braft-utils';
import { Upload, Icon } from 'antd';



export default class AbEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(props.defaultValue ? props.defaultValue : null)
        }

        this.props.onRefer(this);
    }

    setProps(nextProps) {
        const htmlContent = nextProps.defaultValue;
        this.setState({
            editorState: BraftEditor.createEditorState(htmlContent)
        })
    }

    componentDidMount() {
        this.setProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.defaultValue !== nextProps.defaultValue) {
            this.setProps(nextProps)
        }
    }

    submitContent = () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        const htmlContent = this.state.editorState.toHTML()
        if (this.state.editorState.isEmpty()) {
            return null
        } else {
            return htmlContent
        }
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }

    //预览
    preview = () => {

        if (window.previewWindow) {
            window.previewWindow.close()
        }

        window.previewWindow = window.open()
        window.previewWindow.document.write(this.buildPreviewHtml())
        window.previewWindow.document.close()

    }

    buildPreviewHtml() {
        return `
          <!Doctype html>
          <html>
            <head>
              <title>Preview Content</title>
              <style>
                html,body{
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  overflow: auto;
                  background-color: #f1f2f3;
                }
                .container{
                  box-sizing: border-box;
                  width: 1000px;
                  max-width: 100%;
                  min-height: 100%;
                  margin: 0 auto;
                  padding: 30px 20px;
                  overflow: hidden;
                  background-color: #fff;
                  border-right: solid 1px #eee;
                  border-left: solid 1px #eee;
                }
                .container img,
                .container audio,
                .container video{
                  max-width: 100%;
                  height: auto;
                }
                .container p{
                  white-space: pre-wrap;
                  min-height: 1em;
                }
                .container pre{
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-radius: 5px;
                }
                .container blockquote{
                  margin: 0;
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-left: 3px solid #d1d1d1;
                }
              </style>
            </head>
            <body>
              <div class="container">${this.state.editorState.toHTML()}</div>
            </body>
          </html>
        `
    }


    //上传附件
    uploadHandler = (param) => {
        let result = param.file.response;
        if (!param.file) {
            return false
        }
        if (param.file.status === 'done') {
            this.setState({
                editorState: ContentUtils.insertHTML(this.state.editorState, `<a href=${result ? result.data.dataList[0] : null} target='_blank'>${param.file.name}</a>`)
            })
        }

    }

    render() {
        const { editorState } = this.state;
        const extendControls = [
            {
                key: 'custom-button',
                type: 'button',
                text: '预览',
                onClick: this.preview
            },
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        showUploadList={false}
                        action="/rs/common/uploadFile"
                        onChange={this.uploadHandler}
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="添加附件">
                            <Icon type="file" theme="filled" />
                        </button>
                    </Upload>
                )
            }
        ];

        let UploadFn = (param) => {
            const serverURL = '/rs/common/uploadImg'
            const xhr = new XMLHttpRequest
            const fd = new FormData();

            const successFn = (response) => {
                // 假设服务端直接返回文件上传后的地址
                // 上传成功后调用param.success并传入上传后的文件地址
                param.success({
                    url: xhr.responseText ? JSON.parse(xhr.responseText).data.dataList[0] : null,
                    meta: {
                        id: moment(),
                        title: param.file.name,
                        alt: param.file.name,
                        loop: true, // 指定音视频是否循环播放
                        autoPlay: true, // 指定音视频是否自动播放
                        controls: true, // 指定音视频是否显示控制栏
                        poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                    }
                })
            }

            const progressFn = (event) => {
                // 上传进度发生变化时调用param.progress
                param.progress(event.loaded / event.total * 100)
            }

            const errorFn = (response) => {
                // 上传发生错误时调用param.error
                param.error({
                    msg: '上传失败'
                })
            }

            xhr.upload.addEventListener("progress", progressFn, false)
            xhr.addEventListener("load", successFn, false)
            xhr.addEventListener("error", errorFn, false)
            xhr.addEventListener("abort", errorFn, false)

            fd.append('file', param.file)
            xhr.open('POST', serverURL, true)
            xhr.send(fd)

        }




        return (
            <div className="my-component">
                <BraftEditor
                    media={{ uploadFn: UploadFn }}
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                    extendControls={extendControls}
                />
            </div>
        )

    }

}