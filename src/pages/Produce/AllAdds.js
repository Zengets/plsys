import react, { Component } from 'react'
import { connect } from 'dva';
import {
    Table, Icon, Row, Col, Input, Select,
    Popconfirm, Divider, DatePicker,
    message, Card, Modal, InputNumber, Button, Drawer
} from 'antd';
import SearchBox from '@/components/SearchBox';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import AllAdd from './AllAdd'


function color16() {//十六进制颜色随机
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
}
function rgb() {//rgb颜色随机
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 125);
    var b = Math.floor(Math.random() * 256);
    var rgb = '(' + r + ',' + g + ',' + b + ',1)';
    return rgb;
}
let { Option } = Select,n=0;
function uniq(array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        let temparr = temp.map((it) => { return it.id });

        if (temparr.indexOf(array[i].id) == -1) {
            temp.push(array[i]);
        }
    }
    return temp;
}

@connect(({ publicmodel, produce, loading }) => ({
    publicmodel,
    produce,
    submitting: loading.effects['produce/sizequeryList'],
}))
class AllAdds extends Component {

    constructor(props) {
        super(props);
        let color = [];
        for (let i = 0; i < 1000; i++) {
            color.push(`rgba` + rgb())
        }
        this.state = {
            postDataz: {
                pageIndex: 1,
                pageSize: 10,
                manufactureContent: "",
                productNo: "",
                shopId: ""
            },
            postData: {
                pageIndex: 1,    //第几页
                pageSize: 10,     //每页大小
                equipmentNo: "",//编号
                equipmentName: "",//设备名
                positionNo: "",//位置编号
                equipmentTypeId: "",//类型
                shopId: ""
            },
            selectedRowKeys: [],
            selectedRows: [],
            color,
            visibles: false,
            iftype: {
                name: "新增排产",
                value: "addchild"
            }
        }
    }


    onSelectChange = (selectedRowKeys, selectedRows) => {
        let cuRow = this.state.selectedRows, newArr = [];
        selectedRows.shiftProductList = [];
        cuRow = [...cuRow, ...selectedRows].filter((item) => { return selectedRowKeys.indexOf(item.id) !== -1 });
        cuRow = [...new Set(cuRow)];

        cuRow = uniq(cuRow)

        this.setState({ selectedRowKeys, selectedRows: cuRow });
    };

    //设置新状态
    setNewStates(type, values, fn) {
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
        this.setNewStates("sizequeryList", { ...this.state.postDataz }, () => {
            this.setState({
                selectedRows: [],
                selectedRowKeys: [],
            })
        })
    }

    componentDidMount() {
        this.resetData();
    }


