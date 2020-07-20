import {
    Drawer,Modal 
} from 'antd';



class Draw extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        let { visible, title,imgurl } = this.props;
        return (
            <Drawer
                width={"90%"}
                title={title}
                visible={visible}
                onClose={this.props.onClose}
            >
                <img onClick={() => {
                    Modal.info({
                        maskClosable: true,
                        width: "92%",
                        style: { top: 20 },
                        title: `预览流程图`,
                        okText: "关闭",
                        content: (
                            <div style={{ width: "100%" }}>
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={imgurl} onError={(e) => { e.target.src = './images/default.png' }} />
                            </div>
                        ),
                        
                    });

                }} style={{ width: "100%", cursor: "pointer" }} src={imgurl} onError={(e) => { e.target.src = './images/default.png' }} />
            </Drawer>
        )
    }


}

export default Draw



