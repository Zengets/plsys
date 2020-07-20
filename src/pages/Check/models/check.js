/**
 * Created by 11485 on 2019/2/28.
 */
import {
    equipmentqueryList, equipmentupdateByIds, equipmentdeleteByIds, equipmentqueryNoByUserId, equipmentqueryByUserId, equipmentsaves,
    checksave, checkqueryList, checkdeleteById, association, uiassociation, queryBusinessByUserId,
    checkmenuqueryList, checkmenudeleteById, checkmenusave, checkmenuqueryAll, queryListOfEquipment, queryWithoutIds,
    queryByDateAndWeekNum, queryItemTaskByDayTaskId, fatequeryListOfEquipment, updatePointCheckUser, queryByEquipId,
    deviceTypequeryTreeList, queryCheckAbnormal, queryListError, checkIgnore, checkRepair, rslgetRepairDetail,
    checkSqueryList, checkSsave, checkSdeleteById, checkssave, checksdeleteById, checksqueryList, queryUpdateByUserId, replaceUser,
    checkmainList, checkmainDetails,checkstatistics,queryByIdList



} from '@/services/rs.js'

export default {
    namespace: 'check',
    state: {
        equipmentqueryNoByUserId: [],
        equipmentqueryByUserId: [],
        equipmentqueryList: [],
        companyList: [],
        repairTypeList: [],
        faultTypeList: [],
        checkqueryList: [],
        checkmenuqueryList: [],
        periodType: [],
        checkmenuqueryAll: [],
        queryListOfEquipment: [],
        queryWithoutIds: [],
        haveItemList: [],
        chart: [],
        dataList: [],
        queryByEquipId: [],
        queryByDateAndWeekNum: [],
        queryItemTaskByDayTaskId: [],
        fatequeryListOfEquipment: [],
        code: {},
        deviceTypequeryTreeList: [],
        uiassociation: [],
        queryBusinessByUserId: [],
        checkSqueryList: [],
        checksqueryList: [],
        periodType: [],
        roleList: [],
        queryCheckAbnormal: {},
        search: {},
        queryUpdateByUserId: [],
        queryListError: [],
        rslgetRepairDetail: [],
        checkmainList: [],
        checkmainDetails: [],
        checkstatistics:[],
        queryByIdList:[],
    },
    effects: {
        *checkstatistics({ payload }, { call, put }) {//datalist
            const responese = yield call(checkstatistics, payload);
            yield put({
                type: 'updateState',
                payload: { checkstatistics: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryByIdList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByIdList, payload);
            yield put({
                type: 'updateState',
                payload: { queryByIdList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *checkmainList({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmainList, payload);
            yield put({
                type: 'updateState',
                payload: { checkmainList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *checkmainDetails({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmainDetails, payload);
            yield put({
                type: 'updateState',
                payload: { checkmainDetails: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },



        *rslgetRepairDetail({ payload }, { call, put }) {//datalist
            const responese = yield call(rslgetRepairDetail, payload);
            yield put({
                type: 'updateState',
                payload: { rslgetRepairDetail: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { dataList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryListError({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListError, payload);
            yield put({
                type: 'updateState',
                payload: { queryListError: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryUpdateByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryUpdateByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { queryUpdateByUserId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *replaceUser({ payload }, { call, put }) {//datalist
            const responese = yield call(replaceUser, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkSqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(checkSqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { checkSqueryList: responese.data ? responese.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { search: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *queryCheckAbnormal({ payload }, { call, put }) {//datalist
            const responese = yield call(queryCheckAbnormal, payload);
            yield put({
                type: 'updateState',
                payload: { queryCheckAbnormal: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *checksqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(checksqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { checksqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { periodType: responese.data.periodType ? responese.data.periodType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { roleList: responese.data.roleList ? responese.data.roleList : [] }
            })
            return responese.code == "0000"
        },

        *queryBusinessByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryBusinessByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { queryBusinessByUserId: responese.data.companyList ? responese.data.companyList : [] }
            })

            return responese.code == "0000"
        },
        *uiassociation({ payload }, { call, put }) {//datalist
            const responese = yield call(uiassociation, payload);
            yield put({
                type: 'updateState',
                payload: { uiassociation: responese.data.dataList ? responese.data.dataList : [] }
            })

            return responese.code == "0000"
        },
        *queryByEquipId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByEquipId, payload);
            yield put({
                type: 'updateState',
                payload: { queryByEquipId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *deviceTypequeryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceTypequeryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceTypequeryTreeList: responese.data.dataList ? responese.data.dataList : [] }
            })

            return responese.code == "0000"
        },
        *fatequeryListOfEquipment({ payload }, { call, put }) {//datalist
            const responese = yield call(fatequeryListOfEquipment, payload);
            yield put({
                type: 'updateState',
                payload: { fatequeryListOfEquipment: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryByDateAndWeekNum({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByDateAndWeekNum, payload);
            yield put({
                type: 'updateState',
                payload: { queryByDateAndWeekNum: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryItemTaskByDayTaskId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryItemTaskByDayTaskId, payload);
            yield put({
                type: 'updateState',
                payload: { queryItemTaskByDayTaskId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },


        *queryListOfEquipment({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListOfEquipment, payload);
            yield put({
                type: 'updateState',
                payload: { queryListOfEquipment: responese.data.data ? responese.data.data.pageInfo : [] }
            })
            yield put({
                type: 'updateState',
                payload: { periodType: responese.data.periodType ? responese.data.periodType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { haveItemList: responese.data.data ? responese.data.data.haveItemList : [] }
            })
            return responese.code == "0000"
        },
        *queryWithoutIds({ payload }, { call, put }) {//datalist
            const responese = yield call(queryWithoutIds, payload);
            yield put({
                type: 'updateState',
                payload: { queryWithoutIds: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },


        *checkmenuqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenuqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { checkmenuqueryAll: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *checkmenuqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenuqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { checkmenuqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { periodType: responese.data.periodType ? responese.data.periodType : [] }
            })
            return responese.code == "0000"
        },
        *checkqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(checkqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { checkqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *equipmentqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *equipmentqueryByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryByUserId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *equipmentqueryNoByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryNoByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryNoByUserId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *updatePointCheckUser({ payload }, { call, put }) {//datalist
            const responese = yield call(updatePointCheckUser, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(checkdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checksave({ payload }, { call, put }) {//datalist
            const responese = yield call(checksave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkSsave({ payload }, { call, put }) {//datalist
            const responese = yield call(checkSsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkSdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(checkSdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkssave({ payload }, { call, put }) {//datalist
            const responese = yield call(checkssave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checksdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(checksdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentsaves({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentsaves, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentupdateByIds({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentupdateByIds, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentdeleteByIds({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentdeleteByIds, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkmenudeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenudeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkmenusave({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenusave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *association({ payload }, { call, put }) {//datalist
            const responese = yield call(association, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkIgnore({ payload }, { call, put }) {//datalist
            const responese = yield call(checkIgnore, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkRepair({ payload }, { call, put }) {//datalist
            const responese = yield call(checkRepair, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        },
    }
}
