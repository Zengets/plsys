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


@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/devicequeryList'],
}))
class DeviceLvli extends Component {
  constructor(props) {
    super(props);
    let { deviceTypequeryLeafList, search } = props;
    if (!deviceTypequeryLeafList) {
      deviceTypequeryLeafList = []
    }
    this.state = {
      iftype: { name: '', val: '' },
      fv: false,
      curitemz: {},
      curitem: {},
      imageUrl: "",
      postData: {
        "pageIndex": 1,                          //(int)页码
        "pageSize": 10,                           //(int)条数
        "status": undefined,                             //(String)设备状态key
        "equipmentTypeId": undefined,  //(int)设备类型id
        "equipmentNo": "",                    //(String)设备编号
        "equipmentName": '',              //(String)设备名称
        "departmentId": undefined      //(int)部门id
      },
      postUrl: "devicequeryList",
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
    this.setNewState('devicequeryList', this.state.postData);
    this.setNewState('deviceTypequeryLeafList');
  }




  pageChange = page => {
    this.setState(
      {
        postData: { ...this.state.postData, pageIndex: page },
      },
      () => {
        this.setNewState('devicequeryList', this.state.postData);
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
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }

  render() {
    const {  curitem
    } = this.state, {  devicequeryList, deviceTypequeryLeafList, search,resumetype } = this.props.device;

    function disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().add("day", -1).endOf('day');
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
        ...gettreeselectbox('equipmentTypeId', search.equipmentTypeTreeList?search.equipmentTypeTreeList:[]),
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
      },
      {
        title: '所在部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        ...gettreeselectbox('departmentId', search.departmentDataList ? search.departmentDataList: [])
      },
      {
        title: '能耗(kw/h)',
        dataIndex: 'energyConsumption',
        key: 'energyConsumption',
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
                "pageIndex": 1, //(int)页码
                "pageSize": 10, //(int)条数
                "status": undefined, //(String)设备状态key
                "equipmentTypeId": '', //(int)设备类型id
                "equipmentNo": "", //(String)设备编号
                "equipmentName": '', //(String)设备名称
                "departmentId": undefined
              } //(int)部门id}
            }, () => {
              this.setNewState('devicequeryList', this.state.postData);
            })
          }}>
            <Icon type="reload" style={{ paddingRight: 4,marginLeft:8 }} />
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
            设备履历
          </h3>
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

    
    const expandedRowRender = () => {
      const columnss= [
        {
          title: '履历编号',
          dataIndex: 'dicKey',
          key: 'dicKey'
        },
        {
          title: '履历类型',
          dataIndex: 'dicName',
          key: 'dicName'
        },
        {
          title: '描述说明',
          dataIndex: 'dicDescription',
          key: 'dicDescription'
        },
        {
          title: '查看',
          dataIndex: 'see',
          key: 'see',
          render:(text,record)=><Link to={`/yxt/devices/devicetzlists/deviceRecord/${this.state.curitem.id}/${record.dicKey}/${this.state.curitem.equipmentName}`}>
            查看履历</Link>
        },
       
      ];
      return <Table bordered size="middle" scroll={{ x:1200,y:"59vh" }} columns={columnss} dataSource={resumetype} pagination={false} />;
    };

    return (
      <div>
        <canvas style={{ display: "none" }} id='myCanvas' width='2480px' height={this.state.height ? this.state.height : 3508}></canvas>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col style={{ borderLeft: "#f0f0f0 solid 1px" }}>
              <div>
                <Card bordered={false} title={titlerender()}>
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
                            this.setState({ curitem: record,curkeys:[record.id]});
                          }, // 点击行
                        };
                      }}
                      onExpand={(expanded,record) => {
                        this.setState({ curitem: expanded?record:[],curkeys:expanded?[record.id]:[] });
                      }}
                      rowClassName={(record, index) => rowClassNameFn(record, index)}
                      size="middle"
                      scroll={{ x:1200,y:"59vh" }}
                      columns={columns}
                      loading={this.props.submitting}
                      rowKey="id"
                      dataSource={devicequeryList.list}
                      expandedRowRender={expandedRowRender}
                      expandRowByClick={true}
                      expandedRowKeys={this.state.curkeys?this.state.curkeys:[]}
                      pagination={{ showTotal:total=>`共${total}条`,
                        // 分页
                        size: 'small',
                        showQuickJumper: true,
                        pageSize: 10,
                        current: devicequeryList.pageNum ? devicequeryList.pageNum : 1,
                        total: devicequeryList.total ? parseInt(devicequeryList.total) : 0,
                        onChange: this.pageChange,
                      }}
                    />
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>




      </div>
    );
  }
}

DeviceLvli = Form.create('foria')(DeviceLvli);

export default DeviceLvli;
