import {
    Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, PageHeader
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import moment from 'moment';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ produce, loading }) => ({
    produce,
    submitting: loading.effects['produce/planshiftqueryList'],
}))
class Produces extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '产品规格',
                dataIndex: 'manufactureContent',
                key: 'manufactureContent',
            },
            {
                title: '设备名称',
                dataIndex: 'equipmentName',
                key: 'equipmentName',
            },
            {
                title: '设备编号',
                dataIndex: 'equipmentNo',
                key: 'equipmentNo',
            },
            {
                title: '设备位置号',
                dataIndex: 'positionNo',
                key: 'positionNo',
            },
            {
                title: '设备类型',
                dataIndex: 'equipmentTypeName',
                key: 'equipmentTypeName',
            },
            {
                title: '状态',
                dataIndex: 'statusName',
                key: 'statusName',
            },
        ]
        this.columnc = [
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
            },
            {
                title: '产品线',
                dataIndex: 'shopName',
                key: 'shopName',
            },
            {
                title: '班次',
                dataIndex: 'shiftName',
                key: 'shiftName',
            },
        ]
        this.state = {
            /*初始化 main List */
            postDataz: {
                pageIndex: 1,    //第几页
                pageSize: 10,     //每页大小
                equipmentNo: "",//编号
                equipmentName: "",//设备名
                positionNo: "",//位置编号
                equipmentTypeId: "",//类型
                shopId: ""
            },
            postDatax: {
                pageIndex: 1,    //第几页
                pageSize: 10,     //每页大小
                shopId: "2019103140067032567", // 设备主键(必须)
                userName: "", // 用户名
            },
            postData: {
                "pageIndex": 1,
                "pageSize": 10,
                "manufactureContent": "",
                "productDate": moment().format("YYYY-MM-DD"),
                "shopId": "",
                "shiftId": "",
                "assignUserName": "", // 计划人名
                "positionNo": "", // 设备名称
                "status": "", // 状态, 0 : 待生产, 1 : 生产中, 2 : 待确认, 3 : 结束
            },
            postUrl: "planshiftqueryList",
            fields: undefined,
            fv: false,
            curitem: {},
            iftype: {
                name: "",
                value: ""
            },
        }
    }
    //设置新状态
    setNewStates(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'publicmodel/' + type,
            payload: values
        }).then((res) => {
            if (res) {
                fn ? fn() : null;
            }
        });
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

    onRefs = (ref) => {
        this.childs = ref;
    }

    resetData() {
        let { postUrl, postData } = this.state;
        this.setNewState(postUrl, postData, () => {
            this.handleCancel()
        })
    }

    componentDidMount() {
        this.resetData();
        this.setNewState('deviceTypequeryTreeList', null);
    }

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

    onSelectChange = (selectval, name) => {
        let { fields } = this.state;
        fields[name] = { ...fields[name], value: selectval };
        this.setState({
            fields
        })
    }
    /*关闭*/
    handleCancel = () => {
        this.setState({
            fv: false,
            fields: {
                confirmManufactureTotalQuantity: {
                    value: null,
                    type: "inputnumber",
                    title: "核定产量",
                    min: 0,
                    keys: "confirmManufactureTotalQuantity",
                    requires: true
                },
                confirmRecycleWaste: {
                    value: null,
                    type: "inputnumber",
                    title: "工序1确认可回收",
                    keys: "confirmRecycleWaste",
                    min: 0,
                    requires: true
                },
                confirmUnrecycleWaste: {
                    value: null,
                    type: "inputnumber",
                    title: "工序1确认不可回收",
                    keys: "confirmUnrecycleWaste",
                    min: 0,
                    requires: true
                },
                confirmRecycleWaste1: {
                    value: null,
                    type: "inputnumber",
                    title: "工序2确认可回收",
                    min: 0,
                    keys: "confirmRecycleWaste1",
                    requires: false
                },
                confirmUnrecycleWaste1: {
                    value: null,
                    type: "inputnumber",
                    title: "工序2确认不可回收",
                    min: 0,
                    keys: "confirmUnrecycleWaste1",
                    requires: false
                },
                confirmRecycleWaste2: {
                    value: null,
                    type: "inputnumber",
                    title: "工序3确认可回收",
                    min: 0,
                    keys: "confirmRecycleWaste2",
                    requires: false
                },
                confirmUnrecycleWaste2: {
                    value: null,
                    type: "inputnumber",
                    title: "工序3确认不可回收",
                    min: 0,
                    keys: "confirmUnrecycleWaste2",
                    requires: false
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
            if (iftype.value == "editpc") {
                values.equipmentId = values.equipmentId[0];
                values.productDate = moment(values.productDate).format("YYYY-MM-DD");
                let postData = { ...values, productPlanId: productPlanId, id: curitemz.id };
                this.setNewState("saveOrUpdate", postData, () => {
                    message.success("修改成功！");
                    this.handleCancel()
                    this.resetData();
                });
            } else if (iftype.value == "ensure") {
                let postData = { ...values, id: curitem.id, equipmentId: curitem.equipmentId };
                this.setNewState("changeProductConfig", postData, () => {
                    message.success("操作成功！");
                    this.handleCancel()
                    this.resetData();
                });
            } else {
                let postData = { ...values, id: curitem.id, equipmentId: curitem.equipmentId };
                this.setNewState("productConfig", postData, () => {
                    message.success("操作成功！");
                    this.handleCancel()
                    this.resetData();
                });
            }


        });
    }

    handleSearch = (selectedKeys, dataIndex) => {
        let { postUrl } = this.state;
        this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewState(postUrl, this.state.postData)
        });
    };
    handleSearchc = (selectedKeys, dataIndex) => {
        let postUrl = "getProductors"
        this.setState({ postDatax: { ...this.state.postDatax, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewStates(postUrl, this.state.postDatax)
        });
    };
    handleSearchz = (selectedKeys, dataIndex) => {
        let postUrl = "queryPageListPlus"
        this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewStates(postUrl, this.state.postDataz)
        });
    };
    onRef = (ref) => {
        this.child = ref;
    }
    onRefz = (ref) => {
        this.childz = ref;
    }
    onRefc = (ref) => {
        this.childc = ref;
    }

    disabledStartDate = current => {
        return current && current > moment().endOf('day');
    };

    render() {
        let { postData, postUrl, iftype, fv, fields, curitem } = this.state,
            { planshiftqueryList, shopList, shiftList, deviceTypequeryTreeList } = this.props.produce;
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
        }, getdatebox = (key, disableddate) => {
            if (this.child) {
                return this.child.getColumnDateProps(key, disableddate)
            } else {
                return null
            }
        }, getsearchboxc = (key) => {
            if (this.childc) {
                return this.childc.getColumnSearchProps(key)
            } else {
                return null
            }
        }, getsearchboxz = (key) => {
            if (this.childz) {
                return this.childz.getColumnSearchProps(key)
            } else {
                return null
            }
        }, gettreeselectboxz = (key, option) => {
            if (this.childz) {
                return this.childz.getColumnTreeSelectProps(key, option)
            } else {
                return null
            }
        }, col = {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 8,
            xl: 8,
            xxl: 8
        };
        this.columns = [
            {
                title: '产品规格',
                dataIndex: 'manufactureContent',
                key: 'manufactureContent',
                ...getsearchboxz("manufactureContent")
            },
            {
                title: '设备名称',
                dataIndex: 'equipmentName',
                key: 'equipmentName',
                ...getsearchboxz("equipmentName")
            },
            {
                title: '设备编号',
                dataIndex: 'equipmentNo',
                key: 'equipmentNo',
                ...getsearchboxz("equipmentNo")
            },
            {
                title: '设备位置号',
                dataIndex: 'positionNo',
                key: 'positionNo',
                ...getsearchboxz("positionNo")
            },
            {
                title: '设备类型',
                dataIndex: 'equipmentTypeName',
                key: 'equipmentTypeName',
                ...gettreeselectboxz('equipmentTypeId', deviceTypequeryTreeList),
            },
            {
                title: '状态',
                dataIndex: 'statusName',
                key: 'statusName',
            },
        ]

        this.columnc = [
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
                ...getsearchboxc("userName")
            },
            {
                title: '产品线',
                dataIndex: 'shopName',
                key: 'shopName',
            },
            {
                title: '班次',
                dataIndex: 'shiftName',
                key: 'shiftName',
            },
        ]

        let renderPerson = (record) => {
            return <Row>
                <Col {...col}>
                    <PageHeader
                        title="工序一"
                    >
                        <p>
                            <span>废料(kg):</span>
                            <span>{record.rejectWaste}</span>
                        </p>
                        <p>
                            <span>可回收废料(kg):</span>
                            <span>{record.recycleWaste}</span>
                        </p>
                        <p>
                            <span>不可回收废料(kg):</span>
                            <span>{record.unrecycleWaste}</span>
                        </p>
                        <p>
                            <span>核定废料(kg):</span>
                            <span>{record.confirmRejectWaste}</span>
                        </p>
                        <p>
                            <span>确认可回收(kg):</span>
                            <span>{record.confirmRecycleWaste}</span>
                        </p>
                        <p>
                            <span>确认不可回收(kg):</span>
                            <span>{record.confirmUnrecycleWaste}</span>
                        </p>
                        <p style={{ display: "flex", flexWrap: "wrap" }}>
                            <span style={{ margin: "0 12px 6px 0", padding: 6 }}>生产人员 : </span>
                            {
                                record.productUserList &&
                                record.productUserList.map((item) => {
                                    return <span style={{ margin: "0 12px 6px 0", padding: 6, backgroundColor: "#f0f0f0", borderRadius: 4 }} key={item.userId}>{item.userName}</span>
                                })
                            }
                        </p>
                    </PageHeader>
                </Col>
                <Col {...col}>
                    <PageHeader
                        title="工序二"
                    >
                        <p>
                            <span>废料(kg):</span>
                            <span>{record.rejectWaste1}</span>
                        </p>
                        <p>
                            <span>可回收废料(kg):</span>
                            <span>{record.recycleWaste1}</span>
                        </p>
                        <p>
                            <span>不可回收废料(kg):</span>
                            <span>{record.unrecycleWaste1}</span>
                        </p>
                        <p>
                            <span>核定废料(kg):</span>
                            <span>{record.confirmRejectWaste1}</span>
                        </p>
                        <p>
                            <span>确认可回收(kg):</span>
                            <span>{record.confirmRecycleWaste1}</span>
                        </p>
                        <p>
                            <span>确认不可回收(kg):</span>
                            <span>{record.confirmUnrecycleWaste1}</span>
                        </p>
                        <p style={{ display: "flex", flexWrap: "wrap" }}>
                            <span style={{ margin: "0 12px 6px 0", padding: 6 }}>生产人员 : </span>
                            {
                                record.productUserList1 &&
                                record.productUserList1.map((item) => {
                                    return <span style={{ margin: "0 12px 6px 0", padding: 6, backgroundColor: "#f0f0f0", borderRadius: 4 }} key={item.userId}>{item.userName}</span>
                                })
                            }
                        </p>
                    </PageHeader>
                </Col>
                <Col {...col}>
                    <PageHeader
                        title="工序三"
                    >
                        <p>
                            <span>废料(kg):</span>
                            <span>{record.rejectWaste2}</span>
                        </p>
                        <p>
                            <span>可回收废料(kg):</span>
                            <span>{record.recycleWaste2}</span>
                        </p>
                        <p>
                            <span>不可回收废料(kg):</span>
                            <span>{record.unrecycleWaste2}</span>
                        </p>
                        <p>
                            <span>核定废料(kg):</span>
                            <span>{record.confirmRejectWaste2}</span>
                        </p>
                        <p>
                            <span>确认可回收(kg):</span>
                            <span>{record.confirmRecycleWaste2}</span>
                        </p>
                        <p>
                            <span>确认不可回收(kg):</span>
                            <span>{record.confirmUnrecycleWaste2}</span>
                        </p>
                        <p style={{ display: "flex", flexWrap: "wrap" }}>
                            <span style={{ margin: "0 12px 6px 0", padding: 6 }}>生产人员 : </span>
                            {
                                record.productUserList2 &&
                                record.productUserList2.map((item) => {
                                    return <span style={{ margin: "0 12px 6px 0", padding: 6, backgroundColor: "#f0f0f0", borderRadius: 4 }} key={item.userId}>{item.userName}</span>
                                })
                            }
                        </p>
                    </PageHeader>
                </Col>
            </Row>
        }

        const columns = [
            {
                title: '计划人',
                dataIndex: 'assignUserName',
                key: 'assignUserName',
                ...getsearchbox("assignUserName")
            },
            {
                title: '产品线名',
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
                title: "位置号",
                dataIndex: 'positionNo',
                key: 'positionNo',
                ...getsearchbox("positionNo")
            },
            {
                title: "设备编号",
                dataIndex: 'equipmentNo',
                key: 'equipmentNo',
                ...getsearchbox("equipmentNo")
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
                title: '生产日期',
                dataIndex: 'productDate',
                key: 'productDate',
                ...getdatebox("productDate")
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
            {
                title: '班别',
                dataIndex: 'className',
                key: 'className',
            },
            {
                title: '目标产量(万支)',
                dataIndex: 'planProductQuantity',
                key: 'planProductQuantity',
                width: 120
            },
            {
                title: '产量/箱',
                dataIndex: 'box',
                key: 'box',
            },
            {
                title: '产量(万支)',
                dataIndex: 'manufactureTotalQuantity',
                key: 'manufactureTotalQuantity',
            },

            {
                title: '核定产量(万支)',
                dataIndex: 'confirmManufactureTotalQuantity',
                key: 'confirmManufactureTotalQuantity',
                width: 120
            },
            {
                title: '克重(kg/万支)',
                dataIndex: 'gramWeight',
                key: 'gramWeight',
                width: 110
            },
            {
                title: '废品率',
                dataIndex: 'rejectionRate',
                key: 'rejectionRate',
                render: (text) => { return text && <span>{text}%</span> }
            },
            {
                title: "状态",
                dataIndex: 'status',
                key: 'status',
                ...getselectbox("status", [
                    {
                        dicName: "待生产",
                        dicKey: "0"
                    },
                    {
                        dicName: "生产中",
                        dicKey: "1"
                    },
                    {
                        dicName: "待确认",
                        dicKey: "2"
                    },
                    {
                        dicName: "结束",
                        dicKey: "3"
                    },
                    {
                        dicName: "关闭",
                        dicKey: "4"
                    },
                ]),
                render: (text, record) => <span>{text == "0" ? "待生产" : text == "1" ? "生产中" : text == "2" ? "待确认" : text == "3" ? "结束" : text == "4" ? "关闭" : ""}</span>
            },
            {
                title: '核定人',
                dataIndex: 'confirmUserName',
                key: 'confirmUserName',
            },

            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    核定时间
                <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postData: {
                                pageIndex: 1,
                                pageSize: 10,
                                "manufactureContent": "",
                                "productDate": "",
                                "shopId": "",
                                "shiftId": "",
                                "assignUserName": "", // 计划人名
                                "positionNo": "", // 设备名称
                                "productNo": "",
                                "status": "", // 状态, 0 : 待生产, 1 : 生产中, 2 : 待确认, 3 : 结束
                            }
                        }, () => {
                            this.resetData()
                        })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                        重置
                </a>
                </span>,
                dataIndex: 'confirmTime',
                key: 'confirmTime',
                width: 140
            },


        ]

        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("planshiftqueryList", this.state.postData);
            })
        }
        function bodyparse(vals) {
            let val = JSON.parse(JSON.stringify(vals))
            delete val.pageSize;
            delete val.pageIndex;
            let res = ''
            for (let key in val) {
                let value = val[key] ? val[key] : ''

                res += `&${key}=${value}`;
            }
            return res.substr(1)
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
                <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
                <SearchBox onRef={this.onRefc} handleSearch={this.handleSearchc} postData={this.state.postDatax}></SearchBox>
                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <Card title='日排产计划' extra={
                    <span>
                        {
                            curitem.id ? <a onClick={
                                () => {
                                    let user1 = curitem.productUserList.map((item) => {
                                        return item.userId
                                    }), user2 = curitem.productUserList1.map((item) => {
                                        return item.userId
                                    }), user3 = curitem.productUserList2.map((item) => {
                                        return item.userId
                                    })
                                    let alluserids = [...user1, ...user2, ...user3];
                                    alluserids = [...new Set(alluserids)].join(",")

                                    this.childs.changedData("getProductors", {
                                        pageIndex: 1,    //第几页
                                        pageSize: 10,     //每页大小
                                        shopId: curitem.shopId, // 设备主键(必须)
                                        userName: "", // 用户名
                                        userIds: alluserids
                                    }, 1, () => {
                                        this.childs.changedData("queryPageListPlus", {
                                            pageIndex: 1,    //第几页
                                            pageSize: 10,     //每页大小
                                            equipmentNo: "",//编号
                                            equipmentName: "",//设备名
                                            positionNo: "",//位置编号
                                            equipmentTypeId: "",//类型
                                            shopId: curitem.shopId,
                                            equipmentIds: curitem.equipmentId
                                        }, 1, () => {
                                            this.setState({
                                                productPlanId: curitem.productPlanId,
                                                postDatax: {
                                                    pageIndex: 1,    //第几页
                                                    pageSize: 10,     //每页大小
                                                    shopId: curitem.shopId, // 设备主键(必须)
                                                    userName: "", // 用户名
                                                    userIds: curitem.productUserList.map((item) => {
                                                        return item.userId
                                                    }).join(",")
                                                },
                                                postDataz: {
                                                    pageIndex: 1,    //第几页
                                                    pageSize: 10,     //每页大小
                                                    equipmentNo: "",//编号
                                                    equipmentName: "",//设备名
                                                    positionNo: "",//位置编号
                                                    equipmentTypeId: "",//类型
                                                    shopId: curitem.shopId,
                                                    equipmentIds: curitem.equipmentId
                                                },
                                                fields: {
                                                    equipmentId: {
                                                        value: [curitem.equipmentId],
                                                        type: "table",
                                                        title: "选择设备",
                                                        keys: "equipmentId",
                                                        requires: true,
                                                        columns: this.columns,
                                                        dataSource: "queryPageListPlus",
                                                        checktype: "radio",
                                                        hides: false,
                                                        dv: "id",
                                                        lb: "equipmentName"
                                                    },
                                                    shiftId: {
                                                        value: curitem.shiftId,
                                                        type: "select",
                                                        title: "选择班次",
                                                        keys: "shiftId",
                                                        requires: true,
                                                        option: this.props.produce.shiftList ? this.props.produce.shiftList.map((item) => {
                                                            return {
                                                                name: item.shiftName,
                                                                id: item.id
                                                            }
                                                        }) : []
                                                    },
                                                    classType: {
                                                        value: curitem.classType,
                                                        type: "select",
                                                        title: "选择班别",
                                                        keys: "classType",
                                                        requires: true,
                                                        option: [{
                                                            name: "白班",
                                                            id: 0
                                                        }, {
                                                            name: "夜班",
                                                            id: 1
                                                        }]
                                                    },
                                                    productDate: {
                                                        value: curitem.productDate ? moment(curitem.productDate) : undefined,
                                                        type: "datepicker",
                                                        title: "生产日期",
                                                        keys: "productDate",
                                                        requires: true,
                                                    },
                                                    planProductQuantity: {
                                                        value: curitem.planProductQuantity,
                                                        type: "inputnumber",
                                                        title: "计划生产数量",
                                                        keys: "planProductQuantity",
                                                        requires: true,
                                                    },
                                                    // productionIdList: {
                                                    //     value: curitem.productUserList.map((item) => {
                                                    //         return item.userId
                                                    //     }),
                                                    //     type: "table",
                                                    //     title: "工序一人员",
                                                    //     keys: "productionIdList",
                                                    //     requires: true,
                                                    //     columns: this.columnc,
                                                    //     dataSource: "getProductors",
                                                    //     dv: "id",
                                                    //     lb: "userName"
                                                    // },
                                                    // productionIdList1: {
                                                    //     value: curitem.productUserList1.map((item) => {
                                                    //         return item.userId
                                                    //     }),
                                                    //     type: "table",
                                                    //     title: "工序二人员",
                                                    //     keys: "productionIdList1",
                                                    //     requires: false,
                                                    //     columns: this.columnc,
                                                    //     dataSource: "getProductors",
                                                    //     dv: "id",
                                                    //     lb: "userName"
                                                    // },
                                                    // productionIdList2: {
                                                    //     value: curitem.productUserList2.map((item) => {
                                                    //         return item.userId
                                                    //     }),
                                                    //     type: "table",
                                                    //     title: "工序三人员",
                                                    //     keys: "productionIdList2",
                                                    //     requires: false,
                                                    //     columns: this.columnc,
                                                    //     dataSource: "getProductors",
                                                    //     dv: "id",
                                                    //     lb: "userName"
                                                    // },
                                                }
                                            }, () => {
                                                this.setState({
                                                    fv: true,
                                                    curitemz: curitem,
                                                    iftype: {
                                                        name: "修改排产计划",
                                                        value: "editpc"
                                                    },
                                                })
                                            })
                                        })
                                    })
                                }}>修改</a> : null
                        }
                        {
                            curitem.id ? <Divider type='vertical' /> : null
                        }

                        {
                            curitem.id ? <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                placement="bottom"
                                title={"确认删除该排产计划？"}
                                onConfirm={() => {
                                    this.setNewState("savedeleteById", { id: curitem.id }, () => {
                                        this.resetData();
                                        message.success("删除成功！");
                                    })
                                }}>
                                <a style={{ color: "#ff4800" }}>删除</a>
                            </Popconfirm> : null
                        }
                        {
                            curitem.id ? <Divider type='vertical' /> : null
                        }


                        {
                            curitem.id && curitem.status == "2" ? <a onClick={
                                () => {
                                    let user1 = curitem.productUserList.map((item) => {
                                        return item.userId
                                    }), user2 = curitem.productUserList1.map((item) => {
                                        return item.userId
                                    }), user3 = curitem.productUserList2.map((item) => {
                                        return item.userId
                                    })
                                    let alluserids = [...user1, ...user2, ...user3];
                                    alluserids = [...new Set(alluserids)].join(",")

                                    this.childs.changedData("getProductors", {
                                        pageIndex: 1,    //第几页
                                        pageSize: 10,     //每页大小
                                        shopId: curitem.shopId, // 设备主键(必须)
                                        userName: "", // 用户名
                                        userIds: alluserids
                                    }, 1, () => {
                                        this.childs.changedData("queryPageListPlus", {
                                            pageIndex: 1,    //第几页
                                            pageSize: 10,     //每页大小
                                            equipmentNo: "",//编号
                                            equipmentName: "",//设备名
                                            positionNo: "",//位置编号
                                            equipmentTypeId: "",//类型
                                            shopId: curitem.shopId,
                                            equipmentIds: curitem.equipmentId
                                        }, 1, () => {
                                            this.setState({
                                                productPlanId: curitem.productPlanId,
                                                postDatax: {
                                                    pageIndex: 1,    //第几页
                                                    pageSize: 10,     //每页大小
                                                    shopId: curitem.shopId, // 设备主键(必须)
                                                    userName: "", // 用户名
                                                    userIds: curitem.productUserList.map((item) => {
                                                        return item.userId
                                                    }).join(",")
                                                },
                                                postDataz: {
                                                    pageIndex: 1,    //第几页
                                                    pageSize: 10,     //每页大小
                                                    equipmentNo: "",//编号
                                                    equipmentName: "",//设备名
                                                    positionNo: "",//位置编号
                                                    equipmentTypeId: "",//类型
                                                    shopId: curitem.shopId,
                                                    equipmentIds: curitem.equipmentId
                                                },
                                                fields: {
                                                    confirmManufactureTotalQuantity: {
                                                        value: curitem.manufactureTotalQuantity,
                                                        type: "inputnumber",
                                                        title: "核定产量",
                                                        min: 0,
                                                        keys: "confirmManufactureTotalQuantity",
                                                        requires: true
                                                    },
                                                    confirmRecycleWaste: {
                                                        value: curitem.recycleWaste,
                                                        type: "inputnumber",
                                                        title: "工序1确认可回收",
                                                        keys: "confirmRecycleWaste",
                                                        min: 0,
                                                        requires: true
                                                    },
                                                    confirmUnrecycleWaste: {
                                                        value: curitem.unrecycleWaste,
                                                        type: "inputnumber",
                                                        title: "工序1确认不可回收",
                                                        keys: "confirmUnrecycleWaste",
                                                        min: 0,
                                                        requires: true
                                                    },
                                                    confirmRecycleWaste1: {
                                                        value: curitem.recycleWaste1,
                                                        type: "inputnumber",
                                                        title: "工序2确认可回收",
                                                        min: 0,
                                                        keys: "confirmRecycleWaste1",
                                                        requires: false
                                                    },
                                                    confirmUnrecycleWaste1: {
                                                        value: curitem.unrecycleWaste1,
                                                        type: "inputnumber",
                                                        title: "工序2确认不可回收",
                                                        min: 0,
                                                        keys: "confirmUnrecycleWaste1",
                                                        requires: false
                                                    },
                                                    confirmRecycleWaste2: {
                                                        value: curitem.recycleWaste2,
                                                        type: "inputnumber",
                                                        title: "工序3确认可回收",
                                                        min: 0,
                                                        keys: "confirmRecycleWaste2",
                                                        requires: false
                                                    },
                                                    confirmUnrecycleWaste2: {
                                                        value: curitem.unrecycleWaste2,
                                                        type: "inputnumber",
                                                        title: "工序3确认不可回收",
                                                        min: 0,
                                                        keys: "confirmUnrecycleWaste2",
                                                        requires: false
                                                    },
                                                    productionIdList: {
                                                        value: curitem.productUserList.map((item) => {
                                                            return item.userId
                                                        }),
                                                        type: "table",
                                                        title: "工序一人员",
                                                        keys: "productionIdList",
                                                        requires: true,
                                                        columns: this.columnc,
                                                        dataSource: "getProductors",
                                                        dv: "id",
                                                        lb: "userName"
                                                    },
                                                    productionIdList1: {
                                                        value: curitem.productUserList1.map((item) => {
                                                            return item.userId
                                                        }),
                                                        type: "table",
                                                        title: "工序二人员",
                                                        keys: "productionIdList1",
                                                        requires: false,
                                                        columns: this.columnc,
                                                        dataSource: "getProductors",
                                                        dv: "id",
                                                        lb: "userName"
                                                    },
                                                    productionIdList2: {
                                                        value: curitem.productUserList2.map((item) => {
                                                            return item.userId
                                                        }),
                                                        type: "table",
                                                        title: "工序三人员",
                                                        keys: "productionIdList2",
                                                        requires: false,
                                                        columns: this.columnc,
                                                        dataSource: "getProductors",
                                                        dv: "id",
                                                        lb: "userName"
                                                    },

                                                },
                                            }, () => {
                                                this.setState({
                                                    fv: true,
                                                    curitemz: curitem,
                                                    iftype: {
                                                        name: "确认",
                                                        value: ""
                                                    },
                                                })
                                            })
                                        })
                                    })

                                }}>
                                确认
                            </a> : null
                        }


                        {
                            curitem.id && curitem.status == "3" ? <a onClick={
                                () => {
                                    let user1 = curitem.productUserList.map((item) => {
                                        return item.userId
                                    }), user2 = curitem.productUserList1.map((item) => {
                                        return item.userId
                                    }), user3 = curitem.productUserList2.map((item) => {
                                        return item.userId
                                    })
                                    let alluserids = [...user1, ...user2, ...user3];
                                    alluserids = [...new Set(alluserids)].join(",")

                                    this.childs.changedData("getProductors", {
                                        pageIndex: 1,    //第几页
                                        pageSize: 10,     //每页大小
                                        shopId: curitem.shopId, // 设备主键(必须)
                                        userName: "", // 用户名
                                        userIds: alluserids
                                    }, 1, () => {
                                        this.childs.changedData("queryPageListPlus", {
                                            pageIndex: 1,    //第几页
                                            pageSize: 10,     //每页大小
                                            equipmentNo: "",//编号
                                            equipmentName: "",//设备名
                                            positionNo: "",//位置编号
                                            equipmentTypeId: "",//类型
                                            shopId: curitem.shopId,
                                            equipmentIds: curitem.equipmentId
                                        }, 1, () => {
                                            this.setState({
                                                productPlanId: curitem.productPlanId,
                                                postDatax: {
                                                    pageIndex: 1,    //第几页
                                                    pageSize: 10,     //每页大小
                                                    shopId: curitem.shopId, // 设备主键(必须)
                                                    userName: "", // 用户名
                                                    userIds: curitem.productUserList.map((item) => {
                                                        return item.userId
                                                    }).join(",")
                                                },
                                                postDataz: {
                                                    pageIndex: 1,    //第几页
                                                    pageSize: 10,     //每页大小
                                                    equipmentNo: "",//编号
                                                    equipmentName: "",//设备名
                                                    positionNo: "",//位置编号
                                                    equipmentTypeId: "",//类型
                                                    shopId: curitem.shopId,
                                                    equipmentIds: curitem.equipmentId
                                                },
                                                fields: {
                                                    confirmManufactureTotalQuantity: {
                                                        value: curitem.confirmManufactureTotalQuantity,
                                                        type: "inputnumber",
                                                        title: "核定产量",
                                                        min: 0,
                                                        keys: "confirmManufactureTotalQuantity",
                                                        requires: true
                                                    },
                                                    confirmRecycleWaste: {
                                                        value: curitem.confirmRecycleWaste,
                                                        type: "inputnumber",
                                                        title: "工序1确认可回收",
                                                        keys: "confirmRecycleWaste",
                                                        min: 0,
                                                        requires: true
                                                    },
                                                    confirmUnrecycleWaste: {
                                                        value: curitem.confirmUnrecycleWaste,
                                                        type: "inputnumber",
                                                        title: "工序1确认不可回收",
                                                        keys: "confirmUnrecycleWaste",
                                                        min: 0,
                                                        requires: true
                                                    },
                                                    confirmRecycleWaste1: {
                                                        value: curitem.confirmRecycleWaste1,
                                                        type: "inputnumber",
                                                        title: "工序2确认可回收",
                                                        min: 0,
                                                        keys: "confirmRecycleWaste1",
                                                        requires: false
                                                    },
                                                    confirmUnrecycleWaste1: {
                                                        value: curitem.confirmUnrecycleWaste1,
                                                        type: "inputnumber",
                                                        title: "工序2确认不可回收",
                                                        min: 0,
                                                        keys: "confirmUnrecycleWaste1",
                                                        requires: false
                                                    },
                                                    confirmRecycleWaste2: {
                                                        value: curitem.confirmRecycleWaste2,
                                                        type: "inputnumber",
                                                        title: "工序3确认可回收",
                                                        min: 0,
                                                        keys: "confirmRecycleWaste2",
                                                        requires: false
                                                    },
                                                    confirmUnrecycleWaste2: {
                                                        value: curitem.confirmUnrecycleWaste2,
                                                        type: "inputnumber",
                                                        title: "工序3确认不可回收",
                                                        min: 0,
                                                        keys: "confirmUnrecycleWaste2",
                                                        requires: false
                                                    },
                                                    productionIdList: {
                                                        value: curitem.productUserList.map((item) => {
                                                            return item.userId
                                                        }),
                                                        type: "table",
                                                        title: "工序一人员",
                                                        keys: "productionIdList",
                                                        requires: true,
                                                        columns: this.columnc,
                                                        dataSource: "getProductors",
                                                        dv: "id",
                                                        lb: "userName"
                                                    },
                                                    productionIdList1: {
                                                        value: curitem.productUserList1.map((item) => {
                                                            return item.userId
                                                        }),
                                                        type: "table",
                                                        title: "工序二人员",
                                                        keys: "productionIdList1",
                                                        requires: false,
                                                        columns: this.columnc,
                                                        dataSource: "getProductors",
                                                        dv: "id",
                                                        lb: "userName"
                                                    },
                                                    productionIdList2: {
                                                        value: curitem.productUserList2.map((item) => {
                                                            return item.userId
                                                        }),
                                                        type: "table",
                                                        title: "工序三人员",
                                                        keys: "productionIdList2",
                                                        requires: false,
                                                        columns: this.columnc,
                                                        dataSource: "getProductors",
                                                        dv: "id",
                                                        lb: "userName"
                                                    },

                                                },
                                            }, () => {
                                                this.setState({
                                                    fv: true,
                                                    curitemz: curitem,
                                                    iftype: {
                                                        name: "修改确认信息",
                                                        value: "ensure"
                                                    },
                                                })
                                            })
                                        })
                                    })

                                }}>
                                修改确认信息
                                <Divider type='vertical' />
                            </a> : null
                        }


                        {
                            curitem.id && curitem.status == "2" ? <Divider type='vertical' /> : null
                        }
                        {/* <a onClick={() => {
                            if (!postData.shopId) {
                                message.warn("请先选择产品线...");
                                return
                            }

                            if (!postData.productDate) {
                                message.info("默认导出昨天的数据...");
                            }

                            this.setNewState("exportPlanRateFileCheck", {
                                shopId: postData.shopId,
                                productDate: postData.productDate ? postData.productDate : moment().add("day", -1).format("YYYY-MM-DD"),
                                shiftId: postData.shiftId,
                            }, () => {
                                message.loading("正在导出文件...")
                                window.open(`/rs/equipmentShiftProduct/exportPlanRateFile?${bodyparse({
                                    shopId: postData.shopId,
                                    productDate: postData.productDate ? postData.productDate : moment().add("day", -1).format("YYYY-MM-DD"),
                                    shiftId: postData.shiftId,
                                })}`)
                            })
                        }}>导出计划达成率</a> 
                        <Divider type='vertical' />*/}
                        <a onClick={() => {
                            this.setNewState("exportEquipmentShiftProductCheck", {
                                shopId: postData.shopId,
                                productDate: postData.productDate ? postData.productDate : '',
                                shiftId: postData.shiftId,
                                positionNo: postData.positionNo,           // 位置号
                                manufactureContent: postData.manufactureContent,   // 产品规格
                                status: postData.status,               // 状态： 0 : 待生产, 1 : 生产中, 2 : 待确认, 3 : 结束
                                assignUserName: postData.assignUserName        // 计划人
                            }, () => {
                                message.loading("正在导出文件...")
                                window.open(`/rs/equipmentShiftProduct/exportEquipmentShiftProduct?${bodyparse(postData)}`)
                            })
                        }}>导出排产计划</a>
                        {/* <Divider type='vertical' />
                        <a onClick={() => {
                            if (!postData.shopId) {
                                message.warn("请先选择产品线...");
                                return
                            }
                            if (!postData.productDate) {
                                message.info("默认导出昨天的数据...");
                            }
                            this.setNewState("exportFileCheck", {
                                shopId: postData.shopId,
                                productDate: postData.productDate ? postData.productDate : moment().add("day", -1).format("YYYY-MM-DD"),
                                shiftId: postData.shiftId,
                            }, () => {
                                message.loading("正在导出文件...")
                                window.open(`/rs/equipmentShiftProduct/exportFile?shopId=${postData.shopId}&productDate=${postData.productDate ? postData.productDate : moment().add("day", -1).format("YYYY-MM-DD")}&shiftId${postData.shiftId ? "=" + postData.shiftId : "="}`)
                            })


                        }}>导出日报</a> */}
                    </span>
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
                        scroll={{ x: 1680, y: "59vh" }}
                        loading={this.props.submitting}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: planshiftqueryList.pageNum ? planshiftqueryList.pageNum : 1,
                            total: planshiftqueryList.total ? parseInt(planshiftqueryList.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        expandedRowRender={record => renderPerson(record)}
                        dataSource={planshiftqueryList.list ? planshiftqueryList.list : []}
                    >
                    </Table>
                    {
                        fv ? <CreateForm
                            tableUrl={[{
                                url: "queryPageListPlus",
                                post: this.state.postDataz
                            }, {
                                url: "getProductors",
                                post: this.state.postDatax
                            }]}/*配置页面表格数据*/
                            width={1200}
                            fields={this.state.fields}
                            iftype={iftype}
                            onRef={this.onRefs}
                            onSelectChange={this.onSelectChange}
                            onChange={this.handleFormChange}
                            wrappedComponentRef={this.saveFormRef}
                            visible={fv}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                        /> : <CreateForm
                                width={1200}
                                fields={this.state.fields}
                                iftype={iftype}
                                onRef={this.onRefs}
                                onSelectChange={this.onSelectChange}
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

export default Produces



