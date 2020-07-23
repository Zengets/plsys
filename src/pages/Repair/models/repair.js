/**
 * Created by 11485 on 2019/2/28.
 */
import {
  equipmentqueryList,
  equipmentsavec,
  equipmentupdateByIdc,
  equipmentdeleteByIdc,
  equipmentsavez,
  equipmentupdateByIdz,
  equipmentdeleteByIdz,
  weiwaicreate,
  queryBusinessByUserId,
  equipmentqueryNoByUserId,
  equipmentqueryByUserId,
  repairqueryList,
  modifyRepairUser,
  getRepairDetail,
  queryAllRepair,
  rslmodifyRepairUser,
  rslgetRepairDetail,
  TroublequeryTreeList,
  Troublesave,
  TroubledeleteById,
  hisToryqueryList,
  hisgetRepairDetail,
  deviceTypequeryTreeList,
  weiqueryList,
  weiauditExternalRepair,
  weiconfigBack,
  association,
  uiassociation,
  queryCondition,
  queryUpdateByUserId,
  replaceUser,
} from '@/services/rs.js';

export default {
  namespace: 'repair',
  state: {
    equipmentqueryNoByUserId: [],
    equipmentqueryByUserId: [],
    equipmentqueryList: [],
    repairqueryList: {},
    repairStatusList: [],
    repairTypeList: [],
    faultTypeList: [],
    TroublequeryTreeList: {},
    chart: [],
    shopList: [],
    dataList: [],
    hisToryqueryList: [],
    queryAllRepair: [],
    rslgetRepairDetail: [],
    hisgetRepairDetail: [],
    confirmDetails: [],
    equipmentTypeList: [],
    code: {},
    weiqueryList: [],
    deviceTypequeryTreeList: [],
    equipmentList: [],
    spareList: [],
    companyList: [],
    uiassociation: [],
    queryBusinessByUserId: [],
    queryUpdateByUserId: [],
    queryCondition: {},
  },
  effects: {
    *queryCondition({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryCondition, payload);
      yield put({
        type: 'updateState',
        payload: { shiftList: responese.data.shiftList ? responese.data.shiftList : [] },
      });
      yield put({
        type: 'updateState',
        payload: { userList: responese.data.userList ? responese.data.userList : [] },
      });
      yield put({
        type: 'updateState',
        payload: { shopList: responese.data.shopList ? responese.data.shopList : [] },
      });
      yield put({
        type: 'updateState',
        payload: {
          departmentLists: responese.data.departmentList ? responese.data.departmentList : [],
        },
      });
      yield put({
        type: 'updateState',
        payload: {
          equipmentTypeLeafList: responese.data.equipmentTypeLeafList
            ? responese.data.equipmentTypeLeafList
            : [],
        },
      });
      return responese.code == '0000';
    },

    *queryUpdateByUserId({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryUpdateByUserId, payload);
      yield put({
        type: 'updateState',
        payload: { queryUpdateByUserId: responese.data.dataList ? responese.data.dataList : [] },
      });
      return responese.code == '0000';
    },
    *queryBusinessByUserId({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryBusinessByUserId, payload);
      yield put({
        type: 'updateState',
        payload: {
          queryBusinessByUserId: responese.data.companyList ? responese.data.companyList : [],
        },
      });

      return responese.code == '0000';
    },
    *uiassociation({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uiassociation, payload);
      yield put({
        type: 'updateState',
        payload: { uiassociation: responese.data.dataList ? responese.data.dataList : [] },
      });

      return responese.code == '0000';
    },
    *weiqueryList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(weiqueryList, payload);
      yield put({
        type: 'updateState',
        payload: { weiqueryList: responese.data.page ? responese.data.page : [] },
      });
      yield put({
        type: 'updateState',
        payload: {
          equipmentList: responese.data.equipmentList ? responese.data.equipmentList : [],
        },
      });
      yield put({
        type: 'updateState',
        payload: { spareList: responese.data.spareList ? responese.data.spareList : [] },
      });
      return responese.code == '0000';
    },
    *deviceTypequeryTreeList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(deviceTypequeryTreeList, payload);
      yield put({
        type: 'updateState',
        payload: {
          deviceTypequeryTreeList: responese.data.dataList ? responese.data.dataList : [],
        },
      });

      return responese.code == '0000';
    },
    *hisToryqueryList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(hisToryqueryList, payload);
      yield put({
        type: 'updateState',
        payload: { hisToryqueryList: responese.data.page ? responese.data.page : [] },
      });
      yield put({
        type: 'updateState',
        payload: {
          repairStatusList: responese.data.repairStatusList ? responese.data.repairStatusList : [],
        },
      });
      yield put({
        type: 'updateState',
        payload: { companyList: responese.data.companyList ? responese.data.companyList : [] },
      });

      return responese.code == '0000';
    },

    *TroublequeryTreeList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(TroublequeryTreeList, payload);
      yield put({
        type: 'updateState',
        payload: { TroublequeryTreeList: responese.data.page ? responese.data.page : [] },
      });

      yield put({
        type: 'updateState',
        payload: {
          equipmentTypeList: responese.data.equipmentTypeList
            ? responese.data.equipmentTypeList
            : [],
        },
      });
      return responese.code == '0000';
    },

    *queryAllRepair({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryAllRepair, payload);
      yield put({
        type: 'updateState',
        payload: { queryAllRepair: responese.data.dataList ? responese.data.dataList : [] },
      });
      return responese.code == '0000';
    },
    *rslgetRepairDetail({ payload }, { call, put }) {
      //datalist
      const responese = yield call(rslgetRepairDetail, payload);
      yield put({
        type: 'updateState',
        payload: { rslgetRepairDetail: responese.data.data ? responese.data.data : [] },
      });
      yield put({
        type: 'updateState',
        payload: {
          confirmDetails: responese.data.confirmDetails ? responese.data.confirmDetails : [],
        },
      });
      yield put({
        type: 'updateState',
        payload: { dataList: responese.data.dataList ? responese.data.dataList : [] },
      });
      return responese.code == '0000';
    },
    *hisgetRepairDetail({ payload }, { call, put }) {
      //datalist
      const responese = yield call(hisgetRepairDetail, payload);
      yield put({
        type: 'updateState',
        payload: { hisgetRepairDetail: responese.data.data ? responese.data.data : [] },
      });
      yield put({
        type: 'updateState',
        payload: {
          confirmDetails: responese.data.confirmDetails ? responese.data.confirmDetails : [],
        },
      });

      yield put({
        type: 'updateState',
        payload: { dataList: responese.data.dataList ? responese.data.dataList : [] },
      });
      return responese.code == '0000';
    },
    *repairqueryList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(repairqueryList, payload);
      yield put({
        type: 'updateState',
        payload: { repairqueryList: responese.data.page ? responese.data.page : [] },
      });
      yield put({
        type: 'updateState',
        payload: { companyList: responese.data.companyList ? responese.data.companyList : [] },
      });
      yield put({
        type: 'updateState',
        payload: {
          repairStatusList: responese.data.repairStatusList ? responese.data.repairStatusList : [],
        },
      });
      yield put({
        type: 'updateState',
        payload: {
          repairTypeList: responese.data.repairTypeList ? responese.data.repairTypeList : [],
        },
      });
      yield put({
        type: 'updateState',
        payload: {
          faultTypeList: responese.data.faultTypeList ? responese.data.faultTypeList : [],
        },
      });
      yield put({
        type: 'updateState',
        payload: { chart: responese.data.chart ? responese.data.chart : [] },
      });

      return responese.code == '0000';
    },

    *equipmentqueryList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentqueryList, payload);
      yield put({
        type: 'updateState',
        payload: { equipmentqueryList: responese.data.page ? responese.data.page : [] },
      });
      yield put({
        type: 'updateState',
        payload: { userList: responese.data.dataList ? responese.data.dataList : [] },
      });
      yield put({
        type: 'updateState',
        payload: { companyList: responese.data.companyList ? responese.data.companyList : [] },
      });
      return responese.code == '0000';
    },
    *equipmentqueryByUserId({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentqueryByUserId, payload);
      yield put({
        type: 'updateState',
        payload: { equipmentqueryByUserId: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *equipmentqueryNoByUserId({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentqueryNoByUserId, payload);
      yield put({
        type: 'updateState',
        payload: { equipmentqueryNoByUserId: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },

    *equipmentsavec({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentsavec, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *rslmodifyRepairUser({ payload }, { call, put }) {
      //datalist
      const responese = yield call(rslmodifyRepairUser, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *equipmentupdateByIdc({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentupdateByIdc, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *Troublesave({ payload }, { call, put }) {
      //datalist
      const responese = yield call(Troublesave, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *TroubledeleteById({ payload }, { call, put }) {
      //datalist
      const responese = yield call(TroubledeleteById, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *equipmentdeleteByIdc({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentdeleteByIdc, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *equipmentsavez({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentsavez, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *equipmentupdateByIdz({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentupdateByIdz, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *weiauditExternalRepair({ payload }, { call, put }) {
      //datalist
      const responese = yield call(weiauditExternalRepair, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *weiconfigBack({ payload }, { call, put }) {
      //datalist
      const responese = yield call(weiconfigBack, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },

    *equipmentdeleteByIdz({ payload }, { call, put }) {
      //datalist
      const responese = yield call(equipmentdeleteByIdz, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *weiwaicreate({ payload }, { call, put }) {
      //datalist
      const responese = yield call(weiwaicreate, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *association({ payload }, { call, put }) {
      //datalist
      const responese = yield call(association, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
    *replaceUser({ payload }, { call, put }) {
      //datalist
      const responese = yield call(replaceUser, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : [] },
      });
      return responese.code == '0000';
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
