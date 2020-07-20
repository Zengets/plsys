import {
    Table, Tree, Divider, Row, Col, Icon, Select, Alert, Popconfirm, message, Card, Modal, DatePicker
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import moment from 'moment';


const { TreeNode } = Tree;


@connect(({ produce, loading }) => ({
    produce,
    submitting: loading.effects['produce/promonqueryList'],
}))
class Child extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: {
                checked: [], halfChecked: []
            },
            iftype: {
                name: "",
                value: ""
            },
            fv: false,
            fields: {},
            /*初始化 main List */
            postData: {
                startDate: "",
                endDate: "",
                "pageIndex": 1, // 第一页
                "pageSize": 10 // 每页十条
            },
            postDatas: {
                "pageIndex": 1, // 第一页
                "pageSize": 10, // 每页十条
                "shopId": "", // 产品线主键(必须)
                startDate: "",
                endDate: "",
            },
            postUrl: "promonqueryList",
            curitem: {}
        }
    }

    onCheck = (checkedKeys, info) => {
        message.destroy();
        if (this.state.iftype.liziyuan == 2) {
            message.warn("移动端无法操作")
        } else {
            this.setState({ checkedKeys });
        }

    };


    //设置新状态
    setNewState(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'produce/' + type,
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
            curitem: {},
            fields: {

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
            if (iftype.value == "edit") {
                let postData = { ...values, id: curitem.id, companyId: curitem.companyId };
                this.setNewState("partssave", postData, () => {
                    message.success("修改成功！");
                    this.resetData();
                });
            } else if (iftype.value == "add") {
                let postData = { ...values, companyId: curitem.companyId };
                this.setNewState("partssave", postData, () => {
                    message.success("新增成功！");
                    this.resetData();
                });
            } else {
                //ELSE TO DO
            }

        });
    }

    handleSearch = (selectedKeys, dataIndex) => {
        let { postUrl } = this.state;
        this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewState(postUrl, this.state.postData)
        });
    };


    onRef = (ref) => {
        this.child = ref;
    }


    disabledStartDate = startValue => {
        const { endDate } = this.state.postData;
        if (!startValue || !endDate) {
            return false;
        }
        return startValue.valueOf() > moment(endDate).valueOf();
    };

    disabledEndDate = endValue => {
        const { startDate } = this.state.postData;
        if (!endValue || !startDate) {
            return false;
        }
        return endValue.valueOf() <= moment(startDate).valueOf();
    };


    render() {
        let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
            { promonqueryList, queryByShopIdAndPlanMonth } = this.props.produce;
        console.log(promonqueryList)
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
        }


        const columns = [
            {
                title: '组织',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '日期',
                dataIndex: 'planMonth',
                key: 'planMonth',
            },
            {
                title: '计划订单(万支)',
                dataIndex: 'saleQuantity',
                key: 'saleQuantity',
            },
            {
                title: '实际产量(万支)',
                dataIndex: 'actualQuantity',
                key: 'actualQuantity',
            },
            {
                title: '完成率(%)',
                dataIndex: 'finishRate',
                key: 'finishRate',
                render: (text) => <span>{text ? `${text}%` : ''}</span>
            },
            {
                title: '废品率(%)',
                dataIndex: 'rejectionRate',
                key: 'rejectionRate',
                render: (text) => <span>{text ? `${text}%` : ''}</span>
            },
        ]



        const loop = data =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode key={item.key} title={item.title}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} title={item.title} />;
            });

        const rowClassNameFn = (record, index) => {
            const { curitem } = this.state;
            if (!curitem.id) {
                return curitem.companyId === record.companyId
            } else if (curitem && curitem.id === record.id) {
                return "selectedRow";
            }

            return null;
        };
        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("promonqueryList", this.state.postData);
            })
        }
        let pageChanges = (page) => {
            this.setState({
                postDatas: { ...this.state.postDatas, pageIndex: page }
            }, () => {
                this.setNewState("queryByShopIdAndPlanMonth", this.state.postDatas);
            })
        }

        let renderAdd = (record) => {
            let selectedRows = record.productMonthPlanDetailList;
            return <Table bordered
                dataSource={record.productMonthPlanDetailList}
                rowKey='id'
                columns={[
                    {
                        title: '产品线名称',
                        dataIndex: 'shopName',
                        key: 'shopName',
                    },
                    {
                        title: '计划订单(万支)',
                        dataIndex: 'saleQuantity',
                        key: 'saleQuantity',
                    },
                    {
                        title: '实际达成(万支)',
                        dataIndex: 'actualQuantity',
                        key: 'actualQuantity',
                    },
                    {
                        title: '完成率(%)',
                        dataIndex: 'finishRate',
                        key: 'finishRate',
                        render: (text) => <span>{text ? `${text}%` : ''}</span>
                    },
                    {
                        title: '废品率(%)',
                        dataIndex: 'rejectionRate',
                        key: 'rejectionRate',
                        render: (text) => <span>{text ? `${text}%` : ''}</span>
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text, record) => <a onClick={() => {
                            this.setNewState("queryByShopIdAndPlanMonth", { ...this.state.postDatas, shopId: record.shopId, startDate: record.startDate, endDate: record.endDate }, () => {
                                this.setState({
                                    title: `${record.shopName}详情`,
                                    visible: true,
                                    postDatas: { ...this.state.postDatas, shopId: record.shopId, startDate: record.startDate, endDate: record.endDate }
                                })
                            })
                        }}>查看详情</a>
                    },
                ]}
                style={{ backgroundColor: "#fff" }}
                pagination={{
                    showTotal: total => `共${total}条`, // 分页
                    size: "small",
                    pageSize: 10,
                    showQuickJumper: true,
                }}
            >
            </Table>
        }

        return (
            <div>
                <Modal
                    width={"80%"}
                    visible={this.state.visible}
                    title={this.state.title}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    footer={null}
                >
                    <Table bordered
                        dataSource={queryByShopIdAndPlanMonth ? queryByShopIdAndPlanMonth.list : []}
                        rowKey='id'
                        columns={[
                            {
                                title: '产品规格',
                                dataIndex: 'manufactureContent',
                                key: 'manufactureContent',
                            },
                            {
                                title: '产品料号',
                                dataIndex: 'productNo',
                                key: 'productNo',
                            },
                            {
                                title: '计划订单(万支)',
                                dataIndex: 'saleQuantity',
                                key: 'saleQuantity',
                            },
                            {
                                title: '实际达成(万支)',
                                dataIndex: 'actualQuantity',
                                key: 'actualQuantity',
                            },
                            {
                                title: '完成率(%)',
                                dataIndex: 'finishRate',
                                key: 'finishRate',
                                render: (text) => <span>{text ? `${text}%` : ''}</span>
                            },
                            {
                                title: '废品率(%)',
                                dataIndex: 'rejectionRate',
                                key: 'rejectionRate',
                                render: (text) => <span>{text ? `${text}%` : ''}</span>
                            },
                        ]}
                        style={{ backgroundColor: "#fff" }}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: queryByShopIdAndPlanMonth.pageNum ? queryByShopIdAndPlanMonth.pageNum : 1,
                            total: queryByShopIdAndPlanMonth.total ? parseInt(queryByShopIdAndPlanMonth.total) : 0,
                            onChange: pageChanges,
                        }}
                    >
                    </Table>
                </Modal>

                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <Card title='公司计划' extra={
                    <div>
                        <DatePicker.MonthPicker allowClear='false' placeholder='开始月份' disabledDate={this.disabledStartDate} value={postData.startDate ? moment(postData.startDate) : undefined} onChange={(value) => {
                            this.setState({
                                postData: {
                                    ...postData,
                                    startDate: value?moment(value).format("YYYY-MM"):undefined
                                }
                            }, () => {
                                this.resetData()
                            })

                        }}></DatePicker.MonthPicker>
                        <Divider type='vertical'></Divider>
                        <DatePicker.MonthPicker allowClear='false' placeholder='结束月份' disabledDate={this.disabledEndDate} value={postData.endDate ? moment(postData.endDate) : undefined} onChange={(value) => {
                            this.setState({
                                postData: {
                                    ...postData,
                                    endDate: value?moment(value).format("YYYY-MM"):undefined
                                }
                            }, () => {
                                this.resetData()
                            })

                        }}></DatePicker.MonthPicker>


                    </div>
                }>
                    <Table bordered size="middle"
                        expandRowByClick
                        onRow={record => {
                            return {
                                onClick: event => {
                                    this.setState({ curitem: record });
                                }, // 点击行
                            };
                        }}
                        rowClassName={(record, index) => rowClassNameFn(record, index)}
                        scroll={{ x: 800, y: "59vh" }}
                        loading={this.props.submitting}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: promonqueryList.pageNum ? promonqueryList.pageNum : 1,
                            total: promonqueryList.total ? parseInt(promonqueryList.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={promonqueryList ? promonqueryList.list : []}
                        expandedRowRender={record => renderAdd(record)}
                    >
                    </Table>
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

export default Child



