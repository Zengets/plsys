import {
    Table, Icon,
    Popconfirm, Divider,
    message, Card, Modal
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import Abload from '@/components/Abload';

@connect(({ device, loading }) => ({
    device,
    submitting: loading.effects['device/queryListAndSpareList'],
}))
class DeviceSpare extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '料号',
                dataIndex: 'sparePartsNo',
                key: 'sparePartsNo',
            },
            {
                title: '配件名称',
                dataIndex: 'sparePartsName',
                key: 'sparePartsName',
            },
            {
                title: '配件类型',
                dataIndex: 'sparePartsTypeName',
                key: 'sparePartsTypeName',
            },
        ]
        this.state = {
            expandedRowKeys: [],
            iftype: {
                name: "",
                value: ""
            },
            pcData: [],
            ydData: [],
            checkedValues: [],
            fv: false,
            fields: undefined,
            /*初始化 main List */
            postData: {
                "pageIndex": 1,
                "pageSize": 10,
                "equipmentTypeId": "", // 设备类型主键
                "equipmentNo": "", // 设备编号
                "equipmentName": "" // 设备名称
            },
            postDatas: {
                "pageIndex": 1,  // 第一页(必须)
                "pageSize": 10, // 每页十条(必须)
                "sparePartsIds": "", // 已选择的配件主键数组
                "sparePartsNo": "", // 配件编号
                "sparePartsName": "" // 配件名称
            },
            postUrl: "queryListAndSpareList",
            curitem: {},
            visible: false
        }
    }


    //设置新状态
    setNewState(type, values, fn) {
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
            this.handleCancel()
        })
    }

    componentWillMount() {
        this.resetData();
    }

    onRefs = (ref) => {
        this.childs = ref;
    }

    onSelectChange = (selectval, name) => {
        let { fields } = this.state;
        fields[name] = { ...fields[name], value: selectval };
        this.setState({
            fields
        })
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
        let curitem = this.state.curitem;
        if (this.state.curitem.id) {
            curitem = this.props.device[this.state.postUrl].list.filter((item) => { return item.id == curitem.id })[0]
        }
        this.setState({
            fv: false,
            curitem: curitem ? curitem : {},
            fields: {
                sparePartsIds: {
                    value: undefined,
                    type: "table",
                    title: "选择配件",
                    keys: "sparePartsIds",
                    requires: true,
                    columns: this.columns,
                    dataSource: "DSparequery",
                    hides: false,
                    dv: "id",
                    lb: "sparePartsName"
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
            values.sparePartsIds = values.sparePartsIds.join(",")
            let postData = { ...values, equipmentId: curitem.id };
            this.setNewState("DSparesave", postData, () => {
                message.success("操作成功！");
                this.resetData();
            });

        });
    }

    handleSearch = (selectedKeys, dataIndex) => {
        let { postUrl } = this.state;
        if (dataIndex == "companyId") {
            this.setState({
                postData: {
                    ...this.state.postData,
                    [dataIndex]: selectedKeys[0],
                    departmentId: "",
                    shopId: "",
                }
            }, () => {
                this.setNewState(postUrl, this.state.postData);
                this.setNewState("queryCondition", { companyId: selectedKeys[0] }, () => {
                })
            })
            return
        }
        this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewState(postUrl, this.state.postData)
        });
    };

    onRef = (ref) => {
        this.child = ref;
    }

    getChildTable(record, expanded) {
        this.setState({
            expandedRowKeys: expanded ? [record.id] : [],
            curitem: record
        })
    }

    render() {
        let { postData, expandedRowKeys, fv, fields, iftype, curitem } = this.state,
            { queryListAndSpareList, search } = this.props.device;

        let getsearchbox = (key) => {
            if (this.child) {
                return this.child.getColumnSearchProps(key)
            } else {
                return null
            }
        }, getselectbox = (key, option, lb, vl) => {
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
        }, col = {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 8,
            xl: 6,
            xxl: 6
        }

        const columns = [
            {
                title: '编号',
                dataIndex: 'equipmentNo',
                key: 'equipmentNo',
                ...getsearchbox('equipmentNo')
            },
            {
                title: '主设备',
                dataIndex: 'isMain',
                key: 'isMain',
                render: (text) => <span style={{ color: text == "1" ? "red" : text == "0" ? "#666" : "green" }}>{text == "1" ? "是" : text == "0" ? "否" : "公共设施"}</span>,
                ...getselectbox("isMain", [
                    {
                        dicName: "否",
                        dicKey: "0"
                    }, {
                        dicName: "是",
                        dicKey: "1"
                    }, {
                        dicName: "公共设施",
                        dicKey: "2"
                    }
                ])
            },
            {
                title: '名称',
                dataIndex: 'equipmentName',
                key: 'equipmentName',
                ...getsearchbox('equipmentName')
            },
            {
                title: '位置号',
                dataIndex: 'positionNo',
                key: 'positionNo',
                ...getsearchbox('positionNo')
            },
            {
                title: '类型',
                dataIndex: 'equipmentTypeName',
                key: 'equipmentTypeName',
                ...gettreeselectbox('equipmentTypeId', search.equipmentTypeTreeList ? search.equipmentTypeTreeList : []),
            },
            {
                title: '状态',
                dataIndex: 'statusName',
                key: 'statusName',
                ...getselectbox('status', search.equipmentStatusList),
                render: (text, record) => <a style={{
                    color: record.status == 0 ? "green" :
                        record.status == 1 ? "#398dcd" :
                            record.status == 2 ? "#999" :
                                record.status == 5 ? "#ff5000" :
                                    "lightred"
                }}>{text}</a>
            },

            {
                title: '型号',
                dataIndex: 'equipmentModel',
                key: 'equipmentModel',
                ...getsearchbox('equipmentModel')
            },
            {
                title: '所在公司',
                dataIndex: 'companyName',
                key: 'companyName',
                ...getselectbox('companyId', search.sysCompanyList ? search.sysCompanyList.map((item) => {
                    return {
                        dicName: item.companyName,
                        dicKey: item.id
                    }
                }) : []),

            },
            {
                title: '所在部门',
                dataIndex: 'departmentName',
                key: 'departmentName',
                ...gettreeselectbox('departmentId', this.props.device.departmentLists ? this.props.device.departmentLists : [])
            },
            {
                title: '产品线',
                dataIndex: 'shopName',
                key: 'shopName',
                ...getselectbox('shopId', this.props.device.shopList ? this.props.device.shopList.map((item) => {
                    return {
                        dicName: item.shopName,
                        dicKey: item.id
                    }
                }) : null)
            },
            {
                title: '保管负责人',
                dataIndex: 'keepUserName',
                key: 'keepUserName',
                ...getsearchbox('keepUserName')
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    二维码
                <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postData: {
                                pageIndex: 1, //(int)页码
                                pageSize: 10, //(int)条数
                                equipmentNo: "",
                                equipmentName: "",
                                positionNo: "",
                                equipmentTypeId: "",
                                status: "",
                                equipmentModel: "",
                                departmentId: "",
                                shopId: "",
                                isMain: ""
                            } //(int)部门id}
                        }, () => {
                            this.resetData()
                        })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                  重置
                </a>
                </span>,
                dataIndex: 'qrCodeUrl',
                key: 'qrCodeUrl',
                render: (text, record) => (text ? <img onClick={() => {
                    Modal.info({
                        maskClosable: true,
                        title: `预览${record.equipmentName}的二维码`,
                        okText: "关闭",
                        content: (
                            <div style={{ width: "100%" }}>
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
                            </div>
                        ),

                    });
                }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
            }
        ];

        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("queryListAndSpareList", this.state.postData);
            })
        }

        const rowClassNameFn = (record, index) => {
            const { curitem } = this.state;
            if (curitem && curitem.id === record.id) {
                return "selectedRow";
            }
            return null;
        };

        let renderAdd = (record) => {
            let column = [

                {
                    title: '料号',
                    dataIndex: 'sparePartsNo',
                    key: 'sparePartsNo',
                },
                {
                    title: '配件名称',
                    dataIndex: 'sparePartsName',
                    key: 'sparePartsName',
                },
                {
                    title: '配件价值(元)',
                    dataIndex: 'sparePartsValue',
                    key: 'sparePartsValue',
                },
                {
                    title: '配件单位(件)',
                    dataIndex: 'spareUnit',
                    key: 'spareUnit',
                },
                {
                    title: '配件规格',
                    dataIndex: 'spareSpec',
                    key: 'spareSpec',
                },
                {
                    title: '配件类型',
                    dataIndex: 'sparePartsTypeName',
                    key: 'sparePartsTypeName',
                },
            ]


            return <Table bordered
                size="middle"
                pagination={false}
                rowKey='id'
                columns={column}
                dataSource={record.sparePartsList ? record.sparePartsList : []}
            >
            </Table>
        }

        return (
            <div>
                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <Card title='设备配件关联列表' extra={<div style={{ display: "flex" }}>
                    <Abload reload={() => {
                        this.resetData()
                    }} postName="uploadequipmentSpareRel" filePath="http://www.plszems.com/download/设备配件关联模板.xlsx"></Abload>

                    <div style={{ display: curitem.id ? "flex" : "none", alignItems: "center", marginRight: 12 }}>
                        <Divider type="vertical"></Divider>
                        <a onClick={() => {
                            this.childs.changedData("DSparequery", {
                                "pageIndex": 1,                          //(int)页码
                                "pageSize": 10,                           //(int)条数
                                "sparePartsIds": curitem.sparePartsList ? curitem.sparePartsList.map((item, i) => {
                                    return item.id
                                }).join(",") : "", // 已选择的配件主键数组
                                "sparePartsNo": "", // 配件编号
                                "sparePartsName": "" // 配件名称
                            }, 1, () => {
                                this.setState({
                                    postDatas: {
                                        "pageIndex": 1,                          //(int)页码
                                        "pageSize": 10,                           //(int)条数
                                        "sparePartsIds": curitem.sparePartsList ? curitem.sparePartsList.map((item, i) => {
                                            return item.id
                                        }).join(",") : "", // 已选择的配件主键数组
                                        "sparePartsNo": "", // 配件编号
                                        "sparePartsName": "" // 配件名称
                                    },
                                    fields: {
                                        sparePartsIds: {
                                            ...this.state.fields.sparePartsIds,
                                            value: curitem.sparePartsList ? curitem.sparePartsList.map((item, i) => {
                                                return item.id
                                            }) : ""
                                        }
                                    },
                                }, () => {
                                    this.setState({
                                        fv: true,
                                        iftype: {
                                            name: "编辑设备下关联的配件",
                                            value: "edit"
                                        },
                                    })
                                })

                            })




                        }}>编辑</a>
                    </div>
                </div>
                }>
                    <Table bordered size="middle" scroll={{ x: 1500, y: "59vh" }}
                        onRow={record => {
                            return {
                                onClick: event => {
                                    this.setState({ curitem: record });
                                }, // 点击行
                            };
                        }}
                        expandRowByClick
                        rowClassName={(record, index) => rowClassNameFn(record, index)}
                        loading={this.props.submitting}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: queryListAndSpareList.pageNum ? queryListAndSpareList.pageNum : 1,
                            total: queryListAndSpareList.total ? parseInt(queryListAndSpareList.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={queryListAndSpareList.list ? queryListAndSpareList.list : []}
                        expandedRowRender={record => renderAdd(record)}
                        expandedRowKeys={expandedRowKeys}
                        onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
                    >
                    </Table>

                    <CreateForm
                        tableUrl={[{
                            url: "DSparequery",
                            post: this.state.postDatas
                        }]}/*配置页面表格数据*/
                        width={800}
                        fields={this.state.fields}
                        iftype={iftype}
                        onChange={this.handleFormChange}
                        wrappedComponentRef={this.saveFormRef}
                        visible={fv}
                        onRef={this.onRefs}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        onSelectChange={this.onSelectChange}
                    />

                </Card>
            </div>
        )
    }


}

export default DeviceSpare



