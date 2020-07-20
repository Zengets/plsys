import react, { Component } from 'react'
import { connect } from 'dva';
import {
    Table, Icon, Row, Col, Input, Select,
    Popconfirm, Divider, DatePicker,
    message, Card, Modal, InputNumber, Button
} from 'antd';
import SearchBox from '@/components/SearchBox';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

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
let { Option } = Select,n =1;
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
    submitting: loading.effects['produce/planqueryList'],
}))
class AllAdd extends Component {

    constructor(props) {
        super(props);
        let color = [];
        for (let i = 0; i < 1000; i++) {
            color.push(`rgba` + rgb())
        }
        console.log(props.curitem)
        this.state = {
            postDataz: props.postDataz,
            selectedRowKeys: props.curitem.shiftProductList ? props.curitem.shiftProductList.map((item) => { return item.id }) : [],
            selectedRows: props.curitem.shiftProductList ? props.curitem.shiftProductList : [],
            color,
        }
    }


    onSelectChange = (selectedRowKeys, selectedRows) => {
        let cuRow = this.state.selectedRows, newArr = [];
        cuRow = [...cuRow, ...selectedRows].filter((item) => { return selectedRowKeys.indexOf(item.id) !== -1 || item.id.indexOf("|") !== -1 });
        cuRow = [...new Set(cuRow)]
        cuRow = uniq(cuRow)
        this.setState({ selectedRowKeys, selectedRows: cuRow });
    };

    //设置新状态
    setNewState(type, values, fn) {
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
        this.setNewState("queryPageListPlus", { ...this.state.postDataz })
    }

    componentDidMount() {
        this.resetData();
        this.setNewStates('deviceTypequeryTreeList', null);
    }


    handleSearchz = (selectedKeys, dataIndex) => {
        let postUrl = "queryPageListPlus"
        this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewState(postUrl, this.state.postDataz)
        });
    };

    onRefz = (ref) => {
        this.childz = ref;
    }

    render() {
        const { loading, selectedRowKeys, selectedRows } = this.state;
        let { queryPageListPlus } = this.props.publicmodel,
            { deviceTypequeryTreeList, getProductorsByShopIdDown } = this.props.produce,
            getsearchboxz = (key) => {
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
                sm: 12,
                md: 12,
                lg: 8,
                xl: 6,
                xxl: 6
            }
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.id.indexOf("|") !== -1,
            }),
        };

        let columns = [
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
                title: '设备状态',
                dataIndex: 'statusName',
                key: 'statusName',
            },
        ]

        let pageChange = (page) => {
            this.setState({
                postDataz: { ...this.state.postDataz, pageIndex: page }
            }, () => {
                this.setNewState("queryPageListPlus", this.state.postDataz);
            })
        }


        return <div>
            <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
            <Table bordered
                style={{ marginBottom: 12 }}
                columns={columns}
                rowSelection={rowSelection}
                pagination={{
                    showTotal: total => `共${total}条`, // 分页
                    size: "small",
                    pageSize: 10,
                    showQuickJumper: true,
                    current: queryPageListPlus.pageNum ? queryPageListPlus.pageNum : 1,
                    total: queryPageListPlus.total ? parseInt(queryPageListPlus.total) : 0,
                    onChange: pageChange,
                }}
                rowKey='id'
                dataSource={queryPageListPlus.list ? queryPageListPlus.list : []}
                scroll={{ x: 1200, y: "59vh" }}
            >
            </Table>

            <Table bordered
                rowSelection={rowSelection}
                dataSource={this.state.selectedRows}
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
                        title: <span><i style={{ color: "black" }}>* </i>班次</span>,
                        dataIndex: 'shiftId',
                        key: 'shiftId',
                        width: 172,
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
                                    this.setState({
                                        selectedRows: newselectedRows
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
                        title: <span><i style={{ color: "black" }}>* </i>班别</span>,
                        dataIndex: 'classType',
                        key: 'classType',
                        width: 172,
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
                                    this.setState({
                                        selectedRows: newselectedRows
                                    })
                                }}
                                style={{ width: 140 }} placeholder='选择班别'>
                                {
                                     [{
                                        name:"白班",
                                        id:"0"
                                      },{
                                        name:"夜班",
                                        id:"1"
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
                        title: <span><i style={{ color: "black" }}>* </i>生产日期</span>,
                        dataIndex: 'productDate',
                        key: 'productDate',
                        width: 172,
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
                                    this.setState({
                                        selectedRows: newselectedRows
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
                        width: 92,

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
                                    this.setState({
                                        selectedRows: newselectedRows
                                    })
                                }}
                                placeholder='' min={1} max={7}></InputNumber>
                        )
                    },
                    {
                        title: <span><i style={{ color: "black" }}>* </i>生产数量</span>,
                        dataIndex: 'planProductQuantity',
                        key: 'planProductQuantity',
                        width: 132,
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
                                    this.setState({
                                        selectedRows: newselectedRows
                                    })
                                }}
                                min={0}></InputNumber>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text, record) => <div>
                            <a onClick={() => {
                                function RandomNumBoth(Min, Max) {
                                    var Range = Max - Min;
                                    var Rand = Math.random();
                                    var num = Min + Math.round(Rand * Range); //四舍五入
                                    return num;
                                }
                                let index = 0;
                                let newarr = this.state.selectedRows.map((item, i) => {
                                    if (item.id == record.id) {
                                        index = i
                                    }
                                    return item
                                })
                                let newrecord = JSON.parse(JSON.stringify(record));

                                newrecord.id = newrecord.id + "|" + n++;
                                newarr.splice(index + 1, 0, newrecord);
                                console.log(newarr)

                                this.setState({
                                    selectedRows: newarr
                                })
                            }}>复制</a>
                            {
                                record.id.indexOf("|") !== -1 &&
                                <Popconfirm
                                    okText="确认"
                                    cancelText="取消"
                                    placement="bottom"
                                    title={"确认删除该排产计划？"}
                                    onConfirm={() => {
                                        let newarr = this.state.selectedRows.filter((item, i) => {
                                            return item.id !== record.id
                                        })
                                        this.setState({
                                            selectedRows: newarr
                                        })
                                    }}>
                                    <a>
                                        <Divider type='vertical'></Divider>
                                    删除
                                </a>
                                </Popconfirm>
                            }

                        </div>
                    }

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




            {
                selectedRows.length > 0 ?
                    <Button style={{ width: "100%", marginTop: 18 }} size='large' type='primary' onClick={() => {
                        let postData = selectedRows.map((item, i) => {
                            return {
                                ...item,
                                equipmentId: item.id,
                                shiftId: item.shiftId,
                                classType: item.classType,
                                productDate: item.productDate,
                                productDay: item.productDay ? item.productDay : 1,
                                planProductQuantity: item.planProductQuantity,
                            }
                        })

                        this.props.sendData(postData);
                    }}>
                        添加排产
                </Button>
                    : null
            }



        </div>
    }






}


export default AllAdd