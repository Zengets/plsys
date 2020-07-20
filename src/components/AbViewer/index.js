import react, { Component } from 'react';
import { Icon, Drawer, PageHeader, Alert, Row, Col, Avatar, Button, Input, Affix, message, Divider, Empty, Modal, Pagination } from "antd";
import FileViewer from 'react-file-viewer';

class AbViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    onError(e) {
        logger.logError(e, 'error in file-viewer');
    }

    PrintPage1() {
        var va = document.getElementsByClassName("document-container")[0];
        var newstr = `<style>
        .center{
           display: flex;
           justify-content: center;
           padding: 12px;
         }
         *{
             font-size:14px;
         }
         p{
             margin:6px 4px 6px 4px;
         }
         table{
             width:100%
         }
         table,td{
             border:#999 solid 1px;
             border-collapse: collapse
         }
         img{
            width: 120px;
            height: 98px;
            display:block;
            margin:0 auto;
         }
        </style><div style="position:relative">
       ${va.innerHTML}
       <img style='position:absolute;top:0;right:0;opacity:0.5;width:96px;height:96px' src='./images/readed.png'/>  
       </div>`;

        const win = window.open('', 'printwindow');
        var body = win.document.getElementsByTagName("body")[0];
        win.document.write(newstr);
        body.setAttribute("class", "center");
        setTimeout(() => {
            win.print();
            body.removeAttribute("class", "center");
            win.close();
        }, 500)


    }



    render() {
        return <Drawer
            title={this.props.title}
            visible={this.props.visible}
            onClose={this.props.onClose}
            width="96%"
            destroyOnClose
        >
            <Affix offsetTop={20} target={() => {
                return document.getElementsByClassName("ant-drawer-wrapper-body")[0]
            }}>
                <Button style={{ width: 120, float: "right" }} type='primary' dashed onClick={() => { this.PrintPage1() }}>开始打印</Button>
            </Affix>

            <div id='printPage' style={{ marginTop: -24 }}>
                <FileViewer
                    style={{ width: 800 }}
                    fileType={this.props.type}
                    filePath={this.props.file}
                    errorComponent={() => { return <></> }}
                    onError={this.onError}
                ></FileViewer>
            </div>


        </Drawer>
    }

}

export default AbViewer