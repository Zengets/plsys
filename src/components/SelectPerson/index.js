/**
 * Created by 11485 on 2019/3/8.
 */
import {
  Button, Modal, Form, Input, Radio,Checkbox,Row,Col,Table,Tooltip,Tag,InputNumber,Alert
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';

@connect(({ user,forms, loading }) => ({
  user,
  forms,
}))
class SelectPersonData extends React.Component {
  //fetch PersonData
  constructor(props){
    super(props)
    this.state = {
      postData:{
        spareCode:"",//配件编号
        spareName:"",//配件名称
        page:1,
        rows:6
      },
      cur:"",
      data:[],
      selectedRowKeys: [],
      sparestock:[]
    }
  }

  setNewState(type,value,fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'forms/'+type,
      payload:value
    }).then(()=>{
      fn?fn():null
    });
  }

  /*选中修改*/
  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
    let res = this.props.forms.myGetSpareList.rows,
      changeres = this.state.sparestock,
      parr=this.state.sparestock.map((item)=>{return item.pkid});

    if(res){
      res.map((item)=>{
        if(selectedRowKeys.indexOf(item.pkid)!=-1){ //选中的item
          let data = {
            pkid:item.pkid,
            spareNum:undefined,
            price:item.price,
            spareName:item.spareName,
            page:this.props.forms.myGetSpareList.page
          }
          if(parr.indexOf(item.pkid)!=-1){
            data = this.state.sparestock.filter((key)=>{return key.pkid==item.pkid})[0]
          }
          changeres.push(data)
        }
      })
    }
    changeres = selectedRowKeys.map((item)=>{
      return changeres.filter((key)=>{return key.pkid==item})[0]
    })
    this.setState({ sparestock:changeres });
  }

  componentDidMount(){
    this.props.onRef?
    this.props.onRef(this):null;
    const { dispatch,type } = this.props;
    type.key?this.setNewState("myGetSpareList",this.state.postData):null;
    dispatch({
      type:type.key?'user/'+type.key:"user/findShiftsUser",
      payload: this.props.data
    });
  }

  componentWillReceiveProps(nextProps){
    if(this.props.data.id!=nextProps.data.id){
      const { dispatch,type } = nextProps;
      type.key?this.setNewState("myGetSpareList",this.state.postData):null;
      dispatch({
        type:type.key?'user/'+type.key:"user/findShiftsUser",
        payload:nextProps.data
      });
    }
  }
  changePage = (page)=>{
    this.setNewState("myGetSpareList",{...this.state.postData,page:page},()=>{
      this.setState({
        postData:{...this.state.postData,page:page}
      })
    })
  }

  returnState = ()=>{
    return this.state.sparestock
  }

  render() {
    const {
      visible, onCancel, onCreate, form,render,type,btntext,multiple
      } = this.props;
    let {person} = this.props.user,
        {myGetSpareList} = this.props.forms,
        {selectedRowKeys,sparestock} = this.state;
    const { getFieldDecorator } = form;

    const rowSelection = {
      selectedRowKeys:selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.nowCount == '0', // Column configuration not to be checked
        spareName: record.spareName,
      }),
    };
    let _it = this;
    function getval(value){
      let val = undefined;
      _it.state.sparestock.map((item)=>{
        if(item.pkid == value){
          val = item.spareNum
        }
      })
      return val
    }
    let columns = [
      {
        title: '配件名称',
        dataIndex: 'spareName',
        key: 'spareName',
        render:(text,record) => <Tooltip placement="bottomLeft" title={text} >
          <a style={{display:"block",maxWidth:88,color:record.pkid==this.state.cur?"#f50":"#398dcd",
          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}
          >{text}</a>
        </Tooltip>,
      },
      {
        title: '当前数量',
        dataIndex: 'spareNum',
        key: 'spareNum',
      },
      {
        title: '累积获取总数',
        key: 'spareCount',
        dataIndex: 'spareCount',
        render: (text,info) =>{
          return(
            <Tooltip placement="bottomLeft" title={text} >
              <span style={{display:"block",maxWidth:100,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{text}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '价值类型',
        dataIndex: 'type',
        key: 'type',
        render:(text)=><span>{text=="1"?"低":"高"}</span>
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (tag,record) => (
          <span>
              <Tag color={
                record.status=="0"?"green":
                record.status=="1"?"red":
                  "#ff0000"
                } key={tag}>{tag=="0"?"持有":tag=="1"?"未持有":""}</Tag>
            </span>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width:200,
        render: (text, record) => (
          <div>
            {
              parseInt(record.nowCount)<=0?
                <span style={{color:"#ff4800"}}>暂无库存</span>:
                  selectedRowKeys.indexOf(record.pkid)==-1?
                    <span>勾选填写数量</span>:
                    <div>
                      <InputNumber min={1}  max={record.spareNum?parseInt(record.spareNum):1} style={{width:100}} placeholder="申领数量"
                          value = {getval(record.pkid)} onChange={(val)=>{
                          let newsparestock = this.state.sparestock.map((item)=>{
                             if(item.pkid==record.pkid){
                                item.spareNum = val
                             }
                             return item
                           })
                        this.setState({
                          sparestock:newsparestock
                        })
                      }}
                     formatter={value =>`${value?parseInt(value):''}`}/>
                    <span style={{opacity:getval(record.pkid)>record.nowCount?"1":"0",color:"#ff2100",
                      marginLeft:6,transition:"all 0.4s"}}>库存不足
                    </span>
                </div>

            }
          </div>
        ),
      }
    ]


    return (
      <Modal
        style={{maxWidth:"90%"}}
        width={type.show?"90%":"600px"}
        visible={visible}
        title={type.name?type.show?"选择使用配件及验证人":'选择'+type.name:'选择人员'}
        okText={btntext?btntext:"确定"}
        onCancel={onCancel}
        onOk={onCreate}
      >
        {
          type.show&&<div>
           <p className="fades">选择使用的配件</p>
            <Alert
              style={{
              backgroundColor:"transparent",
              opacity:sparestock.length!=0?1:0.2,
              transition:"all 0.6s",
              overflow:"hidden",
              height:sparestock.length==0?0:"auto",
              padding:sparestock.length!=0?"16px 15px 8px 15px":0,
              borderColor:"#9ff2f2"}}
              message={
              <div>
              {
                sparestock?
                sparestock.map((item,i)=>(<Tag key={i} color="blue" onClick={()=>{
                 this.setNewState("myGetSpareList",{ ...this.state.postData,page:item.page },()=>{
                    this.setState({
                      postData:{...this.state.postData,page:item.page},
                      cur:item.pkid
                    })
                  })
                }}
                style={{marginBottom:8,cursor:"pointer"}}><span style={{color:"#398dcd"}}>{item.spareName}</span>:
                <span style={{color:item.spareNum?"#398dcd":"#ff4800"}}>
                {item.spareNum?item.spareNum+"个":"未填写"}</span>
                </Tag>)):
                null
              }
              </div>}
              type="info"/>
          <Table bordered size="middle" scroll={{x:1200,y:"59vh"}}
            loading={this.props.submitting}
            style={{marginTop:12}}
            pagination = {{ // 分页
             size: "small",
             pageSize:6,
             showQuickJumper:true,
             current:myGetSpareList?myGetSpareList.page:1,
             total: myGetSpareList?myGetSpareList.records:1,
             onChange: this.changePage,
          }}
            rowKey="pkid"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={myGetSpareList.rows?myGetSpareList.rows:[]}
          /></div>
        }


        <Form layout="vertical">
          {
            multiple? <Form.Item label={type.name?'选择'+type.name:'选择人员'}>
              {getFieldDecorator('checkedPerson', {
                rules: [{ required: true, message: '请选择负责人!' }],
              })(
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    {
                      person.map((item,i)=>(
                        <Col span={8} key={i} style={{marginBottom:8}}>
                          <Checkbox value={item.ID}>{item.Name}</Checkbox>
                        </Col>
                      ))
                    }
                  </Row>
                </Checkbox.Group>
              )}
            </Form.Item>:
            <Form.Item label={type.name?'选择'+type.name:'选择人员'} >
              {getFieldDecorator('checkedPerson', {
                rules: [{ required: true, message: '请选择负责人!' }],
              })(
                <Radio.Group style={{ width: '100%' }}>
                  <Row>
                    {
                      person.map((item,i)=>(
                        <Col xl={4} lg={6} md={8} xs={8} sm={8} key={i} style={{marginBottom:8}}>
                          <Radio value={item.ID}>{item.Name}</Radio>
                        </Col>
                      ))
                    }
                  </Row>
                </Radio.Group>
              )}
            </Form.Item>
          }



        </Form>
      </Modal>
    );
  }
}

const SelectPerson = Form.create({ name: 'createform',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      checkedPerson: Form.createFormField({
        ...props.checkedPerson,
        value: props.checkedPerson.value,
      })
    };
  },
  onValuesChange(_, values) {
      console.log(values)
  } })(
  SelectPersonData
);

export default SelectPerson