    handleSearchz = (selectedKeys, dataIndex) => {
        let postUrl = "sizequeryList"
        this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewStates(postUrl, this.state.postDataz)
        });
    };

    onRefz = (ref) => {
        this.childz = ref;
    }


    render() {
        const { loading, selectedRowKeys, selectedRows, iftype, postData } = this.state;
        let { getProductorsByShopIdDown, sizequeryList, shopList } = this.props.produce,
            getsearchboxz = (key) => {
                if (this.childz) {
                    return this.childz.getColumnSearchProps(key)
                } else {
                    return null
                }
            }, getselectboxz = (key, option) => {
                if (this.childz) {
                    return this.childz.getColumnSelectProps(key, option)
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

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const columns = [
            {
                title: '产品线',
                dataIndex: 'shopName',
                key: 'shopName',
                ...getselectboxz("shopId", shopList ? shopList.map((item) => {
                    return {
                        dicName: item.shopName,
                        dicKey: item.id
                    }
                }) : [])
            },
            {
                title: '产品规格',
                dataIndex: 'manufactureContent',
                key: 'manufactureContent',
                ...getsearchboxz("manufactureContent")
            },
            { //productNo,shopName
                title: '料号',
                dataIndex: 'productNo',
                key: 'productNo',
                ...getsearchboxz("productNo")
            },

            {
                title: "克重(kg/万支)",
                dataIndex: 'gramWeight',
                key: 'gramWeight',
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    单机产能(万支/班)
                <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postDataz: {
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
                dataIndex: 'planShiftProductQuantity',
                key: 'planShiftProductQuantity',
            },
        ]

        let pageChange = (page) => {
            this.setState({
                postDataz: { ...this.state.postDataz, pageIndex: page }
            }, () => {
                this.setNewStates("sizequeryList", this.state.postDataz);
            })
        }

        let renderAdd = (record) => {
            let selectedRows = record.shiftProductList;
            return <Table bordered
                dataSource={record.shiftProductList}
                rowKey='id'
                columns={[
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
                        title: <span><i style={{ color: "red" }}>* </i>班次</span>,
                        dataIndex: 'shiftId',
                        key: 'shiftId',
                        style: 172,
                        render: (text, item, i) => (
                            <Select
                                value={item.shiftId ? item.shiftId : undefined}
                                allowClear
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.shiftId = val
                                        }
                                        return index
                                    })

                                    let newres = this.state.selectedRows.map((item) => {
                                        if (item.id == record.id) {
                                            item = {
                                                ...item,
                                                shiftProductList: newselectedRows
                                            }
                                        }
                                        return item
                                    })

                                    this.setState({
                                        selectedRows: newres
                                    })
                                }}
                                style={{ width: 140 }} placeholder='选择班次'>
                                {
                                    this.props.produce.shiftList ? this.props.produce.shiftList.map((item) => {
                                        return <Option title={item.shiftName} key={item.id} value={item.id}>
                                            {item.shiftName}
                                        </Option>
                                    }) : []
                                }
                            </Select>
                        )
                    },
                    {
                        title: <span><i style={{ color: "red" }}>* </i>班别</span>,
                        dataIndex: 'classType',
                        key: 'classType',
                        style: 172,
                        render: (text, item, i) => (
                            <Select
                                value={item.classType ? item.classType : undefined}
                                allowClear
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.classType = val
                                        }
                                        return index
                                    })

                                    let newres = this.state.selectedRows.map((item) => {
                                        if (item.id == record.id) {
                                            item = {
                                                ...item,
                                                shiftProductList: newselectedRows
                                            }
                                        }
                                        return item
                                    })
                                    this.setState({
                                        selectedRows: newres
                                    })
                                }}
                                style={{ width: 140 }} placeholder='选择班别'>
                                {
                                    [{
                                        name: "白班",
                                        id: "0"
                                    }, {
                                        name: "夜班",
                                        id: "1"
                                    }].map((item) => {
                                        return <Option title={item.name} key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    })
                                }
                            </Select>
                        )
                    },
                    {
                        title: <span><i style={{ color: "red" }}>* </i>生产日期</span>,
                        dataIndex: 'productDate',
                        key: 'productDate',
                        style: 172,
                        render: (text, item, i) => (
                            <DatePicker
                                disabledDate={(current) => { return current < moment().add(-1, 'days') }}
                                value={item.productDate ? moment(item.productDate) : undefined}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.productDate = moment(val).format("YYYY-MM-DD")
                                        }
                                        return index
                                    })
                                    let newres = this.state.selectedRows.map((item) => {
                                        if (item.id == record.id) {
                                            item = {
                                                ...item,
                                                shiftProductList: newselectedRows
                                            }
                                        }
                                        return item
                                    })

                                    this.setState({
                                        selectedRows: newres
                                    })
                                }}
                                style={{ width: 140 }}
                            ></DatePicker>
                        )
                    },
                    {
                        title: '生产天数',
                        dataIndex: 'productDay',
                        key: 'productDay',
                        style: 92,
                        render: (text, item, i) => (
                            <InputNumber
                                style={{ width: 60 }}
                                value={item.productDay ? item.productDay : 1}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.productDay = val
                                        }
                                        return index
                                    })
                                    let newres = this.state.selectedRows.map((item) => {
                                        if (item.id == record.id) {
                                            item = {
                                                ...item,
                                                shiftProductList: newselectedRows
                                            }
                                        }
                                        return item
                                    })

                                    this.setState({
                                        selectedRows: newres
                                    })
                                }}
                                placeholder='' min={1} max={7}></InputNumber>
                        )
                    },
                    {
                        title: <span><i style={{ color: "red" }}>* </i>生产数量</span>,
                        dataIndex: 'planProductQuantity',
                        key: 'planProductQuantity',
                        style: 160,
                        render: (text, item, i) => (
                            <InputNumber
                                style={{ width: 60 }}
                                value={item.planProductQuantity ? item.planProductQuantity : undefined}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.planProductQuantity = val
                                        }
                                        return index
                                    })
                                    let newres = this.state.selectedRows.map((item) => {
                                        if (item.id == record.id) {
                                            item = {
                                                ...item,
                                                shiftProductList: newselectedRows
                                            }
                                        }
                                        return item
                                    })

                                    this.setState({
                                        selectedRows: newres
                                    })
                                }}
                                min={0}></InputNumber>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text, item, i) => (
                            <div>
                                <a onClick={() => {
                                    let index = 0, records = item;
                                    function RandomNumBoth(Min, Max) {
                                        var Range = Max - Min;
                                        var Rand = Math.random();
                                        var num = Min + Math.round(Rand * Range); //四舍五入
                                        return num;
                                    }

                                    let newarr = selectedRows.map((item, i) => {
                                        if (item.id == records.id) {
                                            index = i
                                        }
                                        return item
                                    })

                                    let newrecord = JSON.parse(JSON.stringify(records));

                                    newrecord.id = newrecord.id + "|" + n++;
                                    newarr.splice(index + 1, 0, newrecord);
                                    let newres = this.state.selectedRows.map((item) => {
                                        if (item.id == record.id) {
                                            item = {
                                                ...item,
                                                shiftProductList: newarr
                                            }
                                        }
                                        return item
                                    })
                                    this.setState({
                                        selectedRows: newres
                                    })
                                }}>复制</a>
                                <Divider type='vertical'></Divider>
                                <Popconfirm
                                    okText="确认"
                                    cancelText="取消"
                                    placement="bottom"
                                    title={"确认删除该排产计划？"}
                                    onConfirm={() => {
                                        let newselectedRows = selectedRows.filter((index, j) => {
                                            return index.id !== item.id
                                        })
                                        let newres = this.state.selectedRows.map((item) => {
                                            if (item.id == record.id) {
                                                item = {
                                                    ...item,
                                                    shiftProductList: newselectedRows
                                                }
                                            }
                                            return item
                                        })
                                        this.setState({
                                            selectedRows: newres
                                        })
                                    }}>
                                    <a>删除</a>
                                </Popconfirm>
                            </div>
                        )
                    },
                ]}
                pagination={{
                    showTotal: total => `共${total}条`, // 分页
                    size: "small",
                    pageSize: 10,
                    showQuickJumper: true,
                }}
                scroll={{ x: "100%", y: "59vh" }}
            >
            </Table>
        }

        return <div>
            <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
            <Table
                bordered
                style={{ marginBottom: 12 }}
                columns={columns}
                loading={this.props.submitting}
                rowSelection={rowSelection}
                pagination={{
                    showTotal: total => `共${total}条`, // 分页
                    size: "small",
                    pageSize: 10,
                    showQuickJumper: true,
                    current: sizequeryList.pageNum ? sizequeryList.pageNum : 1,
                    total: sizequeryList.total ? parseInt(sizequeryList.total) : 0,
                    onChange: pageChange,
                }}
                rowKey='id'
                dataSource={sizequeryList.list ? sizequeryList.list : []}
                scroll={{ x: "100%", y: "59vh" }}

            >
            </Table>
            <Table bordered
                rowSelection={rowSelection}
                dataSource={this.state.selectedRows}
                rowKey='id'
                columns={[
                    {
                        title: '产品规格',
                        dataIndex: 'manufactureContent',
                        key: 'manufactureContent',
                    },
                    {
                        title: '产品线',
                        dataIndex: 'shopName',
                        key: 'shopName',
                    },
                    // {
                    //     title: '订单号',
                    //     dataIndex: 'orderNo',
                    //     key: 'orderNo',
                    //     style: 172,
                    //     render: (text, item, i) => (
                    //         <Input
                    //             value={text}
                    //             style={{ width: 140 }}
                    //             placeholder='订单号'
                    //             onChange={(e) => {
                    //                 let val = e.target.value;
                    //                 let newselectedRows = selectedRows.map((index, j) => {
                    //                     if (index.id == item.id) {
                    //                         index.orderNo = val
                    //                     }
                    //                     return index
                    //                 })
                    //                 this.setState({
                    //                     selectedRows: newselectedRows
                    //                 })
                    //             }}
                    //         >
                    //         </Input>
                    //     )
                    // },
                    {
                        title: <span><i style={{ color: "red" }}>* </i>生产数量</span>,
                        dataIndex: 'planProductQuantity',
                        key: 'planProductQuantity',
                        width: 132,
                        render: (text, item, i) => (
                            <InputNumber
                                style={{ width: 100 }}
                                value={item.planProductQuantity ? item.planProductQuantity : undefined}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.planProductQuantity = val
                                        }
                                        return index
                                    })
                                    this.setState({
                                        selectedRows: newselectedRows
                                    })
                                }}
                                placeholder='生产数量(万只)' min={0}></InputNumber>
                        )
                    },
                    {
                        title: <span><i style={{ color: "red" }}>* </i>产线数量</span>,
                        dataIndex: 'planProductLines',
                        key: 'planProductLines',
                        style: 132,
                        render: (text, item, i) => (
                            <InputNumber
                                style={{ width: 100 }}
                                value={item.planProductLines ? item.planProductLines : undefined}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.planProductLines = val
                                        }
                                        return index
                                    })
                                    this.setState({
                                        selectedRows: newselectedRows
                                    })
                                }}
                                placeholder='产线数量' min={0}>
                            </InputNumber>
                        )
                    },
                    {
                        title: <span><i style={{ color: "red" }}>* </i>计划开始日期</span>,
                        dataIndex: 'productPlanDate',
                        key: 'productPlanDate',
                        width: 172,
                        render: (text, item, i) => (
                            <DatePicker
                                disabledDate={(current) => { return current < moment().add(-1, 'days') }}
                                value={item.productPlanDate ? moment(item.productPlanDate) : undefined}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.productPlanDate = moment(val).format("YYYY-MM-DD")
                                        }
                                        return index
                                    })
                                    this.setState({
                                        selectedRows: newselectedRows
                                    })
                                }}
                                style={{ width: 140 }}
                            ></DatePicker>
                        )
                    },
                    {
                        title: <span><i style={{ color: "red" }}>* </i>预计开线天数</span>,
                        dataIndex: 'planProductDays',
                        key: 'planProductDays',
                        style: 132,
                        render: (text, item, i) => (
                            <InputNumber
                                style={{ width: 120 }}
                                value={item.planProductDays ? item.planProductDays : undefined}
                                onChange={(val) => {
                                    let newselectedRows = selectedRows.map((index, j) => {
                                        if (index.id == item.id) {
                                            index.planProductDays = val
                                        }
                                        return index
                                    })
                                    this.setState({
                                        selectedRows: newselectedRows
                                    })
                                }}
                                placeholder='预计开线天数' min={0}></InputNumber>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text, record) => <a onClick={() => {
                            this.setNewStates("getProductorsByShopIdDown", { shopId: record.shopId }, () => {
                                this.setState({
                                    iftype: {
                                        name: "新增排产",
                                        value: "addchild"
                                    },
                                    curitem: record,
                                    postData: {
                                        ...postData,
                                        shopId: record.shopId
                                    },
                                    secondRowKeys: [record.id]
                                }, () => {
                                    this.setState({
                                        visibles: true,
                                    })
                                })
                            })

                        }}>排产</a>
                    },
                ]}
                pagination={{
                    showTotal: total => `共${total}条`, // 分页
                    size: "small",
                    pageSize: 10,
                    showQuickJumper: true,
                }}
                expandedRowKeys={this.state.secondRowKeys ? this.state.secondRowKeys : []}
                expandedRowRender={record => renderAdd(record)}
                onExpand={(expanded, record) => {
                    this.setState({
                        secondRowKeys: expanded ? [record.id] : [],
                    })
                }}
                scroll={{ x: 1600, y: "59vh" }}

            >
            </Table>
            {
                selectedRows.length > 0 ?
                    <Button style={{ width: "100%", marginTop: 18 }} size='large' type='primary' onClick={() => {
                        let postData = selectedRows.map((item, i) => {
                            return {
                                manufactureContentId: item.id,
                                shopId: item.shopId,
                                //orderNo: item.orderNo,
                                planProductQuantity: item.planProductQuantity,
                                planProductLines: item.planProductLines,
                                planProductDays: item.planProductDays,
                                productPlanDate: item.productPlanDate,
                                shiftProductList: item.shiftProductList && item.shiftProductList.map((item) => {
                                    return {
                                        equipmentId: item.equipmentId.indexOf("|") !== -1 ? item.equipmentId.split("|")[0] : item.equipmentId,
                                        shiftId: item.shiftId,
                                        classType: item.classType,
                                        productDate: item.productDate,
                                        productDay: item.productDay,
                                        planProductQuantity: item.planProductQuantity,
                                    }
                                })
                            }
                        })
                        let errorarr = postData.filter(item => {
                            return !item.shopId || !item.planProductQuantity || !item.planProductLines || !item.productPlanDate || !item.planProductDays
                        })

                        if (errorarr.length > 0) {
                            message.warn("输入框都是必填项,请检查后提交...");
                            return
                        }

                        this.setNewStates("plansaveList", postData, () => {
                            this.props.resetData();
                            message.success("新增成功");
                        })

                    }}>
                        批量新增
                </Button>
                    : null
            }
            <Drawer
                destroyOnClose={true}
                visible={this.state.visibles}
                width={"90%"}
                title={iftype.name}
                onClose={() => {
                    this.setState({
                        visibles: false
                    })
                }}
            >
                <AllAdd sendData={(shiftProductList) => {
                    let newselectedRows = selectedRows.map((item) => {
                        if (item.id == this.state.curitem.id) {
                            item = {
                                ...item,
                                shiftProductList: shiftProductList
                            }
                        }
                        return item
                    })
                    this.setState({
                        visibles: false,
                        selectedRows: newselectedRows
                    })
                }} postDataz={postData} resetData={() => { this.resetData() }} curitem={this.state.curitem ? this.state.curitem : []}>
                </AllAdd>
            </Drawer>


        </div >
    }






}


export default AllAdds