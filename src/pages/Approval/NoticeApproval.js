//queryNoReview,auditReview,queryYesReview

import {
    Table, Divider, Row, Col, Icon, Tabs, Alert, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import Draw from './Drawer'

const { TabPane } = Tabs;

@connect(({ approval, loading }) => ({
    approval,
    submitting: loading.effects['approval/queryNoReview'],
}))
class NoticeApproval extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iftype: {
                name: "",
                value: ""
            },
            fv: false,
            fields: {},
            key: "1",
            /*初始化 main List */
            postData: {
                "pageIndex": 1,  //-----当前页码(必填)
                "pageSize": 10,  //-----每页条数(必填)
                "startTime": undefined,  //-----开始时间
                "endTime": undefined,  //-----结束时间
                "announcementTitle": "" //-------公告标题
            },
            show:false,
            postDatas: {
                "pageIndex": 1,  //-----当前页码(必填)
                "pageSize": 10,  //-----每页条数(必填)
                "startTime": undefined,  //-----开始时间
                "endTime": undefined,  //-----结束时间
                "announcementTitle": "" //-------公告标题
            },
            postUrl: "queryNoReview",
            curitem: {}
        }
    }


    //设置新状态
    setNewState(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'approval/' + type,
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
                result: {
                    value: null,
                    type: "select",
                    title: "审批结果",
                    keys: "result",
                    requires: true,
                    option: [
                        { name: "通过", id: "1" }, { name: "不通过", id: "2" }
                    ]
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
            this.setNewState("auditReview", postData, () => {
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
    handleSearchs = (selectedKeys, dataIndex, end) => {
        if (end) {
            let start = dataIndex;
            let { postUrl } = this.state;
            this.setState({ postDatas: { ...this.state.postDatas, [start]: selectedKeys[0] ? selectedKeys[0] : "", [end]: selectedKeys[1] ? selectedKeys[1] : "" } }, () => {
                this.setNewState(postUrl, this.state.postDatas)
            });
        } else {
            let { postUrl } = this.state;
            this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
                this.setNewState(postUrl, this.state.postDatas)
            });
        }

    };

    onRef = (ref) => {
        this.child = ref;
    }
    onRefs = (ref) => {
        this.childs = ref;
    }
    render() {
        let { postData, postUrl, fv, fields, iftype, curitem, postDatas,show } = this.state,
            { queryReview } = this.props.approval;
        let getsearchbox = (key) => {
            if (this.child) {
                return this.child.getColumnSearchProps(key)
            } else {
                return null
            }
        }, getdaterangebox = (start, end) => {
            if (this.child) {
                return this.child.getColumnRangeProps(start, end)
            } else {
                return null
            }
        }, getsearchboxs = (key) => {
            if (this.childs) {
                return this.childs.getColumnSearchProps(key)
            } else {
                return null
            }
        }, getdaterangeboxs = (start, end) => {
            if (this.childs) {
                return this.childs.getColumnRangeProps(start, end)
            } else {
                return null
            }
        }

        const columns = [
            {
                title: '公告标题',
                dataIndex: 'announcementTitle',
                key: 'announcementTitle',
                ...getsearchbox("announcementTitle"),
                
            },
            {
                title: '发布人',
                dataIndex: 'publishUserName',
                key: 'publishUserName',
            },
            {
                title: '发布时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
                ...getdaterangebox("startTime", "endTime")
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    状态
                <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postData: {
                                "pageIndex": 1,  //-----当前页码(必填)
                                "pageSize": 10,  //-----每页条数(必填)
                                "startTime": "",  //-----开始时间
                                "endTime": "",  //-----结束时间
                                "announcementTitle": "" //-------公告标题
                            }
                        }, () => {
                            this.resetData();
                        })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                        重置
                </a>
                </span>,
                dataIndex: 'statusName',
                key: 'statusName',
            },
        ], columncs = [
            {
                title: '公告标题',
                dataIndex: 'announcementTitle',
                key: 'announcementTitle',
                ...getsearchboxs("announcementTitle")
            },
            {
                title: '发布人',
                dataIndex: 'publishUserName',
                key: 'publishUserName',
            },
            {
                title: '发布时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
            },
            {
                title: '审批时间',
                dataIndex: 'auditTime',
                key: 'auditTime',
                ...getdaterangeboxs("startTime", "endTime")
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    状态
                <a style={{ color: "#f50" }} onClick={() => {
                        this.setState(this.state.key == 1 ? {
                            postData: {
                                "pageIndex": 1,  //-----当前页码(必填)
                                "pageSize": 10,  //-----每页条数(必填)
                                "startTime": "",  //-----开始时间
                                "endTime": "",  //-----结束时间
                                "announcementTitle": "" //-------公告标题
                            },

                        } : {
                                postDatas: {
                                    "pageIndex": 1,  //-----当前页码(必填)
                                    "pageSize": 10,  //-----每页条数(必填)
                                    "startTime": "",  //-----开始时间
                                    "endTime": "",  //-----结束时间
                                    "announcementTitle": "" //-------公告标题
                                }
                            }, () => {
                                this.resetData();
                            })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                        重置
                </a>
                </span>,
                dataIndex: 'statusName',
                key: 'statusName',
            },
        ]


        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("queryNoReview", this.state.postData);
            })
        }
        let pageChanges = (page) => {
            this.setState({
                postDatas: { ...this.state.postDatas, pageIndex: page }
            }, () => {
                this.setNewState("queryYesReview", this.state.postDatas);
            })
        }

        const rowClassNameFn = (record, index) => {
            const { curitem } = this.state;
            if (curitem && curitem.id === record.id) {
                return "selectedRow";
            }
            return null;
        };

        let callback = (key) => {
            if (key == "1") {
                this.setState({
                    postUrl: "queryNoReview",
                    key
                }, () => {
                    this.resetData()
                })

            } else {
                this.setState({
                    postUrl: "queryYesReview",
                    key
                }, () => {
                    this.resetData()
                })
            }
        }
        return (
            <div>
                <Draw
                    visible={show}
                    title="通知公告流程图"
                    imgurl="./images/all6.png"
                    onClose={() => {
                        this.setState({
                            show: false
                        })
                    }}
                >
                </Draw>
                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <SearchBox onRef={this.onRefs} handleSearch={this.handleSearchs} postData={this.state.postDatas}></SearchBox>
                <Card title='通知公告列表' extra={
                    <div>
                        {
                            curitem.id && this.state.key == "1" ? <a onClick={() => {
                                this.setState({
                                    iftype: {
                                        name: "审批" + curitem.announcementTitle,
                                        value: "sh"
                                    },
                                    fv: true
                                })
                            }}>审批</a> : null
                        }


                    </div>
                }>
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane tab="待审批的通知公告" key="1">
                            <Table bordered size="middle"
                                onRow={record => {
                                    return {
                                        onClick: event => {
                                            this.setState({ curitem: record });
                                        }, // 点击行
                                    };
                                }}
                                expandRowByClick
                                expandedRowRender={record => <div dangerouslySetInnerHTML={{ __html: curitem ? record.announcementContent : null }}></div>}
                                rowClassName={(record, index) => rowClassNameFn(record, index)}
                                scroll={{ x:1200,y:"59vh" }}
                                loading={this.props.submitting}
                                pagination={{
                                    showTotal: total => `共${total}条`, // 分页
                                    size: "small",
                                    pageSize: 10,
                                    showQuickJumper: true,
                                    current: queryReview.pageNum ? queryReview.pageNum : 1,
                                    total: queryReview.total ? parseInt(queryReview.total) : 0,
                                    onChange: pageChange,
                                }}
                                rowKey='id'
                                columns={columns}
                                dataSource={queryReview.list ? queryReview.list : []}
                            >
                            </Table>
                        </TabPane>
                        <TabPane tab="已审批的通知公告" key="2">
                            <Table bordered size="middle"
                                onRow={record => {
                                    return {
                                        onClick: event => {
                                            this.setState({ curitem: record });
                                        }, // 点击行
                                    };
                                }}
                                expandRowByClick
                                expandedRowRender={record => <div dangerouslySetInnerHTML={{ __html: curitem ? record.announcementContent : null }}></div>}
                                rowClassName={(record, index) => rowClassNameFn(record, index)}
                                scroll={{ x:1200,y:"59vh" }}
                                loading={this.props.submitting}
                                pagination={{
                                    showTotal: total => `共${total}条`, // 分页
                                    size: "small",
                                    pageSize: 10,
                                    showQuickJumper: true,
                                    current: queryReview.pageNum ? queryReview.pageNum : 1,
                                    total: queryReview.total ? parseInt(queryReview.total) : 0,
                                    onChange: pageChanges,
                                }}
                                rowKey='id'
                                columns={columncs}
                                dataSource={queryReview.list ? queryReview.list : []}
                            >
                            </Table>
                        </TabPane>
                    </Tabs>
                    {
                        fields &&
                        <CreateForm
                            fields={fields}
                            iftype={iftype}
                            onChange={this.handleFormChange}
                            wrappedComponentRef={this.saveFormRef}
                            visible={fv}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                        />
                    }

                </Card>
            </div>
        )
    }


}

export default NoticeApproval



