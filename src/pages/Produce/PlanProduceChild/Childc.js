import {
    Table, Tree, Divider, Row, Col, Icon, Select, Alert, Popconfirm, message, Card, Modal, DatePicker
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import moment from 'moment';
import styles from './index.less';

const { TreeNode } = Tree, { Option } = Select;


@connect(({ produce, login, loading }) => ({
    produce,
    login,
    submitting: loading.effects['produce/productDayReport'],
}))
class Child extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.login.userinfo)
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
                "productDate": "", // 日期(只要年月，必须)
                "shopId": "",// 产品线主键(必须)
                "shiftId": "", //班次
                "pageIndex": 1, // 第一页
                "pageSize": 10 // 每页十条
            },
            postUrl: "productDayReport",
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


    resetData(ifs) {
        let { postUrl, postData } = this.state;
        this.setNewState(postUrl, postData, () => {
            this.handleCancel()
            if (ifs) {
                let { shopList } = this.props.produce;
                this.setState({
                    postData: {
                        ...this.state.postData,
                        "shopId": shopList[0] && shopList[0].id,
                        "productDate": moment().add("day", -1).format("YYYY-MM-DD")
                    }
                })
            }
        })
    }

    componentDidMount() {
        this.resetData(true);
        this.props.onRef(this)
    }

    outputCur() {
        let { postUrl, postData } = this.state;
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
            window.open(`/rs/equipmentShiftProduct/exportFile?shopId=${postData.shopId?postData.shopId:""}&productDate=${postData.productDate ? postData.productDate : moment().add("day", -1).format("YYYY-MM-DD")}&shiftId${postData.shiftId ? "=" + postData.shiftId : "="}`)
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

    render() {
        let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
            { productDayReport, queryByShopIdAndproductDate, shiftList, shopList } = this.props.produce;
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
                title: '序号',
                dataIndex: 'sortNo',
                key: 'sortNo',
            },
            {
                title: '产品线',
                dataIndex: 'shopName',
                key: 'shopName',
            },
            {
                title: '设备位置号',
                dataIndex: 'positionNo',
                key: 'positionNo',
            },
            {
                title: '产品料号',
                dataIndex: 'productNo',
                key: 'productNo',
            },
            {
                title: '产品规格',
                dataIndex: 'manufactureContent',
                key: 'manufactureContent',
            },
            {
                title: '开机人员',
                children: [
                    {
                        title: '工序1',
                        dataIndex: 'productUserNameStr',
                        key: 'productUserNameStr',
                    },
                    {
                        title: '工序2',
                        dataIndex: 'productUserNameStr1',
                        key: 'productUserNameStr1',
                    },
                    {
                        title: '工序3',
                        dataIndex: 'productUserNameStr2',
                        key: 'productUserNameStr2',
                    }
                ]
            },
            {
                title: '产量',
                children: [
                    {
                        title: '计划(万支)',
                        dataIndex: 'planProductQuantity',
                        key: 'planProductQuantity',
                    },
                    {
                        title: '实际(箱)',
                        dataIndex: 'box',
                        key: 'box',
                    },
                    {
                        title: '实际(万支)',
                        dataIndex: 'confirmManufactureTotalQuantity',
                        key: 'confirmManufactureTotalQuantity',
                    },
                    {
                        title: '计划完成率(%)',
                        dataIndex: 'planCompletionRate',
                        key: 'planCompletionRate',
                        render: (text) => <span>{text ? `${text}%` : ''}</span>
                    }
                ]
            },
            {
                title: '故障修机时间合计',
                dataIndex: 'repairTime',
                key: 'repairTime',
            },
            {
                title: '实际开始时间',
                dataIndex: 'bootTime',
                key: 'bootTime',
            },
            {
                title: '工序1(主设备)废料',
                children: [
                    {
                        title: '可回收',
                        dataIndex: 'confirmRecycleWaste',
                        key: 'confirmRecycleWaste',
                    },
                    {
                        title: '不可回收',
                        dataIndex: 'confirmUnrecycleWaste',
                        key: 'confirmUnrecycleWaste',
                    },
                ]
            },
            {
                title: '工序2废料(边角料)',
                children: [
                    {
                        title: '可回收',
                        dataIndex: 'confirmRecycleWaste1',
                        key: 'confirmRecycleWaste1',
                    },
                    {
                        title: '不可回收',
                        dataIndex: 'confirmUnrecycleWaste1',
                        key: 'confirmUnrecycleWaste1',
                    },
                ]
            },
            {
                title: '工序3废料(废杯)',
                children: [
                    {
                        title: '可回收',
                        dataIndex: 'confirmRecycleWaste2',
                        key: 'confirmRecycleWaste2',
                    },
                    {
                        title: '不可回收',
                        dataIndex: 'confirmUnrecycleWaste2',
                        key: 'confirmUnrecycleWaste2',
                    },
                ]
            },
            {
                title: '废品率(%)',
                dataIndex: 'rejectionRate',
                key: 'rejectionRate',
                render: (text) => <span>{text ? `${text}%` : ''}</span>
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            }
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
                this.setNewState("productDayReport", this.state.postData);
            })
        }
        return (
            <div className={styles.rightrender}>
                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <Card title='生产日报' extra={
                    <div>
                        <label>选择日期：</label>
                        <DatePicker allowClear={false} value={postData.productDate ? moment(postData.productDate) : undefined} onChange={(value) => {
                            this.setState({
                                postData: {
                                    ...postData,
                                    productDate: moment(value).format("YYYY-MM-DD")
                                }
                            }, () => {
                                this.resetData()
                            })
                        }}></DatePicker>

                        <Divider type='vertical'></Divider>

                        <label>选择产品线：</label>
                        <Select style={{ width: 220 }} value={postData.shopId} onChange={(val) => {
                            this.setState({
                                postData: {
                                    ...postData,
                                    shopId: val
                                }
                            }, () => {
                                this.resetData()
                            })
                        }} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} allowClear>
                            {
                                shopList && shopList.map((item, i) => {
                                    return <Option title={item.shopName} key={i} value={item.id}>{item.shopName}</Option>
                                })
                            }
                        </Select>
                        <Divider type='vertical'></Divider>
                        <label>选择班次：</label>
                        <Select style={{ width: 160 }} value={postData.shiftId} onChange={(val) => {
                            this.setState({
                                postData: {
                                    ...postData,
                                    shiftId: val
                                }
                            }, () => {
                                this.resetData()
                            })
                        }} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} allowClear>
                            {
                                shiftList && shiftList.map((item, i) => {
                                    return <Option title={item.shiftName} key={i} value={item.id}>{item.shiftName}</Option>
                                })
                            }

                        </Select>



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
                        scroll={{ x: 1600, y: "59vh" }}
                        loading={this.props.submitting}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 10,
                            showQuickJumper: true,
                            current: productDayReport.pageNum ? productDayReport.pageNum : 1,
                            total: productDayReport.total ? parseInt(productDayReport.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={productDayReport ? productDayReport.list : []}
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



