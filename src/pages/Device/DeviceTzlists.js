import React, { Component } from 'react';
import moment from 'moment';
import {
  Icon, Upload, Table, Divider, Card, Form, Button, Input, Row, Col, Tree, Modal, Skeleton,
  message, Popconfirm, Tooltip, Select, DatePicker, InputNumber, Dropdown, Menu, Tabs
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import Link from 'umi/link';
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'
import CreateForm from "@/components/CreateForm"
import DrawImage from "@/components/DrawImage"
const { TabPane } = Tabs;

const confirm = Modal.confirm;
const { TreeNode } = Tree;
const Search = Input.Search;
const Option = Select.Option;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/queryUseList'],
}))
class Tzlist extends Component {
  constructor(props) {
    super(props);
    let { deviceTypequeryLeafList, search } = props;
    if (!deviceTypequeryLeafList) {
      deviceTypequeryLeafList = []
    }
    this.state = {
      iftype: { name: '', val: '' },
      curitemz: {},
      curitem: {},
      imageUrl: "",
      postData: {
        "pageIndex": 1,                          //(int)页码
        "pageSize": 10,                           //(int)条数
        "status": props.location.query.name ? props.location.query.name : "",                             //(String)设备状态key
        "equipmentTypeId": undefined,  //(int)设备类型id
        "equipmentNo": "",                    //(String)设备编号
        "equipmentName": '',              //(String)设备名称
        "departmentId": undefined,      //(int)部门id
        "isMain": props.location.query.isMain ? props.location.query.isMain : ""
      },
      postUrl: "queryUseList",
    };
  }

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch, device } = this.props;
    dispatch({
      type: 'device/' + type,
      payload: value,
    }).then(key => {
      if (key) {
        fn ? fn(key) : null;
      }
    });
  }

  componentDidMount() {
    this.setNewState(this.state.postUrl, this.state.postData);
    this.setNewState('deviceTypequeryLeafList');
  }


  pageChange = page => {
    this.setState(
      {
        postData: { ...this.state.postData, pageIndex: page },
      },
      () => {
        this.setNewState('queryUseList', this.state.postData);
      },
    );
  };


  getOption(key) {
    let allData = this.props.device.queryAnalysis;
    let xData = allData.map((item) => {
      return item.date
    });
    if (key == "worktime") {
      let workTime = allData.map((item) => {
        return item.workTime
      })
      return {
        title: {
          text: `${this.state.curitemz.equipmentName}工作时长`,
          subtext: '',
          x: '0',
          textStyle: {
            fontSize: 16,
            fontWeight: "noraml",
            color: "#f50"
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
        }],
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: false }
          }
        },
        legend: {
          data: ['工作时长'],
          left: "center",
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '工作时长',
            axisLabel: {
              formatter: '{value} h'
            }
          }
        ],
        series: [
          {
            name: '工作时长',
            type: 'bar',
            data: workTime,
            label: {
              normal: {
                formatter: '{c}h',
                show: true
              },
            },
          },
          {
            name: '工作时长',
            type: 'line',
            data: workTime,
            label: {
              normal: {
                formatter: '{c}h',
                show: true
              },
            },
          }
        ]
      };
    } else if (key == "workenegry") {
      let rejectWaste = allData.map((item) => {
        return item.rejectWaste
      }), manufactureTotalQuantity = allData.map((item) => {
        return item.manufactureTotalQuantity
      })
      return {
        title: {
          text: `${this.state.curitemz.equipmentName}产能分析`,
          subtext: '',
          x: '0',
          textStyle: {
            fontSize: 16,
            fontWeight: "noraml",
            color: "#f50"
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
        }],
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: false }
          }
        },
        legend: {
          data: ['废料(kg)', '生产量'],
          left: "center",
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            axisLabel: {
              formatter: '{value} 个'
            }
          }
        ],
        series: [
          {
            name: '废料(kg)',
            type: 'line',
            data: rejectWaste,
            label: {
              normal: {
                formatter: '{c} 个',
                show: true
              },
            },
          },
          {
            name: '生产量',
            type: 'bar',
            data: manufactureTotalQuantity,
            label: {
              normal: {
                formatter: '{c} 个',
                show: true
              },
            },
          }
        ]
      };
    } else {
      let electricityConsumption = allData.map((item) => {
        return item.electricityConsumption
      })
      return {
        title: {
          text: `${this.state.curitemz.equipmentName} 能耗`,
          subtext: '',
          x: '0',
          textStyle: {
            fontSize: 16,
            fontWeight: "noraml",
            color: "#f50"
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
        }],
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: false }
          }
        },
        legend: {
          data: ['能耗'],
          left: "center",
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '能耗',
            axisLabel: {
              formatter: '{value} kw'
            }
          }
        ],
        series: [
          {
            name: '能耗',
            type: 'bar',
            data: electricityConsumption,
            label: {
              normal: {
                formatter: '{c} kw',
                show: true
              },
            },
          },
          {
            name: '能耗',
            type: 'line',
            data: electricityConsumption,
            label: {
              normal: {
                formatter: '{c} kw',
                show: true
              },
            },
          }
        ]
      };
    }
  }


  getOptions(key) {
    let res = {},
      allData = this.props.device.search.chart ? this.props.device.search.chart : undefined;
    let now = allData ? allData[key] : [];
    switch (key) {
      case "electricityChart":
        let xData = now.map((item) => {
          return item.name
        }), yData = now.map((item) => {
          return item.value
        })
        res = {
          title: {
            text: `设备能耗趋势`,
            subtext: '',
            x: '0',
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: false }
            }
          },
          legend: {
            data: ['能耗趋势'],
            left: "center",
          },
          xAxis: [
            {
              type: 'category',
              data: xData,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '总能耗(kw)',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '能耗趋势',
              type: 'line',
              data: yData,
              label: {
                normal: {
                  formatter: '{c} kw',
                  show: true
                },
              },
            },
          ]
        };
        break;

      case "equipStatusChart":
        res = {
          title: {
            text: '设备状态分布',
            subtext: '',
            x: 0,
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}个 ({d}%)"
          },
          series: [
            {
              name: '设备状态分布',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              radius: ['20%', '40%'],
              data: now,
              label: {
                normal: {
                  formatter: '{b}: {c}个 ({d}%) ',
                  show: true
                },
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        break;
      case "faultCountChart":
        let xDatas = now.map((item) => {
          return item.name
        }), yDatas = now.map((item) => {
          return item.value
        })
        res = {
          title: {
            text: `设备故障总数`,
            subtext: '',
            x: '0',
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: false }
            }
          },
          legend: {
            data: ['设备故障总数'],
            left: "center",
          },
          xAxis: [
            {
              type: 'category',
              data: xDatas,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '故障数(台)',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '设备故障总数',
              type: 'bar',
              data: yDatas,
              label: {
                normal: {
                  formatter: '{c} 台',
                  show: true
                },
              },
            },
          ]
        };
        break;
    }
    return res
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

  onRefQrCode = (ref) => {
    this.childs = ref;
  }

  render() {
    const { searchValue, curtitle, ifshow, curitem, curitemz,
      addstr, addkey, show,
      iftype, postData, imageUrl,
    } = this.state, { queryUseList, deviceTypequeryLeafList, search } = this.props.device;
    const { getFieldDecorator } = this.props.form;

    function disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().add("day", -1).endOf('day');
    }

    const menu = () => {
      let record = curitem;
      return record.id ? (
        <div style={{ display: 'flex', justifyContent: "flex-start", alignItems: "center" }}>
          <Link style={{ color: "#666", marginRight: 12 }} to={`/yxt/devices/devicetzlists/devicerepair/${record.id}/${record.equipmentName}`}>
            <Icon type="tool" style={{ marginTop: 2, marginRight: 6 }} />
            维修处理
          </Link>
          {/* <a style={{ color: "#666" }} onClick={() => {
            this.setNewState("queryAnalysis", { equipmentId: record.id }, () => {
              this.setState({
                visible: true,
                curitemz: record,
                iftype: {
                  name: `${record.equipmentName}的生产分析`,
                  val: "toseecharts"
                }
              })
            })
          }}>
            <Icon type="bar-chart" style={{ marginTop: 2, marginRight: 6 }} />
            生产分析
          </a>
          <Divider type="vertical"></Divider>
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              visibles: true,
              iftype: {
                name: "查看设备图表",
                value: "seeChart"
              }
            })
          }}>
            <Icon type='area-chart' style={{ marginTop: 2, marginRight: 6 }}></Icon>
            设备图表
          </a>
         */}
        </div>
      ) : (
          <></>
          // <a style={{ color: "#f50" }} onClick={() => {
          //   this.setState({
          //     visibles: true,
          //     iftype: {
          //       name: "查看设备图表",
          //       value: "seeChart"
          //     }
          //   })
          // }}>
          //   <Icon type='area-chart' style={{ marginTop: 2, marginRight: 6 }}></Icon>
          //   设备图表
          // </a>
        )
    }

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
        render: (text) => <span style={{ color: text == "1" ? "red" : text == "0" ? "#666" : "green" }}>{text == "1" ? "是" : text == "0" ? "" : "公共设施"}</span>,
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
        title: '能耗(kw/h)',
        dataIndex: 'energyConsumption',
        key: 'energyConsumption',
      },
      {
        title: '转速(转/分)',
        dataIndex: 'speed',
        key: 'speed',
      },
      {
        title: '理论产能(万只/班)',
        dataIndex: 'theoreticalCapacity',
        key: 'theoreticalCapacity',
        width: 160
      },
      {
        title: '图片',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
        render: (text, record) => (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览${record.equipmentName}的图片`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),

          });

        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : "")
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
              this.setNewState('queryUseList', this.state.postData);
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

    const titlerender = () => (
      <div className={styles.pubheader}>
        <div style={{ transition: 'all 0.4s', display: "flex", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, margin: 0, padding: 0 }}>
            设备清单
          </h3>
        </div>
      </div>
    );

    const extrarender = width => (
      <div className={styles.pubextra} style={{ overflow: "hidden", width: "100%", display: 'flex', justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ display: 'flex', justifyContent: "flex-end", alignItems: "center" }}>
          {
            menu()
          }
          <span style={{ marginLeft: 12, cursor: "pointer" }} onClick={() => {
            let postData = this.state.postData;
            delete postData.pageIndex;
            delete postData.pageSize;
            this.setNewState("queryQrCode", postData, () => {
              let data = this.props.device.queryQrCode;
              this.childs.setAllCanvas(data)
            })
          }}>导出二维码</span>


        </div>
      </div>
    );

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    return (
      <div>
        <DrawImage name="设备二维码" onRef={this.onRefQrCode}></DrawImage>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col style={{ borderLeft: "#f0f0f0 solid 1px" }}>
              <div>
                <Card bordered={false} title={titlerender()} extra={extrarender()}>
                  <div
                    style={{
                      overflowX: 'hidden',
                      overflowY: 'auto',
                    }}
                  >
                    <Table bordered
                      onRow={record => {
                        return {
                          onClick: event => {
                            this.setState({ curitem: record });
                          }, // 点击行
                        };
                      }}
                      rowClassName={(record, index) => rowClassNameFn(record, index)}
                      size="middle"
                      scroll={{ x: 2200, y: "59vh" }}
                      columns={columns}
                      loading={this.props.submitting}
                      rowKey="id"
                      dataSource={queryUseList.list}
                      pagination={{
                        showTotal: total => `共${total}条`,
                        // 分页
                        size: 'small',
                        showQuickJumper: true,
                        pageSize: 10,
                        current: queryUseList.pageNum ? queryUseList.pageNum : 1,
                        total: queryUseList.total ? parseInt(queryUseList.total) : 0,
                        onChange: this.pageChange,
                      }}
                    />
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>

        <Modal
          style={{ maxWidth: "90%", top: 20 }}
          width={1200}
          visible={this.state.visible}
          title={iftype.name}
          onCancel={() => { this.setState({ visible: false }) }}
          footer={null}
        >
          <Row gutter={24}>
            <Col span={24} style={{ marginBottom: 24 }}>
              {
                this.state.visible && <DatePicker.RangePicker disabledDate={disabledDate} defaultValue={[moment().add("day", -8), moment().add("day", -1)]} style={{ width: "100%" }} onChange={(val) => {
                  this.setNewState("queryAnalysis", {
                    equipmentId: curitemz.id,
                    startTime: val[0] ? moment(val[0]).format("YYYY-MM-DD") : "",
                    endTime: val[1] ? moment(val[1]).format("YYYY-MM-DD") : "",
                  })
                }} />
              }
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOption("worktime")}></ReactEcharts>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOption("workenegry")}></ReactEcharts>
            </Col>
            <Col span={24}>
              <ReactEcharts option={this.getOption("enegrydown")}></ReactEcharts>
            </Col>
          </Row>
        </Modal>

        <Modal
          style={{ maxWidth: "90%", top: 20 }}
          width={1200}
          visible={this.state.visibles}
          title={iftype.name}
          onCancel={() => { this.setState({ visibles: false }) }}
          footer={null}
        >
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOptions("electricityChart")}></ReactEcharts>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOptions("equipStatusChart")}></ReactEcharts>
            </Col>
            <Col span={24}>
              <ReactEcharts option={this.getOptions("faultCountChart")}></ReactEcharts>
            </Col>
          </Row>
        </Modal>



      </div>
    );
  }
}

Tzlist = Form.create('yangzige')(Tzlist);

export default Tzlist;
