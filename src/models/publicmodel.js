/**
 * Created by 11485 on 2019/2/28.
 */
import {
  devicequeryList,
  queryPageList,
  verbqueryItemForAdd,
  outqueryList,
  pairqueryPageByUserId,
  queryApplyReapairList,
  getProductors,
  uploadsysUser,
  uploaduserEquipment,
  uploadequipment,
  uploadequipmentMaintainItem,
  uploadequipmentFaultType,
  uploadspareParts,
  uploadequipmentMaintainPlan,
  uploadproductMonthPlanDetail,
  uploadbuddleEquipment,
  uploadequipmentSpareRel,
  uploadequipmentPointCheckPlan,
  uploadproductPlan,
  uploadelectricityMeterReadDay,
  queryPageListPlus,
  DSparequery,
  replysave,
  queryListByKnowledgeId,
  queryListByParentIds,
  replydeleteById,
  uploadproductionPecification,
  queryByConditionPage,
  queryUseListByComId,
} from '@/services/rs.js';

export default {
  namespace: 'publicmodel',
  state: {
    queryPageList: [],
    queryUseListByComId: [],
    queryPageListPlus: [],
    verbqueryItemForAdd: [],
    outqueryList: [],
    pairqueryPageByUserId: [],
    itemIds: [],
    devicequeryList: [],
    getProductors: [],
    queryApplyReapairList: [],
    key: '1',
    DSparequery: [],
    selectlist: [],
    queryListByKnowledgeId: {},
    queryListByParentIds: {},
    queryByConditionPage: {},
    dataList: {},
    code: {},
  },
  effects: {
    *queryByConditionPage({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryByConditionPage, payload);
      yield put({
        type: 'updateState',
        payload: { queryByConditionPage: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },

    *DSparequery({ payload }, { call, put }) {
      //datalist
      const responese = yield call(DSparequery, payload);
      yield put({
        type: 'updateState',
        payload: { DSparequery: responese.data.page ? responese.data.page : [] },
      });
      yield put({
        type: 'updateState',
        payload: { selectlist: responese.data.dataList ? responese.data.dataList : [] },
      });
      return responese.code == '0000';
    },
    *queryListByKnowledgeId({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryListByKnowledgeId, payload);
      yield put({
        type: 'updateState',
        payload: { queryListByKnowledgeId: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *queryListByParentIds({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryListByParentIds, payload);
      yield put({
        type: 'updateState',
        payload: { queryListByParentIds: responese.data.dataList ? responese.data.dataList : [] },
      });
      return responese.code == '0000';
    },

    *getProductors({ payload }, { call, put }) {
      //datalist
      const responese = yield call(getProductors, payload);
      yield put({
        type: 'updateState',
        payload: { getProductors: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *quanbu({ payload }, { call, put }) {
      //datalist
      yield put({
        type: 'updateState',
        payload: { key: payload.key ? payload.key : '1' },
      });
      return true;
    },
    *devicequeryList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(devicequeryList, payload);
      yield put({
        type: 'updateState',
        payload: { devicequeryList: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *devicequeryList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(devicequeryList, payload);
      yield put({
        type: 'updateState',
        payload: { devicequeryList: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *pairqueryPageByUserId({ payload }, { call, put }) {
      //datalist
      const responese = yield call(pairqueryPageByUserId, payload);
      yield put({
        type: 'updateState',
        payload: { pairqueryPageByUserId: responese.data.page },
      });
      return responese.code == '0000';
    },
    *uploadsysUser({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadsysUser, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploaduserEquipment({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploaduserEquipment, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadequipment({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadequipment, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadequipmentMaintainItem({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadequipmentMaintainItem, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadproductMonthPlanDetail({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadproductMonthPlanDetail, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadequipmentFaultType({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadequipmentFaultType, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadspareParts({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadspareParts, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *replysave({ payload }, { call, put }) {
      //datalist
      const responese = yield call(replysave, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *replydeleteById({ payload }, { call, put }) {
      //datalist
      const responese = yield call(replydeleteById, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadequipmentMaintainPlan({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadequipmentMaintainPlan, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadproductPlan({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadproductPlan, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadelectricityMeterReadDay({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadelectricityMeterReadDay, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadbuddleEquipment({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadbuddleEquipment, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadequipmentSpareRel({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadequipmentSpareRel, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadequipmentPointCheckPlan({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadequipmentPointCheckPlan, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *uploadproductionPecification({ payload }, { call, put }) {
      //datalist
      const responese = yield call(uploadproductionPecification, payload);
      yield put({
        type: 'updateState',
        payload: { code: responese.data ? responese.data : {} },
      });
      return responese.code == '0000';
    },
    *outqueryList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(outqueryList, payload);
      yield put({
        type: 'updateState',
        payload: { outqueryList: responese.data.page },
      });
      yield put({
        type: 'updateState',
        payload: { dataList: responese.data.dataList },
      });
      return responese.code == '0000';
    },
    *queryApplyReapairList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryApplyReapairList, payload);
      yield put({
        type: 'updateState',
        payload: { queryApplyReapairList: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *queryPageList({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryPageList, payload);
      yield put({
        type: 'updateState',
        payload: { queryPageList: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *queryUseListByComId({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryUseListByComId, payload);
      yield put({
        type: 'updateState',
        payload: { queryUseListByComId: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *queryPageListPlus({ payload }, { call, put }) {
      //datalist
      const responese = yield call(queryPageListPlus, payload);
      yield put({
        type: 'updateState',
        payload: { queryPageListPlus: responese.data.page ? responese.data.page : [] },
      });
      return responese.code == '0000';
    },
    *verbqueryItemForAdd({ payload }, { call, put }) {
      //datalist
      const responese = yield call(verbqueryItemForAdd, payload);
      yield put({
        type: 'updateState',
        payload: { verbqueryItemForAdd: responese.data.page ? responese.data.page : [] },
      });
      yield put({
        type: 'updateState',
        payload: { itemIds: responese.data.itemIds ? responese.data.itemIds : [] },
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
