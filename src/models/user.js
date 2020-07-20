import { findShiftsUser,findCheckUser,currentUser,changePwd } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    person:[],
    code:""
  },

  effects: {
    *findShiftsUser({payload}, { call, put }) {
      const response = yield call( findShiftsUser,payload );
      sessionStorage.setItem("USERLIST",JSON.stringify(response.data))
      yield put({
        type: 'updateState',
        payload: { person:response.data?response.data:[]}
      });
    },
    *findCheckUser({payload}, { call, put }) {
      const response = yield call(findCheckUser);
      yield put({
        type: 'updateState',
        payload: { person:response.data?response.data:[]}
      });
    },
    *fetchCurrent(_, { call, put }) {
      let response = yield call(currentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response?response.data.data:{name:"xxx"},
      });
    },
    *changePwd({ payload }, { call, put }) {
      let res = yield call(changePwd,payload);
      yield put({
        type: 'updateState',
        payload: { code:res.code},
      });
    },

  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
