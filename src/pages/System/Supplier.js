import React, { PureComponent, Fragment } from 'react';
import {
    Table, Button, Input, message, Popconfirm, TimePicker,
    Divider, Card, Select, Icon, Calendar, Badge, DatePicker,
    Row, Modal, Col, Tag, Alert, Tooltip
} from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
import SearchBox from '@/components/SearchBox';


const format = 'HH:mm';
const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
const { RangePicker } = DatePicker;
const { CheckableTag } = Tag;

let year = new Date().getFullYear(),
    month = new Date().getMonth() + 1;


let id = 0;
@connect(({ system, loading }) => ({
    system,
    submitting: loading.effects['system/getShiftPage'],
}))
class Supplier extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fv: false,
            type: 'shift',
            curitem: "",
            month: month,
            loading: true,
            postUrl: "getShiftPage",
            postData: {
                "pageIndex": 1, // 第1页*
                "pageSize": 10, // 每页10条*
                "shiftName": "", // 班次名称
                "description": "" // 描述
            },
            ifshow: false,
            calendar: {
                shiftDate: "",
            },
            iftype: {
                name: "",
                value: ""
            },
            fields:{},
            visible: false,
            curdate: [],
            nowdate: [],
            getShiftList: [],
            allList: []
        };

    }




    showModal(key) {
        let { curdate, nowdate, getShiftList } = this.state;
        if (key == "need" && nowdate.length == 0) {
            message.warn("请先选择排班时间...")
            return
        }
        if (key == "need") {
            this.setState({
                curdate: nowdate
            }, () => {
                this.setState({
                    visible: true,
                });
            })
        } else {
            let { getScheduleList } = this.props.system,
                curData = [],
                ifs = moment(key).format("YYYY-MM-DD");
            getScheduleList.map((item, i) => {
                if (ifs == item.date) {
                    curData = item.shifts;
                }
            });

            let all = curData.map((item) => { return item.shiftId }),
                res = curData.map((item) => {
                    return {
                        id: item.shiftId,
                        shift: item.shiftName,
                        val_a: item.startTime ? moment(item.startDate + " " + item.startTime) : null,
                        val_b: item.endTime ? moment(item.endDate + " " + item.endTime) : null
                    }
                });
            this.props.system.getShiftList.map((item, i) => {
                if (all.indexOf(item.id) == -1) {
                    res.push({
                        id: item.id,
                        shift: item.shiftName,
                        val_a: "",
                        val_b: ""
                    })
                }
            })
            console.log(res, curData)
            this.setState({
                curitem: curData,
                getShiftList: curData.length == 0 ? this.props.system.getShiftList : res,
                allList: this.props.system.getShiftList.map((item) => { return item.id })
            }, () => {
                this.setState({
                    visible: true,
                });
            })
        }


    }

    handleOk = (e) => {
        let shifts = this.state.getShiftList, curdate = this.state.curdate, curitem = this.state.curitem,
            allList = this.state.allList, allshifts = [], ifs = 0, str = "";

        shifts.map((item, i) => {
            if (allList.indexOf(item.id) != -1) {
                allshifts.push(item)
            }
        });//获取当前有几个班次

        allshifts.map((item, i) => {
            if (!item.val_a || !item.val_b) {
                ifs = 1;
                str += item.shift + " ";
            }
        })//当前班次是否填写完成
        console.log(allshifts)
        if (ifs == 1) {
            message.warn("请填写完整 " + str + "的信息！");
            return
        }
        let allshift = allshifts.map((item, i) => {
            let enddates = moment(item.val_b).format("HH:mm")
            if (item.val_a > item.val_b) {
                let timestamp = Date.parse(item.val_b);
                timestamp += 24 * 60 * 60 * 1000;//加一天
                enddates = moment(timestamp).format('HH:mm')
            }
            let data = {
                startTime: moment(item.val_a).format("HH:mm"),
                endTime: enddates,
                shiftId: item.id
            }
            return data
        });

        let range = "", can = "";
        if (Array.isArray(curdate)) {
            range = curdate.join(",");
            can = curdate[0];
        } else {
            range = curdate;
            can = curdate
        }
        let postData = {
            range: range,
            shifts: allshift
        }
        this.setNewState("insertSchedule", postData, () => {
            message.success("操作成功！")
            this.resetCalendar(can);
        })
        this.setState({
            visible: false,
        });
    }


    //设置新状态
    setNewState(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'system/' + type,
            payload: values
        }).then((res) => {
            if (res) {
                fn ? fn() : null;
            }
        });
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
            shiftName: {
                value: null,
                type: "input",
                title: "班次名称",
                keys: "shiftName",
                requires: true
            },
            description: {
                value: null,
                type: "textarea",
                title: "班次描述",
                keys: "description",
                requires: false
            }
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
                let postData = { ...values, id: curitem.id };
                this.setNewState("insertShift", postData, () => {
                    message.success("修改成功！");
                    this.setState({ fv: false });
                    this.setNewState("getShiftPage", this.state.postData);
                    this.resetSupplier(this.state.calendar)
                });
            } else if (iftype.value == "add") {
                let postData = { ...values };
                this.setNewState("insertShift", postData, () => {
                    message.success("新增成功！");
                    this.setState({ fv: false });
                    this.setNewState("getShiftPage", this.state.postData);
                    this.resetSupplier(this.state.calendar)
                });
            } else {
                //ELSE TO DO
            }

        });
    }


    pageChange = (page) => {
        let data = this.state.postData,
            postData = { ...data, pageIndex: page };
        this.setState({
            postData
        }, () => {
            this.setNewState("getShiftPage", postData)
        })
    }

    //reset calendar data
    resetCalendar(key) {
        let postData = {}
        if (key) {
            postData = { ...this.state.calendar, shiftDate: key };
        } else {
            postData = this.state.calendar;
        }
        this.resetSupplier(postData);
    }

    resetSupplier(postData) {
        this.setNewState("getScheduleList", postData, () => {
            let values = this.props.system.getShiftList;
            let all = values.map((item) => { return item.id }),
                res = values.map((item) => {
                    item.val_a = "";
                    item.val_b = "";
                    item.shift = item.shiftName;
                    return item
                });
            this.setState({
                getShiftList: res,
                allList: all,
            })
        });//获取日历排班
    }

    componentDidMount() {
        this.resetCalendar();
        this.resetData();
    }

    resetData() {
        this.setNewState("getShiftPage", this.state.postData)
    }

    //选择日期后逻辑
    onChange = (value, mode) => {
        if (this.state.month == value._d.getMonth()) {
            return
        } else {
            this.setState({
                month: value._d.getMonth(),
                calendar: { ...this.state.calendar, shiftDate: moment(value._d).format('YYYY-MM-DD') }
            }, () => {
                this.resetSupplier(this.state.calendar);
            })
        }

    }

    handleChange(tag, checked) {
        const { allList } = this.state;
        const nextSelectedTags = checked
            ? [...allList, tag]
            : allList.filter(t => t !== tag);
        this.setState({ allList: nextSelectedTags });
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
        const { loading, data, type, curitem, ifshow, curdate, getShiftList, allList, postData, fv, iftype, fields } = this.state,
            { getShiftPage, getScheduleList } = this.props.system;
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
        }

        const columns = [
            {
                title: '班次名称',
                dataIndex: 'shiftName',
                key: 'shiftName',
                ...getsearchbox('shiftName'),
            },
            {
                title: '班次描述',
                dataIndex: 'description',
                key: 'description',
                ...getsearchbox('description'),
            },
            {
                title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    操作
                        <a style={{ color: "#f50" }} onClick={() => {
                        this.setState({
                            postData: {
                                "pageIndex": 1, // 第1页*
                                "pageSize": 10, // 每页10条*
                                "shiftName": "", // 班次名称
                                "description": "" // 描述
                            }
                        }, () => {
                            this.resetData()
                        })
                    }}>
                        <Icon type="reload" style={{ paddingRight: 4, marginLeft: 8 }} />
                        重置
                        </a>
                </span>,
                key: 'action',
                width: 120,
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={() => {
                                this.setState({
                                    fv: true,
                                    iftype: {
                                        name: "修改班次",
                                        value: "edit"
                                    },
                                    curitem: record,
                                    fields: {
                                        companyId: {
                                            ...this.state.fields.companyId,
                                            value: record.companyId,
                                        },
                                        shiftName: {
                                            ...this.state.fields.shiftName,
                                            value: record.shiftName,
                                        },
                                        description: {
                                            ...this.state.fields.description,
                                            value: record.description,
                                        }
                                    },
                                })
                            }}>
                                修改
                            </a>
                            <Divider type="vertical"></Divider>
                            <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                placement="bottom"
                                title={"确认删除该班次？"}
                                onConfirm={() => {
                                    this.setNewState("deleteShifts", { id: record.id }, () => {
                                        let total = this.props.system.getShiftPage.total,
                                            page = this.props.system.getShiftPage.pageNum;
                                        if ((total - 1) % 10 == 0) {
                                            page = page - 1
                                        }
                                        this.setState({
                                            postData: { ...this.state.postData, pageIndex: page }
                                        }, () => {
                                            this.setNewState("getShiftPage", postData, () => {
                                                message.success("删除成功！");
                                            });
                                            this.resetSupplier(this.state.calendar)
                                        })
                                    })
                                }}>
                                <a style={{ color: "#ff4800" }}>删除</a>
                            </Popconfirm>
                        </span>

                    )
                },
            },
        ];

        function dateCellRender(value) {
            let cur = moment(value).format('YYYY-MM-DD'),
                curData = [];
            if (!getScheduleList) {
                return
            }
            getScheduleList.map((item, i) => {
                if (cur == item.date) {
                    curData = item.shifts;
                }
            })
            return (
                <div className="pointer">
                    {
                        curData.map((item, i) => {
                            return <Tag key={i} style={{ marginBottom: 4, height: "auto" }} color={`rgba(${i * 10 + 110},${i * 15 + 118},${i * 15 + 100},1)`}>
                                <p style={{ marginBottom: 8, color: "#fff" }}>{item.shiftName}</p>
                                <p style={{ margin: 0, color: "#f0f0f0" }}>{item.startTime + "至" + item.endTime}</p>
                            </Tag>
                        }
                        )}
                </div>
            );
        }

        return (
            <div>
                <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

                <Modal
                    width={640}
                    style={{ maxWidth: "90%" }}
                    title="开始排班"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    <Row gutter={24}>
                        <Col xl={8} lg={8} md={8} sm={24} xs={24} style={{ marginBottom: 16 }}>
                            <Alert style={{ marginBottom: 12 }}
                                message="排班日期："
                                description={
                                    Array.isArray(curdate) ?
                                        <p>
                                            {curdate[0]}<br />至<br />{curdate[1]}
                                        </p>
                                        :
                                        curdate
                                }
                                type="info" />
                            <p>选择班次：</p>
                            {
                                getShiftList.map((item, i) => (
                                    <CheckableTag
                                        key={i}
                                        style={{ marginBottom: 10 }}
                                        checked={
                                            this.state.allList.indexOf(item.id) != -1
                                        }
                                        onChange={checked => this.handleChange(item.id, checked)}>
                                        {item.shift}
                                    </CheckableTag>
                                ))
                            }
                        </Col>
                        <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                            {
                                allList.length > 0 ?
                                    <p>选择时间：</p>
                                    :
                                    <Alert
                                        message="暂无班次"
                                        description="没有选择班次"
                                        type="info"
                                        showIcon
                                    />
                            }
                            {
                                getShiftList.map((item, i) => (
                                    <div key={i} style={{ display: this.state.allList.indexOf(item.id) != -1 ? "block" : "none", marginBottom: 12 }}>
                                        <p>{item.shift}</p>
                                        <Row gutter={24}>
                                            <Col span={11}>
                                                <TimePicker inputReadOnly style={{ width: "100%" }} placeholder="开始时间"
                                                    onChange={(val) => {
                                                        let newresult = getShiftList.map((now) => {
                                                            if (now.id == item.id) {
                                                                now.val_a = val;
                                                            }
                                                            return now
                                                        })
                                                        this.setState({
                                                            getShiftList: newresult
                                                        })
                                                    }} value={item.val_a ? item.val_a : undefined} format={format} />
                                            </Col>
                                            <Col span={2}><Divider style={{ margin: "16px 0 0 0" }}></Divider></Col>
                                            <Col span={11}>
                                                <TimePicker inputReadOnly style={{ width: "100%" }} placeholder="结束时间"
                                                    onChange={(val) => {
                                                        let newresult = getShiftList.map((now) => {
                                                            if (now.id == item.id) {
                                                                now.val_b = val;
                                                            }
                                                            return now
                                                        })
                                                        this.setState({
                                                            getShiftList: newresult
                                                        })
                                                    }} value={item.val_b ? item.val_b : undefined} format={format} />
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            }
                        </Col>
                    </Row>

                </Modal>
                <CreateForm
                    fields={fields}
                    data={{}}
                    iftype={iftype}
                    onChange={this.handleFormChange}
                    wrappedComponentRef={this.saveFormRef}
                    visible={fv}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
                <Card title="班次列表" extra={<a
                    onClick={() => {
                        this.setState({
                            fields: {
                                shiftName: {
                                    value: null,
                                    type: "input",
                                    title: "班次名称",
                                    keys: "shiftName",
                                    requires: true
                                },
                                description: {
                                    value: null,
                                    type: "textarea",
                                    title: "描述",
                                    keys: "description",
                                    requires: false
                                }
                            },
                            iftype: {
                                name: "新增班次",
                                value: "add"
                            },
                            fv: true
                        })
                    }}
                    icon="plus"
                >
                    新增班次
                </a>}
                // actions={[
                //     <Button
                //         type="primary"
                //         onClick={() => {
                //             this.setState({
                //                 ifshow: !ifshow
                //             })
                //         }}><Icon type="calendar" />{!ifshow ? " 展开" : " 收起"}排班计划
                // </Button>]}
                >
                    <Fragment>
                        <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }}
                            rowKey="id"
                            loading={loading && this.props.submitting}
                            columns={columns}
                            dataSource={getShiftPage.list ? getShiftPage.list : []}
                            pagination={{
                                showTotal: total => `共${total}条`, // 分页
                                size: "small", pageSize: 10,
                                showQuickJumper: true,
                                current: getShiftPage.pageNum ? getShiftPage.pageNum : 1,
                                total: getShiftPage.total ? parseInt(getShiftPage.total) : 0,
                                onChange: this.pageChange,
                            }}
                            rowClassName={record => (record.editable ? styles.editable : '')}
                        />
                    </Fragment>
                    <div style={{ height: ifshow ? 980 : 0, transition: "all 0.4s", overflowY: "hidden", background: "#f9f9f9", marginTop: 12 }}>
                        <a style={{ display: "block", borderLeft: "#ff4600 solid 4px", paddingLeft: 12, color: "#ff4600", fontSize: 16, margin: 12 }}>
                            <span>
                                排班计划表
          </span>
                            <span style={{ cursor: "pointer", color: "#666", float: 'right' }} onClick={() => {
                                this.setState({
                                    ifshow: false
                                })
                            }}>
                                <Icon type="up-circle" /> 收起
          </span>
                        </a>
                        <div className={styles.bac}>
                            <Row gutter={24}>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <p>选择排班时间：</p>
                                    <RangePicker style={{ width: "100%" }} onChange={(date, dateString) => {
                                        this.setState({
                                            curdate: dateString,
                                            nowdate: dateString,
                                        })
                                    }}></RangePicker>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={24} className={styles.flio}>
                                    <p style={{ opacity: 0 }}>1</p>
                                    <Button type="primary" ghost icon="calendar" style={{ width: "100%" }} onClick={() => {
                                        this.showModal("need")
                                    }}>
                                        开始排班
              </Button>
                                </Col>
                            </Row>
                        </div>
                        <div className={styles.hidesr} style={{ minWidth: 800, overflow: "auto" }}>
                            <Calendar onSelect={(key) => {
                                this.setState({
                                    curdate: moment(key).format('YYYY-MM-DD')
                                }, () => {
                                    this.showModal(key)
                                })
                            }} dateCellRender={dateCellRender} onChange={this.onChange} />
                        </div>
                    </div>
                </Card>


            </div>
        );
    }
}

export default Supplier;
