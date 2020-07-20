import {
    Table, Divider, Row, Col, Icon, Select, Alert, Popconfirm, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from '../style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';


//buyqueryList,buyaudit,buyrecall,buysave

@connect(({ spare, loading }) => ({
    spare,
    submitting: loading.effects['spare/buyqueryList'],
}))
class SpareBuyChild extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iftype: {
                name: "",
                value: ""
            },
            fv: false,
            fields: {},
            /*初始化 main List */
            postData: {
                "pageIndex": 1,  //-----当前页码(必填)
                "pageSize": 10,  //-----每页条数(必填)
                "taskNo": "",            // 申请单号
                "applyUserName": "",     // 申请人
                "auditUserName": "",     // 审批人
                "auditStatus": props.postData.status,       // 审批状态。0 : 待审批 , 1 : 审批通过 , 2 : 审批未通过 , 3 : 撤回
            },
            postUrl: "buyqueryList",
            curitem: {}
        }
    }



    //设置新状态
    setNewState(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'spare/' + type,
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
            this.handleCancel()
        })
    }

    componentDidMount() {
        this.resetData();
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
                auditResultType: {
                    value: null,
                    type: "select",
                    title: "审批结果",
                    keys: "auditResultType",
                    requires: true,
                    option: [{ name: "不通过", id: "0" }, { name: "通过", id: "1" }]

                },
                auditOpinion: {
                    value: null,
                    type: "textarea",
                    title: "审批意见",
                    keys: "auditOpinion",
                    requires: true,
                }

            },
        });
    }

    /*form 提交*/
    handleCreate = () => {
        const form = this.formRef.props.form;
        let { curitem, iftype } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let postData = { ...values, id: curitem.id };
            this.setNewState("buyaudit", postData, () => {
                message.success("操作成功！");
                this.resetData();
            });

        });
    }

    handleSearch = (selectedKeys, dataIndex, end) => {
        if (end) {
            let start = dataIndex;
            let { postUrl } = this.state;
            this.setState({ postData: { ...this.state.postData, [start]: selectedKeys[0] ? selectedKeys[0] : "", [end]: selectedKeys[1] ? selectedKeys[1] : "" } }, () => {
                this.setNewState(postUrl, this.state.postData)
            });
        } else {
            let { postUrl } = this.state;
            this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
                this.setNewState(postUrl, this.state.postData)
            });
        }
    };

    onRef = (ref) => {
        this.child = ref;
    }

    render() {
        let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
            { buyqueryList, nodeList } = this.props.spare;
        let getsearchbox = (key) => {
            if (this.child) {
                return this.child.getColumnSearchProps(key)
            } else {
                return null
            }
        }, getselectbox = (key, option) => {
            if (this.child) {
                return this.child.getColumnSelectProps(key, option)
            } else {
                return null
            }
        }, gettreeselectbox = (key, option) => {
            if (this.child) {
                return this.child.getColumnTreeSelectProps(key, option)
            } else {
                return null
            }
        }, getdaterangebox = (start, end) => {
            if (this.child) {
                return this.child.getColumnRangeProps(start, end)
            } else {
                return null
            }
        }

        const columns = [
            {
                title: '申请单号',
                dataIndex: 'taskNo',
                key: 'taskNo',
                ...getsearchbox("taskNo"),
                
            },
            {
                title: '配件名称',
                dataIndex: 'sparePartsName',
                key: 'sparePartsName',
            },
            {
                title: '料号',
                dataIndex: 'sparePartsNo',
                key: 'sparePartsNo',
            },
            {
                title: '配件价值(元)',
                dataIndex: 'sparePartsValue',
                key: 'sparePartsValue',
            },
            {
                title: '申请人',
                dataIndex: 'applyUserName',
                key: 'applyUserName',
                ...getsearchbox("applyUserName")
            },
            {
                title: '申请时间',
                dataIndex: 'applyTime',
                key: 'applyTime',
                
            },
            {
                title: '审批人',
                dataIndex: 'auditUserName',
                key: 'auditUserName',
                ...getsearchbox("auditUserName")
            },
            {
                title: '审批时间',
                dataIndex: 'auditTime',
                key: 'auditTime',
                
            },
            {
                title: '审批结果',
                dataIndex: 'auditResultTypeName',
                key: 'auditResultTypeName',
            },
            {
                title: '审批意见',
                dataIndex: 'auditOpinion',
                key: 'auditOpinion',
                
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    备注
                <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postData: {
                                "pageIndex": 1,  //-----当前页码(必填)
                                "pageSize": 10,  //-----每页条数(必填)
                                "taskNo": "",            // 申请单号
                                "applyUserName": "",     // 申请人
                                "auditUserName": "",     // 审批人
                                "auditStatus": this.props.postData.status,
                            }
                        }, () => {
                            this.resetData();
                        })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                        重置
                </a>
                </span>,
                dataIndex: 'remark',
                key: 'remark',
               },
        ]


        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("buyqueryList", this.state.postData);
            })
        }


        const rowClassNameFn = (record, index) => {
            const { curitem } = this.state;
            if (curitem && curitem.id === record.id) {
                return "selectedRow";
            }
            return null;
        };
        return (
            <div>
                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <Card title={this.props.postData.status == "0" ? "待审批列表" :
                    this.props.postData.status == "1" ? "审批通过列表" :
                        this.props.postData.status == "2" ? "审批未通过列表" :
                            this.props.postData.status == "3" ? "撤回列表" : ""} extra={
                                <div>
                                    {
                                        curitem.id && this.props.postData.status == "0" ?
                                        <span>
                                            <a onClick={() => {
                                                this.setState({
                                                    iftype: {
                                                        name: "审批",
                                                        value: "edit"
                                                    },
                                                    fields: {
                                                        auditResultType: {
                                                            value: null,
                                                            type: "select",
                                                            title: "审批结果",
                                                            keys: "auditResultType",
                                                            requires: true,
                                                            option: [{ name: "不通过", id: "0" }, { name: "通过", id: "1" }]

                                                        },
                                                        auditOpinion: {
                                                            value: null,
                                                            type: "textarea",
                                                            title: "审批意见",
                                                            keys: "auditOpinion",
                                                            requires: true,
                                                        }

                                                    },
                                                }, () => {
                                                    this.setState({
                                                        fv: true
                                                    })
                                                })
                                            }}>审批</a>
                                            <Divider type="vertical"></Divider>
                                            <Popconfirm
                                                okText="确认"
                                                cancelText="取消"
                                                placement="bottom"
                                                title={"是否撤回？"}
                                                onConfirm={() => {
                                                    this.setNewState("buyrecall", { id: curitem.id }, () => {
                                                        let total = this.props.spare.buyqueryList.total,
                                                            page = this.props.spare.buyqueryList.pageNum;
                                                        if ((total - 1) % 10 == 0) {
                                                            page = page - 1
                                                        }
                                                        this.setState({
                                                            postData: { ...this.state.postData, pageIndex: page }
                                                        }, () => {
                                                            this.resetData();
                                                            message.success("撤回成功！");
                                                        })
                                                    })
                                                }}>
                                                <a style={{ color: "#ff4800" }}>撤回</a>
                                            </Popconfirm>
                                        </span>:null

                                    }


                                </div>
                            }>
                    <Table bordered size="middle"
                        onRow={record => {
                            return {
                                onClick: event => {
                                    this.setState({ curitem: record });
                                }, // 点击行
                            };
                        }}
                        rowClassName={(record, index) => rowClassNameFn(record, index)}
                        scroll={{ x: 1200, y: "59vh" }}
                        loading={this.props.submitting}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: buyqueryList.pageNum ? buyqueryList.pageNum : 1,
                            total: buyqueryList.total ? parseInt(buyqueryList.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={buyqueryList.list ? buyqueryList.list : []}
                    >
                    </Table>
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

export default SpareBuyChild



