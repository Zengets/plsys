import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, fakeAccountLoginOut } from '@/services/rs';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',
  state: {
    status: undefined,
    userinfo: ""
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      response.currentAuthority = "user";
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'updateState',
        payload: { userinfo: response }
      })

      if (response.code == "0000") {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { call, put }) {
      let res = yield call(fakeAccountLoginOut);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
          search: stringify({
            redirect: window.location.href,
          }),
        },
      });
      yield put({
        type: 'updateState',
        payload: { userinfo: "" }
      })
      reloadAuthorized();
      localStorage.clear();
      if (res.code) {
        yield put(
          routerRedux.push({
            pathname: '/user/login'
          })
        );
      }

    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
