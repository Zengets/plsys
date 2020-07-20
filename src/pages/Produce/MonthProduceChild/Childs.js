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
    submitting: loading.effects['produce/takequeryList'],
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
                "companyId": "", // 公司主键
                "planMonth": "", // 日期(只要年月)
                "shopId": "",  // 产品线主键主键
                "manufactureContent": "", // 产品规格
                "productNo": "", // 料号
                "orderNo": "", // 订单号
                "pageIndex": 1, // 第一页
                "pageSize": 10 // 每页十条
            },
            postUrl: "takequeryList",
            curitem: {}
        }
    }



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
        this.handleCancel()
    }

    componentDidMount() {
        this.resetData();
        this.props.onRef(this)
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
                planMonth: {
                    value: null,
                    type: "monthpicker",
                    title: "日期",
                    keys: "planMonth",
                    requires: true,
                },
                productId: {
                    value: null,
                    type: "select",
                    title: "产品规格",
                    keys: "productId",
                    requires: true,
                    option: this.props.produce.pecificationList && this.props.produce.pecificationList.map((item) => {
                        return {
                            name: item.manufactureContent,
                            id: item.id
                        }
                    })
                },
                orderNo: {
                    value: null,
                    type: "input",
                    title: "订单号",
                    keys: "orderNo",
                    requires: true,
                },
                saleQuantity: {
                    value: null,
                    type: "inputnumber",
                    title: "销售计划量(万支)",
                    keys: "saleQuantity",
                    min: 0,
                    requires: true,
                },
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
            values.planMonth = moment(values.planMonth).format("YYYY-MM");
            if (iftype.value == "edit") {
                let postData = { ...values, id: curitem.id };
                this.setNewState("takesave", postData, () => {
                    message.success("修改成功！");
                    this.resetData();
                });
            } else if (iftype.value == "add") {
                let postData = { ...values };
                this.setNewState("takesave", postData, () => {
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

    render() {
        let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
            { takequeryList, queryByShopIdAndPlanMonth, sysCompanyList, pecificationList, shopList } = this.props.produce;
        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("takequeryList", this.state.postData);
            })
        }
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
        }, getmonthbox = (key, disableddate) => {
            if (this.child) {
                return this.child.getColumnMonthProps(key, disableddate)
            } else {
                return null
            }
        }


        const columns = [
            {
                title: '组织',
                dataIndex: 'companyName',
                key: 'companyName',
                ...getselectbox("companyId", sysCompanyList && sysCompanyList.map((item) => {
                    return {
                        dicName: item.companyName,
                        dicKey: item.id
                    }
                }))
            },
            {
                title: '日期',
                dataIndex: 'planMonth',
                key: 'planMonth',
                ...getmonthbox("planMonth")
            },
            {
                title: '产品线',
                dataIndex: 'shopName',
                key: 'shopName',
                ...getselectbox("shopId", shopList && shopList.map((item) => {
                    return {
                        dicName: item.shopName,
                        dicKey: item.id
                    }
                }))
            },
            {
                title: '产品规格',
                dataIndex: 'manufactureContent',
                key: 'manufactureContent',
                ...getsearchbox("manufactureContent")
            },
            {
                title: '产品料号',
                dataIndex: 'productNo',
                key: 'productNo',
                ...getsearchbox("productNo")
            },
            {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                ...getsearchbox("orderNo")
            },
            {
                title: '销售计划量(万支)',
                dataIndex: 'saleQuantity',
                key: 'saleQuantity',
            },
            {
                title: '实际产量(万支)',
                dataIndex: 'actualQuantity',
                key: 'actualQuantity',
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    完成率(%)
               <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postData: {
                                "companyId": "", // 公司主键
                                "planMonth": "", // 日期(只要年月)
                                "shopId": "",  // 产品线主键主键
                                "manufactureContent": "", // 产品规格
                                "productNo": "", // 料号
                                "orderNo": "", // 订单号
                                "pageSize": 10 // 每页十条
                            },
                        }, () => {
                            this.resetData()
                        })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                        重置
                </a>
                </span>,
                dataIndex: 'finishRate',
                key: 'finishRate',
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
                                title: '规格料号',
                                dataIndex: 'manufactureContent',
                                key: 'manufactureContent',
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


                </Modal>

                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <Card title='组织计划' extra={
                    <div>
                        <a onClick={() => {
                            this.setState({
                                iftype: {
                                    name: "新增计划",
                                    value: "add"
                                },
                            }, () => {
                                this.setState({
                                    fv: true
                                })
                            })
                        }}>新增</a>

                        {
                            curitem.id && <span>
                                <Divider type="vertical"></Divider>

                                <a onClick={() => {
                                    this.setState({
                                        iftype: {
                                            name: "修改计划",
                                            value: "edit"
                                        },
                                        fields: {
                                            planMonth: {
                                                ...fields.planMonth,
                                                value: curitem.planMonth && moment(curitem.planMonth),
                                                disabled: true
                                            },
                                            shopId: {
                                                ...fields.shopId,
                                                value: curitem.shopId,
                                                disabled: true
                                            },
                                            productId: {
                                                ...fields.productId,
                                                value: curitem.productId,
                                                disabled: true
                                            },
                                            orderNo: {
                                                ...fields.orderNo,
                                                value: curitem.orderNo,
                                                disabled: true
                                            },
                                            saleQuantity: {
                                                ...fields.saleQuantity,
                                                value: curitem.saleQuantity
                                            },
                                        },
                                    }, () => {
                                        this.setState({
                                            fv: true
                                        })
                                    })
                                }}>修改</a>
                                <Divider type="vertical"></Divider>
                                <Popconfirm
                                    okText="确认"
                                    cancelText="取消"
                                    placement="bottom"
                                    title={"确认删除该计划？"}
                                    onConfirm={() => {
                                        this.setNewState("takedeleteById", { id: curitem.id }, () => {
                                            this.resetData();
                                            message.success("删除成功！");
                                        })
                                    }}>
                                    <a style={{ color: "#ff4800" }}>删除</a>
                                </Popconfirm>
                            </span>

                        }


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
                        scroll={{ x: 1200, y: "59vh" }}
                        loading={this.props.submitting}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: takequeryList.pageNum ? takequeryList.pageNum : 1,
                            total: takequeryList.total ? parseInt(takequeryList.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={takequeryList ? takequeryList.list : []}
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



