import {
    Steps, Popover, Skeleton,
    Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;
const { Step } = Steps;

@connect(({ device, loading }) => ({
    device,
    submitting: loading.effects['device/devicestepqueryList'],
}))
class DeviceStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iftype: {
                name: "",
                value: ""
            },
            fv: false,
            fields: {
                nodeName: {
                    value: null,
                    type: "input",
                    title: "节点名",
                    keys: "nodeName",
                    requires: true
                },
            },
            /*初始化 main List */
            postData: {
            },
            postUrl: "devicestepqueryList",
            curitem: {},
            dataList: []

        }
    }

    //设置新状态
    setNewState(type, values, fn) {
        //devicestepqueryList, devicestepsave, devicestepdeleteById, devicestepnodesave, devicestepnodedeleteById
        const { dispatch } = this.props;
        dispatch({
            type: 'device/' + type,
            payload: values
        }).then((res) => {
            if (res) {
                fn ? fn() : null;
            }
        });
    }


    resetData() {
        let { postUrl, postData } = this.state;
        this.setNewState(postUrl, postData, () => {
            this.setState({
                dataList: this.props.device.devicestepqueryList.dataList ? this.props.device.devicestepqueryList.dataList : []
            })
        })
    }

    componentDidMount() {
        this.resetData()
    }


    //表单改变
    handleFormChange = (changedFields) => {
        let fields = this.state.fields, obj;
        for (let i in changedFields) {
            obj = changedFields[i]
        }
        if (obj) {
            for (let i in fields) {
                if (i == obj.name) {
                    fields[i].value = obj.value
                    fields[i].name = obj.name
                    fields[i].dirty = obj.dirty
                    fields[i].errors = obj.errors
                    fields[i].touched = obj.touched
                    fields[i].validating = obj.validating
                }
            }
            this.setState({
                fields: fields,
            })
        }

    }

    /*绑定form*/
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    /*关闭*/
    handleCancel = () => {
        this.setState({
            fv: false,
            fields: {
                nodeName: {
                    value: null,
                    type: "input",
                    title: "节点名",
                    keys: "nodeName",
                    requires: true
                },
            },
        });
    }

    /*form 提交*/
    handleCreate = () => {
        const form = this.formRef.props.form;
        let { curitem, iftype, curitemz } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.approvalProcessId = curitem.id;

            if (iftype.value == "edit") {
                let postData = { ...values, id: curitemz.id };
                this.setNewState("devicestepnodesave", postData, () => {
                    message.success("修改成功！");
                    this.setState({ visibleform: false });
                    this.resetData();
                    this.handleCancel();
                });
            } else if (iftype.value == "add") {
                let postData = { ...values };
                this.setNewState("devicestepnodesave", postData, () => {
                    message.success("新增成功！");
                    this.setState({ visibleform: false });
                    this.resetData();
                    this.handleCancel();
                });
            } else {
                //ELSE TO DO
            }

        });
    }

    deletStep(id) {
        let dataList = this.state.dataList;
        if (id.indexOf("add") == -1) {
            this.setNewState("devicestepdeleteById", { id: id }, () => {
                message.success("删除成功");
                this.resetData();
            })
        } else {
            dataList = dataList.filter((item) => { return item.id != id });
            this.setState({
                dataList
            })
        }
    }


    render() {
        let { postData, postUrl, fv, fields, iftype, curitem, dataList } = this.state,
            { devicestepqueryList } = this.props.device;

        const customDot = (dot, { status, index }, resarr, ifs, records) => {
            let mainid = records.id;
            return (
                <Popover content={
                    <span>
                        <a onClick={() => {
                            let record = resarr[index];
                            this.setState({
                                iftype: {
                                    name: "修改" + record.nodeName,
                                    value: "edit"
                                },
                                curitemz: record,
                                curitem:records,
                                fields: {
                                    nodeName: {
                                        value: record.nodeName,
                                        type: "input",
                                        title: "节点名",
                                        keys: "nodeName",
                                        requires: true
                                    },
                                },
                            },()=>{
                                this.setState({
                                    fv: true,
                                })
                            })
                        }}>修改</a>
                        <Divider type="vertical"></Divider>
                        <Popconfirm
                            okText="确认"
                            cancelText="取消"
                            placement="bottom"
                            title={"确认删除该节点？"}
                            onConfirm={() => {
                                let record = resarr[index];
                                this.setNewState("devicestepnodedeleteById", { id: record.id, approvalProcessId: mainid }, () => {
                                    message.success("删除成功");
                                    this.resetData()
                                })
                            }}>
                            <a style={{ color: "#ff4800" }}>删除</a>
                        </Popconfirm>


                    </span>
                }
                >
                    {dot}
                </Popover>
            );

        }


        let resetDataList = (val, id, key) => {
            let res = dataList.map((item) => {
                if (item.id == id) {
                    item[key] = val
                }
                return item
            })
            console.log(res)
            this.setState({
                dataList: res
            })

        }


        let renderCard = (record, i) => {
            if (record.adden) {
                return <Col xxl={6} xl={8} lg={12} md={12} sm={24} xs={24} key={i} >
                    <Card style={{ marginBottom: 24 }}
                        title={<a>
                            <Select showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="流程" style={{ width: 74 }} value={record.approvalProcessType} onChange={(val) => {
                                resetDataList(val, record.id, "approvalProcessType")
                            }}>
                                {
                                    devicestepqueryList.transferType.map((item, i) => (<Option key={i} value={item.dicKey}>{item.dicName}</Option>))
                                }
                            </Select> 流程</a>}
                        actions={[
                            <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                placement="bottom"
                                title={"确认删除该流程？"}
                                onConfirm={() => {
                                    this.deletStep(record.id)
                                }}>
                                <a style={{ color: "#ff4800" }}><Icon type="delete" /> 删除流程</a>
                            </Popconfirm>
                            , <a style={{ color: "#398dcd" }} onClick={() => {
                                if (!record.approvalProcessType) {
                                    message.warn("请完善信息后提交...")
                                    return;
                                }

                                this.setNewState("devicestepsave", {
                                    "approvalProcessType": record.approvalProcessType,
                                }, () => {
                                    message.success("操作成功")
                                    this.resetData()
                                })

                            }}><Icon type="upload" /> 提交</a>]
                        }
                    >
                        <div style={{ height: 232, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <span>提交后添加节点...</span>
                        </div>
                    </Card >
                </Col >
            } else if (record.edit) {
                return <Col xxl={6} xl={8} lg={12} md={12} sm={24} xs={24} key={i} >
                    <Card style={{ marginBottom: 24 }}
                        title={<a>
                            <Select showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="流程" style={{ width: 74 }} value={record.approvalProcessType} onChange={(val) => {
                                resetDataList(val, record.id, "approvalProcessType")
                            }}>
                                {
                                    devicestepqueryList.transferType.map((item, i) => (<Option key={i} value={item.dicKey}>{item.dicName}</Option>))
                                }
                            </Select> 流程</a>}
                        actions={[
                            <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                placement="bottom"
                                title={"确认删除该流程？"}
                                onConfirm={() => {
                                    this.deletStep(record.id)
                                }}>
                                <a style={{ color: "#ff4800" }}><Icon type="delete" /> 删除流程</a>
                            </Popconfirm>, <a style={{ color: "#398dcd" }} onClick={() => {
                                if (!record.approvalProcessType) {
                                    message.warn("请完善信息后提交...")
                                    return;
                                }


                                this.setNewState("devicestepsave", {
                                    "approvalProcessType": record.approvalProcessType,
                                    "id": record.id
                                }, () => {
                                    message.success("操作成功")
                                    this.resetData()
                                })

                            }}><Icon type="upload" /> 提交</a>]
                        }
                    >
                        <Steps current={10} direction="vertical" size="small" progressDot={(dot, { status, index }) => customDot(dot, { status, index }, record.nodeList, record.isLimit == 1, record)} style={{ height: 200, overflowY: "auto" }}>
                            {
                                record.nodeList.map((item, n) => {
                                    return <Step key={n} title={item.nodeName} description={<div className={styles.limitdiv} style={{ padding: "6px 0px" }}>
                                    </div>} />
                                })
                            }
                        </Steps>
                        <Button type="default" style={{ width: "100%" }} onClick={() => {
                            this.setState({
                                fv: true,
                                iftype: {
                                    name: `新增${record.approvalProcessName}流程的节点`,
                                    value: "add"
                                },
                                fields: {
                                    nodeName: {
                                        value: null,
                                        type: "input",
                                        title: "节点名",
                                        keys: "nodeName",
                                        requires: true
                                    },
                                },
                                curitem: record
                            })

                        }}> 新增节点</Button>
                    </Card>
                </Col>
            } else {
                return <Col xxl={6} xl={8} lg={12} md={12} sm={24} xs={24} key={i} >
                    <Card style={{ marginBottom: 24 }}
                        title={<a style={{ paddingLeft: 12,paddingTop:5,paddingBottom:5,display:"block" }}>{record.approvalProcessName}流程</a>}
                        actions={[<Popconfirm
                            okText="确认"
                            cancelText="取消"
                            placement="bottom"
                            title={"确认删除该流程？"}
                            onConfirm={() => {
                                this.deletStep(record.id)
                            }}>
                            <a style={{ color: "#ff4800" }}><Icon type="delete" /> 删除流程</a>
                        </Popconfirm>, <span style={{ color: "#398dcd" }} onClick={() => {
                            resetDataList("1", record.id, "edit")
                        }}><Icon type="edit" /> 修改流程</span>]}
                    >
                        <Steps current={10} direction="vertical" size="small" progressDot={(dot, { status, index }) => customDot(dot, { status, index }, record.nodeList, record.isLimit == 1, record)} style={{ height: 200, overflowY: "auto" }}>
                            {
                                record.nodeList.map((item, n) => {
                                    return <Step key={n} title={item.nodeName} description={<div className={styles.limitdiv} style={{ padding: "6px 0px" }}>
                                    </div>} />
                                })
                            }
                        </Steps>
                        <Button type="default" style={{ width: "100%" }} onClick={() => {
                            this.setState({
                                fv: true,
                                iftype: {
                                    name: `新增${record.approvalProcessName}流程的节点`,
                                    value: "add"
                                },
                                fields: {
                                    nodeName: {
                                        value: null,
                                        type: "input",
                                        title: "节点名",
                                        keys: "nodeName",
                                        requires: true
                                    },
                                },
                                curitem: record
                            })
                        }}> 新增节点</Button>
                    </Card>
                </Col>
            }

        }

        return (
            <div>
                <Card title='流程列表' extra={<Button onClick={() => {
                    let dataLists = JSON.parse(JSON.stringify(dataList))
                    dataLists.unshift({
                        "adden": "1",
                        "id": "add" + dataLists.length,
                        "approvalProcessName": undefined,      //流程类型名称
                        "approvalProcessType": undefined,             //流程类型
                        "nodeList": [
                        ]
                    })
                    this.setState({
                        dataList: dataLists
                    }, () => {
                        console.log(this.state.dataList)
                    })
                }}>新增流程</Button>}>
                    <Skeleton active loading={this.props.submitting}>
                        <div className={styles.constep}>
                            <Row gutter={24}>
                                {
                                    this.state.dataList && this.state.dataList.map((item, i) => {
                                        return renderCard(item, i)
                                    })
                                }
                            </Row>
                        </div>

                    </Skeleton>



                    <CreateForm
                        fields={fields}
                        data={{}}
                        iftype={iftype}
                        onChange={this.handleFormChange}
                        wrappedComponentRef={this.saveFormRef}
                        visible={fv}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    />

                </Card>
            </div>
        )
    }


}

export default DeviceStep



