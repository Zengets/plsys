import {
    Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import Abload from '@/components/Abload';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;

//sizequeryList,sizesave,sizedeleteById,sizequeryById
@connect(({ produce, loading }) => ({
    produce,
    submitting: loading.effects['produce/sizequeryList'],
}))
class ProduceSize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curitem: {},
            fields: {},
            iftype: {},
            fv: false,
            /*初始化 main List */
            postData: {
                pageIndex: 1,
                pageSize: 10,
                manufactureContent: "",
                productNo: "",
                shopId: ""
            },
            postUrl: "sizequeryList",
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
                manufactureContent: {
                    value: null,
                    type: "input",
                    title: "产品规格",
                    keys: "manufactureContent",
                    requires: true
                },
                productNo: {
                    value: null,
                    type: "input",
                    title: "生产料号",
                    keys: "productNo",
                    requires: true
                },
                gramWeight: {
                    value: null,
                    type: "inputnumber",
                    title: "克重(kg/万支)",
                    keys: "gramWeight",
                    requires: true
                },
                shopId: {
                    value: null,
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
                planShiftProductQuantity: {
                    value: null,
                    type: "inputnumber",
                    title: "单机产能(万支/班)",
                    keys: "planShiftProductQuantity",
                    requires: true
                },
                standardWorkForce: {
                    value: null,
                    type: "inputnumber",
                    title: "标准工时",
                    keys: "standardWorkForce",
                    requires: true
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
            if (iftype.value == "edit") {
                let postData = { ...values, id: curitem.id };
                this.setNewState("sizesave", postData, () => {
                    message.success("修改成功！");
                    this.resetData();
                });
            } else if (iftype.value == "add") {
                let postData = { ...values };
                this.setNewState("sizesave", postData, () => {
                    message.success("新增成功！");
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

    onRef = (ref) => {
        this.child = ref;
    }

    render() {
        let { postData, postUrl, curitem, fields, iftype, fv } = this.state,
            { sizequeryList, shopList } = this.props.produce;
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
                title: '产品规格',
                dataIndex: 'manufactureContent',
                key: 'manufactureContent',
                ...getsearchbox("manufactureContent")
            },
            { //productNo,shopName
                title: '料号',
                dataIndex: 'productNo',
                key: 'productNo',
                ...getsearchbox("productNo")
            },

            {
                title: "克重(kg/万支)",
                dataIndex: 'gramWeight',
                key: 'gramWeight',
            },
            {
                title: "标准工时",
                dataIndex: 'standardWorkForce',
                key: 'standardWorkForce',
            },

            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    单机产能(万支/班)
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
                dataIndex: 'planShiftProductQuantity',
                key: 'planShiftProductQuantity',
            },
        ]

        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("sizequeryList", this.state.postData);
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
                <Card title='产品信息' extra={<span style={{ display: "flex", alignItems: "center" }}>
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
                                this.setState({
                                    iftype: {
                                        name: "修改" + curitem.manufactureContent,
                                        value: "edit"
                                    },
                                    fields: {
                                        manufactureContent: {
                                            ...fields.manufactureContent,
                                            value: curitem.manufactureContent
                                        },
                                        productNo: {
                                            ...fields.productNo,
                                            value: curitem.productNo
                                        },
                                        shopId: {
                                            ...fields.shopId,
                                            value: curitem.shopId
                                        },
                                        gramWeight: {
                                            ...fields.gramWeight,
                                            value: curitem.gramWeight
                                        },
                                        planShiftProductQuantity: {
                                            ...fields.planShiftProductQuantity,
                                            value: curitem.planShiftProductQuantity
                                        },
                                        standardWorkForce: {
                                            ...fields.standardWorkForce,
                                            value: curitem.standardWorkForce
                                        },
                                    },
                                }, () => {
                                    this.setState({
                                        fv: true
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
                                    this.setNewState("sizedeleteById", { id: curitem.id }, () => {
                                        let total = this.props.produce.sizequeryList.total,
                                            page = this.props.produce.sizequeryList.pageNum;
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
                    <Divider style={{ marginTop: 6 }} type='vertical'></Divider>
                    <Abload reload={() => {
                        this.resetData()
                    }} data={null} postName="uploadproductionPecification" left={0} filePath="http://www.plszems.com/download/产品规格导入模板.xlsx"></Abload>

                </span>}>
                    <Table bordered size="middle"
                        scroll={{ x: 1200, y: "59vh" }}
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
                            current: sizequeryList.pageNum ? sizequeryList.pageNum : 1,
                            total: sizequeryList.total ? parseInt(sizequeryList.total) : 0,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={sizequeryList.list ? sizequeryList.list : []}
                    >
                    </Table>


                </Card>
                <CreateForm
                    width={800}
                    fields={fields}
                    iftype={iftype}
                    onChange={this.handleFormChange}
                    wrappedComponentRef={this.saveFormRef}
                    visible={fv}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }


}

export default ProduceSize



