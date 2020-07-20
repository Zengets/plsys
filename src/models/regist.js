import { fakeRegister,getApplyInfo,updateApply,sendCode,compairCode,updatePassword } from '@/services/api';

export default {
  namespace:'regist',
  state: {
    fakeRegister: { code:"",data:"" },
    getApplyInfo:undefined,
    getApplyInfoList:[],
    code:""
  },
  effects: {
    * sendCode({ payload }, { call, put }) {
      let res = yield call(sendCode, payload);
      yield put({
        type: 'updateState',
        payload: { sendCode:res.data?res.data.data:{id:""}}
      })
      return res.code=="0000"
    },
    * compairCode({ payload }, { call, put }) {
      let res = yield call(compairCode, payload);
      yield put({
        type: 'updateState',
        payload: { code:res.code?res.code:""}
      })
      return res.code=="0000"
    },
    * updatePassword({ payload }, { call, put }) {
      let res = yield call(updatePassword, payload);
      yield put({
        type: 'updateState',
        payload: { code:res.code?res.code:""}
      })
      return res.code=="0000"
    },
    * submit({ payload }, { call, put }) {
      let res = yield call(fakeRegister, payload);
      yield put({
        type: 'updateState',
        payload: { fakeRegister:res?res:{}}
      })
      return res.code == "0000"
    },
    * getApplyInfo({ payload }, { call, put }) {
      let res = yield call(getApplyInfo, payload);
      yield put({
        type: 'updateState',
        payload: { getApplyInfo:res.data?res.data.sysCompanyApply:undefined}
      })
      yield put({
        type: 'updateState',
        payload: { getApplyInfoList:res.data?res.data.sysCompanyAuditList:[]}
      })

      return res.code == "0000"
    },
    * updateApply({ payload }, { call, put }) {
      let res = yield call(updateApply, payload);
      yield put({
        type: 'updateState',
        payload: { code:res.code}
      })
      return res.code == "0000"
    },
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload };
    },
  }
};
