import {
    Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import Abload from '@/components/Abload';
import moment from 'moment'


@connect(({ produce, loading }) => ({
    produce,
    submitting: loading.effects['produce/dayinfoqueryList'],
    saveing: loading.effects['produce/dayinfosave'],
}))
class ProduceDayInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curitem: {},
            fields: {},
            iftype: {},
            fv: false,
            /*初始化 main List */
            postData: {
                "pageIndex": 1,
                "pageSize": 10,
                "productDateStart": "",//日期起
                "productDateEnd": "",//日期止
                "shopId": "",//生产线id
                "shiftId": "",//班次id
                "productLeader": "",//生产班长
                "pqcLeader": "",//品控班长
                "equipmentLeader": "",//设备班长
                "productManager": "",//生产主管
                "pqcUsers": "",//PQC
                "equipmentRepairUsers": "",//维修工
                "checkUsers": "",//复查人员
                "mixUsers": "",//拌料工
                "sectionUser": "",//工段长
                "flowUsers": "",//物流工
                "newUsers": "",//新员工
                "leaveUsers": ""//请假人
            },
            postUrl: "dayinfoqueryList",
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
                    if (i == "shopId") {
                        this.setNewState("queryInOrNotByShopId", { shopId: obj.value }, () => {
                            let option = this.props.produce.queryInOrNotByShopId && this.props.produce.queryInOrNotByShopId.map((item) => {
                                return {
                                    name: item.userName,
                                    id: item.userName + "|" + item.id
                                }
                            })

                            let arr = ['productLeader', 'pqcLeader', 'equipmentLeader', 'productManager', 'pqcUsers', 'equipmentRepairUsers', 'checkUsers', 'mixUsers', 'sectionUser', 'flowUsers', 'newUsers', 'leaveUsers']
                            arr.map((item) => {
                                fields[item].option = option;
                                fields[item].value = undefined;
                            })


                            this.setState({
                                fields: fields,
                            })
                        })


                    }

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
        let curitem = this.state.curitem;
        if (this.state.curitem.id) {
            curitem = this.props.produce[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
        }
        this.setState({
            fv: false,
            visibles: false,
            curitem: curitem ? curitem : {},
            fields: {
                productDate: {
                    value: undefined,
                    type: "datepicker",
                    title: "生产日期",
                    keys: "productDate",
                    requires: true
                },
                shopId: {
                    value: undefined,
                    type: "select",
                    title: "产品线",
                    keys: "shopId",
                    requires: true,
                    option: this.props.produce.shopList && this.props.produce.shopList.map((item) => {
                        return {
                            name: item.shopName,
                            id: item.id
                        }
                    })
                },
                shiftId: {
                    value: undefined,
                    type: "select",
                    title: "班次",
                    keys: "shiftId",
                    requires: true,
                    option: this.props.produce.shiftList && this.props.produce.shiftList.map((item) => {
                        return {
                            name: item.shiftName,
                            id: item.id
                        }
                    })
                },
                planUserQuantity: {
                    value: undefined,
                    type: "inputnumber",
                    title: "本班应到人数",
                    keys: "planUserQuantity",
                    min: 1,
                    requires: true
                },
                actualUserQuantity: {
                    value: undefined,
                    type: "inputnumber",
                    title: "本班实到人数",
                    keys: "actualUserQuantity",
                    min: 1,
                    requires: true
                },
                productLeader: {
                    value: undefined,
                    type: "select",
                    title: "生产班长",
                    keys: "productLeader",
                    requires: true,
                    option: this.props.produce.queryInOrNotByShopId && this.props.produce.queryInOrNotByShopId.map((item) => {
                        return {
                            name: item.userName,
                            id: item.userName
                        }
                    })
                },
                pqcLeader: {
                    value: undefined,
                    type: "select",
                    title: "品控班长",
                    keys: "pqcLeader",
                    requires: true,
                },
                equipmentLeader: {
                    value: undefined,
                    type: "select",
                    title: "设备班长",
                    keys: "equipmentLeader",
                    requires: false,
                },
                productManager: {
                    value: undefined,
                    type: "select",
                    title: "生产主管",
                    keys: "productManager",
                    requires: false,
                },
                pqcUsers: {
                    value: undefined,
                    type: "select",
                    title: "PQC",
                    keys: "pqcUsers",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                equipmentRepairUsers: {
                    value: undefined,
                    type: "select",
                    title: "维修工",
                    keys: "equipmentRepairUsers",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                checkUsers: {
                    value: undefined,
                    type: "select",
                    title: "复查人员",
                    keys: "checkUsers",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                mixUsers: {
                    value: undefined,
                    type: "select",
                    title: "拌料工",
                    keys: "mixUsers",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                sectionUser: {
                    value: undefined,
                    type: "select",
                    title: "工段长",
                    keys: "sectionUser",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                flowUsers: {
                    value: undefined,
                    type: "select",
                    title: "物流工",
                    keys: "flowUsers",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                newUsers: {
                    value: undefined,
                    type: "select",
                    title: "新员工",
                    keys: "newUsers",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                leaveUsers: {
                    value: undefined,
                    type: "select",
                    title: "请假人",
                    keys: "leaveUsers",
                    requires: false,
                    multiple: true,
                    col: { span: 24 }
                },
                remark: {
                    value: undefined,
                    type: "textarea",
                    title: "备注",
                    keys: "remark",
                    requires: false,
                    col: { span: 24 }
                },
            },
        });
    }

    /*form 提交*/
    handleCreate = () => {
        const form = this.formRef.props.form;
        let { curitem, iftype, curitemz, productPlanId } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let arr = ['pqcUsers', 'equipmentRepairUsers', 'checkUsers', 'mixUsers', 'sectionUser', 'flowUsers', 'newUsers', 'leaveUsers'];
            arr.map((item) => {
                values[item] = values[item] ? values[item].join(",") : ""
            })
            values.productDate = values.productDate ? moment(values.productDate).format("YYYY-MM-DD") : ""
            if (iftype.value == "edit") {
                let postData = { ...values, id: curitem.id };
                this.setNewState("dayinfosave", postData, () => {
                    message.success("修改成功！");
                    this.resetData();
                });
            } else if (iftype.value == "add") {
                let postData = { ...values };
                this.setNewState("dayinfosave", postData, () => {
                    message.success("新增成功！");
                    this.resetData();
                });
            }

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
        let { postData, postUrl, curitem, fields, iftype, fv } = this.state,
            { dayinfoqueryList, shopList, shiftList } = this.props.produce;
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
        }, getdaterangebox = (start, end) => {
            if (this.child) {
                return this.child.getColumnRangeProps(start, end)
            } else {
                return null
            }
        }



        const columns = [
            {
                title: '产品线',
                dataIndex: 'shopName',
                key: 'shopName',
                ...getselectbox("shopId", shopList ? shopList.map((item) => {
                    return {
                        dicName: item.shopName,
                        dicKey: item.id
                    }
                }) : [])
            },
            {
                title: '班次',
                dataIndex: 'shiftName',
                key: 'shiftName',
                ...getselectbox("shiftId", shiftList ? shiftList.map((item) => {
                    return {
                        dicName: item.shiftName,
                        dicKey: item.id
                    }
                }) : [])
            },
            { //productNo,shopName
                title: '生产日期',
                dataIndex: 'productDate',
                key: 'productDate',
                ...getdaterangebox("productDateStart", "productDateEnd")
            },
            {
                title: "本班应到人数",
                dataIndex: 'planUserQuantity',
                key: 'planUserQuantity',
            },
            {
                title: "本班实到人数",
                dataIndex: 'actualUserQuantity',
                key: 'actualUserQuantity',
            },
            {
                title: "生产班长",
                dataIndex: 'productLeader',
                key: 'productLeader',
                ...getsearchbox('productLeader'),
                render: (text) => <span>{text ? text.split(",").map((item) => { return <i style={{ padding: "4px 6px", backgroundColor: "#f0f0f0", display: "inline-block", margin: 4, fontStyle: "normal" }}>{item.split("|")[0]}</i> }) : ""}</span>
            },
            {
                title: "设备班长",
                dataIndex: 'equipmentLeader',
                key: 'equipmentLeader',
                ...getsearchbox('equipmentLeader'),
                render: (text) => <span>{text ? text.split(",").map((item) => { return <i style={{ padding: "4px 6px", backgroundColor: "#f0f0f0", display: "inline-block", margin: 4, fontStyle: "normal" }}>{item.split("|")[0]}</i> }) : ""}</span>
            },

            {
                title: "品控班长",
                dataIndex: 'pqcLeader',
                key: 'pqcLeader',
                ...getsearchbox('pqcLeader'),
                render: (text) => <span>{text ? text.split(",").map((item) => { return <i style={{ padding: "4px 6px", backgroundColor: "#f0f0f0", display: "inline-block", margin: 4, fontStyle: "normal" }}>{item.split("|")[0]}</i> }) : ""}</span>
            },
            {
                title: "生产主管",
                dataIndex: 'productManager',
                key: 'productManager',
                ...getsearchbox('productManager'),
                render: (text) => <span>{text ? text.split(",").map((item) => { return <i style={{ padding: "4px 6px", backgroundColor: "#f0f0f0", display: "inline-block", margin: 4, fontStyle: "normal" }}>{item.split("|")[0]}</i> }) : ""}</span>
            },
            {
                title: "PQC",
                dataIndex: 'pqcUsers',
                key: 'pqcUsers',
                ...getsearchbox('pqcUsers'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: "维修工",
                dataIndex: 'equipmentRepairUsers',
                key: 'equipmentRepairUsers',
                ...getsearchbox('equipmentRepairUsers'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: "复查人员",
                dataIndex: 'checkUsers',
                key: 'checkUsers',
                ...getsearchbox('checkUsers'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: "拌料工",
                dataIndex: 'mixUsers',
                key: 'mixUsers',
                ...getsearchbox('mixUsers'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: "工段长",
                dataIndex: 'sectionUser',
                key: 'sectionUser',
                ...getsearchbox('sectionUser'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: "物流工",
                dataIndex: 'flowUsers',
                key: 'flowUsers',
                ...getsearchbox('flowUsers'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: "新员工",
                dataIndex: 'newUsers',
                key: 'newUsers',
                ...getsearchbox('newUsers'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: "请假人",
                dataIndex: 'leaveUsers',
                key: 'leaveUsers',
                ...getsearchbox('leaveUsers'),
                render: (text) => {
                    let val = text ? text.split(",").map((item) => { return item.split("|")[0] }).join(",") : ""
                    return <span title={val} style={{
                        padding: "4px 6px", backgroundColor: "#f0f0f0", display: "block", margin: 4, overflow: "hidden",
                        textOverflow: 'ellipsis', whiteSpace: "nowrap"
                    }} >{val}</span>
                }
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    备注
                <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postData: {
                                pageIndex: 1,
                                pageSize: 10,
                                manufactureContent: "",
                                productNo: "",
                                shopId: ""
                            }
                        }, () => {
                            this.resetData()
                        })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                  重置
                </a>
                </span>,
                ellipsis: true,
                dataIndex: 'remark',
                key: 'remark',
            },
        ]

        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("dayinfoqueryList", this.state.postData);
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
                <Card title='日班组信息' extra={<span style={{ display: "flex", alignItems: "center" }}>
                    <a onClick={() => {
                        this.setState({
                            iftype: {
                                name: "新增产品规格",
                                value: "add"
                            },
                        }, () => {
                            this.setState({
                                fv: true
                            })
                        })
                    }}>
                        新增
                    </a>
                    {
                        curitem.id &&
                        <span>
                            <Divider type='vertical'></Divider>
                            <a onClick={() => {
                                this.setNewState("queryInOrNotByShopId", { shopId: curitem.shopId }, () => {
                                    let option = this.props.produce.queryInOrNotByShopId && this.props.produce.queryInOrNotByShopId.map((item) => {
                                        return {
                                            name: item.userName,
                                            id: item.userName + "|" + item.id
                                        }
                                    })
                                    this.setState({
                                        iftype: {
                                            name: "修改",
                                            value: "edit"
                                        },
                                        fields: {
                                            productDate: {
                                                ...fields.productDate,
                                                value: curitem.productDate ? moment(curitem.productDate) : undefined,
                                                disabled: true
                                            },
                                            shopId: {
                                                ...fields.shopId,
                                                value: curitem.shopId,
                                                disabled: true
                                            },
                                            shiftId: {
                                                ...fields.shiftId,
                                                value: curitem.shiftId,
                                                disabled: true
                                            },
                                            planUserQuantity: {
                                                ...fields.planUserQuantity,
                                                value: curitem.planUserQuantity
                                            },
                                            actualUserQuantity: {
                                                ...fields.actualUserQuantity,
                                                value: curitem.actualUserQuantity
                                            },
                                            productLeader: {
                                                ...fields.productLeader,
                                                value: curitem.productLeader,
                                                option
                                            },
                                            pqcLeader: {
                                                ...fields.pqcLeader,
                                                value: curitem.pqcLeader,
                                                option
                                            },
                                            equipmentLeader: {
                                                ...fields.equipmentLeader,
                                                value: curitem.equipmentLeader,
                                                option
                                            },
                                            productManager: {
                                                ...fields.productManager,
                                                value: curitem.productManager,
                                                option
                                            },
                                            pqcUsers: {
                                                ...fields.pqcUsers,
                                                value: curitem.pqcUsers ? curitem.pqcUsers.split(",") : "",
                                                option
                                            },
                                            equipmentRepairUsers: {
                                                ...fields.equipmentRepairUsers,
                                                value: curitem.equipmentRepairUsers ? curitem.equipmentRepairUsers.split(",") : "",
                                                option
                                            },
                                            checkUsers: {
                                                ...fields.checkUsers,
                                                value: curitem.checkUsers ? curitem.checkUsers.split(",") : "",
                                                option
                                            },
                                            mixUsers: {
                                                ...fields.mixUsers,
                                                value: curitem.mixUsers ? curitem.mixUsers.split(",") : "",
                                                option
                                            },
                                            sectionUser: {
                                                ...fields.sectionUser,
                                                value: curitem.sectionUser ? curitem.sectionUser.split(",") : "",
                                                option
                                            },
                                            flowUsers: {
                                                ...fields.flowUsers,
                                                value: curitem.flowUsers ? curitem.flowUsers.split(",") : "",
                                                option
                                            },
                                            newUsers: {
                                                ...fields.newUsers,
                                                value: curitem.newUsers ? curitem.newUsers.split(",") : "",
                                                option
                                            },
                                            leaveUsers: {
                                                ...fields.leaveUsers,
                                                value: curitem.leaveUsers ? curitem.leaveUsers.split(",") : "",
                                                option
                                            },
                                            remark: {
                                                ...fields.remark,
                                                value: curitem.remark
                                            },
                                        }
                                    }, () => {
                                        this.setState({
                                            fv: true
                                        })
                                    })

                                })

                            }}>
                                修改
                            </a>
                            <Divider type='vertical'></Divider>
                            <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                placement="bottom"
                                title={"确认删除该产品规格？"}
                                onConfirm={() => {
                                    this.setNewState("dayinfodeleteById", { id: curitem.id }, () => {
                                        let total = this.props.produce.dayinfoqueryList.total,
                                            page = this.props.produce.dayinfoqueryList.pageNum;
                                        if ((total - 1) % 10 == 0) {
                                            page = page - 1
                                        }

                                        this.setState({
                                            postData: { ...this.state.postData, pageIndex: page }
                                        }, () => {
                                            message.success("删除成功！");
                                            this.resetData()
                                        })
                                    })
                                }}>
                                <a style={{ color: "#ff4800" }}>删除</a>
                            </Popconfirm>
                        </span>
                    }

                    {/* <Divider style={{ marginTop: 6 }} type='vertical'></Divider>
                    <Abload reload={() => {
                        this.resetData()
                    }} data={null} postName="uploadproductionPecification" left={0} filePath="http://www.plszems.com/download/产品规格导入模板.xlsx"></Abload> */}

                </span>}>
                    <Table bordered size="middle"
                        scroll={{ x: 1900, y: "59vh" }}
                        loading={this.props.submitting}
                        onRow={record => {
                            return {
                                onClick: event => {
                                    this.setState({ curitem: record });
                                }, // 点击行
                            };
                        }}
                        rowClassName={(record, index) => rowClassNameFn(record, index)}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: dayinfoqueryList.pageNum ? dayinfoqueryList.pageNum : 1,
                            total: dayinfoqueryList.total ? parseInt(dayinfoqueryList.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={dayinfoqueryList.list ? dayinfoqueryList.list : []}
                    >
                    </Table>
                </Card>
                <CreateForm
                    width={1200}
                    fields={fields}
                    iftype={iftype}
                    onChange={this.handleFormChange}
                    wrappedComponentRef={this.saveFormRef}
                    visible={fv}
                    col={{ span: 8 }}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    confirmLoading={this.props.saveing}
                />
            </div>
        )
    }


}

export default ProduceDayInfo



