import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';
import { getMenu } from '@/services/api';
import menulist from '@/locales/zh-CN/menu'
import { get } from 'https';

const { check } = Authorized;


// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data.map(item => {
    if (!item.name || !item.path) {
      return null;
    }

    let locale = 'menu';
    if (parentName) {
      locale = `${parentName}.${item.name}`;
    } else {
      locale = `menu.${item.name}`;
    }
    // if enableMenuLocale use item.name,
    // close menu international
    const name = menu.disableLocal
      ? item.name
      : formatMessage({ id: locale, defaultMessage: item.name });
    const result = {
      ...item,
      name,
      locale,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = formatter(item.routes, item.authority, locale);
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);


export default {
  namespace: 'menu',
  state: {
    menuData: [],
    breadcrumbNameMap: {},
    curMenuList:sessionStorage.getItem("SBXUTAO")?JSON.parse(sessionStorage.getItem("SBXUTAO")):[],
    curMenu: sessionStorage.getItem("SBXU")?sessionStorage.getItem("SBXU"):""
  },
  effects: {
    *resetMenu({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: { curMenuList:[] }
      });
      yield put({
        type: 'updateState',
        payload: { curMenu: "" }
      });
      sessionStorage.removeItem("SBXUTAO");
      sessionStorage.removeItem("SBXU");
      return true
    },
    *deleteMenu({ payload }, { call, put, select }) {
      let curMenuList = yield select(state => state.menu.curMenuList),
          urlist = curMenuList.map((item,i)=>{return item.pathname}),
          pathname = payload.pathname,newarr=[],
          index = payload.i == 0;

      curMenuList.map((item,i)=>{
        if(item.pathname==pathname){
        }else{
          newarr.push(item)
        }
      })    
      yield put({
        type: 'updateState',
        payload: { curMenuList:newarr }
      });

      let res = newarr.length==0?"/home":
      index ?newarr[0].pathname : 
      newarr[payload.i-1].pathname

      yield put({
        type: 'updateState',
        payload: { curMenu: res }
      });

      sessionStorage.setItem("SBXUTAO",JSON.stringify(newarr));
      sessionStorage.setItem("SBXU",res);
      return true
    },

    *setMenuList({ payload }, { call, put, select }) {//删除除自身之外的tab
      yield put({
        type: 'updateState',
        payload: { curMenuList:payload }
      });
      sessionStorage.setItem("SBXUTAO",JSON.stringify(payload));
      return true
    },

    *insertMenu({ payload }, { call, put, select }) {
      let curMenuList = yield select(state => state.menu.curMenuList),
          urlist = curMenuList.map((item,i)=>{return item.pathname});
      if (urlist.indexOf(payload.pathname) == -1 &&
        payload.pathname.indexOf("user") == -1 &&
        payload.pathname.indexOf("home") == -1 &&
        payload.pathname != "/"
      ) {
        let key = payload.pathname.split("/").slice(1),str = `menu`;
        key.map((item,i)=>{
        
          if(i>3){
          }else{
            str += `.${item}`
          }
        })
        curMenuList.push({
          pathname: payload.pathname,
          cname: menulist[str]
        })
      }
      sessionStorage.setItem("SBXUTAO",JSON.stringify(curMenuList));
      sessionStorage.setItem("SBXU",payload.pathname);

      yield put({
        type: 'updateState',
        payload: { curMenuList }
      });
      yield put({
        type: 'updateState',
        payload: { curMenu: payload.pathname }
      });
      return true
    },
    *getMenuData({ payload }, { call, put }) {
      let response = yield call(getMenu),
        res = [];
      if (!response.data.dataList) {
        res = []
      } else {
        res = response.data.dataList
      }
      const { routes, authority } = payload;
      const menuData = filterMenuData(memoizeOneFormatter(res , authority));//res  or routes
      //const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(memoizeOneFormatter(res , authority));//res  or routes
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((pathname) => {
        dispatch({
          type: "insertMenu",
          payload: pathname
        })

      })
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
